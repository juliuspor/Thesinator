import { createClient } from "npm:@supabase/supabase-js@2.49.8";

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY") ?? "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type AgentType = "general" | "qa" | "networking" | "thesis_proposal";

type CreateRequest = {
  action: "create";
  agent_type: AgentType;
  student_id: string;
  metadata?: Record<string, unknown>;
};

type ChatRequest = {
  action: "chat";
  agent_type: AgentType;
  session_id: string;
  content: string;
};

type FinalizeRequest = {
  action: "finalize";
  session_id: string;
};

const SYSTEM_PROMPTS: Record<AgentType, string> = {
  general: `Du bist Gini, eine freundliche und kompetente KI-Assistentin auf der Studyond-Plattform. Du hilfst Studierenden bei ihrer akademischen Reise — von der Themenfindung bis zum Abschluss der Thesis. Antworte immer auf Deutsch, sei hilfsbereit und ermutigend. Halte deine Antworten prägnant aber informativ.`,
  qa: `Du bist Gini, die KI-Assistentin von Studyond. Du beantwortest Fragen zu Thesis-Themen, Universitäten, Unternehmen und dem wissenschaftlichen Arbeiten. Antworte auf Deutsch, kurz und präzise.`,
  networking: `Du bist Gini, die KI-Networking-Assistentin von Studyond. Du hilfst Studierenden, professionelle Nachrichten an Betreuer:innen, Expert:innen und Mentor:innen zu verfassen. Gib konkrete Formulierungstipps und helfe beim Netzwerken. Antworte auf Deutsch.`,
  thesis_proposal: `Du bist Gini, die KI-Assistentin von Studyond für Thesis-Vorschläge. Du hilfst Studierenden, ihre Thesis-Ideen zu verfeinern, die Fragestellung zu schärfen und das Exposé zu verbessern. Stelle Rückfragen, gib konstruktives Feedback und schlage Verbesserungen vor. Antworte auf Deutsch.`,
};

function getGreeting(agentType: AgentType, metadata?: Record<string, unknown>): string {
  switch (agentType) {
    case "thesis_proposal": {
      const title = metadata?.thesis_title ?? "dein Thema";
      return `Hey! Ich bin Gini und helfe dir, dein Thesis-Thema "${title}" zu verfeinern. Erzähl mir mehr über deine Idee — was ist die zentrale Fragestellung?`;
    }
    case "networking":
      return `Hey! Ich bin Gini und coache dich beim Networking. Wie kann ich dir helfen — soll ich eine Nachricht formulieren oder Tipps geben?`;
    case "qa":
      return `Hey! Ich bin Gini. Stell mir deine Fragen — ich helfe dir gerne weiter!`;
    default:
      return `Hey! Ich bin Gini, deine KI-Assistentin auf Studyond. Wie kann ich dir helfen?`;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const action = body.action as string;

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // --- CREATE SESSION ---
    if (action === "create") {
      const { agent_type, student_id, metadata } = body as CreateRequest;

      const sessionId = crypto.randomUUID();
      const greeting = getGreeting(agent_type, metadata);

      // Store session in DB
      await supabase.from("chat_sessions").insert({
        id: sessionId,
        agent_type,
        student_id,
        metadata: metadata ?? {},
        status: "active",
        created_at: new Date().toISOString(),
      });

      // Store greeting as first message
      await supabase.from("chat_messages").insert({
        session_id: sessionId,
        role: "assistant",
        content: greeting,
        created_at: new Date().toISOString(),
      });

      return new Response(
        JSON.stringify({
          session_id: sessionId,
          agent_type,
          greeting,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // --- CHAT (SSE Streaming) ---
    if (action === "chat") {
      const { agent_type, session_id, content } = body as ChatRequest;

      // Store user message
      await supabase.from("chat_messages").insert({
        session_id,
        role: "user",
        content,
        created_at: new Date().toISOString(),
      });

      // Fetch conversation history
      const { data: history } = await supabase
        .from("chat_messages")
        .select("role, content")
        .eq("session_id", session_id)
        .order("created_at", { ascending: true })
        .limit(50);

      const messages = (history ?? []).map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      }));

      // Call Anthropic API with streaming
      const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2048,
          system: SYSTEM_PROMPTS[agent_type] || SYSTEM_PROMPTS.general,
          messages,
          stream: true,
        }),
      });

      if (!anthropicRes.ok) {
        const errText = await anthropicRes.text();
        console.error("Anthropic error:", errText);
        throw new Error(`Anthropic API error: ${anthropicRes.status}`);
      }

      // Transform Anthropic SSE to our SSE format
      const encoder = new TextEncoder();
      let fullAssistantText = "";

      const stream = new ReadableStream({
        async start(controller) {
          const reader = anthropicRes.body!.getReader();
          const decoder = new TextDecoder();
          let buffer = "";

          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split("\n");
              buffer = lines.pop() || "";

              for (const line of lines) {
                if (line.startsWith("data: ")) {
                  const raw = line.slice(6).trim();
                  if (raw === "[DONE]") continue;

                  try {
                    const parsed = JSON.parse(raw);

                    if (parsed.type === "content_block_delta" && parsed.delta?.text) {
                      const text = parsed.delta.text;
                      fullAssistantText += text;
                      controller.enqueue(
                        encoder.encode(`event: text_delta\ndata: ${JSON.stringify({ text })}\n\n`)
                      );
                    }

                    if (parsed.type === "message_stop") {
                      controller.enqueue(
                        encoder.encode(`event: done\ndata: ${JSON.stringify({ metadata: {} })}\n\n`)
                      );
                    }
                  } catch {
                    // Skip malformed JSON
                  }
                }
              }
            }

            // If stream ended without message_stop, send done event
            if (fullAssistantText) {
              controller.enqueue(
                encoder.encode(`event: done\ndata: ${JSON.stringify({ metadata: {} })}\n\n`)
              );
            }

            // Store assistant message in DB
            if (fullAssistantText) {
              await supabase.from("chat_messages").insert({
                session_id,
                role: "assistant",
                content: fullAssistantText,
                created_at: new Date().toISOString(),
              });
            }
          } catch (err) {
            console.error("Stream error:", err);
            controller.enqueue(
              encoder.encode(
                `event: error\ndata: ${JSON.stringify({ message: "Stream error" })}\n\n`
              )
            );
          } finally {
            controller.close();
          }
        },
      });

      return new Response(stream, {
        headers: {
          ...corsHeaders,
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    // --- FINALIZE ---
    if (action === "finalize") {
      const { session_id } = body as FinalizeRequest;

      await supabase
        .from("chat_sessions")
        .update({ status: "finalized" })
        .eq("id", session_id);

      return new Response(
        JSON.stringify({
          session_id,
          status: "finalized",
          output: {},
          completion_level: "mvp",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ error: `Unknown action: ${action}` }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("general-chat error:", err);
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

import { createClient } from "npm:@supabase/supabase-js@2.49.8";

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY") ?? "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type PersonaMatch = {
  id?: string;
  name: string;
  title: string;
  institution: string;
  type: "mentor" | "expert" | "professor" | "alumni";
  field_badges: string[];
  research_focus: string;
  bio: string;
  scores: {
    fit: number;
    future_benefit: number;
    rating: number;
  };
  match_reason: string;
  benefit_description: string;
};

type GenerateMatchesRequest = {
  action: "generate_matches";
  student_id: string;
  type: string;
  field: string;
  goal: string;
  details: string;
};

type SwipeRequest = {
  action: "swipe";
  session_id: string;
  persona_name: string;
  action_type: "skip" | "connect" | "save";
};

type StartChatRequest = {
  action: "start_chat" | "start_direct_chat";
  session_id: string;
  persona: PersonaMatch;
};

const MATCH_GENERATION_PROMPT = `Du bist ein KI-Matching-System für eine akademische Networking-Plattform. Generiere personalisierte Persona-Matches basierend auf dem Profil des Studierenden.

Generiere genau 8 Personas als JSON-Array. Jede Persona muss folgendes Format haben:
{
  "name": "vollständiger Name",
  "title": "akademischer/beruflicher Titel",
  "institution": "Universität oder Unternehmen",
  "type": "mentor|expert|professor|alumni",
  "field_badges": ["Fachgebiet1", "Fachgebiet2", "Fachgebiet3"],
  "research_focus": "Kurze Beschreibung des Forschungsfokus",
  "bio": "2-3 Sätze Bio",
  "scores": { "fit": 60-98, "future_benefit": 60-98, "rating": 60-98 },
  "match_reason": "Warum passt diese Person zum Studierenden",
  "benefit_description": "Was bringt die Verbindung dem Studierenden"
}

Die Personas sollten realistisch sein, in der Schweiz/DACH-Region angesiedelt, und eine Mischung aus verschiedenen Typen bieten. Sortiere nach gewichtetem Score (40% fit, 35% future_benefit, 25% rating) absteigend.

Antworte NUR mit dem JSON-Array, kein anderer Text.`;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const action = body.action as string;

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // --- GENERATE MATCHES ---
    if (action === "generate_matches") {
      const { student_id, type, field, goal, details } = body as GenerateMatchesRequest;

      const sessionId = crypto.randomUUID();

      // Store networking session
      await supabase.from("networking_sessions").insert({
        id: sessionId,
        student_id,
        questionnaire: { type, field, goal, details },
        created_at: new Date().toISOString(),
      });

      // Generate matches via Claude
      const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4096,
          system: MATCH_GENERATION_PROMPT,
          messages: [
            {
              role: "user",
              content: `Student sucht: ${type}
Fachgebiet: ${field}
Ziel: ${goal}
Details: ${details || "keine weiteren Details"}

Generiere 8 passende Personas.`,
            },
          ],
        }),
      });

      if (!anthropicRes.ok) {
        throw new Error(`Anthropic API error: ${anthropicRes.status}`);
      }

      const anthropicData = await anthropicRes.json();
      const content = anthropicData.content?.[0]?.text ?? "[]";

      // Extract JSON array from response
      let matches: PersonaMatch[] = [];
      try {
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          matches = JSON.parse(jsonMatch[0]);
        }
      } catch {
        console.error("Failed to parse matches JSON");
        matches = [];
      }

      // Store matches
      await supabase.from("networking_sessions").update({
        matches: matches,
      }).eq("id", sessionId);

      return new Response(
        JSON.stringify({ session_id: sessionId, matches }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // --- SWIPE ---
    if (action === "swipe") {
      const { session_id, persona_name } = body;
      const swipeAction = body.action_type || body.action_value || "skip";

      await supabase.from("networking_swipes").insert({
        session_id,
        persona_name,
        swipe_action: swipeAction,
        created_at: new Date().toISOString(),
      });

      return new Response(
        JSON.stringify({ ok: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // --- START CHAT / START DIRECT CHAT ---
    if (action === "start_chat" || action === "start_direct_chat") {
      const { session_id: parentSessionId, persona } = body as StartChatRequest;

      const chatSessionId = crypto.randomUUID();
      const isDirect = action === "start_direct_chat";

      const greeting = isDirect
        ? `Hallo! Schön, dass du dich meldest. Ich bin ${persona.name} — ${persona.title} bei ${persona.institution}. Was kann ich für dich tun?`
        : `Hey! Du chattest jetzt mit ${persona.name}. Ich bin Gini und helfe dir im Hintergrund mit Tipps für das Gespräch. Was möchtest du ${persona.name} zuerst schreiben?`;

      // Store chat session in general chat_sessions
      await supabase.from("chat_sessions").insert({
        id: chatSessionId,
        agent_type: "networking",
        student_id: null,
        metadata: {
          parent_session_id: parentSessionId,
          persona_name: persona.name,
          persona_type: persona.type,
          chat_mode: isDirect ? "direct" : "coaching",
        },
        status: "active",
        created_at: new Date().toISOString(),
      });

      return new Response(
        JSON.stringify({
          session_id: chatSessionId,
          greeting,
          persona,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: `Unknown action: ${action}` }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("networking error:", err);
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

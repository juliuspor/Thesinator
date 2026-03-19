import { supabase, supabaseUrl, supabaseAnonKey } from "@/lib/supabase";
import type {
  AgentType,
  SessionCreateResponse,
  FinalizeResponse,
  SSEEvent,
} from "@/api/types";

export async function createChatSession(
  agentType: AgentType,
  studentId: string,
  metadata?: Record<string, unknown>
): Promise<SessionCreateResponse> {
  if (!supabase) throw new Error("Supabase not configured");

  const { data, error } = await supabase.functions.invoke("general-chat", {
    body: {
      action: "create",
      agent_type: agentType,
      student_id: studentId,
      metadata: metadata ?? {},
    },
  });

  if (error) throw new Error(error.message || "Failed to create chat session");
  if (!data) throw new Error("Empty response from general-chat create");
  return data as SessionCreateResponse;
}

export async function* streamChat(
  agentType: AgentType,
  request: { session_id: string; content: string },
  signal?: AbortSignal
): AsyncGenerator<SSEEvent> {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase not configured");
  }

  const res = await fetch(`${supabaseUrl}/functions/v1/general-chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${supabaseAnonKey}`,
      apikey: supabaseAnonKey,
    },
    body: JSON.stringify({
      action: "chat",
      agent_type: agentType,
      session_id: request.session_id,
      content: request.content,
    }),
    signal,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || res.statusText);
  }

  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    let eventType: string | null = null;
    for (const line of lines) {
      if (line.startsWith("event: ")) {
        eventType = line.slice(7).trim();
      } else if (line.startsWith("data: ") && eventType) {
        const rawData = line.slice(6);
        try {
          const data = JSON.parse(rawData);
          yield { event: eventType, data } as SSEEvent;
        } catch {
          // skip malformed JSON
        }
        eventType = null;
      } else if (line === "") {
        eventType = null;
      }
    }
  }

  // Flush remaining buffer after stream ends
  if (buffer.trim()) {
    const remainingLines = buffer.split("\n");
    let eventType: string | null = null;
    for (const line of remainingLines) {
      if (line.startsWith("event: ")) {
        eventType = line.slice(7).trim();
      } else if (line.startsWith("data: ") && eventType) {
        try {
          const data = JSON.parse(line.slice(6));
          yield { event: eventType, data } as SSEEvent;
        } catch {
          // skip malformed JSON
        }
        eventType = null;
      }
    }
  }
}

export async function finalizeSession(
  sessionId: string
): Promise<FinalizeResponse> {
  if (!supabase) throw new Error("Supabase not configured");

  const { data, error } = await supabase.functions.invoke("general-chat", {
    body: {
      action: "finalize",
      session_id: sessionId,
    },
  });

  if (error) throw new Error(error.message || "Failed to finalize session");
  if (!data) throw new Error("Empty response from general-chat finalize");
  return data as FinalizeResponse;
}

import { supabase } from "@/lib/supabase";
import type {
  GenerateMatchesRequest,
  GenerateMatchesResponse,
  SwipeAction,
  ChatStartResponse,
  PersonaMatch,
} from "@/api/types";

export async function fetchMatches(
  req: GenerateMatchesRequest
): Promise<GenerateMatchesResponse> {
  if (!supabase) throw new Error("Supabase not configured");

  const { data, error } = await supabase.functions.invoke("networking", {
    body: {
      action: "generate_matches",
      ...req,
    },
  });

  if (error) throw new Error(error.message || "Failed to generate matches");
  if (!data) throw new Error("Empty response from networking generate_matches");
  return data as GenerateMatchesResponse;
}

export async function logSwipe(req: SwipeAction): Promise<void> {
  if (!supabase) return;

  await supabase.functions.invoke("networking", {
    body: {
      action: "swipe",
      ...req,
    },
  });
}

export async function startNetworkingChat(
  sessionId: string,
  persona: PersonaMatch
): Promise<ChatStartResponse> {
  if (!supabase) throw new Error("Supabase not configured");

  const { data, error } = await supabase.functions.invoke("networking", {
    body: {
      action: "start_chat",
      session_id: sessionId,
      persona,
    },
  });

  if (error) throw new Error(error.message || "Failed to start networking chat");
  if (!data) throw new Error("Empty response from networking start_chat");
  return data as ChatStartResponse;
}

export async function startDirectChat(
  sessionId: string,
  persona: PersonaMatch
): Promise<ChatStartResponse> {
  if (!supabase) throw new Error("Supabase not configured");

  const { data, error } = await supabase.functions.invoke("networking", {
    body: {
      action: "start_direct_chat",
      session_id: sessionId,
      persona,
    },
  });

  if (error) throw new Error(error.message || "Failed to start direct chat");
  if (!data) throw new Error("Empty response from networking start_direct_chat");
  return data as ChatStartResponse;
}

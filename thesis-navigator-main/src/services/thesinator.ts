import { hasSupabaseEnv, supabase } from "@/lib/supabase";

export type InputMode = "mcq" | "text" | "speech";

export type ThesinatorQuestion = {
  id: number;
  question: string;
  options: string[];
};

export type ContextSnapshot = {
  goal_type: string | null;
  target_industry: string[];
  preferred_cities: string[];
  remote_ok: boolean | null;
  future_vision: string | null;
  paid_required: boolean | null;
  duration_months: number | null;
  nda_ok: boolean | null;
  publish_required: boolean | null;
  existing_ideas: string[];
  refined_interests: string[];
  depth_preference: string | null;
};

export type StartThesinatorResponse = {
  session_id: string;
  client_token: string | null;
  assistant_reply: string;
  audio_b64: string | null;
  question: ThesinatorQuestion;
  question_index: number;
  is_complete: boolean;
};

export type TurnThesinatorResponse = {
  session_id: string;
  client_token: string | null;
  assistant_reply: string;
  audio_b64: string | null;
  next_question: ThesinatorQuestion | null;
  question_index: number;
  is_complete: boolean;
  context_snapshot?: ContextSnapshot;
};

const requireSupabase = () => {
  if (!hasSupabaseEnv || !supabase) {
    throw new Error(
      "Missing Supabase environment variables. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
    );
  }

  return supabase;
};

export const startThesinatorSession = async (): Promise<StartThesinatorResponse> => {
  const client = requireSupabase();

  const { data, error } = await client.functions.invoke<StartThesinatorResponse>("thesinator-chat", {
    body: {
      action: "start",
    },
  });

  if (error) {
    throw new Error(error.message || "Failed to start Thesinator session.");
  }

  if (!data) {
    throw new Error("Thesinator start response was empty.");
  }

  return data;
};

export const sendThesinatorTurn = async (payload: {
  sessionId: string;
  questionId: number;
  userAnswer: string;
  inputMode: InputMode;
  clientToken?: string | null;
}): Promise<TurnThesinatorResponse> => {
  const client = requireSupabase();

  const { data, error } = await client.functions.invoke<TurnThesinatorResponse>("thesinator-chat", {
    body: {
      action: "turn",
      session_id: payload.sessionId,
      question_id: payload.questionId,
      user_answer: payload.userAnswer,
      input_mode: payload.inputMode,
      client_token: payload.clientToken ?? null,
    },
  });

  if (error) {
    throw new Error(error.message || "Failed to send Thesinator answer.");
  }

  if (!data) {
    throw new Error("Thesinator turn response was empty.");
  }

  return data;
};

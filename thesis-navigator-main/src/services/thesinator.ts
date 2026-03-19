import { hasSupabaseEnv, supabase } from "@/lib/supabase";

export type InputMode = "mcq" | "text" | "speech";

export type PinnedItem = {
  id: string;
  questionId: number;
  text: string;
  pinnedAt: string;
};

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
  pinned_items?: PinnedItem[];
};

export type StartThesinatorResponse = {
  session_id: string;
  client_token: string | null;
  assistant_reply: string;
  audio_b64: string | null;
  questions: ThesinatorQuestion[];
  question: ThesinatorQuestion;
  question_index: number;
  is_complete: boolean;
};

export type TopTopicResult = {
  rank: number;
  topic_id: string;
  title: string;
  final_score: number;
  vector_score: number;
  structured_score: number;
  reason: Record<string, unknown> | null;
};

export type MatchingMeta = {
  used_vector: boolean;
  relaxation_stage: number;
  total_candidates: number;
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
  top_topics?: TopTopicResult[];
  matching_meta?: MatchingMeta;
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

export const completeThesinatorSession = async (payload: {
  sessionId: string;
  answers: Array<{
    questionId: number;
    userAnswer: string;
    inputMode: InputMode;
  }>;
  clientToken?: string | null;
}): Promise<TurnThesinatorResponse> => {
  const client = requireSupabase();

  const { data, error } = await client.functions.invoke<TurnThesinatorResponse>("thesinator-chat", {
    body: {
      action: "complete",
      session_id: payload.sessionId,
      client_token: payload.clientToken ?? null,
      answers: payload.answers.map((answer) => ({
        question_id: answer.questionId,
        user_answer: answer.userAnswer,
        input_mode: answer.inputMode,
      })),
    },
  });

  if (error) {
    throw new Error(error.message || "Failed to complete Thesinator session.");
  }

  if (!data) {
    throw new Error("Thesinator completion response was empty.");
  }

  return data;
};

export const pinThesinatorItems = async (payload: {
  sessionId: string;
  clientToken?: string | null;
  pinnedItems: PinnedItem[];
}): Promise<{ ok: boolean; pinned_items: PinnedItem[] }> => {
  const client = requireSupabase();

  const { data, error } = await client.functions.invoke<{
    ok: boolean;
    pinned_items: PinnedItem[];
  }>("thesinator-chat", {
    body: {
      action: "pin",
      session_id: payload.sessionId,
      client_token: payload.clientToken ?? null,
      pinned_items: payload.pinnedItems,
    },
  });

  if (error) {
    throw new Error(error.message || "Failed to pin items.");
  }

  return data ?? { ok: true, pinned_items: payload.pinnedItems };
};

const normalizeTopTopics = (data: unknown): TopTopicResult[] => {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.filter((row): row is TopTopicResult => {
    if (!row || typeof row !== "object") {
      return false;
    }
    const candidate = row as Record<string, unknown>;
    return (
      typeof candidate.rank === "number" &&
      typeof candidate.topic_id === "string" &&
      typeof candidate.title === "string" &&
      typeof candidate.final_score === "number" &&
      typeof candidate.vector_score === "number" &&
      typeof candidate.structured_score === "number"
    );
  });
};

const normalizeMatchingMeta = (value: unknown): MatchingMeta => {
  if (!value || typeof value !== "object") {
    return {
      used_vector: false,
      relaxation_stage: 0,
      total_candidates: 0,
    };
  }

  const candidate = value as Record<string, unknown>;
  return {
    used_vector: candidate.used_vector === true,
    relaxation_stage:
      typeof candidate.relaxation_stage === "number" && Number.isFinite(candidate.relaxation_stage)
        ? Math.round(candidate.relaxation_stage)
        : 0,
    total_candidates:
      typeof candidate.total_candidates === "number" && Number.isFinite(candidate.total_candidates)
        ? Math.round(candidate.total_candidates)
        : 0,
  };
};

export const fetchThesinatorTopTopics = async (payload: {
  sessionId: string;
  clientToken?: string | null;
  limit?: number;
}): Promise<{ top_topics: TopTopicResult[]; matching_meta: MatchingMeta }> => {
  const client = requireSupabase();
  const { data, error } = await client.functions.invoke<{
    top_topics?: unknown;
    matching_meta?: unknown;
  }>("thesinator-chat", {
    body: {
      action: "top_topics",
      session_id: payload.sessionId,
      client_token: payload.clientToken ?? null,
      limit: payload.limit ?? 5,
    },
  });

  if (error) {
    throw new Error(error.message || "Failed to fetch top thesis topics.");
  }

  if (!data) {
    return {
      top_topics: [],
      matching_meta: {
        used_vector: false,
        relaxation_stage: 0,
        total_candidates: 0,
      },
    };
  }

  return {
    top_topics: normalizeTopTopics(data.top_topics),
    matching_meta: normalizeMatchingMeta(data.matching_meta),
  };
};

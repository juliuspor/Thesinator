import { hasSupabaseEnv, supabase, supabaseAnonKey, supabaseUrl } from "@/lib/supabase";

export type FutureSource = "matched" | "generated";
export type SimulationStatus = "queued" | "preparing" | "ready" | "failed";
export type GraphBuildStatus = "queued" | "preparing" | "ready" | "failed";
export type SwarmStatus = "queued" | "preparing" | "running" | "ready" | "failed";

export type FutureEntitySummary = {
  id: string;
  name: string;
  subtitle?: string | null;
  summary?: string | null;
  href?: string | null;
};

export type SwarmImpactDecision = "up" | "steady" | "down";

export type SwarmImpact = {
  decision: SwarmImpactDecision;
  display_delta: number;
  why_this_path: string;
  future_self_angle: string;
  risks: string[];
  evidence: string[];
};

export type FutureCard = {
  future_id: string;
  source: FutureSource;
  rank: number;
  display_rank: number;
  future_headline: string;
  future_role: string;
  future_organization: string;
  future_path_snapshot: string;
  thesis_title: string;
  thesis_summary: string;
  why_fit: string;
  theme: string;
  topic_id: string | null;
  source_topic_ids: string[];
  grounding: {
    company: FutureEntitySummary | null;
    university: FutureEntitySummary | null;
    supervisors: FutureEntitySummary[];
    experts: FutureEntitySummary[];
    fields: string[];
  };
  saved: boolean;
  simulation_status: SimulationStatus;
  swarm_impact: SwarmImpact | null;
};

export type FutureDetail = {
  hero_title: string;
  hero_summary: string;
  opening_note: string;
  why_this_path: string;
  future_self_intro: string;
  story_beat: string;
  persona_brief: string;
  milestones: Array<{
    title: string;
    detail: string;
  }>;
};

export type FutureMapNode = {
  id: string;
  type: "future" | "thesis" | "company" | "university" | "supervisor" | "expert";
  label: string;
  summary: string;
};

export type FutureChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type FutureGraphNode = {
  id: string;
  label: string;
  type:
    | "student"
    | "thesis"
    | "company"
    | "university"
    | "supervisor"
    | "expert"
    | "organization"
    | "other";
  summary: string;
};

export type FutureGraphEdge = {
  id: string;
  source: string;
  target: string;
  label: string;
};

export type FutureGraphEvent = {
  timestamp: string | null;
  message: string | null;
  stage_label: string | null;
  status: string | null;
  progress: number | null;
  error: string | null;
};

export type GraphBuildState = {
  status: GraphBuildStatus;
  stage_label: string | null;
  progress: number;
  mirofish_project_id: string | null;
  task_id: string | null;
  graph_id: string | null;
  error: string | null;
  preview_nodes: FutureGraphNode[];
  preview_edges: FutureGraphEdge[];
  events: FutureGraphEvent[];
};

export type FutureSwarmAction = {
  round_num: number;
  timestamp: string | null;
  platform: string | null;
  agent_id: number;
  agent_name: string;
  action_type: string;
  action_args: Record<string, unknown>;
  result: string | null;
  success: boolean;
};

export type SwarmState = {
  status: SwarmStatus;
  stage_label: string | null;
  progress: number;
  simulation_id: string | null;
  prepare_task_id: string | null;
  runner_status: string | null;
  latest_actions: FutureSwarmAction[];
  events: FutureGraphEvent[];
  error: string | null;
  metrics: {
    twitter_actions_count: number;
    reddit_actions_count: number;
    total_actions_count: number;
  };
};

export type FinalizationStatus = "queued" | "preparing" | "ready" | "failed";

export type FinalizationState = {
  status: FinalizationStatus;
  stage_label: string | null;
  progress: number;
  error: string | null;
};

export type FutureViewState = {
  graph_build: GraphBuildState;
  swarm: SwarmState;
  finalization: FinalizationState;
};

export type FutureSessionState = {
  future_session_id: string;
  matched_futures: FutureCard[];
  generated_futures: FutureCard[];
  futures: FutureCard[];
  saved_future_ids: string[];
  selected_future_id?: string | null;
  graph_build: GraphBuildState;
  swarm: SwarmState;
  finalization: FinalizationState;
};

export type FutureDetailResponse = {
  future_card: FutureCard;
  future_detail: FutureDetail | null;
  simulation_status: SimulationStatus;
  map_nodes: FutureMapNode[];
  suggested_prompts: string[];
  swarm_impact: SwarmImpact | null;
  chat_history: FutureChatMessage[];
};

const requireSupabaseEnv = () => {
  if (!hasSupabaseEnv || !supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
    );
  }
};

const getFunctionHeaders = async () => {
  requireSupabaseEnv();

  const headers = new Headers({
    "Content-Type": "application/json",
    apikey: supabaseAnonKey!,
  });

  const session = supabase ? await supabase.auth.getSession() : null;
  const accessToken = session?.data.session?.access_token;
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return headers;
};

const callFutureSessionsApi = async <T>(path: string, init?: RequestInit): Promise<T> => {
  requireSupabaseEnv();

  const headers = await getFunctionHeaders();
  if (init?.headers) {
    const extraHeaders = new Headers(init.headers);
    extraHeaders.forEach((value, key) => headers.set(key, value));
  }

  const response = await fetch(`${supabaseUrl}/functions/v1/future-sessions${path}`, {
    ...init,
    headers,
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      payload && typeof payload === "object" && "error" in payload && typeof payload.error === "string"
        ? payload.error
        : "Future sessions request failed.";
    throw new Error(message);
  }

  return payload as T;
};

export const createFutureSession = async (thesinatorSessionId: string) =>
  callFutureSessionsApi<FutureSessionState>("", {
    method: "POST",
    body: JSON.stringify({ thesinator_session_id: thesinatorSessionId }),
  });

export const getFutureSession = async (futureSessionId: string) =>
  callFutureSessionsApi<FutureSessionState>(`/${futureSessionId}`, {
    method: "GET",
  });

export const getFutureSessionFutureView = async (futureSessionId: string) =>
  callFutureSessionsApi<FutureViewState>(`/${futureSessionId}/future-view`, {
    method: "GET",
  });

export const getFutureSessionGraph = async (futureSessionId: string) =>
  callFutureSessionsApi<FutureViewState>(`/${futureSessionId}/graph`, {
    method: "GET",
  });

export const getFuture = async (futureSessionId: string, futureId: string) =>
  callFutureSessionsApi<FutureDetailResponse>(`/${futureSessionId}/futures/${futureId}`, {
    method: "GET",
  });

export const saveFuture = async (futureSessionId: string, futureId: string) =>
  callFutureSessionsApi<{ saved_future_ids: string[] }>(`/${futureSessionId}/futures/${futureId}/save`, {
    method: "POST",
  });

export const chatWithFutureSelf = async (
  futureSessionId: string,
  futureId: string,
  message: string,
) =>
  callFutureSessionsApi<{ reply: string }>(`/${futureSessionId}/futures/${futureId}/chat`, {
    method: "POST",
    body: JSON.stringify({ message }),
  });

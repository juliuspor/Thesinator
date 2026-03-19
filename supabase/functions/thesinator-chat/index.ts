import { createClient } from "npm:@supabase/supabase-js@2.49.8";
import {
  DEFAULT_CONTEXT_SNAPSHOT,
  THESINATOR_QUESTIONS,
  defaultAssistantIntro,
  extractJsonObject,
  isInputMode,
  mergeContextSnapshot,
} from "./_shared.ts";
import type { ContextSnapshot, InputMode, ThesinatorQuestion } from "./_shared.ts";

type StartRequest = {
  action: "start";
};

type TurnRequest = {
  action: "turn";
  session_id: string;
  question_id: number;
  user_answer: string;
  input_mode: InputMode;
  client_token?: string | null;
};

type TopTopicsRequest = {
  action: "top_topics";
  session_id: string;
  client_token?: string | null;
  limit?: number;
};

type AnthropicTurnResult = {
  assistant_reply: string;
  snapshot_patch: Record<string, unknown>;
  next_question_index: number | null;
  is_complete: boolean;
};

type SessionRow = {
  id: string;
  user_id: string | null;
  client_token: string | null;
  status: string;
  current_question_index: number;
  context_snapshot: unknown;
};

type TopTopicRow = {
  rank: number;
  topic_id: string;
  title: string;
  final_score: number;
  vector_score: number;
  structured_score: number;
  reason: Record<string, unknown> | null;
};

type MatchingMeta = {
  used_vector: boolean;
  relaxation_stage: number;
  total_candidates: number;
};

type TopTopicComputation = {
  topTopics: TopTopicRow[];
  matchingMeta: MatchingMeta;
};

type TopicEmbeddingRow = {
  id: string;
  title: string;
  search_document: string | null;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (status: number, payload: unknown) => {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
};

const errorResponse = (status: number, message: string) => {
  return json(status, { error: message });
};

const getClients = async (req: Request) => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.");
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  let userId: string | null = null;
  const authHeader = req.headers.get("Authorization");

  if (authHeader && anonKey) {
    const authClient = createClient(supabaseUrl, anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    const { data, error } = await authClient.auth.getUser();
    if (!error) {
      userId = data.user?.id ?? null;
    }
  }

  return { adminClient, userId };
};

const buildAssistantReply = (
  reflectiveReply: string,
  nextQuestion: ThesinatorQuestion | null,
  isComplete: boolean,
) => {
  const normalized = reflectiveReply.trim() || "Thanks for sharing that.";

  if (isComplete) {
    return `${normalized}\n\nGreat, I have enough information now. I will produce your structured context snapshot next.`;
  }

  if (!nextQuestion) {
    return normalized;
  }

  return `${normalized}\n\nNext question: ${nextQuestion.question}`;
};

const buildAnthropicPrompt = (input: {
  currentQuestion: ThesinatorQuestion;
  currentQuestionIndex: number;
  userAnswer: string;
  contextSnapshot: unknown;
}) => {
  const promptPayload = {
    instruction:
      "Reflect briefly in English on the user answer and update only inferable fields in snapshot_patch. Keep unknown fields omitted from patch.",
    question_order: THESINATOR_QUESTIONS.map((q, index) => ({
      index,
      id: q.id,
      question: q.question,
      options: q.options,
    })),
    current_question_index: input.currentQuestionIndex,
    current_question: input.currentQuestion,
    user_answer: input.userAnswer,
    existing_context_snapshot: input.contextSnapshot,
    strict_output_schema: {
      assistant_reply: "string",
      snapshot_patch: {
        goal_type: "string|null",
        target_industry: "string[]",
        preferred_cities: "string[]",
        remote_ok: "boolean|null",
        future_vision: "string|null",
        paid_required: "boolean|null",
        duration_months: "number|null",
        nda_ok: "boolean|null",
        publish_required: "boolean|null",
        existing_ideas: "string[]",
        refined_interests: "string[]",
        depth_preference: "string|null",
      },
      next_question_index: "number|null",
      is_complete: "boolean",
    },
  };

  return JSON.stringify(promptPayload, null, 2);
};

const callAnthropic = async (input: {
  currentQuestion: ThesinatorQuestion;
  currentQuestionIndex: number;
  userAnswer: string;
  contextSnapshot: unknown;
}): Promise<AnthropicTurnResult> => {
  const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");
  if (!anthropicKey) {
    throw new Error("Missing ANTHROPIC_API_KEY environment variable.");
  }

  const model = Deno.env.get("ANTHROPIC_MODEL") ?? "claude-3-5-sonnet-latest";

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": anthropicKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 800,
      temperature: 0.2,
      system:
        "You are Thesinator, a thesis assistant. Respond in English. Output JSON only, no markdown, no extra keys.",
      messages: [{ role: "user", content: buildAnthropicPrompt(input) }],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Anthropic API failed (${response.status}): ${body}`);
  }

  const data = await response.json();
  const content = Array.isArray(data.content)
    ? data.content
        .filter((item: Record<string, unknown>) => item.type === "text")
        .map((item: Record<string, unknown>) => String(item.text ?? ""))
        .join("\n")
    : "";

  const parsed = extractJsonObject(content);

  if (!parsed) {
    throw new Error("Anthropic response did not contain a valid JSON object.");
  }

  const assistantReply =
    typeof parsed.assistant_reply === "string" && parsed.assistant_reply.trim().length > 0
      ? parsed.assistant_reply.trim()
      : "Thanks, that helps me understand your preferences better.";

  const snapshotPatch =
    parsed.snapshot_patch && typeof parsed.snapshot_patch === "object" && !Array.isArray(parsed.snapshot_patch)
      ? (parsed.snapshot_patch as Record<string, unknown>)
      : {};

  const nextQuestionIndex =
    typeof parsed.next_question_index === "number" && Number.isFinite(parsed.next_question_index)
      ? Math.round(parsed.next_question_index)
      : null;

  const isComplete = typeof parsed.is_complete === "boolean" ? parsed.is_complete : false;

  return {
    assistant_reply: assistantReply,
    snapshot_patch: snapshotPatch,
    next_question_index: nextQuestionIndex,
    is_complete: isComplete,
  };
};

const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  let binary = "";

  for (let index = 0; index < bytes.length; index += chunkSize) {
    const chunk = bytes.subarray(index, index + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
};

const synthesizeWithElevenLabs = async (text: string): Promise<string | null> => {
  const apiKey = Deno.env.get("ELEVENLABS_API_KEY");
  const voiceId = Deno.env.get("ELEVENLABS_VOICE_ID");
  const modelId = Deno.env.get("ELEVENLABS_MODEL_ID") ?? "eleven_multilingual_v2";

  if (!apiKey || !voiceId) {
    return null;
  }

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: "POST",
    headers: {
      accept: "audio/mpeg",
      "content-type": "application/json",
      "xi-api-key": apiKey,
    },
    body: JSON.stringify({
      text,
      model_id: modelId,
      voice_settings: {
        stability: 0.45,
        similarity_boost: 0.75,
      },
    }),
  });

  if (!response.ok) {
    return null;
  }

  const buffer = await response.arrayBuffer();
  return arrayBufferToBase64(buffer);
};

const toPositiveInteger = (value: unknown, fallback: number, max: number): number => {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return fallback;
  }

  return Math.max(1, Math.min(Math.round(value), max));
};

const normalizeLimit = (value: unknown): number => {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 5;
  }

  return Math.max(1, Math.min(Math.round(value), 20));
};

const chunk = <T>(input: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let index = 0; index < input.length; index += size) {
    chunks.push(input.slice(index, index + size));
  }
  return chunks;
};

const callOpenAIEmbeddings = async (inputs: string[]): Promise<number[][] | null> => {
  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey || inputs.length === 0) {
    return null;
  }

  const model = Deno.env.get("OPENAI_EMBEDDING_MODEL") ?? "text-embedding-3-small";
  const normalizedInputs = inputs.map((input) => {
    const trimmed = input.trim();
    return trimmed.length > 0 ? trimmed : "n/a";
  });

  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      input: normalizedInputs,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`OpenAI embeddings API failed (${response.status}): ${body}`);
  }

  const payload = await response.json();
  if (!Array.isArray(payload.data)) {
    throw new Error("OpenAI embeddings response did not include data.");
  }

  const vectors: number[][] = [];
  for (const row of payload.data as Array<Record<string, unknown>>) {
    const embedding = row.embedding;
    if (!Array.isArray(embedding)) {
      throw new Error("OpenAI embeddings response row was missing embedding array.");
    }

    const numericEmbedding = embedding.filter((item: unknown): item is number => typeof item === "number");
    if (numericEmbedding.length === 0) {
      throw new Error("OpenAI embeddings response row had no numeric values.");
    }

    vectors.push(numericEmbedding);
  }

  if (vectors.length !== normalizedInputs.length) {
    throw new Error("OpenAI embeddings response size mismatch.");
  }

  return vectors;
};

const callOpenAIEmbedding = async (text: string): Promise<number[] | null> => {
  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return null;
  }

  const vectors = await callOpenAIEmbeddings([trimmed]);
  return vectors?.[0] ?? null;
};

const buildProfileDocument = (snapshot: ContextSnapshot, transcriptText: string): string => {
  return [
    "Thesinator profile summary",
    `Snapshot JSON:\n${JSON.stringify(snapshot, null, 2)}`,
    "Conversation transcript",
    transcriptText,
  ].join("\n\n");
};

const normalizeTopTopics = (rows: unknown): TopTopicRow[] => {
  if (!Array.isArray(rows)) {
    return [];
  }

  const normalized: TopTopicRow[] = [];

  for (const item of rows) {
    if (!item || typeof item !== "object") {
      continue;
    }

    const row = item as Record<string, unknown>;
    if (
      typeof row.rank !== "number" ||
      typeof row.topic_id !== "string" ||
      typeof row.title !== "string" ||
      typeof row.final_score !== "number" ||
      typeof row.vector_score !== "number" ||
      typeof row.structured_score !== "number"
    ) {
      continue;
    }

    normalized.push({
      rank: row.rank,
      topic_id: row.topic_id,
      title: row.title,
      final_score: row.final_score,
      vector_score: row.vector_score,
      structured_score: row.structured_score,
      reason:
        row.reason && typeof row.reason === "object" && !Array.isArray(row.reason)
          ? (row.reason as Record<string, unknown>)
          : null,
    });
  }

  normalized.sort((a, b) => a.rank - b.rank);
  return normalized;
};

const extractMatchingMeta = (rows: TopTopicRow[]): MatchingMeta => {
  const firstReason = rows[0]?.reason;
  const stage =
    firstReason && typeof firstReason.relaxation_stage === "number" && Number.isFinite(firstReason.relaxation_stage)
      ? Math.round(firstReason.relaxation_stage)
      : 0;
  const totalCandidates =
    firstReason && typeof firstReason.total_candidates === "number" && Number.isFinite(firstReason.total_candidates)
      ? Math.round(firstReason.total_candidates)
      : rows.length;

  const usedVectorFromReason = rows.some((row) => row.reason?.used_vector === true);
  const usedVectorFallback = rows.some((row) => row.vector_score > 0);

  return {
    used_vector: usedVectorFromReason || usedVectorFallback,
    relaxation_stage: stage,
    total_candidates: totalCandidates,
  };
};

const persistCompletionSearchProfile = async (input: {
  adminClient: ReturnType<typeof createClient>;
  session: SessionRow;
  snapshot: ContextSnapshot;
}): Promise<void> => {
  const { data: messageRows, error: messagesError } = await input.adminClient
    .from("thesinator_messages")
    .select("role, content, created_at")
    .eq("session_id", input.session.id)
    .order("created_at", { ascending: true });

  if (messagesError) {
    throw new Error(messagesError.message);
  }

  const transcriptText = (messageRows ?? [])
    .map((message) => {
      const role = typeof message.role === "string" ? message.role : "unknown";
      const content = typeof message.content === "string" ? message.content.trim() : "";
      return content.length > 0 ? `${role}: ${content}` : null;
    })
    .filter((line): line is string => line !== null)
    .join("\n");

  const profileDocument = buildProfileDocument(input.snapshot, transcriptText);
  let embedding: number[] | null = null;
  try {
    embedding = await callOpenAIEmbedding(profileDocument);
  } catch (embeddingError) {
    console.error("Failed to create profile embedding, continuing with structured scoring.", embeddingError);
  }

  const { error: upsertProfileError } = await input.adminClient.rpc(
    "upsert_thesinator_search_profile",
    {
      p_session_id: input.session.id,
      p_user_id: input.session.user_id,
      p_context_snapshot: input.snapshot,
      p_transcript_text: transcriptText,
      p_profile_document: profileDocument,
      p_embedding: embedding,
    },
  );

  if (upsertProfileError) {
    throw new Error(upsertProfileError.message);
  }
};

const ensureTopicEmbeddings = async (adminClient: ReturnType<typeof createClient>) => {
  const hasOpenAiKey = Boolean(Deno.env.get("OPENAI_API_KEY"));
  if (!hasOpenAiKey) {
    return;
  }

  const maxTopics = toPositiveInteger(
    Number(Deno.env.get("TOPIC_EMBED_AUTO_HEAL_MAX") ?? "200"),
    200,
    1000,
  );
  const batchSize = toPositiveInteger(
    Number(Deno.env.get("TOPIC_EMBED_BATCH_SIZE") ?? "20"),
    20,
    100,
  );

  const { error: refreshError } = await adminClient.rpc("refresh_topic_search_documents");
  if (refreshError) {
    throw new Error(refreshError.message);
  }

  const { data: missingTopics, error: missingTopicsError } = await adminClient
    .from("topics")
    .select("id, title, search_document")
    .is("embedding", null)
    .order("id", { ascending: true })
    .limit(maxTopics);

  if (missingTopicsError) {
    throw new Error(missingTopicsError.message);
  }

  const topics = (missingTopics ?? []) as TopicEmbeddingRow[];
  if (topics.length === 0) {
    return;
  }

  for (const topicChunk of chunk(topics, batchSize)) {
    const inputs = topicChunk.map((topic) => {
      const searchDocument = topic.search_document?.trim() ?? "";
      const title = topic.title?.trim() ?? "";
      return searchDocument.length > 0 ? searchDocument : title;
    });

    const embeddings = await callOpenAIEmbeddings(inputs);
    if (!embeddings) {
      return;
    }

    for (let index = 0; index < topicChunk.length; index += 1) {
      const topic = topicChunk[index];
      const embedding = embeddings[index];

      const { error: setEmbeddingError } = await adminClient.rpc("set_topic_embedding", {
        p_topic_id: topic.id,
        p_embedding: embedding,
      });

      if (setEmbeddingError) {
        throw new Error(setEmbeddingError.message);
      }
    }
  }
};

const computeTopTopics = async (input: {
  adminClient: ReturnType<typeof createClient>;
  sessionId: string;
  limit?: number;
}): Promise<TopTopicComputation> => {
  const { data, error } = await input.adminClient.rpc("refresh_session_top_topics", {
    p_session_id: input.sessionId,
    p_limit: input.limit ?? 5,
  });

  if (error) {
    throw new Error(error.message);
  }

  const topTopics = normalizeTopTopics(data);
  return {
    topTopics,
    matchingMeta: extractMatchingMeta(topTopics),
  };
};

const handleStart = async (req: Request) => {
  const { adminClient, userId } = await getClients(req);
  const firstQuestion = THESINATOR_QUESTIONS[0];
  const assistantReply = defaultAssistantIntro(firstQuestion);

  const clientToken = userId ? null : crypto.randomUUID();

  const { data: session, error: createSessionError } = await adminClient
    .from("thesinator_sessions")
    .insert({
      user_id: userId,
      client_token: clientToken,
      status: "active",
      current_question_index: 0,
      context_snapshot: DEFAULT_CONTEXT_SNAPSHOT,
    })
    .select("id, client_token")
    .single();

  if (createSessionError || !session) {
    throw new Error(createSessionError?.message ?? "Failed to create thesinator session.");
  }

  const { error: assistantMessageError } = await adminClient.from("thesinator_messages").insert({
    session_id: session.id,
    role: "assistant",
    question_id: firstQuestion.id,
    input_mode: null,
    content: assistantReply,
  });

  if (assistantMessageError) {
    throw new Error(assistantMessageError.message);
  }

  const audioB64 = await synthesizeWithElevenLabs(assistantReply);

  return {
    session_id: session.id,
    client_token: session.client_token,
    assistant_reply: assistantReply,
    audio_b64: audioB64,
    question: firstQuestion,
    question_index: 0,
    is_complete: false,
  };
};

const enforceSessionOwnership = (
  session: SessionRow,
  userId: string | null,
  clientToken: string | null,
): string | null => {
  if (session.user_id) {
    if (!userId || userId !== session.user_id) {
      return "You do not have access to this session.";
    }
    return null;
  }

  if (!session.client_token || !clientToken || clientToken !== session.client_token) {
    return "Missing or invalid client token for anonymous session.";
  }

  return null;
};

const loadSessionById = async (adminClient: ReturnType<typeof createClient>, sessionId: string) => {
  const { data: session, error: sessionError } = await adminClient
    .from("thesinator_sessions")
    .select("id, user_id, client_token, status, current_question_index, context_snapshot")
    .eq("id", sessionId)
    .single();

  if (sessionError || !session) {
    return null;
  }

  return session as SessionRow;
};

const handleTurn = async (req: Request, body: TurnRequest) => {
  const { adminClient, userId } = await getClients(req);

  if (!body.session_id || typeof body.session_id !== "string") {
    return errorResponse(400, "session_id is required.");
  }

  if (typeof body.question_id !== "number") {
    return errorResponse(400, "question_id must be a number.");
  }

  if (!isInputMode(body.input_mode)) {
    return errorResponse(400, "input_mode must be one of: mcq, text, speech.");
  }

  if (typeof body.user_answer !== "string" || body.user_answer.trim().length === 0) {
    return errorResponse(400, "user_answer is required.");
  }

  const session = await loadSessionById(adminClient, body.session_id);
  if (!session) {
    return errorResponse(404, "Session not found.");
  }

  const ownershipError = enforceSessionOwnership(session, userId, body.client_token ?? null);

  if (ownershipError) {
    return errorResponse(403, ownershipError);
  }

  if (session.status !== "active") {
    return errorResponse(409, `Session is not active (current status: ${session.status}).`);
  }

  const currentQuestion = THESINATOR_QUESTIONS[session.current_question_index];
  if (!currentQuestion) {
    return errorResponse(500, "Session question index is out of range.");
  }

  if (body.question_id !== currentQuestion.id) {
    return errorResponse(
      409,
      `Question mismatch. Expected question_id ${currentQuestion.id}, received ${body.question_id}.`,
    );
  }

  const trimmedAnswer = body.user_answer.trim();

  const { error: userMessageError } = await adminClient.from("thesinator_messages").insert({
    session_id: session.id,
    role: "user",
    question_id: currentQuestion.id,
    input_mode: body.input_mode,
    content: trimmedAnswer,
  });

  if (userMessageError) {
    throw new Error(userMessageError.message);
  }

  const modelResult = await callAnthropic({
    currentQuestion,
    currentQuestionIndex: session.current_question_index,
    userAnswer: trimmedAnswer,
    contextSnapshot: session.context_snapshot,
  });

  const mergedSnapshot = mergeContextSnapshot(session.context_snapshot, modelResult.snapshot_patch);

  const isLastQuestion = session.current_question_index >= THESINATOR_QUESTIONS.length - 1;
  const nextQuestionIndex = isLastQuestion ? null : session.current_question_index + 1;
  const isComplete = isLastQuestion;
  const nextQuestion = nextQuestionIndex !== null ? THESINATOR_QUESTIONS[nextQuestionIndex] : null;

  const assistantReply = buildAssistantReply(modelResult.assistant_reply, nextQuestion, isComplete);

  const { error: updateSessionError } = await adminClient
    .from("thesinator_sessions")
    .update({
      status: isComplete ? "completed" : "active",
      current_question_index: nextQuestionIndex ?? session.current_question_index,
      context_snapshot: mergedSnapshot,
      completed_at: isComplete ? new Date().toISOString() : null,
    })
    .eq("id", session.id);

  if (updateSessionError) {
    throw new Error(updateSessionError.message);
  }

  const { error: assistantMessageError } = await adminClient.from("thesinator_messages").insert({
    session_id: session.id,
    role: "assistant",
    question_id: nextQuestion?.id ?? currentQuestion.id,
    input_mode: null,
    content: assistantReply,
  });

  if (assistantMessageError) {
    throw new Error(assistantMessageError.message);
  }

  const audioB64 = await synthesizeWithElevenLabs(assistantReply);
  let topTopics: TopTopicRow[] | undefined;
  let matchingMeta: MatchingMeta | undefined;

  if (isComplete) {
    await persistCompletionSearchProfile({
      adminClient,
      session,
      snapshot: mergedSnapshot,
    }).catch((completionError) => {
      console.error("Failed to persist completion profile.", completionError);
    });

    try {
      await ensureTopicEmbeddings(adminClient);
    } catch (topicEmbeddingError) {
      console.error("Failed to auto-heal topic embeddings; proceeding without vector boost.", topicEmbeddingError);
    }

    try {
      const computed = await computeTopTopics({
        adminClient,
        sessionId: session.id,
        limit: 5,
      });
      topTopics = computed.topTopics;
      matchingMeta = computed.matchingMeta;
    } catch (completionError) {
      console.error("Failed to compute completion top topics", completionError);
    }
  }

  return json(200, {
    session_id: session.id,
    client_token: session.client_token,
    assistant_reply: assistantReply,
    audio_b64: audioB64,
    next_question: nextQuestion,
    question_index: nextQuestionIndex ?? session.current_question_index,
    is_complete: isComplete,
    context_snapshot: isComplete ? mergedSnapshot : undefined,
    top_topics: isComplete ? topTopics ?? [] : undefined,
    matching_meta: isComplete ? matchingMeta : undefined,
  });
};

const handleTopTopics = async (req: Request, body: TopTopicsRequest) => {
  const { adminClient, userId } = await getClients(req);

  if (!body.session_id || typeof body.session_id !== "string") {
    return errorResponse(400, "session_id is required.");
  }

  const session = await loadSessionById(adminClient, body.session_id);
  if (!session) {
    return errorResponse(404, "Session not found.");
  }

  const ownershipError = enforceSessionOwnership(session, userId, body.client_token ?? null);
  if (ownershipError) {
    return errorResponse(403, ownershipError);
  }

  try {
    await ensureTopicEmbeddings(adminClient);
  } catch (topicEmbeddingError) {
    console.error("Failed to auto-heal topic embeddings for top_topics action.", topicEmbeddingError);
  }

  const computed = await computeTopTopics({
    adminClient,
    sessionId: session.id,
    limit: normalizeLimit(body.limit),
  });

  return json(200, {
    top_topics: computed.topTopics,
    matching_meta: computed.matchingMeta,
  });
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return errorResponse(405, "Method not allowed. Use POST.");
  }

  let body: StartRequest | TurnRequest | TopTopicsRequest;
  try {
    body = (await req.json()) as StartRequest | TurnRequest | TopTopicsRequest;
  } catch {
    return errorResponse(400, "Invalid JSON payload.");
  }

  try {
    if (body.action === "start") {
      const result = await handleStart(req);
      return json(200, result);
    }

    if (body.action === "turn") {
      return await handleTurn(req, body);
    }

    if (body.action === "top_topics") {
      return await handleTopTopics(req, body);
    }

    return errorResponse(400, "Invalid action. Use 'start', 'turn', or 'top_topics'.");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected server error.";
    return errorResponse(500, message);
  }
});

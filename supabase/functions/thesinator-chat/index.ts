import { createClient } from "npm:@supabase/supabase-js@2.49.8";
import {
  DEFAULT_CONTEXT_SNAPSHOT,
  THESINATOR_QUESTIONS,
  defaultAssistantIntro,
  extractJsonObject,
  isInputMode,
  mergeContextSnapshot,
} from "./_shared.ts";
import type { InputMode, ThesinatorQuestion } from "./_shared.ts";

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

  const { data: session, error: sessionError } = await adminClient
    .from("thesinator_sessions")
    .select("id, user_id, client_token, status, current_question_index, context_snapshot")
    .eq("id", body.session_id)
    .single();

  if (sessionError || !session) {
    return errorResponse(404, "Session not found.");
  }

  const ownershipError = enforceSessionOwnership(
    session as SessionRow,
    userId,
    body.client_token ?? null,
  );

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

  return json(200, {
    session_id: session.id,
    client_token: session.client_token,
    assistant_reply: assistantReply,
    audio_b64: audioB64,
    next_question: nextQuestion,
    question_index: nextQuestionIndex ?? session.current_question_index,
    is_complete: isComplete,
    context_snapshot: isComplete ? mergedSnapshot : undefined,
  });
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return errorResponse(405, "Method not allowed. Use POST.");
  }

  let body: StartRequest | TurnRequest;
  try {
    body = (await req.json()) as StartRequest | TurnRequest;
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

    return errorResponse(400, "Invalid action. Use 'start' or 'turn'.");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected server error.";
    return errorResponse(500, message);
  }
});

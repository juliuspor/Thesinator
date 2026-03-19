import type { TranscriptResponse } from "@/api/types";

// Voice services - simplified/mocked for now since voice is not primary for pitch

export async function transcribeAudio(
  blob: Blob
): Promise<TranscriptResponse> {
  // For demo: use browser SpeechRecognition instead
  console.warn("transcribeAudio: backend transcription not yet configured");
  return { transcript: "", language: "de-DE" };
}

export async function streamTTS(text: string): Promise<Response> {
  console.warn("streamTTS: TTS not yet configured");
  return new Response("", { status: 200 });
}

export interface SignedUrlResponse {
  signed_url: string;
  overrides: {
    agent: {
      language: string;
    };
  };
  dynamic_variables: Record<string, string>;
}

export async function getOnboardingSignedUrl(
  sessionId: string
): Promise<SignedUrlResponse> {
  console.warn("getOnboardingSignedUrl: not yet configured");
  throw new Error("ElevenLabs integration not configured");
}

export async function submitExtraction(
  sessionId: string,
  params: { section: string; data: Record<string, unknown>; confidence: number }
): Promise<Record<string, unknown>> {
  console.warn("submitExtraction: not yet configured");
  return {};
}

export async function submitFinalization(
  sessionId: string,
  params: { reason: string; summaries?: Record<string, unknown> }
): Promise<Record<string, unknown>> {
  console.warn("submitFinalization: not yet configured");
  return {};
}

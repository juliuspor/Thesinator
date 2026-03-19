// ElevenLabs session hook - simplified/stubbed for Supabase architecture
// Can be connected to ElevenLabs later if voice onboarding is needed.

import { useState, useCallback } from "react";
import type { ChatMessage } from "@/api/types";

export type ElevenLabsStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "error";

interface UseElevenLabsSessionOptions {
  onFinalized?: (reason: string) => void;
}

export function useElevenLabsSession(_opts?: UseElevenLabsSessionOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status] = useState<ElevenLabsStatus>("disconnected");
  const [isSpeaking] = useState(false);

  const connect = useCallback(async (_sessionId: string): Promise<boolean> => {
    console.warn("ElevenLabs session not yet configured for Supabase");
    return false;
  }, []);

  const sendText = useCallback((_text: string) => {}, []);
  const setVolume = useCallback((_volume: number) => {}, []);
  const disconnect = useCallback(async () => {}, []);

  return {
    messages,
    setMessages,
    status,
    isSpeaking,
    connect,
    sendText,
    setVolume,
    disconnect,
  };
}

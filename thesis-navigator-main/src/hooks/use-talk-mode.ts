// Talk mode hook - placeholder for WebSocket-based talk mode
// WebSocket talk mode requires a dedicated backend endpoint.
// For now this is a stub that can be connected later.

import { useState, useCallback } from "react";
import type { AgentType, ChatMessage } from "@/api/types";

export type TalkState = "idle" | "listening" | "processing" | "speaking";

interface UseTalkModeOptions {
  sessionId: string | null;
  agentType: AgentType;
  onUserMessage: (msg: ChatMessage) => void;
  onAssistantStart: () => string;
  onAssistantDelta: (text: string) => void;
  onAssistantDone: () => void;
}

export function useTalkMode(_opts: UseTalkModeOptions) {
  const [isActive] = useState(false);
  const [isMicOn] = useState(false);
  const [talkState] = useState<TalkState>("idle");
  const [partialTranscript] = useState("");

  const startTalkMode = useCallback(async () => {
    console.warn("Talk mode not yet connected to Supabase WebSocket endpoint");
  }, []);

  const stopTalkMode = useCallback(() => {}, []);
  const toggleMic = useCallback(async () => {}, []);
  const sendInterrupt = useCallback(() => {}, []);

  return {
    isActive,
    isMicOn,
    talkState,
    partialTranscript,
    startTalkMode,
    stopTalkMode,
    toggleMic,
    sendInterrupt,
  };
}

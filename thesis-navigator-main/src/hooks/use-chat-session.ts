import { useState, useRef, useCallback, useEffect } from "react";
import { createChatSession, finalizeSession, streamChat } from "@/services/chat";
import type {
  AgentType,
  ChatMessage,
  FinalizeResponse,
} from "@/api/types";

function makeId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const STUDENT_ID = import.meta.env.VITE_STUDENT_ID || "student-01";

export function useChatSession(agentType: AgentType, externalSessionId?: string | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(externalSessionId ?? null);

  // Sync external session ID when it changes (e.g. after networking chat/start)
  useEffect(() => {
    if (externalSessionId) {
      setSessionId(externalSessionId);
      setIsConnected(true);
    }
  }, [externalSessionId]);

  const abortRef = useRef<AbortController | null>(null);

  const startSession = useCallback(async (metadata?: Record<string, unknown>) => {
    setIsLoading(true);
    setIsConnected(null);

    // Abort session creation if it takes longer than 15s
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      const res = await createChatSession(agentType, STUDENT_ID, metadata);
      clearTimeout(timeout);
      if (controller.signal.aborted) return;
      setSessionId(res.session_id);
      setMessages([
        {
          id: makeId(),
          role: "assistant",
          content: res.greeting,
          timestamp: Date.now(),
        },
      ]);
      setIsConnected(true);
    } catch {
      clearTimeout(timeout);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, [agentType]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!sessionId || isStreaming) return;

      const userMsg: ChatMessage = {
        id: makeId(),
        role: "user",
        content,
        timestamp: Date.now(),
      };
      const assistantId = makeId();

      setMessages((prev) => [
        ...prev,
        userMsg,
        {
          id: assistantId,
          role: "assistant",
          content: "",
          timestamp: Date.now(),
          isStreaming: true,
        },
      ]);

      setIsStreaming(true);
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        let fullText = "";
        for await (const event of streamChat(
          agentType,
          { session_id: sessionId, content },
          controller.signal
        )) {
          if (event.event === "text_delta") {
            fullText += event.data.text;
            const captured = fullText;
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? { ...m, content: captured, isStreaming: true }
                  : m
              )
            );
          } else if (event.event === "error") {
            fullText += `\n[Error: ${event.data.message}]`;
            const captured = fullText;
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? { ...m, content: captured, isStreaming: false }
                  : m
              )
            );
          }
        }

        // Replace empty assistant messages with error feedback
        if (!fullText.trim()) {
          fullText = "[Gini konnte keine Antwort generieren. Bitte versuche es erneut.]";
        }
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: fullText, isStreaming: false }
              : m
          )
        );
      } catch (e) {
        if ((e as Error).name !== "AbortError") {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? {
                    ...m,
                    content:
                      m.content +
                      `\n[Error: ${e instanceof Error ? e.message : "unknown"}]`,
                    isStreaming: false,
                  }
                : m
            )
          );
        }
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [sessionId, isStreaming, agentType]
  );

  const finalizeChat = useCallback(async (): Promise<FinalizeResponse | null> => {
    if (!sessionId) return null;
    try {
      return await finalizeSession(sessionId);
    } catch {
      return null;
    }
  }, [sessionId]);

  const addMessage = useCallback((msg: ChatMessage) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  const updateLastAssistant = useCallback(
    (updater: (content: string) => string, streaming?: boolean) => {
      setMessages((prev) => {
        const idx = prev.findLastIndex((m) => m.role === "assistant");
        if (idx < 0) return prev;
        const copy = [...prev];
        copy[idx] = {
          ...copy[idx],
          content: updater(copy[idx].content),
          isStreaming: streaming ?? copy[idx].isStreaming,
        };
        return copy;
      });
    },
    []
  );

  return {
    messages,
    isStreaming,
    isConnected,
    isLoading,
    sessionId,
    startSession,
    sendMessage,
    finalizeChat,
    addMessage,
    updateLastAssistant,
    setMessages,
  };
}

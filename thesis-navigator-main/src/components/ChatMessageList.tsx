import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import type { ChatMessage } from "@/api/types";

interface ChatMessageListProps {
  messages: ChatMessage[];
  avatarSrc?: string;
  className?: string;
  partialTranscript?: string;
}

export const ChatMessageList = ({
  messages,
  avatarSrc,
  className = "",
  partialTranscript,
}: ChatMessageListProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, partialTranscript]);

  return (
    <div className={`flex-1 overflow-y-auto space-y-3 ${className}`}>
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
        >
          {msg.role === "assistant" && avatarSrc && (
            <img
              src={avatarSrc}
              alt="Assistant"
              className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-1"
            />
          )}
          <div
            className={`max-w-[80%] rounded-lg px-4 py-3 ${
              msg.role === "user"
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border text-foreground"
            }`}
          >
            {msg.role === "assistant" ? (
              <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-headings:my-2">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            ) : (
              <p className="ds-small whitespace-pre-wrap">{msg.content}</p>
            )}
            {msg.isStreaming && (
              <span className="inline-flex gap-1 mt-1">
                <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce opacity-60" />
                <span
                  className="w-1.5 h-1.5 bg-current rounded-full animate-bounce opacity-60"
                  style={{ animationDelay: "0.1s" }}
                />
                <span
                  className="w-1.5 h-1.5 bg-current rounded-full animate-bounce opacity-60"
                  style={{ animationDelay: "0.2s" }}
                />
              </span>
            )}
          </div>
        </div>
      ))}

      {partialTranscript && (
        <div className="flex gap-3 justify-end">
          <div className="max-w-[80%] rounded-lg px-4 py-3 bg-primary/50 text-primary-foreground">
            <p className="ds-small italic">{partialTranscript}</p>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useChatSession } from "@/hooks/use-chat-session";
import { ChatMessageList } from "./ChatMessageList";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import genieAvatar from "@/assets/genie-avatar.png";
import giniAvatar from "@/assets/thesinator-talk1.png";
import type { StudentProfile, FeaturedTopic, ThesisProject } from "@/api/types";

interface DashboardChatWidgetProps {
  open: boolean;
  onClose: () => void;
  studentProfile: StudentProfile | null;
  projects: ThesisProject[];
  topics: FeaturedTopic[];
}

function buildChatContext(
  profile: StudentProfile | null,
  projects: ThesisProject[],
  topics: FeaturedTopic[],
) {
  return {
    student: profile
      ? {
          name: `${profile.first_name} ${profile.last_name}`,
          degree: profile.degree,
          university: profile.university_name,
          program: profile.study_program_name,
          skills: profile.skills,
          fields: profile.field_names,
          bio: profile.bio,
        }
      : undefined,
    projects: projects.map((p) => ({
      title: p.title,
      state: p.state,
      company: p.company_name,
      university: p.university_name,
    })),
    featured_topics: topics.map((t) => ({
      title: t.title,
      fields: t.field_names,
      company: t.company_name,
      university: t.university_name,
    })),
  };
}

const suggestedPrompts = [
  "Wie stehen meine Projekte?",
  "Welche Themen passen zu meinen Skills?",
  "Was sollte ich als nächstes tun?",
];

export default function DashboardChatWidget({
  open,
  onClose,
  studentProfile,
  projects,
  topics,
}: DashboardChatWidgetProps) {
  const [input, setInput] = useState("");
  const [sessionStarted, setSessionStarted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  const {
    messages,
    isStreaming,
    isLoading,
    startSession,
    sendMessage,
  } = useChatSession("general");

  const hasUserMessage = messages.some((m) => m.role === "user");

  // Lazy session start — only when widget is first opened
  useEffect(() => {
    if (open && !sessionStarted) {
      setSessionStarted(true);
      startSession(buildChatContext(studentProfile, projects, topics));
    }
  }, [open, sessionStarted, startSession, studentProfile, projects, topics]);

  const handleSend = useCallback(
    (text?: string) => {
      const value = (text ?? input).trim();
      if (!value || isStreaming) return;
      sendMessage(value);
      setInput("");
    },
    [input, isStreaming, sendMessage],
  );

  // Escape key closes panel
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Focus input when panel opens
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -12, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={`fixed z-50 flex flex-col bg-background border border-border rounded-2xl shadow-2xl overflow-hidden ${
            isMobile
              ? "inset-3"
              : "top-16 right-6 w-[380px] h-[520px]"
          }`}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-muted/30">
            <img
              src={giniAvatar}
              alt="Gini"
              className="w-10 h-10 object-contain"
            />
            <div className="flex-1 min-w-0">
              <h3 className="ds-label text-foreground">Gini</h3>
              <p className="ds-caption text-muted-foreground">Dein KI-Assistent</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full shrink-0"
              onClick={onClose}
            >
              <X size={18} />
            </Button>
          </div>

          {/* Messages */}
          <ChatMessageList
            messages={messages}
            avatarSrc={genieAvatar}
            className="flex-1 px-3 py-3"
          />

          {/* Suggested prompts (before any user message) */}
          {!hasUserMessage && !isLoading && messages.length > 0 && (
            <div className="flex flex-wrap gap-2 px-3 pb-2">
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  disabled={isStreaming}
                  className="ds-caption px-3 py-1.5 rounded-full border border-border bg-card text-foreground hover:bg-accent transition-colors disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input bar */}
          <div className="border-t border-border p-3">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Frag Gini..."
                className="flex-1 bg-transparent ds-body outline-none placeholder:text-muted-foreground px-3 py-2 rounded-full border border-input focus:ring-2 focus:ring-ring/20"
                disabled={isStreaming || isLoading}
              />
              <Button
                size="icon"
                className="rounded-full shrink-0"
                disabled={!input.trim() || isStreaming || isLoading}
                onClick={() => handleSend()}
              >
                <Send size={16} />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

import { useState, useEffect, useRef } from "react";
import { useChatSession } from "@/hooks/use-chat-session";
import { startNetworkingChat, startDirectChat } from "@/services/networking";
import { ChatMessageList } from "./ChatMessageList";
import type { PersonaMatch } from "@/api/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Send, ArrowLeft, Building2, Copy, Check, Sparkles, MessageSquare } from "lucide-react";
import thesinatorTalk1 from "@/assets/thesinator-talk1.png";

interface NetworkChatProps {
  persona: PersonaMatch;
  parentSessionId: string;
  onBack: () => void;
  onShowDetail?: () => void;
}

function makeId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function NetworkChat({ persona, parentSessionId, onBack }: NetworkChatProps) {
  // --- Direct chat (left panel) ---
  const [directSessionId, setDirectSessionId] = useState<string | null>(null);
  const directChat = useChatSession("networking", directSessionId);
  const [directInput, setDirectInput] = useState("");

  // --- Coaching chat (right panel) ---
  const [coachingSessionId, setCoachingSessionId] = useState<string | null>(null);
  const coachingChat = useChatSession("networking", coachingSessionId);
  const [coachingInput, setCoachingInput] = useState("");

  const [isInitializing, setIsInitializing] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"direct" | "coaching">("direct");

  const directInputRef = useRef<HTMLInputElement>(null);
  const coachingInputRef = useRef<HTMLInputElement>(null);

  // Initialize both chat sessions in parallel
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [directRes, coachingRes] = await Promise.all([
          startDirectChat(parentSessionId, persona),
          startNetworkingChat(parentSessionId, persona),
        ]);
        if (cancelled) return;
        setDirectSessionId(directRes.session_id);
        directChat.setMessages([
          { id: makeId(), role: "assistant", content: directRes.greeting, timestamp: Date.now() },
        ]);
        setCoachingSessionId(coachingRes.session_id);
        coachingChat.setMessages([
          { id: makeId(), role: "assistant", content: coachingRes.greeting, timestamp: Date.now() },
        ]);
      } catch {
        if (cancelled) return;
        // Fallback greetings
        directChat.setMessages([
          {
            id: makeId(),
            role: "assistant",
            content: `Hallo! Schön, dass du dich meldest. Ich bin ${persona.name} — was kann ich für dich tun?`,
            timestamp: Date.now(),
          },
        ]);
        coachingChat.setMessages([
          {
            id: makeId(),
            role: "assistant",
            content: `Hey! Du chattest jetzt mit ${persona.name} — ich bin hier für Tipps da!`,
            timestamp: Date.now(),
          },
        ]);
      } finally {
        if (!cancelled) setIsInitializing(false);
      }
    })();
    return () => { cancelled = true; };
  }, [persona, parentSessionId]);

  const handleDirectSend = () => {
    if (!directInput.trim() || directChat.isStreaming) return;
    directChat.sendMessage(directInput.trim());
    setDirectInput("");
  };

  const handleCoachingSend = () => {
    if (!coachingInput.trim() || coachingChat.isStreaming) return;
    coachingChat.sendMessage(coachingInput.trim());
    setCoachingInput("");
  };

  const handleCopyLastUserMessage = () => {
    const lastUserMsg = [...directChat.messages].reverse().find((m) => m.role === "user");
    if (lastUserMsg) {
      navigator.clipboard.writeText(lastUserMsg.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const hasDirectUserMessages = directChat.messages.some((m) => m.role === "user");

  const initSpinner = (
    <div className="flex items-center justify-center h-full">
      <div className="flex items-center gap-2 text-muted-foreground ds-small">
        <div className="w-2 h-2 rounded-full bg-[hsl(var(--ai-from))] animate-pulse" />
        Wird vorbereitet...
      </div>
    </div>
  );

  // --- Shared header ---
  const header = (
    <div className="border-b border-border p-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="rounded-full shrink-0" onClick={onBack}>
          <ArrowLeft size={18} />
        </Button>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(var(--ai-from))] to-[hsl(var(--ai-to))] flex items-center justify-center text-white text-sm font-semibold shrink-0">
          {persona.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="ds-label text-foreground truncate">{persona.name}</h3>
          <div className="flex items-center gap-1.5">
            <Building2 size={12} className="text-muted-foreground" />
            <span className="ds-caption text-muted-foreground truncate">
              {persona.title} · {persona.institution}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 mt-2 ml-[52px]">
        {persona.field_badges.slice(0, 3).map((badge) => (
          <Badge key={badge} variant="secondary" className="ds-badge">
            {badge}
          </Badge>
        ))}
      </div>
    </div>
  );

  // --- Direct chat panel ---
  const directPanel = (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        {isInitializing ? initSpinner : <ChatMessageList messages={directChat.messages} />}
      </div>
      <div className="border-t border-border p-3">
        <div className="flex items-center gap-2">
          <input
            ref={directInputRef}
            type="text"
            value={directInput}
            onChange={(e) => setDirectInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleDirectSend()}
            placeholder={`Nachricht an ${persona.name}...`}
            className="flex-1 bg-transparent ds-body outline-none placeholder:text-muted-foreground px-3 py-2 rounded-full border border-input focus:ring-2 focus:ring-ring/20"
            disabled={directChat.isStreaming || isInitializing}
          />
          {hasDirectUserMessages && (
            <Button
              size="icon"
              variant="outline"
              className="rounded-full shrink-0"
              onClick={handleCopyLastUserMessage}
              title="Letzten Entwurf kopieren"
            >
              {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
            </Button>
          )}
          <Button
            size="icon"
            className="rounded-full shrink-0"
            disabled={!directInput.trim() || directChat.isStreaming || isInitializing}
            onClick={handleDirectSend}
          >
            <Send size={16} />
          </Button>
        </div>
      </div>
    </div>
  );

  // --- Coaching panel ---
  const coachingPanel = (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/30">
        <Sparkles size={14} className="text-[hsl(var(--ai-from))]" />
        <span className="ds-label text-foreground">Gini Coaching</span>
      </div>
      <div className="flex-1 overflow-y-auto">
        {isInitializing ? initSpinner : <ChatMessageList messages={coachingChat.messages} avatarSrc={thesinatorTalk1} />}
      </div>
      <div className="border-t border-border p-3">
        <div className="flex items-center gap-2">
          <input
            ref={coachingInputRef}
            type="text"
            value={coachingInput}
            onChange={(e) => setCoachingInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCoachingSend()}
            placeholder="Frag Gini um Rat..."
            className="flex-1 bg-transparent ds-small outline-none placeholder:text-muted-foreground px-3 py-1.5 rounded-full border border-input focus:ring-2 focus:ring-ring/20"
            disabled={coachingChat.isStreaming || isInitializing}
          />
          <Button
            size="icon"
            variant="outline"
            className="rounded-full shrink-0 h-8 w-8"
            disabled={!coachingInput.trim() || coachingChat.isStreaming || isInitializing}
            onClick={handleCoachingSend}
          >
            <Send size={14} />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {header}

      {/* Desktop: side-by-side */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        <div className="flex-1 min-w-0">{directPanel}</div>
        <div className="w-[320px] border-l border-border">{coachingPanel}</div>
      </div>

      {/* Mobile: tab switching */}
      <div className="flex flex-col flex-1 md:hidden overflow-hidden">
        <div className={`flex-1 overflow-hidden ${activeTab === "direct" ? "" : "hidden"}`}>
          {directPanel}
        </div>
        <div className={`flex-1 overflow-hidden ${activeTab === "coaching" ? "" : "hidden"}`}>
          {coachingPanel}
        </div>

        {/* Mobile tab bar */}
        <div className="flex border-t border-border bg-background">
          <button
            className={`flex-1 flex items-center justify-center gap-2 py-3 transition-colors ${
              activeTab === "direct"
                ? "text-primary border-t-2 border-primary"
                : "text-muted-foreground"
            }`}
            onClick={() => setActiveTab("direct")}
          >
            <MessageSquare size={16} />
            <span className="ds-badge">Chat</span>
          </button>
          <button
            className={`flex-1 flex items-center justify-center gap-2 py-3 transition-colors ${
              activeTab === "coaching"
                ? "text-primary border-t-2 border-primary"
                : "text-muted-foreground"
            }`}
            onClick={() => setActiveTab("coaching")}
          >
            <Sparkles size={16} />
            <span className="ds-badge">Gini Coaching</span>
          </button>
        </div>
      </div>
    </div>
  );
}

import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Bookmark,
  Briefcase,
  Building2,
  Check,
  ChevronDown,
  ChevronRight,
  Compass,
  Footprints,
  GraduationCap,
  LoaderCircle,
  MessageCircle,
  Mic,
  MicOff,
  Network,
  Send,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  chatWithFutureSelf,
  createFutureSession,
  getFuture,
  getFutureSession,
  getFutureSessionGraph,
  saveFuture,
  type FutureCard,
  type FutureDetailResponse,
  type FutureMapNode,
  type FutureSessionState,
} from "@/services/futureSessions";
import { LiveFuturePathGraph } from "@/components/LiveFuturePathGraph";
import {
  fetchThesinatorTopTopics,
  sendThesinatorTurn,
  startThesinatorSession,
  type ContextSnapshot,
  type InputMode,
  type MatchingMeta,
  type TopTopicResult,
  type ThesinatorQuestion as BackendQuestion,
} from "@/services/thesinator";
import thesinatorTalk1 from "@/assets/thesinator-talk1.png";
import thesinatorTalk2 from "@/assets/thesinator-talk2.png";
import thesinatorThinking from "@/assets/thesinator-thinking.png";

const stages = [
  { id: "discover", label: "Discover" },
  { id: "build", label: "See your future" },
  { id: "explore", label: "Explore theses" },
  { id: "detail", label: "Detail" },
] as const;

type StageId = (typeof stages)[number]["id"];

type CompletedDiscoverPayload = {
  sessionId: string;
  clientToken: string | null;
  contextSnapshot: ContextSnapshot | null;
  topTopics: TopTopicResult[];
  matchingMeta: MatchingMeta | null;
};

type ConversationTurn = {
  question: BackendQuestion;
  assistantMessage: string;
  userAnswer: {
    text: string;
    inputMode: InputMode;
  } | null;
};

type SpeechRecognitionResultItem = {
  transcript: string;
};

type SpeechRecognitionResultShape = ArrayLike<SpeechRecognitionResultItem> & {
  isFinal: boolean;
};

type SpeechRecognitionEventShape = {
  results: ArrayLike<SpeechRecognitionResultShape>;
};

type SpeechRecognitionErrorEventShape = {
  error: string;
  message?: string;
};

type BrowserSpeechRecognition = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEventShape) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventShape) => void) | null;
  onend: (() => void) | null;
};

type BrowserSpeechRecognitionConstructor = new () => BrowserSpeechRecognition;

const FUTURE_SESSION_STORAGE_KEY = "starthack-active-future-session";
const ACTIVE_FUTURE_STORAGE_KEY = "starthack-active-future-selection";
const THESINATOR_QUESTION_COUNT = 3;

const inputModeLabels: Record<InputMode, string> = {
  mcq: "MCQ",
  text: "TEXT",
  speech: "SPEECH",
};

const sourceLabels: Record<FutureCard["source"], string> = {
  matched: "Best match",
  generated: "Extra idea",
};

const sourceStyles: Record<FutureCard["source"], string> = {
  matched: "bg-primary/10 text-primary",
  generated: "bg-emerald-500/10 text-emerald-700",
};

const nodeStyles: Record<FutureMapNode["type"], string> = {
  future: "bg-primary text-primary-foreground border-primary",
  thesis: "bg-background text-foreground border-border",
  company: "bg-background text-foreground border-border",
  university: "bg-background text-foreground border-border",
  supervisor: "bg-background text-foreground border-border",
  expert: "bg-background text-foreground border-border",
};

const formatMatchingNote = (matchingMeta: MatchingMeta | null) => {
  if (!matchingMeta || matchingMeta.used_vector) {
    return null;
  }

  return "Using your best matches while search finishes loading.";
};

const readFutureSessionStorage = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return window.sessionStorage.getItem(FUTURE_SESSION_STORAGE_KEY);
};

const writeFutureSessionStorage = (futureSessionId: string | null) => {
  if (typeof window === "undefined") {
    return;
  }

  if (futureSessionId) {
    window.sessionStorage.setItem(FUTURE_SESSION_STORAGE_KEY, futureSessionId);
    return;
  }

  window.sessionStorage.removeItem(FUTURE_SESSION_STORAGE_KEY);
};

const readActiveFutureStorage = (futureSessionId: string) => {
  if (typeof window === "undefined") {
    return null;
  }

  return window.sessionStorage.getItem(`${ACTIVE_FUTURE_STORAGE_KEY}:${futureSessionId}`);
};

const writeActiveFutureStorage = (futureSessionId: string, futureId: string | null) => {
  if (typeof window === "undefined") {
    return;
  }

  const key = `${ACTIVE_FUTURE_STORAGE_KEY}:${futureSessionId}`;
  if (futureId) {
    window.sessionStorage.setItem(key, futureId);
    return;
  }

  window.sessionStorage.removeItem(key);
};

const mergeFutureSessionState = (session: FutureSessionState, updatedFuture: FutureCard): FutureSessionState => ({
  ...session,
  selected_future_id: updatedFuture.future_id,
  futures: session.futures.map((future) =>
    future.future_id === updatedFuture.future_id ? updatedFuture : future,
  ),
  matched_futures: session.matched_futures.map((future) =>
    future.future_id === updatedFuture.future_id ? updatedFuture : future,
  ),
  generated_futures: session.generated_futures.map((future) =>
    future.future_id === updatedFuture.future_id ? updatedFuture : future,
  ),
  saved_future_ids: updatedFuture.saved
    ? Array.from(new Set([...session.saved_future_ids, updatedFuture.future_id]))
    : session.saved_future_ids,
});

/* Thesinator Avatar */
const ThesinatorAvatar = ({ isTyping, isSpeaking }: { isTyping: boolean; isSpeaking: boolean }) => {
  const [talkFrame, setTalkFrame] = useState(0);

  useEffect(() => {
    if (!isSpeaking) {
      return;
    }

    const interval = window.setInterval(() => {
      setTalkFrame((prev) => (prev === 0 ? 1 : 0));
    }, 400);

    return () => window.clearInterval(interval);
  }, [isSpeaking]);

  const currentImage = isTyping
    ? thesinatorThinking
    : isSpeaking
      ? talkFrame === 0
        ? thesinatorTalk1
        : thesinatorTalk2
      : thesinatorTalk1;

  return (
    <div className="flex shrink-0 flex-col items-center">
      <div className="animate-genie-float relative">
        <img
          src={currentImage}
          alt="Thesinator"
          className="h-36 w-36 object-contain transition-opacity duration-200 sm:h-44 sm:w-44 xl:h-52 xl:w-52"
        />
        <div className="absolute -top-2 -right-2 animate-sparkle">
          <Sparkles size={16} className="text-ai-from" />
        </div>
        <div
          className="absolute -bottom-1 -left-3 animate-sparkle"
          style={{ animationDelay: "0.7s" }}
        >
          <Sparkles size={12} className="text-ai-from" />
        </div>
        <div
          className="absolute top-4 -left-4 animate-sparkle"
          style={{ animationDelay: "1.4s" }}
        >
          <Sparkles size={10} className="text-ai-from" />
        </div>
      </div>
    </div>
  );
};

const useVoiceInput = (onResult: (text: string) => void) => {
  const [isListening, setIsListening] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const manuallyStoppedRef = useRef(false);
  const finalTranscriptRef = useRef("");
  const lastLiveTranscriptRef = useRef("");
  const transcriptDeliveredRef = useRef(false);

  const stopListening = () => {
    if (recognitionRef.current) {
      manuallyStoppedRef.current = true;
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
      return;
    }

    const speechWindow = window as Window & {
      SpeechRecognition?: BrowserSpeechRecognitionConstructor;
      webkitSpeechRecognition?: BrowserSpeechRecognitionConstructor;
    };

    const SpeechRecognition = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechError(
        "Speech recognition is not supported in this browser. You can still answer with text or options.",
      );
      return;
    }

    setSpeechError(null);
    setLiveTranscript("");
    finalTranscriptRef.current = "";
    lastLiveTranscriptRef.current = "";
    transcriptDeliveredRef.current = false;
    manuallyStoppedRef.current = false;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEventShape) => {
      const finalParts: string[] = [];
      const interimParts: string[] = [];

      for (let index = 0; index < event.results.length; index += 1) {
        const result = event.results[index];
        const transcript = result?.[0]?.transcript?.trim() ?? "";
        if (!transcript) {
          continue;
        }

        if (result.isFinal) {
          finalParts.push(transcript);
        } else {
          interimParts.push(transcript);
        }
      }

      const finalTranscript = finalParts.join(" ").trim();
      if (finalTranscript) {
        finalTranscriptRef.current = finalTranscript;
      }

      const live = [finalTranscript || finalTranscriptRef.current, interimParts.join(" ").trim()]
        .filter(Boolean)
        .join(" ")
        .trim();
      lastLiveTranscriptRef.current = live;
      setLiveTranscript(live);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEventShape) => {
      setIsListening(false);
      setLiveTranscript("");
      lastLiveTranscriptRef.current = "";
      recognitionRef.current = null;

      if (event.error === "aborted" && manuallyStoppedRef.current) {
        manuallyStoppedRef.current = false;
        return;
      }

      manuallyStoppedRef.current = false;

      switch (event.error) {
        case "not-allowed":
        case "service-not-allowed":
          setSpeechError("Microphone access was denied. Please allow microphone access and try again.");
          break;
        case "no-speech":
          setSpeechError("No speech detected. Please speak clearly and try again.");
          break;
        default:
          setSpeechError("Voice recognition failed. Please try again or answer with text.");
          break;
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
      manuallyStoppedRef.current = false;

      const finalTranscript = finalTranscriptRef.current.trim() || lastLiveTranscriptRef.current.trim();
      if (finalTranscript && !transcriptDeliveredRef.current) {
        transcriptDeliveredRef.current = true;
        setLiveTranscript(finalTranscript);
        onResult(finalTranscript);
      }
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
      setIsListening(true);
    } catch {
      recognitionRef.current = null;
      setIsListening(false);
      setSpeechError("Could not start voice input. Please try again or answer with text.");
    }
  };

  return { isListening, liveTranscript, speechError, toggleListening, stopListening };
};

const compactText = (value: string, maxLength = 120) =>
  value.length <= maxLength ? value : `${value.slice(0, Math.max(0, maxLength - 1)).trim()}…`;

const FutureCompareRibbon = ({
  futures,
  activeFutureId,
  onSelectFuture,
}: {
  futures: FutureCard[];
  activeFutureId: string | null;
  onSelectFuture: (futureId: string) => void;
}) => {
  if (futures.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-border bg-card px-4 py-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <Bookmark size={16} className="text-primary" />
        <p className="ds-label text-foreground">Saved theses</p>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {futures.map((future) => (
          <button
            key={future.future_id}
            onClick={() => onSelectFuture(future.future_id)}
            className={`min-w-[280px] rounded-2xl border px-4 py-3 text-left transition-colors ${
              activeFutureId === future.future_id
                ? "border-primary bg-primary/5"
                : "border-border bg-background hover:bg-accent"
            }`}
          >
            <p className="ds-caption text-muted-foreground">{future.grounding.company?.name ?? future.theme}</p>
            <p className="ds-label mt-1 text-foreground">{future.thesis_title}</p>
            <p className="ds-small text-muted-foreground">
              Could lead to: {future.future_role} at {future.future_organization}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

const FutureCardPreview = ({
  future,
  onOpen,
}: {
  future: FutureCard;
  onOpen: (futureId: string) => void;
}) => (
  <article className="rounded-[1.5rem] border border-border bg-card p-5 shadow-sm transition-transform duration-300 hover:-translate-y-0.5">
    <div className="flex flex-wrap items-center gap-2">
      <span className={`rounded-full px-3 py-1 ds-caption ${sourceStyles[future.source]}`}>
        {sourceLabels[future.source]}
      </span>
      {(future.grounding.company || future.grounding.university) && (
        <span className="rounded-full bg-muted px-3 py-1 ds-caption text-muted-foreground">
          {future.grounding.company?.name ?? future.grounding.university?.name}
        </span>
      )}
      {future.grounding.fields.slice(0, 2).map((field) => (
        <span key={field} className="rounded-full bg-muted px-3 py-1 ds-caption text-muted-foreground">
          {field}
        </span>
      ))}
    </div>
    <div className="mt-5 space-y-3">
      <h3 className="ds-title-sm text-foreground">{future.thesis_title}</h3>
      <p className="ds-small text-muted-foreground">{compactText(future.thesis_summary, 136)}</p>
      <div className="rounded-2xl bg-muted/50 px-4 py-3">
        <p className="ds-caption uppercase tracking-[0.14em] text-muted-foreground">Why it fits</p>
        <p className="ds-small mt-2 text-foreground">{compactText(future.why_fit, 130)}</p>
      </div>
      <p className="ds-small text-muted-foreground">
        Could lead to: {future.future_role} at {future.future_organization}
      </p>
    </div>
    <div className="mt-6 flex items-center justify-between">
      <div className="flex items-center gap-2 text-muted-foreground">
        {future.saved ? <Bookmark size={16} className="fill-current text-primary" /> : <Compass size={16} />}
        <span className="ds-caption">{future.saved ? "Saved" : "Open thesis"}</span>
      </div>
      <Button onClick={() => onOpen(future.future_id)} className="rounded-full gap-2">
        Open thesis <ChevronRight size={16} />
      </Button>
    </div>
  </article>
);

const FutureMap = ({ nodes }: { nodes: FutureMapNode[] }) => (
  <div className="rounded-[1.75rem] border border-border bg-card p-6 shadow-sm">
    <div className="mb-6 flex items-center gap-2">
      <Network size={18} className="text-primary" />
      <p className="ds-title-cards text-foreground">Stakeholder map</p>
    </div>
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {nodes.map((node) => (
        <div key={node.id} className={`rounded-2xl border p-4 ${nodeStyles[node.type]}`}>
          <p className="ds-caption uppercase tracking-[0.14em] opacity-70">{node.type}</p>
          <p className="ds-label mt-2">{node.label}</p>
          <p className="ds-small mt-2 opacity-80">{node.summary}</p>
        </div>
      ))}
    </div>
  </div>
);

const formatGraphEventTime = (value: string | null) => {
  if (!value) {
    return "now";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-CH", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(parsed);
};

const GraphPreviewCanvas = ({
  graphBuild,
}: {
  graphBuild: FutureSessionState["graph_build"];
}) => {
  const latestEvent = graphBuild.events.length > 0
    ? graphBuild.events[graphBuild.events.length - 1]
    : {
        timestamp: null,
        message: "Agent swarms are simulating likely thesis paths from your profile and previous inputs.",
        stage_label: graphBuild.stage_label,
        status: graphBuild.status,
        progress: graphBuild.progress,
        error: graphBuild.error,
      };
  const isLive = graphBuild.status === "preparing" || graphBuild.status === "queued";
  const nodes = graphBuild.preview_nodes;
  const edges = graphBuild.preview_edges;

  return (
    <div className="rounded-[1.75rem] border border-border bg-card p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-end gap-3">
        {isLive && (
          <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-primary">
            <LoaderCircle size={14} className="animate-spin" />
            <span className="ds-caption">Live</span>
          </div>
        )}
      </div>
      <div className="mb-5 rounded-[1.35rem] border border-border bg-muted/30 p-4">
        <div className="flex flex-wrap items-center gap-2">
          {latestEvent.stage_label && (
            <span className="rounded-full bg-background px-3 py-1 ds-caption text-muted-foreground">
              {latestEvent.stage_label}
            </span>
          )}
          <span className="rounded-full bg-background px-3 py-1 ds-caption text-muted-foreground">
            {graphBuild.status}
          </span>
          <span className="rounded-full bg-primary/10 px-3 py-1 ds-caption text-primary">
            {graphBuild.progress}%
          </span>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-background">
          <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${graphBuild.progress}%` }} />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          <span>Latest update</span>
          <span>{formatGraphEventTime(latestEvent.timestamp)}</span>
        </div>
        <p className="mt-2 ds-small text-foreground">
          {latestEvent.message ?? latestEvent.error ?? "Waiting for the next update..."}
        </p>
        {latestEvent.error && latestEvent.error !== latestEvent.message && (
          <p className="mt-2 ds-caption text-destructive">
            {latestEvent.error}
          </p>
        )}
      </div>
      <LiveFuturePathGraph nodes={nodes} edges={edges} isLive={isLive} />
    </div>
  );
};

const SuggestedPromptButtons = ({
  prompts,
  onPrompt,
}: {
  prompts: string[];
  onPrompt: (prompt: string) => void;
}) => (
  <div className="flex flex-wrap gap-2">
    {prompts.map((prompt) => (
      <button
        key={prompt}
        onClick={() => onPrompt(prompt)}
        className="rounded-full border border-border bg-background px-4 py-2 text-left ds-small text-foreground transition-colors hover:bg-accent"
      >
        {prompt}
      </button>
    ))}
  </div>
);

const DiscoverStage = ({
  summary,
  isCreatingFutureSession,
  onCreateFutureSession,
  onComplete,
}: {
  summary: CompletedDiscoverPayload | null;
  isCreatingFutureSession: boolean;
  onCreateFutureSession: () => void;
  onComplete: (payload: CompletedDiscoverPayload) => void;
}) => (
  <div className="space-y-8">
    <div className="space-y-5">
      {summary && (
        <div className="rounded-[1.75rem] border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Check size={18} className="text-primary" />
            <p className="ds-label text-foreground">Your thesis matches are ready</p>
          </div>
          <p className="ds-small mt-2 text-muted-foreground">
            We found your best matches. Next, we show who is connected to them.
          </p>
          <div className="mt-5 grid gap-3 lg:grid-cols-3">
            {summary.topTopics.slice(0, 3).map((topic) => (
              <div key={topic.topic_id} className="rounded-2xl bg-muted/50 px-4 py-3">
                <p className="ds-caption text-muted-foreground">Matched thesis {topic.rank}</p>
                <p className="ds-label mt-1 text-foreground">{topic.title}</p>
              </div>
            ))}
          </div>
          {formatMatchingNote(summary.matchingMeta) && (
            <p className="mt-4 ds-caption text-muted-foreground">{formatMatchingNote(summary.matchingMeta)}</p>
          )}
          <Button
            onClick={onCreateFutureSession}
            className="mt-6 rounded-full gap-2"
            disabled={isCreatingFutureSession}
          >
            {isCreatingFutureSession ? (
              <>
                <LoaderCircle size={16} className="animate-spin" />
                Loading
              </>
            ) : (
              <>
                See where it could lead <ArrowRight size={16} />
              </>
            )}
          </Button>
        </div>
      )}

      <div className="rounded-[2rem] border border-border bg-card/30 p-3 shadow-sm xl:p-4">
        <div className="mb-3 px-2">
          <p className="ds-caption uppercase tracking-[0.18em] text-muted-foreground">Discover</p>
          <h2 className="ds-title-md mt-2 text-foreground">Tell us what you want</h2>
        </div>
        <StepGenieChat onComplete={onComplete} />
      </div>
    </div>
  </div>
);

const BuildGraphStage = ({
  futureSession,
  graphBuild,
  matchingNote,
  onContinue,
}: {
  futureSession: FutureSessionState;
  graphBuild: FutureSessionState["graph_build"];
  matchingNote: string | null;
  onContinue: () => void;
}) => {
  const canRevealTheses = futureSession.matched_futures.length > 0;

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-border bg-card px-6 py-8 shadow-sm">
        <p className="ds-caption uppercase tracking-[0.18em] text-muted-foreground">See your future</p>
        <h2 className="ds-title-lg mt-3 text-foreground">Simulating your future with agent swarms</h2>
        <p className="ds-body mt-3 max-w-3xl text-muted-foreground">
          We are projecting likely thesis trajectories from your profile, saved context, and previous answers, then mapping the people and places that appear around your strongest matches.
        </p>
        {matchingNote && <p className="mt-4 ds-caption text-muted-foreground">{matchingNote}</p>}
      </div>

      <GraphPreviewCanvas graphBuild={graphBuild} />

      {graphBuild.error && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-4">
          <p className="ds-label text-destructive">Future build failed</p>
          <p className="ds-small mt-2 whitespace-pre-line text-destructive">{graphBuild.error}</p>
        </div>
      )}

      {canRevealTheses && (
        <section className="rounded-[1.75rem] border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="ds-title-cards text-foreground">Your thesis matches are already ready</p>
              <p className="ds-small text-muted-foreground">
                Open them now while the simulation keeps enriching your network in the background.
              </p>
            </div>
            <Button onClick={onContinue} className="rounded-full gap-2">
              Open thesis matches <ArrowRight size={16} />
            </Button>
          </div>
        </section>
      )}
    </div>
  );
};

const ExploreStage = ({
  futureSession,
  activeFutureId,
  onOpenFuture,
  generatedExpanded,
  onToggleGenerated,
}: {
  futureSession: FutureSessionState;
  activeFutureId: string | null;
  onOpenFuture: (futureId: string) => void;
  generatedExpanded: boolean;
  onToggleGenerated: () => void;
}) => {
  const savedFutures = futureSession.futures.filter((future) =>
    futureSession.saved_future_ids.includes(future.future_id),
  );

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-border bg-card px-6 py-8 shadow-sm">
        <p className="ds-caption uppercase tracking-[0.18em] text-muted-foreground">Explore theses</p>
        <h2 className="ds-title-lg mt-3 text-foreground">Choose a thesis to explore</h2>
        <p className="ds-body mt-3 max-w-3xl text-muted-foreground">
          Start with your best matches. More ideas are below.
        </p>
        {futureSession.graph_build.status !== "ready" && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-primary">
            <LoaderCircle size={14} className="animate-spin" />
            <span className="ds-caption">Path still updating</span>
          </div>
        )}
      </div>

      <FutureCompareRibbon
        futures={savedFutures}
        activeFutureId={activeFutureId}
        onSelectFuture={onOpenFuture}
      />

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <GraduationCap size={18} className="text-primary" />
          <div>
            <p className="ds-title-cards text-foreground">Best matches</p>
            <p className="ds-small text-muted-foreground">
              Based on your answers.
            </p>
          </div>
        </div>
        <div className="grid gap-5 xl:grid-cols-2">
          {futureSession.matched_futures.map((future) => (
            <FutureCardPreview key={future.future_id} future={future} onOpen={onOpenFuture} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <button
          type="button"
          onClick={onToggleGenerated}
          className="flex w-full items-center justify-between rounded-[1.5rem] border border-border bg-card px-5 py-4 text-left shadow-sm"
        >
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-primary" />
            <div>
              <p className="ds-title-cards text-foreground">More ideas</p>
              <p className="ds-small text-muted-foreground">
                Other theses you may also like.
              </p>
            </div>
          </div>
          <span className="ds-caption text-muted-foreground">
            {generatedExpanded ? "Hide" : "Show"} {futureSession.generated_futures.length}
          </span>
        </button>
        {generatedExpanded && (
          <div className="grid gap-5 xl:grid-cols-2">
            {futureSession.generated_futures.map((future) => (
              <FutureCardPreview key={future.future_id} future={future} onOpen={onOpenFuture} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

const FutureDetailStage = ({
  future,
  detailResponse,
  savedFutures,
  onBack,
  onSelectFuture,
  onSave,
  onSendPrompt,
  onSendChat,
  chatInput,
  onChatInputChange,
  isChatSending,
}: {
  future: FutureCard;
  detailResponse: FutureDetailResponse | null;
  savedFutures: FutureCard[];
  onBack: () => void;
  onSelectFuture: (futureId: string) => void;
  onSave: () => void;
  onSendPrompt: (prompt: string) => void;
  onSendChat: () => void;
  chatInput: string;
  onChatInputChange: (value: string) => void;
  isChatSending: boolean;
}) => {
  const detail = detailResponse?.future_detail;
  const mapNodes = detailResponse?.map_nodes ?? [];
  const suggestedPrompts = detailResponse?.suggested_prompts ?? [];
  const chatHistory = detailResponse?.chat_history ?? [];
  const [isThesisExpanded, setIsThesisExpanded] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-3">
        <Button onClick={onBack} variant="outline" className="rounded-full gap-2">
          <ArrowLeft size={16} />
          Back to theses
        </Button>
        <Button onClick={onSave} className="rounded-full gap-2" variant={future.saved ? "outline" : "default"}>
          <Bookmark size={16} className={future.saved ? "fill-current" : ""} />
          {future.saved ? "Saved" : "Save thesis"}
        </Button>
      </div>

      <FutureCompareRibbon
        futures={savedFutures}
        activeFutureId={future.future_id}
        onSelectFuture={onSelectFuture}
      />

      <section className="rounded-[2rem] border border-border bg-card px-6 py-8 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <p className={`inline-flex rounded-full px-3 py-1 ds-caption ${sourceStyles[future.source]}`}>
            {sourceLabels[future.source]}
          </p>
          {(future.grounding.company || future.grounding.university) && (
            <span className="rounded-full bg-muted px-3 py-1 ds-caption text-muted-foreground">
              {future.grounding.company?.name ?? future.grounding.university?.name}
            </span>
          )}
        </div>
        <div className="mt-6 grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <p className="ds-caption uppercase tracking-[0.18em] text-muted-foreground">This thesis</p>
            <h2 className="ds-title-xl mt-3 text-foreground">{future.thesis_title}</h2>
            <p className="ds-small mt-4 max-w-2xl text-muted-foreground">
              Start here, then explore where it could lead.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {future.grounding.fields.slice(0, 3).map((field) => (
                <span key={field} className="rounded-full bg-muted px-3 py-1 ds-caption text-foreground">
                  {field}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-[1.75rem] bg-muted/60 p-5">
            <div className="flex items-center gap-2">
              <Briefcase size={16} className="text-primary" />
              <p className="ds-caption uppercase tracking-[0.14em] text-muted-foreground">Where it could lead</p>
            </div>
            <p className="ds-label mt-3 text-foreground">{detail?.hero_title ?? `${future.future_role} at ${future.future_organization}`}</p>
            <p className="ds-small mt-3 text-muted-foreground">
              {compactText(detail?.hero_summary ?? future.future_path_snapshot, 150)}
            </p>
            <p className="ds-small mt-4 text-muted-foreground">{detail?.opening_note ?? future.future_path_snapshot}</p>
          </div>
        </div>

        <Collapsible open={isThesisExpanded} onOpenChange={setIsThesisExpanded}>
          <div className="mt-6 rounded-[1.5rem] border border-border bg-muted/30 px-5 py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="ds-label text-foreground">Thesis details</p>
                <p className="ds-small text-muted-foreground">
                  See the summary and why it fits.
                </p>
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="rounded-full gap-2">
                  {isThesisExpanded ? "Hide details" : "Show details"}
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${isThesisExpanded ? "rotate-180" : ""}`}
                  />
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden">
              <div className="mt-4 rounded-2xl border border-border bg-background px-4 py-4">
                <p className="ds-body text-foreground">{future.thesis_summary}</p>
                <p className="ds-small mt-4 text-muted-foreground">
                  {detail?.why_this_path ?? future.why_fit}
                </p>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      </section>

      <section className="rounded-[2rem] border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-background p-6 shadow-sm">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2">
              <MessageCircle size={18} className="text-primary" />
              <p className="ds-title-cards text-foreground">Ask your future self</p>
            </div>
            <p className="ds-body mt-3 text-foreground">
              Ask what this path is really like and what matters early.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-primary/20 bg-background/80 px-4 py-4 xl:w-[320px]">
            <p className="ds-caption uppercase tracking-[0.14em] text-muted-foreground">You later on</p>
            <p className="ds-label mt-2 text-foreground">
              {detail?.hero_title ?? `${future.future_role} at ${future.future_organization}`}
            </p>
            <p className="ds-small mt-2 text-muted-foreground">
              {detail?.future_self_intro ??
                "Ask what changed, what mattered early, or how to prepare before committing."}
            </p>
          </div>
        </div>
        <div className="mt-5">
          <SuggestedPromptButtons prompts={suggestedPrompts} onPrompt={onSendPrompt} />
        </div>
        <div className="mt-6 max-h-[420px] space-y-3 overflow-y-auto pr-1">
          {chatHistory.length === 0 && (
            <div className="rounded-2xl border border-border bg-background/80 px-5 py-5">
              <p className="ds-caption uppercase tracking-[0.14em] text-muted-foreground">Future self</p>
              <p className="ds-body mt-2 text-foreground">
                {detail?.future_self_intro ??
                  "Ask what changed, what mattered early, or how to prepare before committing."}
              </p>
            </div>
          )}
          {chatHistory.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`rounded-2xl px-4 py-4 ${
                message.role === "user"
                  ? "ml-8 border border-primary/20 bg-primary/10"
                  : "mr-8 border border-border bg-background/80"
              }`}
            >
              <p className="ds-caption uppercase tracking-[0.14em] text-muted-foreground">
                {message.role === "user" ? "You" : "Future self"}
              </p>
              <p className="ds-small mt-2 whitespace-pre-line text-foreground">{message.content}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(event) => onChatInputChange(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && onSendChat()}
            placeholder="Ask a question about this path..."
            className="flex-1 rounded-full border border-input bg-background px-5 py-3 ds-small outline-none transition-shadow focus:ring-2 focus:ring-ring/20"
          />
          <Button
            onClick={onSendChat}
            className="rounded-full gap-2 px-5"
            disabled={!chatInput.trim() || isChatSending}
          >
            {isChatSending ? <LoaderCircle size={16} className="animate-spin" /> : <Send size={16} />}
            Ask
          </Button>
        </div>
      </section>

      <FutureMap nodes={mapNodes.length > 0 ? mapNodes : buildFallbackMapNodes(future)} />

      <section className="rounded-[1.75rem] border border-border bg-card p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Compass size={18} className="text-primary" />
          <p className="ds-title-cards text-foreground">Who is connected to it</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <GroundingCard
            title="Company"
            entity={future.grounding.company}
            fallback="No company is attached directly to this path."
            icon={<Building2 size={16} className="text-primary" />}
          />
          <GroundingCard
            title="University"
            entity={future.grounding.university}
            fallback="This path is grounded through the wider thesis ecosystem."
            icon={<BookOpen size={16} className="text-primary" />}
          />
          <GroundingCollectionCard
            title="Supervisors"
            entities={future.grounding.supervisors}
            fallback="Supervisor grounding appears later in the path."
            icon={<GraduationCap size={16} className="text-primary" />}
          />
          <GroundingCollectionCard
            title="Experts"
            entities={future.grounding.experts}
            fallback="Expert grounding appears later in the path."
            icon={<Users size={16} className="text-primary" />}
          />
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-border bg-card p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-2">
          <Footprints size={18} className="text-primary" />
          <p className="ds-title-cards text-foreground">What it could lead to</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {(detail?.milestones ?? buildFallbackMilestones(future)).map((milestone, index) => (
            <div key={`${milestone.title}-${index}`} className="rounded-2xl bg-muted/40 p-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 ds-caption font-semibold text-primary">
                {index + 1}
              </div>
              <p className="ds-label mt-3 text-foreground">{milestone.title}</p>
              <p className="ds-small mt-2 text-muted-foreground">{milestone.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const GroundingCard = ({
  title,
  entity,
  fallback,
  icon,
}: {
  title: string;
  entity: FutureCard["grounding"]["company"] | FutureCard["grounding"]["university"];
  fallback: string;
  icon: React.ReactNode;
}) => (
  <div className="rounded-2xl bg-muted/50 p-4">
    <div className="flex items-center gap-2">
      {icon}
      <p className="ds-label text-foreground">{title}</p>
    </div>
    {entity ? (
      <>
        <p className="ds-label mt-3 text-foreground">{entity.name}</p>
        {entity.subtitle && <p className="ds-caption mt-1 text-muted-foreground">{entity.subtitle}</p>}
        <p className="ds-small mt-2 text-muted-foreground">{entity.summary ?? fallback}</p>
      </>
    ) : (
      <p className="ds-small mt-3 text-muted-foreground">{fallback}</p>
    )}
  </div>
);

const GroundingCollectionCard = ({
  title,
  entities,
  fallback,
  icon,
}: {
  title: string;
  entities: FutureCard["grounding"]["supervisors"] | FutureCard["grounding"]["experts"];
  fallback: string;
  icon: React.ReactNode;
}) => (
  <div className="rounded-2xl bg-muted/50 p-4">
    <div className="flex items-center gap-2">
      {icon}
      <p className="ds-label text-foreground">{title}</p>
    </div>
    {entities.length === 0 ? (
      <p className="ds-small mt-3 text-muted-foreground">{fallback}</p>
    ) : (
      <div className="mt-3 space-y-3">
        {entities.map((entity) => (
          <div key={entity.id}>
            <p className="ds-label text-foreground">{entity.name}</p>
            <p className="ds-small mt-1 text-muted-foreground">{entity.summary ?? fallback}</p>
          </div>
        ))}
      </div>
    )}
  </div>
);

const buildFallbackMilestones = (future: FutureCard) => [
  {
    title: "Choose the thesis path",
    detail: `You commit to ${future.thesis_title} and shape the scope with the right people around it.`,
  },
  {
    title: "Turn the thesis into proof",
    detail: "The work becomes a visible signal of what you can own, explain, and carry through.",
  },
  {
    title: "Carry that signal forward",
    detail: `That visible proof compounds into ${future.future_role} opportunities over the next few years.`,
  },
];

const buildFallbackMapNodes = (future: FutureCard): FutureMapNode[] => {
  const nodes: FutureMapNode[] = [
    {
      id: "future-self",
      type: "future",
      label: future.future_role,
      summary: future.future_path_snapshot,
    },
    {
      id: "thesis",
      type: "thesis",
      label: future.thesis_title,
      summary: future.thesis_summary,
    },
  ];

  if (future.grounding.company) {
    nodes.push({
      id: future.grounding.company.id,
      type: "company",
      label: future.grounding.company.name,
      summary: future.grounding.company.summary ?? "Real company grounding for this thesis.",
    });
  }

  if (future.grounding.university) {
    nodes.push({
      id: future.grounding.university.id,
      type: "university",
      label: future.grounding.university.name,
      summary: future.grounding.university.summary ?? "Academic grounding for this thesis.",
    });
  }

  future.grounding.supervisors.slice(0, 2).forEach((supervisor) => {
    nodes.push({
      id: supervisor.id,
      type: "supervisor",
      label: supervisor.name,
      summary: supervisor.summary ?? "Potential supervisor connected to this thesis.",
    });
  });

  future.grounding.experts.slice(0, 2).forEach((expert) => {
    nodes.push({
      id: expert.id,
      type: "expert",
      label: expert.name,
      summary: expert.summary ?? "Industry expert connected to this thesis.",
    });
  });

  return nodes;
};

const StepGenieChat = ({ onComplete }: { onComplete: (payload: CompletedDiscoverPayload) => void }) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [clientToken, setClientToken] = useState<string | null>(null);
  const [turns, setTurns] = useState<ConversationTurn[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [finalAssistantMessage, setFinalAssistantMessage] = useState<string | null>(null);
  const [contextSnapshot, setContextSnapshot] = useState<ContextSnapshot | null>(null);
  const [textInput, setTextInput] = useState("");
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const activeTurn = !isComplete && turns.length > 0 ? turns[turns.length - 1] : null;
  const activeQuestion = activeTurn?.question ?? null;
  const answeredTurns = turns.filter((turn) => turn.userAnswer !== null);

  const playAudio = useCallback((audioBase64: string | null) => {
    if (!audioBase64) {
      setIsSpeaking(false);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const audio = new Audio(`data:audio/mpeg;base64,${audioBase64}`);
    audioRef.current = audio;
    setIsSpeaking(true);

    audio.onended = () => setIsSpeaking(false);
    audio.onerror = () => setIsSpeaking(false);
    void audio.play().catch(() => setIsSpeaking(false));
  }, []);

  const bootstrapSession = useCallback(async () => {
    setIsLoadingSession(true);
    setError(null);
    setIsComplete(false);
    setTurns([]);
    setCurrentQuestionIndex(0);
    setFinalAssistantMessage(null);
    setSessionId(null);
    setClientToken(null);
    setContextSnapshot(null);
    setTextInput("");

    try {
      const start = await startThesinatorSession();
      setSessionId(start.session_id);
      setClientToken(start.client_token);
      setTurns([
        {
          question: start.question,
          assistantMessage: start.assistant_reply,
          userAnswer: null,
        },
      ]);
      setCurrentQuestionIndex(start.question_index);
      playAudio(start.audio_b64);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start Thesinator.");
    } finally {
      setIsLoadingSession(false);
    }
  }, [playAudio]);

  useEffect(() => {
    void bootstrapSession();
  }, [bootstrapSession]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const submitAnswer = useCallback(
    async (answer: string, inputMode: InputMode) => {
      if (!sessionId || !activeQuestion || isSubmitting || isComplete) {
        return;
      }

      const trimmed = answer.trim();
      if (!trimmed) {
        return;
      }

      setError(null);
      setTextInput("");
      setIsSubmitting(true);
      setTurns((prev) => {
        if (prev.length === 0) {
          return prev;
        }

        const next = [...prev];
        const lastTurn = next[next.length - 1];
        next[next.length - 1] = {
          ...lastTurn,
          userAnswer: {
            text: trimmed,
            inputMode,
          },
        };
        return next;
      });

      try {
        const result = await sendThesinatorTurn({
          sessionId,
          questionId: activeQuestion.id,
          userAnswer: trimmed,
          inputMode,
          clientToken,
        });

        setClientToken((prev) => result.client_token ?? prev);
        setCurrentQuestionIndex(result.question_index);
        playAudio(result.audio_b64);

        if (result.is_complete) {
          const completionTopics =
            result.top_topics && result.top_topics.length > 0
              ? result.top_topics
              : (await fetchThesinatorTopTopics({
                  sessionId: result.session_id,
                  clientToken: result.client_token ?? clientToken,
                  limit: 5,
                })).top_topics;

          setIsComplete(true);
          setFinalAssistantMessage(result.assistant_reply);
          setContextSnapshot(result.context_snapshot ?? null);
          onComplete({
            sessionId: result.session_id,
            clientToken: result.client_token ?? clientToken,
            contextSnapshot: result.context_snapshot ?? null,
            topTopics: completionTopics,
            matchingMeta: result.matching_meta ?? null,
          });
        } else {
          const nextQuestion = result.next_question ?? null;
          if (!nextQuestion) {
            throw new Error("Missing next question from Thesinator.");
          }

          setTurns((prev) => [
            ...prev,
            {
              question: nextQuestion,
              assistantMessage: result.assistant_reply,
              userAnswer: null,
            },
          ]);
        }
      } catch (err) {
        setTurns((prev) => {
          if (prev.length === 0) {
            return prev;
          }

          const next = [...prev];
          const lastTurn = next[next.length - 1];
          next[next.length - 1] = {
            ...lastTurn,
            userAnswer: null,
          };
          return next;
        });
        setError(err instanceof Error ? err.message : "Could not send answer.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [activeQuestion, clientToken, isComplete, isSubmitting, onComplete, playAudio, sessionId],
  );

  const captureSpeechTranscript = useCallback(
    (transcript: string) => {
      if (isSubmitting || isComplete || !activeQuestion) {
        return;
      }

      const trimmed = transcript.trim();
      if (!trimmed) {
        return;
      }

      setError(null);
      void submitAnswer(trimmed, "speech");
    },
    [activeQuestion, isComplete, isSubmitting, submitAnswer],
  );

  const { isListening, liveTranscript, speechError, toggleListening, stopListening } =
    useVoiceInput(captureSpeechTranscript);

  useEffect(() => {
    if (isSubmitting || isComplete) {
      stopListening();
    }
  }, [isComplete, isSubmitting, stopListening]);

  const totalQuestions = THESINATOR_QUESTION_COUNT;
  const answeredCount = answeredTurns.length;
  const progress = Math.min((answeredCount / totalQuestions) * 100, 100);
  const displayStep = isComplete ? totalQuestions : currentQuestionIndex + 1;

  const handleTextSubmit = () => {
    void submitAnswer(textInput, "text");
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[200px_minmax(0,1fr)]">
      <div className="flex flex-col items-center gap-3 xl:pt-2">
        <ThesinatorAvatar
          isTyping={isLoadingSession || isSubmitting}
          isSpeaking={isSpeaking && !(isLoadingSession || isSubmitting)}
        />
      </div>

      <div className="min-w-0">
        {!isLoadingSession && (
          <div className="mb-3 flex items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="ds-caption text-muted-foreground">{displayStep}/{totalQuestions}</span>
          </div>
        )}

        {isLoadingSession ? (
          <div className="flex justify-center py-20">
            <LoaderCircle size={28} className="animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            {answeredTurns.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {answeredTurns.map((turn) => (
                  <div
                    key={`answer-${turn.question.id}`}
                    className="min-w-[180px] rounded-2xl border border-border bg-background px-3 py-2.5"
                  >
                    <p className="ds-caption text-muted-foreground">Q{turn.question.id}</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {compactText(turn.question.question, 58)}
                    </p>
                    <p className="mt-1.5 text-sm font-semibold text-foreground">
                      {compactText(turn.userAnswer?.text ?? "", 40)}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="rounded-[1.5rem] border border-border bg-card/50 p-4 shadow-sm">
              {!isComplete && activeTurn && (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-border bg-background px-4 py-3">
                    <p className="ds-caption uppercase tracking-[0.14em] text-muted-foreground">Thesinator</p>
                    <p className="mt-1.5 text-base leading-7 text-foreground">{activeTurn.assistantMessage}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="relative flex h-12 min-w-12 items-center justify-center rounded-2xl bg-primary px-3 text-lg font-bold text-primary-foreground">
                      Q{activeTurn.question.id}
                    </div>
                    <div className="flex-1 rounded-2xl border border-border bg-background px-4 py-3">
                      <p className="text-[1.1rem] font-semibold leading-7 text-foreground">
                        {activeTurn.question.question}
                      </p>
                    </div>
                  </div>

                  {!isSubmitting && (
                    <div className="grid gap-2.5 sm:grid-cols-2">
                      {activeTurn.question.options.map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            void submitAnswer(option, "mcq");
                          }}
                          className="w-full rounded-2xl border border-border bg-background px-5 py-3.5 text-center text-base font-semibold text-foreground transition-all duration-200 hover:border-primary/50 hover:bg-accent"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}

                  {isSubmitting && (
                    <div className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-background px-4 py-4 text-muted-foreground">
                      <LoaderCircle size={18} className="animate-spin" />
                      <span className="ds-small">Saving your answer and preparing the next step...</span>
                    </div>
                  )}

                  {!isSubmitting && isListening && liveTranscript && (
                    <div className="rounded-2xl border border-primary/30 bg-primary/5 px-4 py-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="ds-caption font-semibold tracking-[0.14em] text-primary">
                          {inputModeLabels.speech}
                        </p>
                        <p className="ds-caption text-muted-foreground">Listening...</p>
                      </div>
                      <p className="ds-body mt-2 whitespace-pre-line text-foreground">{liveTranscript}</p>
                    </div>
                  )}

                  <div className="rounded-[1.5rem] border border-border bg-background p-2.5">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={textInput}
                        onChange={(event) => setTextInput(event.target.value)}
                        onKeyDown={(event) => event.key === "Enter" && handleTextSubmit()}
                        placeholder="Or answer freely in your own words..."
                        disabled={isSubmitting || isComplete}
                        className="flex-1 bg-transparent px-3 py-2 text-base outline-none placeholder:text-muted-foreground"
                      />
                      <Button
                        onClick={toggleListening}
                        size="icon"
                        variant={isListening ? "destructive" : "outline"}
                        className="rounded-full shrink-0"
                        disabled={isSubmitting || isComplete}
                      >
                        {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                      </Button>
                      <Button
                        onClick={handleTextSubmit}
                        size="icon"
                        className="rounded-full shrink-0"
                        disabled={isSubmitting || isComplete}
                      >
                        {isSubmitting ? (
                          <LoaderCircle size={16} className="animate-spin" />
                        ) : (
                          <Send size={16} />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {isComplete && (
                <div className="space-y-4">
                  {finalAssistantMessage && (
                    <div className="rounded-2xl border border-border bg-background px-4 py-3">
                      <p className="ds-caption uppercase tracking-[0.14em] text-muted-foreground">Thesinator</p>
                      <p className="mt-1.5 text-base leading-7 text-foreground">{finalAssistantMessage}</p>
                    </div>
                  )}
                  <div className="rounded-2xl border border-border bg-background px-4 py-4">
                    <p className="ds-caption uppercase tracking-[0.14em] text-muted-foreground">Complete</p>
                    <p className="ds-title-cards mt-2 text-foreground">Your answers are in</p>
                    <p className="ds-small mt-2 text-muted-foreground">
                      We have enough to open your future view.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {speechError && (
          <div className="mt-3 rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3">
            <p className="ds-small text-destructive">{speechError}</p>
          </div>
        )}

        {error && (
          <div className="mt-3 rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3">
            <p className="ds-small text-destructive">{error}</p>
            <Button onClick={() => void bootstrapSession()} variant="outline" className="mt-3 rounded-full">
              Restart Thesinator
            </Button>
          </div>
        )}

        {isComplete && contextSnapshot && (
          <div className="mt-4 rounded-2xl border border-border bg-card p-4">
            <p className="ds-caption uppercase tracking-[0.14em] text-muted-foreground">
              Future profile anchor
            </p>
            <p className="ds-small mt-2 text-muted-foreground">
              Thesinator has enough context now. The next step opens a future view from this
              profile, the transcript, and your top matched theses.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const ThesisFinder = () => {
  const [stage, setStage] = useState<StageId>("discover");
  const [discoverSummary, setDiscoverSummary] = useState<CompletedDiscoverPayload | null>(null);
  const [futureSession, setFutureSession] = useState<FutureSessionState | null>(null);
  const [graphBuild, setGraphBuild] = useState<FutureSessionState["graph_build"] | null>(null);
  const [activeFutureId, setActiveFutureId] = useState<string | null>(null);
  const [futureDetails, setFutureDetails] = useState<Record<string, FutureDetailResponse>>({});
  const [isRestoring, setIsRestoring] = useState(true);
  const [isCreatingFutureSession, setIsCreatingFutureSession] = useState(false);
  const [isChatSending, setIsChatSending] = useState(false);
  const [isGeneratedExpanded, setIsGeneratedExpanded] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [screenError, setScreenError] = useState<string | null>(null);

  const syncGraphBuild = useCallback((nextGraphBuild: FutureSessionState["graph_build"]) => {
    setGraphBuild(nextGraphBuild);
    setFutureSession((prev) => (prev ? { ...prev, graph_build: nextGraphBuild } : prev));
  }, []);

  useEffect(() => {
    const restoreFutureSession = async () => {
      const storedFutureSessionId = readFutureSessionStorage();
      if (!storedFutureSessionId) {
        setIsRestoring(false);
        return;
      }

      try {
        const restored = await getFutureSession(storedFutureSessionId);
        setFutureSession(restored);
        setGraphBuild(restored.graph_build);
        const restoredActiveFutureId =
          readActiveFutureStorage(storedFutureSessionId) ?? restored.selected_future_id ?? null;
        if (restoredActiveFutureId) {
          const restoredDetail = await getFuture(storedFutureSessionId, restoredActiveFutureId);
          setFutureDetails({ [restoredActiveFutureId]: restoredDetail });
          setActiveFutureId(restoredActiveFutureId);
          setStage("detail");
        } else if (restored.graph_build.status === "ready") {
          setStage("explore");
        } else {
          setStage("build");
        }
      } catch (error) {
        console.error(error);
        writeFutureSessionStorage(null);
      } finally {
        setIsRestoring(false);
      }
    };

    void restoreFutureSession();
  }, []);

  useEffect(() => {
    if (!futureSession || stage === "discover") {
      return;
    }

    const currentGraphBuild = graphBuild ?? futureSession.graph_build;
    if (currentGraphBuild.status === "ready" || currentGraphBuild.status === "failed") {
      return;
    }

    let cancelled = false;

    const pollGraph = async () => {
      try {
        const nextGraphBuild = await getFutureSessionGraph(futureSession.future_session_id);
        if (!cancelled) {
          syncGraphBuild(nextGraphBuild);
        }
      } catch (error) {
        if (!cancelled) {
          setScreenError(error instanceof Error ? error.message : "Could not load your future view.");
        }
      }
    };

    void pollGraph();
    const interval = window.setInterval(() => {
      void pollGraph();
    }, 3500);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [futureSession, graphBuild, stage, syncGraphBuild]);

  const activeFuture = useMemo(() => {
    if (!futureSession || !activeFutureId) {
      return null;
    }

    return futureSession.futures.find((future) => future.future_id === activeFutureId) ?? null;
  }, [activeFutureId, futureSession]);

  const savedFutures = useMemo(() => {
    if (!futureSession) {
      return [];
    }

    return futureSession.futures.filter((future) => futureSession.saved_future_ids.includes(future.future_id));
  }, [futureSession]);

  const hydrateFutureDetail = useCallback(
    async (futureId: string) => {
      if (!futureSession) {
        return;
      }

      const cachedDetail = futureDetails[futureId];
      if (cachedDetail) {
        return;
      }

      setScreenError(null);

      try {
        const detailResponse = await getFuture(futureSession.future_session_id, futureId);
        setFutureDetails((prev) => ({ ...prev, [futureId]: detailResponse }));
        setFutureSession((prev) =>
          prev
            ? {
                ...prev,
                selected_future_id: futureId,
              }
            : prev,
        );
      } catch (error) {
        setScreenError(error instanceof Error ? error.message : "Could not open this future.");
      }
    },
    [futureDetails, futureSession],
  );

  const handleDiscoverComplete = useCallback((payload: CompletedDiscoverPayload) => {
    setDiscoverSummary(payload);
    setScreenError(null);
  }, []);

  const handleCreateSession = useCallback(async () => {
    if (!discoverSummary) {
      return;
    }

    setIsCreatingFutureSession(true);
    setScreenError(null);
    try {
      const created = await createFutureSession(discoverSummary.sessionId);
      writeFutureSessionStorage(created.future_session_id);
      writeActiveFutureStorage(created.future_session_id, created.selected_future_id ?? null);
      setFutureSession(created);
      setGraphBuild(created.graph_build);
      setIsGeneratedExpanded(false);
      startTransition(() => {
        setStage("build");
        setActiveFutureId(created.selected_future_id ?? null);
      });
    } catch (error) {
      setScreenError(error instanceof Error ? error.message : "Could not prepare your future view.");
    } finally {
      setIsCreatingFutureSession(false);
    }
  }, [discoverSummary]);

  const handleOpenFuture = useCallback(
    (futureId: string) => {
      if (futureSession) {
        writeActiveFutureStorage(futureSession.future_session_id, futureId);
      }
      setActiveFutureId(futureId);
      setChatInput("");
      startTransition(() => setStage("detail"));
      void hydrateFutureDetail(futureId);
    },
    [futureSession, hydrateFutureDetail],
  );

  const handleSelectSavedFuture = useCallback(
    (futureId: string) => {
      handleOpenFuture(futureId);
    },
    [handleOpenFuture],
  );

  const handleBackToExplore = useCallback(() => {
    startTransition(() => setStage("explore"));
  }, []);

  const handleContinueToExplore = useCallback(() => {
    startTransition(() => setStage("explore"));
  }, []);

  const handleSaveActiveFuture = useCallback(async () => {
    if (!futureSession || !activeFuture) {
      return;
    }

    try {
      const response = await saveFuture(futureSession.future_session_id, activeFuture.future_id);
      const updatedFuture = { ...activeFuture, saved: true };
      setFutureSession((prev) =>
        prev
          ? {
              ...mergeFutureSessionState(prev, updatedFuture),
              saved_future_ids: response.saved_future_ids,
            }
          : prev,
      );
      setFutureDetails((prev) =>
        prev[activeFuture.future_id]
          ? {
              ...prev,
              [activeFuture.future_id]: {
                ...prev[activeFuture.future_id],
                future_card: {
                  ...prev[activeFuture.future_id].future_card,
                  saved: true,
                },
              },
            }
          : prev,
      );
    } catch (error) {
      setScreenError(error instanceof Error ? error.message : "Could not save this future.");
    }
  }, [activeFuture, futureSession]);

  const handleSendPrompt = useCallback(
    async (prompt: string) => {
      if (!futureSession || !activeFuture) {
        return;
      }

      setIsChatSending(true);
      setScreenError(null);
      const existing = futureDetails[activeFuture.future_id];

      setFutureDetails((prev) => ({
        ...prev,
        [activeFuture.future_id]: {
          ...(existing ?? {
            future_card: activeFuture,
            future_detail: null,
            simulation_status: activeFuture.simulation_status,
            map_nodes: [],
            suggested_prompts: [],
            chat_history: [],
          }),
          chat_history: [...(existing?.chat_history ?? []), { role: "user", content: prompt }],
        },
      }));

      try {
        const response = await chatWithFutureSelf(
          futureSession.future_session_id,
          activeFuture.future_id,
          prompt,
        );
        setFutureDetails((prev) => {
          const current = prev[activeFuture.future_id];
          if (!current) {
            return prev;
          }

          return {
            ...prev,
            [activeFuture.future_id]: {
              ...current,
              chat_history: [...current.chat_history, { role: "assistant", content: response.reply }],
            },
          };
        });
        setChatInput("");
      } catch (error) {
        setScreenError(error instanceof Error ? error.message : "Could not send your message.");
        setFutureDetails((prev) => {
          const current = prev[activeFuture.future_id];
          if (!current) {
            return prev;
          }

          return {
            ...prev,
            [activeFuture.future_id]: {
              ...current,
              chat_history: current.chat_history.slice(0, -1),
            },
          };
        });
      } finally {
        setIsChatSending(false);
      }
    },
    [activeFuture, futureDetails, futureSession],
  );

  const handleSendChat = useCallback(() => {
    const trimmed = chatInput.trim();
    if (!trimmed) {
      return;
    }

    void handleSendPrompt(trimmed);
  }, [chatInput, handleSendPrompt]);

  const activeDetail = activeFutureId ? futureDetails[activeFutureId] ?? null : null;
  const currentGraphBuild = graphBuild ?? futureSession?.graph_build ?? null;
  const matchingNote = formatMatchingNote(discoverSummary?.matchingMeta ?? null);
  const currentStageIndex = stages.findIndex((item) => item.id === stage);
  const reachableStages = useMemo(
    () => ({
      discover: true,
      build: Boolean(futureSession && currentGraphBuild),
      explore: Boolean(futureSession),
      detail: Boolean(futureSession && activeFuture),
    }),
    [activeFuture, currentGraphBuild, futureSession],
  );

  const handleStageNavigation = useCallback(
    (targetStage: StageId) => {
      const targetStageIndex = stages.findIndex((item) => item.id === targetStage);
      if (targetStageIndex === -1 || targetStageIndex > currentStageIndex || !reachableStages[targetStage]) {
        return;
      }

      startTransition(() => setStage(targetStage));
    },
    [currentStageIndex, reachableStages],
  );

  return (
    <div className="flex-1 min-h-screen w-full min-w-0">
      <header className="border-b border-border">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="ds-caption uppercase tracking-[0.18em] text-muted-foreground">
              Thesis Copilot
            </p>
            <h1 className="ds-title-lg mt-2 text-foreground">Thesis future simulator</h1>
            <p className="ds-small mt-2 max-w-2xl text-muted-foreground">
              Simulate where your strongest thesis ideas could lead using your profile and previous inputs.
            </p>
          </div>
            <div className="flex min-w-0 gap-2 overflow-x-auto">
              {stages.map((item, index) => {
                const isActive = item.id === stage;
                const isCompleted = stages.findIndex((stageItem) => stageItem.id === stage) > index;
                const isReachable = reachableStages[item.id];
                const isClickable = isReachable && index <= currentStageIndex && !isActive;
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => handleStageNavigation(item.id)}
                    disabled={!isClickable}
                    aria-current={isActive ? "step" : undefined}
                    className={`rounded-full border px-4 py-2 ds-small transition-colors ${
                      isActive
                        ? "border-primary bg-primary text-primary-foreground"
                        : isCompleted
                          ? "border-primary/20 bg-primary/5 text-primary hover:bg-primary/10"
                          : "border-border bg-card text-muted-foreground"
                    } ${
                      isClickable ? "cursor-pointer" : "cursor-default opacity-70"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
        {screenError && (
          <div className="mb-6 rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3">
            <p className="ds-small text-destructive">{screenError}</p>
          </div>
        )}

        {isRestoring ? (
          <div className="flex min-h-[420px] items-center justify-center">
            <LoaderCircle size={28} className="animate-spin text-primary" />
          </div>
        ) : (
          <>
            {stage === "discover" && (
              <DiscoverStage
                summary={discoverSummary}
                isCreatingFutureSession={isCreatingFutureSession}
                onCreateFutureSession={handleCreateSession}
                onComplete={handleDiscoverComplete}
              />
            )}

            {stage === "build" && futureSession && currentGraphBuild && (
              <BuildGraphStage
                futureSession={futureSession}
                graphBuild={currentGraphBuild}
                matchingNote={matchingNote}
                onContinue={handleContinueToExplore}
              />
            )}

            {stage === "explore" && futureSession && (
              <ExploreStage
                futureSession={futureSession}
                activeFutureId={activeFutureId}
                onOpenFuture={handleOpenFuture}
                generatedExpanded={isGeneratedExpanded}
                onToggleGenerated={() => setIsGeneratedExpanded((current) => !current)}
              />
            )}

            {stage === "detail" && futureSession && activeFuture && (
              <FutureDetailStage
                future={activeFuture}
                detailResponse={activeDetail}
                savedFutures={savedFutures}
                onBack={handleBackToExplore}
                onSelectFuture={handleSelectSavedFuture}
                onSave={handleSaveActiveFuture}
                onSendPrompt={(prompt) => void handleSendPrompt(prompt)}
                onSendChat={handleSendChat}
                chatInput={chatInput}
                onChatInputChange={setChatInput}
                isChatSending={isChatSending}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default ThesisFinder;

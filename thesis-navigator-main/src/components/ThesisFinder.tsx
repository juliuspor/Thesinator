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
import { Skeleton } from "@/components/ui/skeleton";
import {
  chatWithFutureSelf,
  createFutureSession,
  getFuture,
  getFutureSession,
  getFutureSessionFutureView,
  saveFuture,
  type FutureCard,
  type FutureDetailResponse,
  type FutureMapNode,
  type FutureSessionState,
  type FutureSwarmAction,
  type FutureViewState,
  type SwarmState,
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
import { useDelayedPending } from "@/hooks/use-delayed-pending";
import thesinatorTalk1 from "@/assets/thesinator-talk1.png";
import thesinatorTalk2 from "@/assets/thesinator-talk2.png";
import thesinatorThinking from "@/assets/thesinator-thinking.png";

const stages = [
  { id: "discover", label: "Discover" },
  { id: "build", label: "Simulate" },
  { id: "explore", label: "Explore" },
  { id: "detail", label: "Detail" },
] as const;

type StageId = (typeof stages)[number]["id"];

const visibleStages = stages.filter((item) => item.id !== "detail");

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
const THESINATOR_WAIT_LINES = [
  "Got it. I locked in your answer.",
  "I’m lining this up with your previous choices.",
  "I’m crafting the best next question for you.",
] as const;

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

const swarmDecisionLabels = {
  up: "Strengthened by swarm",
  steady: "Confirmed by swarm",
  down: "Tradeoffs surfaced",
} as const;

const swarmDecisionStyles = {
  up: "bg-emerald-500/10 text-emerald-700",
  steady: "bg-sky-500/10 text-sky-700",
  down: "bg-amber-500/10 text-amber-700",
} as const;

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

  return "Showing your best matches while the full list loads.";
};

const graphPreviewSignature = (graphBuild: FutureViewState["graph_build"]) =>
  JSON.stringify({
    nodes: [...graphBuild.preview_nodes]
      .sort((left, right) => left.id.localeCompare(right.id))
      .map((node) => [node.id, node.type, node.label, node.summary]),
    edges: [...graphBuild.preview_edges]
      .sort((left, right) => left.id.localeCompare(right.id))
      .map((edge) => [edge.id, edge.source, edge.target, edge.label]),
  });

const stabilizeGraphBuild = (
  previousGraphBuild: FutureViewState["graph_build"] | null,
  nextGraphBuild: FutureViewState["graph_build"],
): FutureViewState["graph_build"] => {
  if (!previousGraphBuild) {
    return nextGraphBuild;
  }

  if (graphPreviewSignature(previousGraphBuild) !== graphPreviewSignature(nextGraphBuild)) {
    return nextGraphBuild;
  }

  return {
    ...nextGraphBuild,
    preview_nodes: previousGraphBuild.preview_nodes,
    preview_edges: previousGraphBuild.preview_edges,
  };
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
      <div className="relative animate-genie-float">
        <div className="absolute inset-0 z-0 rounded-full bg-primary/20 blur-3xl opacity-60" />
        <img
          src={currentImage}
          alt="Thesinator"
          className="relative z-10 h-44 w-44 object-contain transition-opacity duration-200 sm:h-56 sm:w-56 xl:h-72 xl:w-72"
        />
        <div className="absolute -top-2 -right-2 z-20 animate-sparkle">
          <Sparkles size={16} className="text-ai-from" />
        </div>
        <div
          className="absolute -bottom-1 -left-3 z-20 animate-sparkle"
          style={{ animationDelay: "0.7s" }}
        >
          <Sparkles size={12} className="text-ai-from" />
        </div>
        <div
          className="absolute top-4 -left-4 z-20 animate-sparkle"
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
}) => {
  const pathReason = future.swarm_impact?.why_this_path ?? future.why_fit;
  const decision = future.swarm_impact?.decision ?? null;
  const alumniExample = future.alumni_examples[0] ?? null;
  const alumniLine = alumniExample
    ? compactText(
        `Seen before: ${alumniExample.full_name} turned a similar thesis into ${alumniExample.current_role} at ${alumniExample.current_company}.`,
        88,
      )
    : null;

  return (
    <article className="rounded-[1.5rem] border border-border bg-card p-5 shadow-sm transition-transform duration-300 hover:-translate-y-0.5">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-3 py-1 ds-caption ${sourceStyles[future.source]}`}>
          {sourceLabels[future.source]}
        </span>
        {decision && (
          <span className={`rounded-full px-3 py-1 ds-caption ${swarmDecisionStyles[decision]}`}>
            {swarmDecisionLabels[decision]}
          </span>
        )}
        {(future.grounding.company || future.grounding.university) && (
          <span className="rounded-full bg-muted px-3 py-1 ds-caption text-muted-foreground">
            {future.grounding.company?.name ?? future.grounding.university?.name}
          </span>
        )}
      </div>
      <div className="mt-5 space-y-3">
        <h3 className="ds-title-sm text-foreground">{future.thesis_title}</h3>
        <p className="ds-small text-muted-foreground">{compactText(future.thesis_summary, 82)}</p>
        <div className="rounded-2xl bg-muted/50 px-4 py-3">
          <p className="ds-caption uppercase tracking-[0.14em] text-muted-foreground">Why this path now</p>
          <p className="ds-small mt-2 text-foreground">{compactText(pathReason, 92)}</p>
        </div>
        <p className="ds-small text-muted-foreground">
          Could lead to: {future.future_role} at {future.future_organization}
        </p>
        {alumniLine && <p className="ds-small text-muted-foreground">{alumniLine}</p>}
      </div>
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-muted-foreground">
          {future.saved ? <Bookmark size={16} className="fill-current text-primary" /> : <Compass size={16} />}
          <span className="ds-caption">{future.saved ? "Saved" : "Preview"}</span>
        </div>
        <Button onClick={() => onOpen(future.future_id)} className="rounded-full gap-2">
          Open thesis <ChevronRight size={16} />
        </Button>
      </div>
    </article>
  );
};

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

const formatActionType = (value: string) =>
  value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const statusDisplayLabels: Record<string, string> = {
  queued: "Up next",
  preparing: "In progress",
  running: "In progress",
  ready: "Ready",
  failed: "Needs attention",
};

const formatStatusLabel = (value: string | null | undefined) => {
  if (!value) {
    return "Up next";
  }

  return statusDisplayLabels[value.toLowerCase()] ?? formatActionType(value);
};

const stageDisplayLabels: Record<string, string> = {
  "Stakeholder discovery": "Finding key connections",
  "Waiting for stakeholder graph": "Waiting for your map",
  "Graph build failed": "Map could not be built",
  "Preparing simulation": "Getting your path ready",
  "Waiting for simulation": "Waiting for your path",
  "Waiting for full swarm run": "Waiting for your path",
  "Swarm failed": "Future path could not continue",
  "Collecting finished swarm outcomes": "Gathering your results",
  "Preparing thesis cards": "Preparing your thesis matches",
  "Finalizing thesis outcomes": "Preparing your thesis matches",
  "Saving thesis outcomes": "Saving your thesis matches",
  "Thesis outcomes ready": "Thesis matches ready",
  "Outcome synthesis failed": "Thesis matches could not be prepared",
  "Finalizing thesis outcomes failed": "Thesis matches could not be prepared",
  "MiroFish graph start failed": "Map could not be started",
  "MiroFish swarm start failed": "Future path could not be started",
  "MiroFish task unavailable": "Map update unavailable",
  "Swarm unavailable": "Future path unavailable",
};

const formatStageLabel = (value: string | null | undefined, fallback: string) => {
  if (!value) {
    return fallback;
  }

  return (
    stageDisplayLabels[value] ??
    value
      .replace(/graph/gi, "map")
      .replace(/swarm/gi, "future path")
  );
};

const describeSwarmAction = (action: FutureSwarmAction) => {
  const content =
    typeof action.action_args.content === "string"
      ? action.action_args.content
      : typeof action.action_args.text === "string"
        ? action.action_args.text
        : typeof action.action_args.post_content === "string"
          ? action.action_args.post_content
          : null;

  if (content && content.trim()) {
    return compactText(content.trim(), 120);
  }

  if (action.result && action.result.trim()) {
    return compactText(action.result.trim(), 120);
  }

  return `${action.agent_name} performed ${formatActionType(action.action_type).toLowerCase()}.`;
};

const getFutureBuildCopy = (
  graphBuild: FutureSessionState["graph_build"],
  swarm: SwarmState,
  finalization: FutureViewState["finalization"],
) => {
  if (graphBuild.status !== "ready") {
    return {
      title: "Building your stakeholder map",
      body:
        "We’re connecting the people, thesis options, companies, universities, and experts linked to your best matches.",
    };
  }

  if (swarm.status === "queued" || swarm.status === "preparing") {
    return {
      title: "Preparing your future path",
      body:
        "Your map is ready. We’re now preparing the next step that will bring your future path to life.",
    };
  }

  if (swarm.status === "running") {
    return {
      title: "Your future path is running live",
      body:
        "We’re now exploring how your strongest thesis options could unfold across people, places, and organizations.",
    };
  }

  if (swarm.status === "ready" && finalization.status !== "ready") {
    return {
      title: "Preparing your thesis matches",
      body:
        "Your future path is complete. We’re now turning it into clear thesis matches and future options.",
    };
  }

  if (swarm.status === "ready" && finalization.status === "ready") {
    return {
      title: "Your thesis matches are ready",
      body:
        "Your stakeholder map, future path, and thesis matches are ready to explore.",
    };
  }

  return {
    title: "Your future view hit a problem",
    body:
      "Part of the future pipeline failed. We’re keeping thesis exploration locked rather than opening incomplete future-self outcomes.",
  };
};

const getFinalizationStatusCopy = (finalization: FutureViewState["finalization"]) => {
  if (finalization.status === "failed") {
    return "The final thesis synthesis failed, so we are keeping thesis exploration locked instead of showing incomplete results.";
  }

  if (finalization.status === "ready") {
    return "Your future path has been turned into thesis matches, clear reasons, and ready future options.";
  }

  if (finalization.status === "preparing") {
    return "We’re preparing your thesis matches and future options now.";
  }

  return "We’re finishing your matches before showing your future options.";
};

const getSwarmStatusCopy = (swarm: SwarmState) => {
  if (swarm.status === "failed") {
    return "Your future path hit a problem, but the rest of the view can still stay usable.";
  }

  if (swarm.status === "ready") {
    return "Your future path is ready, and the latest update is shown below.";
  }

  if (swarm.status === "running") {
    return "We’re actively exploring how this future path could unfold.";
  }

  return "We’re getting your future path ready now.";
};

const FutureBuildStatusPanel = ({
  graphBuild,
}: {
  graphBuild: FutureSessionState["graph_build"];
}) => {
  const latestEvent = graphBuild.events.length > 0
    ? graphBuild.events[graphBuild.events.length - 1]
    : {
        timestamp: null,
        message: "We’re still waiting for the first map update.",
        stage_label: graphBuild.stage_label,
        status: graphBuild.status,
        progress: graphBuild.progress,
        error: graphBuild.error,
      };

  return (
    <section className="rounded-[1.75rem] border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="ds-title-cards text-foreground">Stakeholder map</p>
          <p className="ds-small text-muted-foreground">Map progress</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-background px-3 py-1 ds-caption text-muted-foreground">
            {formatStatusLabel(graphBuild.status)}
          </span>
          <span className="rounded-full bg-primary/10 px-3 py-1 ds-caption text-primary">
            {graphBuild.progress}%
          </span>
        </div>
      </div>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-muted/50">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${graphBuild.progress}%` }}
        />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
        <span>Current step</span>
        <span>{formatStageLabel(latestEvent.stage_label, "Finding key connections")}</span>
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
    </section>
  );
};

const FutureSwarmStatusPanel = ({
  swarm,
}: {
  swarm: SwarmState;
}) => {
  const latestEvent = swarm.events.length > 0
    ? swarm.events[swarm.events.length - 1]
    : {
        timestamp: null,
        message: getSwarmStatusCopy(swarm),
        stage_label: swarm.stage_label,
        status: swarm.status,
        progress: swarm.progress,
        error: swarm.error,
      };

  return (
    <section className="rounded-[1.75rem] border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="ds-title-cards text-foreground">Future path</p>
          <p className="ds-small text-muted-foreground">Path progress</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-background px-3 py-1 ds-caption text-muted-foreground">
            {formatStatusLabel(swarm.status)}
          </span>
          {swarm.runner_status && (
            <span className="rounded-full bg-background px-3 py-1 ds-caption text-muted-foreground">
              {swarm.runner_status}
            </span>
          )}
          <span className="rounded-full bg-primary/10 px-3 py-1 ds-caption text-primary">
            {swarm.progress}%
          </span>
        </div>
      </div>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-muted/50">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${swarm.progress}%` }}
        />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
        <span>Current step</span>
        <span>{formatStageLabel(latestEvent.stage_label, "Getting your path ready")}</span>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
        <span>Latest update</span>
        <span>{formatGraphEventTime(latestEvent.timestamp)}</span>
      </div>
      <p className="mt-2 ds-small text-foreground">
        {latestEvent.message ?? latestEvent.error ?? getSwarmStatusCopy(swarm)}
      </p>
      {latestEvent.error && latestEvent.error !== latestEvent.message && (
        <p className="mt-2 ds-caption text-destructive">
          {latestEvent.error}
        </p>
      )}
    </section>
  );
};

const FutureFinalizationStatusPanel = ({
  finalization,
}: {
  finalization: FutureViewState["finalization"];
}) => {
  const latestTimestamp = finalization.status === "ready" ? "now" : null;
  const currentStep =
    formatStageLabel(
      finalization.stage_label,
      finalization.status === "failed"
        ? "Thesis matches could not be prepared"
        : finalization.status === "ready"
          ? "Thesis matches ready"
          : finalization.status === "preparing"
            ? "Preparing your thesis matches"
            : "Waiting for your path",
    );

  return (
    <section className="rounded-[1.75rem] border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="ds-title-cards text-foreground">Thesis matches</p>
          <p className="ds-small text-muted-foreground">Match progress</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-background px-3 py-1 ds-caption text-muted-foreground">
            {formatStatusLabel(finalization.status)}
          </span>
          <span className="rounded-full bg-primary/10 px-3 py-1 ds-caption text-primary">
            {finalization.progress}%
          </span>
        </div>
      </div>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-muted/50">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${finalization.progress}%` }}
        />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
        <span>Current step</span>
        <span>{currentStep}</span>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
        <span>Latest update</span>
        <span>{formatGraphEventTime(latestTimestamp)}</span>
      </div>
      <p className="mt-2 ds-small text-foreground">
        {finalization.error ?? getFinalizationStatusCopy(finalization)}
      </p>
    </section>
  );
};

const GraphPreviewCanvas = ({
  graphBuild,
}: {
  graphBuild: FutureSessionState["graph_build"];
}) => {
  const isLive = graphBuild.status === "preparing" || graphBuild.status === "queued";
  const nodes = graphBuild.preview_nodes;
  const edges = graphBuild.preview_edges;

  return (
    <div className="rounded-[1.75rem] border border-border bg-card p-6 shadow-sm">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Network size={18} className="text-primary" />
          <div>
            <p className="ds-title-cards text-foreground">Stakeholder map</p>
            <p className="ds-small text-muted-foreground">
              See how people, organizations, and thesis options connect around your future path.
            </p>
          </div>
        </div>
        {isLive && (
          <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-primary">
            <LoaderCircle size={14} className="animate-spin" />
            <span className="ds-caption">Live</span>
          </div>
        )}
      </div>
      <LiveFuturePathGraph nodes={nodes} edges={edges} isLive={isLive} />
    </div>
  );
};

const SwarmActionFeed = ({
  swarm,
}: {
  swarm: SwarmState;
}) => {
  const latestAction = [...swarm.latest_actions].sort((left, right) => {
    const leftTime = left.timestamp ? new Date(left.timestamp).getTime() : 0;
    const rightTime = right.timestamp ? new Date(right.timestamp).getTime() : 0;
    return rightTime - leftTime;
  })[0] ?? null;

  return (
    <section className="rounded-[1.75rem] border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="ds-title-cards text-foreground">Latest update</p>
          <p className="ds-small text-muted-foreground">Most recent step</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-background px-3 py-1 ds-caption text-muted-foreground">
            {swarm.metrics.total_actions_count > 0
              ? `${swarm.metrics.total_actions_count} so far`
              : "Waiting"}
          </span>
          {latestAction && (
            <span className="rounded-full bg-background px-3 py-1 ds-caption text-muted-foreground">
              {latestAction.platform ?? "platform"}
            </span>
          )}
          {latestAction && (
            <span className="rounded-full bg-primary/10 px-3 py-1 ds-caption text-primary">
              {formatActionType(latestAction.action_type)}
            </span>
          )}
        </div>
      </div>
      <div className="mt-5 border-t border-border/70 pt-4">
        <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          <span>Latest update</span>
          <span>{formatGraphEventTime(latestAction?.timestamp ?? null)}</span>
        </div>
        {!latestAction ? (
          <p className="mt-3 ds-small text-foreground">
            {swarm.status === "running"
              ? "Your future path is live, but the first visible step has not appeared yet."
              : "Your future path has not started yet."}
          </p>
        ) : (
          <>
            <p className="mt-3 ds-caption text-muted-foreground">
              Round {latestAction.round_num}
            </p>
            <p className="mt-2 ds-label text-foreground">{latestAction.agent_name}</p>
            <p className="mt-2 ds-small text-foreground">{describeSwarmAction(latestAction)}</p>
          </>
        )}
      </div>
    </section>
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
}) => {
  const summaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (summary && summaryRef.current) {
      summaryRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [summary]);

  return (
    <div className="space-y-8">
      <div className="space-y-5">
        <div className="rounded-[2.5rem] border border-primary/5 bg-card/40 p-5 shadow-2xl shadow-primary/5 backdrop-blur-sm xl:p-8">
          <div className="mb-6 px-2 text-center xl:text-left">
            <p className="ds-caption uppercase tracking-[0.18em] text-primary/80">Discover</p>
            <h2 className="ds-title-md mt-2 text-foreground">Build your future map</h2>
          </div>
          <StepGenieChat onComplete={onComplete} />
        </div>

        {summary && (
          <div
            ref={summaryRef}
            className="rounded-[2rem] border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-6 shadow-xl backdrop-blur-md animate-in slide-in-from-bottom-4 zoom-in-95 duration-500 xl:p-8"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
                <Check size={20} />
              </div>
              <p className="ds-title-cards text-foreground">Your thesis matches are ready</p>
            </div>
            <p className="ds-body mt-3 text-muted-foreground">
              We mapped your choices and found your best matches. Next, see how they unfold.
            </p>
            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {summary.topTopics.slice(0, 3).map((topic) => (
                <div key={topic.topic_id} className="rounded-[1.25rem] border border-primary/10 bg-background/60 px-5 py-4 backdrop-blur-sm">
                  <p className="ds-caption font-semibold tracking-[0.14em] text-primary">Match {topic.rank}</p>
                  <p className="text-[0.96rem] font-medium leading-snug text-foreground mt-2">{topic.title}</p>
                </div>
              ))}
            </div>
            {formatMatchingNote(summary.matchingMeta) && (
              <p className="mt-5 ds-caption text-muted-foreground">{formatMatchingNote(summary.matchingMeta)}</p>
            )}
            <Button
              onClick={onCreateFutureSession}
              size="lg"
              className="mt-6 rounded-full px-8 gap-2 text-[0.96rem] shadow-md"
              disabled={isCreatingFutureSession}
            >
              {isCreatingFutureSession ? (
                <>
                  <LoaderCircle size={18} className="animate-spin" />
                  Loading your map
                </>
              ) : (
                <>
                  See where it could lead <ArrowRight size={18} />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const BuildFutureStage = ({
  futureSession,
  graphBuild,
  swarm,
  finalization,
  matchingNote,
  onContinue,
}: {
  futureSession: FutureSessionState;
  graphBuild: FutureSessionState["graph_build"];
  swarm: SwarmState;
  finalization: FutureViewState["finalization"];
  matchingNote: string | null;
  onContinue: () => void;
}) => {
  const canRevealTheses = futureSession.matched_futures.length > 0 && finalization.status === "ready";
  const copy = getFutureBuildCopy(graphBuild, swarm, finalization);
  const hasFutureViewError = graphBuild.error || swarm.error || finalization.error;

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-border bg-card px-6 py-8 shadow-sm">
        <p className="ds-caption uppercase tracking-[0.18em] text-muted-foreground">Simulate your future</p>
        <h2 className="ds-title-lg mt-3 text-foreground">{copy.title}</h2>
        <p className="ds-body mt-3 max-w-3xl text-muted-foreground">
          {copy.body}
        </p>
        {matchingNote && <p className="mt-4 ds-caption text-muted-foreground">{matchingNote}</p>}
      </div>

      <div className="grid gap-8 xl:grid-cols-2 2xl:grid-cols-4">
        <FutureBuildStatusPanel graphBuild={graphBuild} />
        <FutureSwarmStatusPanel swarm={swarm} />
        <FutureFinalizationStatusPanel finalization={finalization} />
        <SwarmActionFeed swarm={swarm} />
      </div>

      <GraphPreviewCanvas graphBuild={graphBuild} />

      {hasFutureViewError && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-4">
          <p className="ds-label text-destructive">Future build failed</p>
          <p className="ds-small mt-2 whitespace-pre-line text-destructive">
            {graphBuild.error ?? swarm.error ?? finalization.error}
          </p>
        </div>
      )}

      {canRevealTheses && (
        <section className="rounded-[1.75rem] border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="ds-title-cards text-foreground">Your thesis paths are ready</p>
              <p className="ds-small text-muted-foreground">
                The swarm-backed thesis reasons and future selves are fully prepared. You can open the thesis list now.
              </p>
            </div>
            <Button onClick={onContinue} className="rounded-full gap-2">
              Open thesis paths <ArrowRight size={16} />
            </Button>
          </div>
        </section>
      )}
    </div>
  );
};

const ExploreStage = ({
  futureSession,
  futureView,
  activeFutureId,
  onOpenFuture,
  generatedExpanded,
  onToggleGenerated,
}: {
  futureSession: FutureSessionState;
  futureView: FutureViewState | null;
  activeFutureId: string | null;
  onOpenFuture: (futureId: string) => void;
  generatedExpanded: boolean;
  onToggleGenerated: () => void;
}) => {
  const savedFutures = futureSession.futures.filter((future) =>
    futureSession.saved_future_ids.includes(future.future_id),
  );
  const graphBuild = futureView?.graph_build ?? futureSession.graph_build;
  const swarm = futureView?.swarm ?? futureSession.swarm;
  const finalization = futureView?.finalization ?? futureSession.finalization;
  const isFutureViewUpdating =
    graphBuild.status !== "ready" ||
    (swarm.status !== "ready" && swarm.status !== "failed") ||
    finalization.status !== "ready";

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-border bg-card px-6 py-8 shadow-sm">
        <p className="ds-caption uppercase tracking-[0.18em] text-muted-foreground">Explore theses</p>
        <h2 className="ds-title-lg mt-3 text-foreground">Choose a thesis to explore</h2>
        <p className="ds-body mt-3 max-w-3xl text-muted-foreground">
          Start with your best matches.
        </p>
        {isFutureViewUpdating && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-primary">
            <LoaderCircle size={14} className="animate-spin" />
            <span className="ds-caption">Thesis outcomes still finalizing</span>
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
                More options to explore.
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
  const swarmImpact = detailResponse?.swarm_impact ?? future.swarm_impact;
  const swarmReason = swarmImpact?.why_this_path ?? detail?.why_this_path ?? future.why_fit;
  const futureSelfAngle =
    swarmImpact?.future_self_angle ??
    detail?.future_self_intro ??
    "Ask what changed, what mattered early, or how to prepare before committing.";
  const swarmRisks = (swarmImpact?.risks ?? []).filter((risk) => risk.trim().length > 0).slice(0, 3);
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

      <section className="rounded-[2rem] border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-background p-6 shadow-sm">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2">
              <MessageCircle size={18} className="text-primary" />
              <p className="ds-title-cards text-foreground">Ask your future self</p>
            </div>
            <p className="ds-body mt-3 text-foreground">
              Ask what this path is like.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className={`rounded-full px-3 py-1 ds-caption ${sourceStyles[future.source]}`}>
                {sourceLabels[future.source]}
              </span>
              {swarmImpact && (
                <span
                  className={`rounded-full px-3 py-1 ds-caption ${swarmDecisionStyles[swarmImpact.decision]}`}
                >
                  {swarmDecisionLabels[swarmImpact.decision]}
                </span>
              )}
              <span className="rounded-full bg-background/80 px-3 py-1 ds-caption text-foreground">
                {future.thesis_title}
              </span>
            </div>
            <p className="mt-4 ds-small text-muted-foreground">
              <span className="text-foreground">Why this path now:</span> {compactText(swarmReason, 104)}
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-primary/20 bg-background/80 px-4 py-4 xl:w-[320px]">
            <p className="ds-caption uppercase tracking-[0.14em] text-muted-foreground">You later on</p>
            <p className="ds-label mt-2 text-foreground">
              {detail?.hero_title ?? `${future.future_role} at ${future.future_organization}`}
            </p>
            <p className="ds-small mt-2 text-muted-foreground">
              {compactText(
                detail?.hero_summary ??
                  detail?.future_self_intro ??
                  "Ask what changed, what mattered early, or how to prepare before committing.",
                96,
              )}
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
          {isChatSending && (
            <div className="mr-8 rounded-2xl border border-border bg-background/80 px-4 py-4">
              <p className="ds-caption uppercase tracking-[0.14em] text-muted-foreground">Future self</p>
              <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                <LoaderCircle size={16} className="animate-spin" />
                <p className="ds-small text-foreground">Thinking about your path...</p>
              </div>
            </div>
          )}
        </div>
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(event) => onChatInputChange(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && onSendChat()}
            autoFocus
            disabled={isChatSending}
            placeholder="Ask a question about this path..."
            className="flex-1 rounded-full border border-input bg-background px-5 py-3 ds-small outline-none transition-shadow focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-60"
          />
          <Button
            onClick={onSendChat}
            className="rounded-full gap-2 px-5"
            disabled={!chatInput.trim() || isChatSending}
          >
            {isChatSending ? <LoaderCircle size={16} className="animate-spin" /> : <Send size={16} />}
            {isChatSending ? "Sending" : "Ask"}
          </Button>
        </div>
      </section>

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
              Start with the core idea.
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
              {compactText(detail?.hero_summary ?? future.future_path_snapshot, 96)}
            </p>
          </div>
        </div>

        <Collapsible open={isThesisExpanded} onOpenChange={setIsThesisExpanded}>
          <div className="mt-6 rounded-[1.5rem] border border-border bg-muted/30 px-5 py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="ds-label text-foreground">Thesis details</p>
                <p className="ds-small text-muted-foreground">
                  See the summary and fit.
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
              <div className="mt-4 space-y-4">
                <div className="rounded-2xl border border-border bg-background px-4 py-4">
                  <p className="ds-body text-foreground">{compactText(future.thesis_summary, 220)}</p>
                  <p className="ds-small mt-4 text-muted-foreground">
                    {compactText(detail?.why_this_path ?? future.why_fit, 150)}
                  </p>
                </div>
                <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                  <div className="rounded-2xl border border-border bg-background px-4 py-4">
                    <p className="ds-caption uppercase tracking-[0.14em] text-muted-foreground">
                      What the swarm noticed
                    </p>
                    <p className="ds-small mt-2 text-foreground">{compactText(futureSelfAngle, 120)}</p>
                  </div>
                  {swarmRisks.length > 0 && (
                    <div className="rounded-2xl border border-border bg-background px-4 py-4">
                      <p className="ds-caption uppercase tracking-[0.14em] text-muted-foreground">
                        Early tradeoffs
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {swarmRisks.map((risk) => (
                          <span
                            key={risk}
                            className="rounded-full bg-amber-500/10 px-3 py-1 ds-caption text-amber-700"
                          >
                            {compactText(risk, 64)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      </section>

      <FutureCompareRibbon
        futures={savedFutures}
        activeFutureId={future.future_id}
        onSelectFuture={onSelectFuture}
      />

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

const StepGenieChatSkeleton = ({ showPulse }: { showPulse: boolean }) => (
  <div className="space-y-4" data-testid="step-genie-chat-skeleton">
    <div className="mb-3 flex items-center gap-3">
      <Skeleton className={`h-2 flex-1 rounded-full ${showPulse ? "" : "animate-none"}`} />
      <Skeleton className={`h-4 w-12 rounded-full ${showPulse ? "" : "animate-none"}`} />
    </div>

    <div className="rounded-[2rem] border border-border/50 bg-card/60 p-5 shadow-lg backdrop-blur-xl">
      <div className="space-y-5">
        <div className="rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/5 to-transparent px-5 py-4 shadow-sm backdrop-blur-md">
          <Skeleton className={`h-3 w-20 rounded-full ${showPulse ? "" : "animate-none"}`} />
          <Skeleton className={`mt-3 h-4 w-full rounded-full ${showPulse ? "" : "animate-none"}`} />
          <Skeleton className={`mt-2 h-4 w-4/5 rounded-full ${showPulse ? "" : "animate-none"}`} />
        </div>

        <div className="flex items-start gap-4">
          <Skeleton className={`h-12 w-12 shrink-0 rounded-[1.25rem] ${showPulse ? "" : "animate-none"}`} />
          <div className="flex-1 rounded-[1.25rem] border border-border bg-background px-5 py-3 shadow-sm">
            <Skeleton className={`h-4 w-full rounded-full ${showPulse ? "" : "animate-none"}`} />
            <Skeleton className={`mt-2 h-4 w-3/4 rounded-full ${showPulse ? "" : "animate-none"}`} />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 mt-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton
              key={`step-genie-skeleton-option-${index}`}
              className={`h-[54px] rounded-[1.25rem] ${showPulse ? "" : "animate-none"}`}
            />
          ))}
        </div>
      </div>
    </div>
  </div>
);

const StepGenieTurnWaiting = ({
  lineIndex,
  elapsedMs,
  showPulse,
}: {
  lineIndex: number;
  elapsedMs: number;
  showPulse: boolean;
}) => (
  <div
    className="relative overflow-hidden rounded-[1.5rem] border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent px-5 py-5 text-muted-foreground shadow-sm"
    data-testid="step-genie-next-question-skeleton"
  >
    {showPulse && (
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-shimmer" />
    )}
    <div className="relative z-10">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
          <LoaderCircle size={16} className={showPulse ? "animate-spin text-primary" : "text-primary"} />
        </div>
        <p className="ds-caption font-semibold tracking-[0.14em] text-primary">Thinking</p>
      </div>

      <p className="mt-3 ds-body text-foreground transition-opacity duration-500">{THESINATOR_WAIT_LINES[lineIndex]}</p>

      <div className="mt-4 rounded-xl border border-primary/10 bg-background/50 px-4 py-4 backdrop-blur">
        <div className="flex items-center gap-2">
          <Skeleton className={`h-2 w-2 rounded-full bg-primary/30 ${showPulse ? "" : "animate-none"}`} />
          <p className="ds-caption uppercase tracking-[0.14em] text-muted-foreground">Up next</p>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1 space-y-2">
            <Skeleton className={`h-3 w-10/12 rounded-full ${showPulse ? "" : "animate-none"}`} />
            <Skeleton className={`h-3 w-7/12 rounded-full ${showPulse ? "" : "animate-none"}`} />
          </div>
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <Skeleton className={`h-10 rounded-xl ${showPulse ? "" : "animate-none"}`} />
          <Skeleton className={`h-10 rounded-xl ${showPulse ? "" : "animate-none"}`} />
        </div>
      </div>

      {elapsedMs > 4800 && (
        <p className="mt-4 ds-caption text-primary/70 animate-pulse">
          Taking a bit longer than usual, but still working on your next step.
        </p>
      )}
    </div>
  </div>
);

export const StepGenieChat = ({ onComplete }: { onComplete: (payload: CompletedDiscoverPayload) => void }) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [clientToken, setClientToken] = useState<string | null>(null);
  const [questions, setQuestions] = useState<BackendQuestion[]>([]);
  const [turns, setTurns] = useState<ConversationTurn[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [finalAssistantMessage, setFinalAssistantMessage] = useState<string | null>(null);
  const [contextSnapshot, setContextSnapshot] = useState<ContextSnapshot | null>(null);
  const [textInput, setTextInput] = useState("");
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [submitVisualElapsedMs, setSubmitVisualElapsedMs] = useState(0);
  const [turnMotionClassName, setTurnMotionClassName] = useState("opacity-100 translate-y-0");
  const [isTurnTransitioning, setIsTurnTransitioning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chatCanvasRef = useRef<HTMLDivElement | null>(null);
  const activeTurnIdRef = useRef<number | null>(null);
  const turnMotionTimeoutRef = useRef<number | null>(null);
  const scrollChatCanvasToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    const node = chatCanvasRef.current;
    if (!node) {
      return;
    }

    if (typeof node.scrollTo === "function") {
      node.scrollTo({ top: node.scrollHeight, behavior });
      return;
    }

    node.scrollTop = node.scrollHeight;
  }, []);
  const waitingTurnRef = useCallback((node: HTMLDivElement | null) => {
    if (!node || typeof node.scrollIntoView !== "function") {
      return;
    }

    node.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, []);

  const activeTurn = !isComplete && turns.length > 0 ? turns[turns.length - 1] : null;
  const activeQuestion = activeTurn?.question ?? null;
  const answeredTurns = isComplete
    ? turns.filter((turn) => turn.userAnswer !== null)
    : turns.slice(0, -1).filter((turn) => turn.userAnswer !== null);
  const isLoadingSessionVisual = useDelayedPending(isLoadingSession, {
    delayMs: 120,
    minDurationMs: 500,
  });
  const isSubmittingVisual = useDelayedPending(isSubmitting, {
    delayMs: 120,
    minDurationMs: 500,
  });

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
    setQuestions([]);
    setTurns([]);
    setCurrentQuestionIndex(0);
    setFinalAssistantMessage(null);
    setSessionId(null);
    setClientToken(null);
    setContextSnapshot(null);
    setTextInput("");

    try {
      const start = await startThesinatorSession();
      const preloadedQuestions = start.questions.length > 0 ? start.questions : [start.question];
      setSessionId(start.session_id);
      setClientToken(start.client_token);
      setQuestions(preloadedQuestions);
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
      if (turnMotionTimeoutRef.current !== null) {
        window.clearTimeout(turnMotionTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isSubmittingVisual) {
      setSubmitVisualElapsedMs(0);
      return;
    }

    const startedAt = Date.now();
    const interval = window.setInterval(() => {
      setSubmitVisualElapsedMs(Date.now() - startedAt);
    }, 250);

    return () => window.clearInterval(interval);
  }, [isSubmittingVisual]);

  useEffect(() => {
    const currentTurnId = activeTurn?.question.id ?? null;

    if (currentTurnId === null) {
      return;
    }

    if (activeTurnIdRef.current === null) {
      activeTurnIdRef.current = currentTurnId;
      return;
    }

    if (activeTurnIdRef.current === currentTurnId) {
      return;
    }

    activeTurnIdRef.current = currentTurnId;
    setIsTurnTransitioning(true);
    setTurnMotionClassName("opacity-0 translate-y-1");

    const animationFrame = window.requestAnimationFrame(() => {
      setTurnMotionClassName("opacity-100 translate-y-0");
    });

    if (turnMotionTimeoutRef.current !== null) {
      window.clearTimeout(turnMotionTimeoutRef.current);
    }
    turnMotionTimeoutRef.current = window.setTimeout(() => {
      setTurnMotionClassName("opacity-100 translate-y-0");
      setIsTurnTransitioning(false);
      turnMotionTimeoutRef.current = null;
    }, 160);

    return () => {
      window.cancelAnimationFrame(animationFrame);
    };
  }, [activeTurn?.question.id]);

  useEffect(() => {
    if (isLoadingSession || !activeTurn) {
      return;
    }

    const animationFrame = window.requestAnimationFrame(() => {
      scrollChatCanvasToBottom("smooth");
    });

    return () => {
      window.cancelAnimationFrame(animationFrame);
    };
  }, [activeTurn?.question.id, isLoadingSession, scrollChatCanvasToBottom]);

  const waitLineIndex = Math.min(
    Math.floor(submitVisualElapsedMs / 1200),
    THESINATOR_WAIT_LINES.length - 1,
  );

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
      if (turns.length === 0) {
        return;
      }

      const nextTurns = [...turns];
      nextTurns[nextTurns.length - 1] = {
        ...nextTurns[nextTurns.length - 1],
        userAnswer: {
          text: trimmed,
          inputMode,
        },
      };
      setTurns(nextTurns);
      setIsSubmitting(true);

      try {
        const result = await sendThesinatorTurn({
          sessionId,
          questionId: activeQuestion.id,
          clientToken,
          userAnswer: trimmed,
          inputMode,
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
          return;
        }

        if (!result.next_question) {
          throw new Error("Thesinator did not return the next question.");
        }

        setTurns([
          ...nextTurns,
          {
            question: result.next_question,
            assistantMessage: result.assistant_reply,
            userAnswer: null,
          },
        ]);
      } catch (err) {
        const revertedTurns = [...nextTurns];
        revertedTurns[revertedTurns.length - 1] = {
          ...revertedTurns[revertedTurns.length - 1],
          userAnswer: null,
        };
        setTurns(revertedTurns);
        setError(err instanceof Error ? err.message : "Could not send answer.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [activeQuestion, clientToken, currentQuestionIndex, isComplete, isSubmitting, onComplete, playAudio, questions, sessionId, turns],
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

  const totalQuestions = questions.length > 0 ? questions.length : THESINATOR_QUESTION_COUNT;
  const answeredCount = answeredTurns.length;
  const progress = Math.min((answeredCount / totalQuestions) * 100, 100);
  const displayStep = isComplete ? totalQuestions : Math.min(currentQuestionIndex + 1, totalQuestions);

  const handleTextSubmit = () => {
    void submitAnswer(textInput, "text");
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[228px_minmax(0,1fr)]">
      <div className="flex flex-col items-center gap-3 xl:pt-2">
        <ThesinatorAvatar
          isTyping={isLoadingSessionVisual || isSubmittingVisual}
          isSpeaking={isSpeaking && !(isLoadingSessionVisual || isSubmittingVisual)}
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
          isLoadingSessionVisual ? (
            <StepGenieChatSkeleton showPulse />
          ) : (
            <StepGenieChatSkeleton showPulse={false} />
          )
        ) : (
          <div
            ref={chatCanvasRef}
            className="max-h-[68vh] space-y-4 overflow-y-auto pr-1 sm:max-h-[72vh]"
            data-testid="step-genie-chat-scroll-canvas"
          >
            {answeredTurns.length > 0 && (
              <div className="mb-4 space-y-3">
                {answeredTurns.map((turn) => (
                  <div
                    key={`answer-${turn.question.id}`}
                    className="rounded-[1.5rem] border border-border/70 bg-card/70 px-4 py-4 shadow-sm backdrop-blur-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-6 min-w-6 items-center justify-center rounded-full bg-primary/15 px-2 text-[10px] font-semibold tracking-[0.08em] text-primary">
                        Q{turn.question.id}
                      </div>
                      <div className="max-w-[90%] rounded-2xl rounded-bl-sm border border-primary/10 bg-background/80 px-4 py-3 shadow-sm">
                        <p className="ds-caption font-semibold tracking-[0.14em] text-primary">Thesinator</p>
                        <p className="mt-1 text-[0.94rem] leading-relaxed text-foreground whitespace-pre-wrap break-words">
                          {turn.question.question}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex justify-end">
                      <div className="max-w-[90%] rounded-2xl rounded-tr-sm bg-primary px-4 py-3 text-primary-foreground shadow-md">
                        <p className="ds-caption font-semibold tracking-[0.14em] text-primary-foreground/80">
                          You • {inputModeLabels[turn.userAnswer!.inputMode]}
                        </p>
                        <p className="mt-1 text-[0.94rem] leading-relaxed whitespace-pre-wrap break-words">
                          {turn.userAnswer!.text}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="rounded-[2rem] border border-border/50 bg-card/60 p-5 shadow-lg backdrop-blur-xl">
              {!isComplete && activeTurn && (
                <div
                  className={`space-y-5 transition-all duration-300 ease-out ${turnMotionClassName}`}
                  data-testid="step-genie-active-turn"
                  data-transitioning={isTurnTransitioning}
                >
                  <div className="rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/5 to-transparent px-5 py-4 shadow-sm backdrop-blur-md">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <p className="ds-caption font-semibold tracking-[0.14em] text-primary">Thesinator</p>
                    </div>
                    <p className="text-[1rem] leading-relaxed text-foreground">{activeTurn.assistantMessage}</p>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="mt-1 relative flex h-12 w-12 shrink-0 items-center justify-center rounded-[1.25rem] bg-foreground text-background shadow-md">
                      <span className="text-lg font-bold">Q{activeTurn.question.id}</span>
                      <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-card bg-primary" />
                    </div>
                    <div className="flex-1 rounded-[1.25rem] border border-border bg-background px-5 py-3 shadow-sm">
                      <p className="text-[1rem] font-medium leading-relaxed text-foreground">
                        {activeTurn.question.question}
                      </p>
                    </div>
                  </div>

                  {!isSubmittingVisual ? (
                    <>
                      <div className="grid gap-3 sm:grid-cols-2 mt-2">
                        {activeTurn.question.options.map((option) => {
                          const isSelectedMcq =
                            activeTurn.userAnswer?.inputMode === "mcq" && activeTurn.userAnswer.text === option;
                          return (
                            <button
                              key={option}
                              onClick={() => {
                                void submitAnswer(option, "mcq");
                              }}
                              disabled={isSubmitting || isComplete}
                              className={`w-full rounded-[1.25rem] border px-5 py-3.5 text-center text-[0.96rem] font-medium transition-all duration-200 active:scale-[0.98] ${
                                isSelectedMcq
                                  ? "border-primary bg-primary/10 text-primary shadow-sm"
                                  : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-accent hover:shadow-md hover:-translate-y-0.5"
                              } disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100 disabled:hover:translate-y-0 disabled:hover:shadow-none`}
                            >
                              {option}
                            </button>
                          );
                        })}
                      </div>

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

                      <div className="rounded-[1.5rem] border border-border/50 bg-background/80 p-2.5 shadow-md backdrop-blur-md transition-all focus-within:border-primary/50 focus-within:shadow-lg">
                        <div className="flex gap-2 items-center">
                          <input
                            type="text"
                            value={textInput}
                            onChange={(event) => setTextInput(event.target.value)}
                            onKeyDown={(event) => event.key === "Enter" && handleTextSubmit()}
                            placeholder="Or answer freely in your own words..."
                            disabled={isSubmitting || isComplete}
                            className="flex-1 bg-transparent px-4 py-2 text-base outline-none placeholder:text-muted-foreground"
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
                            <Send size={16} />
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div
                      ref={waitingTurnRef}
                      className="space-y-6 animate-in fade-in zoom-in-95 duration-300"
                    >
                      {activeTurn.userAnswer && (
                        <div className="flex justify-end mt-4">
                          <div className="max-w-[85%] rounded-[1.25rem] rounded-tr-sm bg-primary px-5 py-3.5 text-primary-foreground shadow-md">
                            <p className="text-[0.96rem] leading-relaxed">{activeTurn.userAnswer.text}</p>
                          </div>
                        </div>
                      )}
                      
                      <StepGenieTurnWaiting
                        lineIndex={waitLineIndex}
                        elapsedMs={submitVisualElapsedMs}
                        showPulse
                      />
                    </div>
                  )}
                </div>
              )}

              {isComplete && (
                <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {finalAssistantMessage && (
                    <div className="rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/5 to-transparent px-5 py-4 shadow-sm backdrop-blur-md">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        <p className="ds-caption font-semibold tracking-[0.14em] text-primary">Thesinator</p>
                      </div>
                      <p className="text-[1rem] leading-relaxed text-foreground">{finalAssistantMessage}</p>
                    </div>
                  )}
                  <div className="flex flex-col items-center justify-center rounded-[1.5rem] border border-primary/20 bg-primary/5 px-6 py-8 text-center shadow-sm backdrop-blur-md">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
                      <Check size={28} />
                    </div>
                    <p className="ds-title-cards text-foreground">Your answers are in</p>
                    <p className="ds-body mt-2 text-muted-foreground max-w-sm">
                      We've mapped your choices and have enough context to open your future view.
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
  const [futureView, setFutureView] = useState<FutureViewState | null>(null);
  const [activeFutureId, setActiveFutureId] = useState<string | null>(null);
  const [futureDetails, setFutureDetails] = useState<Record<string, FutureDetailResponse>>({});
  const [isRestoring, setIsRestoring] = useState(true);
  const [isCreatingFutureSession, setIsCreatingFutureSession] = useState(false);
  const [isChatSending, setIsChatSending] = useState(false);
  const [isGeneratedExpanded, setIsGeneratedExpanded] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [screenError, setScreenError] = useState<string | null>(null);

  const syncFutureView = useCallback((nextFutureView: FutureViewState) => {
    setFutureView((prev) => ({
      graph_build: stabilizeGraphBuild(prev?.graph_build ?? null, nextFutureView.graph_build),
      swarm: nextFutureView.swarm,
      finalization: nextFutureView.finalization,
    }));
    setFutureSession((prev) =>
      prev
        ? {
            ...prev,
            graph_build: stabilizeGraphBuild(prev.graph_build, nextFutureView.graph_build),
            swarm: nextFutureView.swarm,
            finalization: nextFutureView.finalization,
          }
        : prev,
    );
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
        setFutureView({
          graph_build: restored.graph_build,
          swarm: restored.swarm,
          finalization: restored.finalization,
        });
        const restoredActiveFutureId =
          readActiveFutureStorage(storedFutureSessionId) ?? restored.selected_future_id ?? null;
        if (restored.finalization.status === "ready" && restoredActiveFutureId) {
          const restoredDetail = await getFuture(storedFutureSessionId, restoredActiveFutureId);
          setFutureDetails({ [restoredActiveFutureId]: restoredDetail });
          setActiveFutureId(restoredActiveFutureId);
          setStage("detail");
        } else if (restored.finalization.status === "ready") {
          setStage("explore");
        } else {
          setActiveFutureId(null);
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

    const currentFutureView = futureView ?? {
      graph_build: futureSession.graph_build,
      swarm: futureSession.swarm,
      finalization: futureSession.finalization,
    };
    const isFutureViewSettled =
      (currentFutureView.graph_build.status === "ready" || currentFutureView.graph_build.status === "failed") &&
      (currentFutureView.swarm.status === "ready" || currentFutureView.swarm.status === "failed") &&
      (currentFutureView.finalization.status === "ready" || currentFutureView.finalization.status === "failed");
    if (isFutureViewSettled) {
      return;
    }

    let cancelled = false;

    const pollFutureView = async () => {
      try {
        const nextFutureView = await getFutureSessionFutureView(futureSession.future_session_id);
        if (!cancelled) {
          syncFutureView(nextFutureView);
        }
      } catch (error) {
        if (!cancelled) {
          setScreenError(error instanceof Error ? error.message : "Could not load your future view.");
        }
      }
    };

    void pollFutureView();
    const interval = window.setInterval(() => {
      void pollFutureView();
    }, 3500);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [futureSession, futureView, stage, syncFutureView]);

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
      setFutureView({
        graph_build: created.graph_build,
        swarm: created.swarm,
        finalization: created.finalization,
      });
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
      const finalizationStatus = futureView?.finalization.status ?? futureSession?.finalization.status;
      if (finalizationStatus !== "ready") {
        setScreenError("Thesis outcomes are still finalizing. Stay in See your future until everything is ready.");
        startTransition(() => setStage("build"));
        return;
      }
      if (futureSession) {
        writeActiveFutureStorage(futureSession.future_session_id, futureId);
      }
      setActiveFutureId(futureId);
      setChatInput("");
      startTransition(() => setStage("detail"));
      void hydrateFutureDetail(futureId);
    },
    [futureSession, futureView, hydrateFutureDetail],
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
    const finalizationStatus = futureView?.finalization.status ?? futureSession?.finalization.status;
    if (finalizationStatus !== "ready") {
      setScreenError("We’re still finalizing the swarm-backed thesis outcomes.");
      return;
    }
    startTransition(() => setStage("explore"));
  }, [futureSession, futureView]);

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
            swarm_impact: activeFuture.swarm_impact,
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
  const currentFutureView = futureView ?? (
    futureSession
      ? {
          graph_build: futureSession.graph_build,
          swarm: futureSession.swarm,
          finalization: futureSession.finalization,
        }
      : null
  );
  const currentGraphBuild = currentFutureView?.graph_build ?? null;
  const currentSwarm = currentFutureView?.swarm ?? null;
  const currentFinalization = currentFutureView?.finalization ?? null;
  const matchingNote = formatMatchingNote(discoverSummary?.matchingMeta ?? null);
  const currentStageIndex = stages.findIndex((item) => item.id === stage);
  const activeVisibleStage = stage === "detail" ? "explore" : stage;
  const currentVisibleStageIndex = visibleStages.findIndex((item) => item.id === activeVisibleStage);
  const reachableStages = useMemo(
    () => ({
      discover: true,
      build: Boolean(futureSession && currentGraphBuild && currentSwarm),
      explore: Boolean(futureSession && currentFinalization?.status === "ready"),
      detail: Boolean(futureSession && activeFuture && currentFinalization?.status === "ready"),
    }),
    [activeFuture, currentFinalization?.status, currentGraphBuild, currentSwarm, futureSession],
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
            <h1 className="ds-title-lg text-foreground">Thesinator</h1>
            <p className="ds-small mt-2 max-w-2xl text-muted-foreground">
              Meet your future self through your strongest thesis paths.
            </p>
          </div>
            <div className="flex min-w-0 gap-2 overflow-x-auto">
              {visibleStages.map((item, index) => {
                const isActive = item.id === activeVisibleStage;
                const isCompleted = currentVisibleStageIndex > index;
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

            {stage === "build" && futureSession && currentGraphBuild && currentSwarm && currentFinalization && (
              <BuildFutureStage
                futureSession={futureSession}
                graphBuild={currentGraphBuild}
                swarm={currentSwarm}
                finalization={currentFinalization}
                matchingNote={matchingNote}
                onContinue={handleContinueToExplore}
              />
            )}

            {stage === "explore" && futureSession && (
              <ExploreStage
                futureSession={futureSession}
                futureView={currentFutureView}
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

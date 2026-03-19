import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SwipeStack from "./SwipeStack";
import NetworkChat from "./NetworkChat";
import { fetchMatches, logSwipe } from "@/services/networking";
import { fetchProjects } from "@/services/data";
import type { PersonaMatch, ThesisProject } from "@/api/types";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  GraduationCap,
  Briefcase,
  Sparkles,
  ArrowRight,
  MessageSquare,
  Building2,
  ChevronRight,
  Loader2,
  Check,
  Trophy,
  TrendingUp,
  BarChart3,
  FileText,
} from "lucide-react";
import thesinatorThinking from "@/assets/thesinator-thinking.png";

const STUDENT_ID = import.meta.env.VITE_STUDENT_ID || "student-01";

// --- Step 1: Questionnaire ---

const personTypes = [
  { value: "mentor", label: "Mentor:in", icon: Users, desc: "Erfahrene Begleitung für deine Thesis" },
  { value: "professor", label: "Professor:in", icon: GraduationCap, desc: "Akademische Betreuung & Expertise" },
  { value: "expert", label: "Expert:in", icon: Briefcase, desc: "Branchen-Know-how & Praxisbezug" },
  { value: "alumni", label: "Alumni", icon: Sparkles, desc: "War in deiner Situation & hat's geschafft" },
];

const fields = [
  "Computer Science", "Data Science", "Artificial Intelligence",
  "Business Administration", "Finance", "Marketing",
  "Supply Chain Management", "Sustainability", "Mechanical Engineering",
  "Electrical Engineering", "Biotechnology", "Healthcare & Medicine",
  "Economics", "Law", "Psychology",
];

const goals = [
  "Thesis-Betreuung finden",
  "Karriere-Einstieg vorbereiten",
  "Forschungskontakte knüpfen",
  "Branchenwissen aufbauen",
  "Mentoring & Guidance",
];

interface QuestionnaireData {
  type: string;
  field: string;
  goal: string;
  details: string;
  topic_id?: string;
}

function StepQuestionnaire({ onSubmit }: { onSubmit: (data: QuestionnaireData) => void }) {
  const [type, setType] = useState("");
  const [field, setField] = useState("");
  const [customField, setCustomField] = useState("");
  const [goal, setGoal] = useState("");
  const [details, setDetails] = useState("");
  const [topicId, setTopicId] = useState<string | undefined>(undefined);
  const [projects, setProjects] = useState<ThesisProject[]>([]);

  useEffect(() => {
    fetchProjects(STUDENT_ID)
      .then((res) => {
        const active = res.projects.filter((p) =>
          ["proposed", "applied", "agreed", "in_progress"].includes(p.state)
        );
        setProjects(active);
      })
      .catch(() => {});
  }, []);

  const isValid = type && field && goal;

  return (
    <div className="max-w-2xl mx-auto w-full px-4">
      <div className="text-center mb-8">
        <h1 className="ds-title-lg text-foreground mb-2">Gini Connect</h1>
        <p className="ds-body text-muted-foreground">
          Finde die perfekten Kontakte für deine akademische Reise
        </p>
      </div>

      {/* Type selection */}
      <div className="mb-6">
        <h2 className="ds-label text-foreground mb-3">Wen suchst du?</h2>
        <div className="grid grid-cols-2 gap-3">
          {personTypes.map((pt) => (
            <button
              key={pt.value}
              onClick={() => setType(pt.value)}
              className={`flex flex-col items-start gap-2 p-4 rounded-xl border transition-all duration-200 text-left ${
                type === pt.value
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border bg-card hover:border-primary/30 hover:shadow-sm"
              }`}
            >
              <div className="flex items-center gap-2">
                <pt.icon size={18} className={type === pt.value ? "text-primary" : "text-muted-foreground"} />
                <span className="ds-label">{pt.label}</span>
              </div>
              <span className="ds-caption text-muted-foreground">{pt.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Field selection */}
      <div className="mb-6">
        <h2 className="ds-label text-foreground mb-3">In welchem Fachgebiet?</h2>
        <div className="flex flex-wrap gap-2">
          {fields.map((f) => (
            <button
              key={f}
              onClick={() => { setField(f); setCustomField(""); }}
              className={`px-3 py-1.5 rounded-full ds-small transition-all duration-200 ${
                field === f && !customField
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="mt-3">
          <input
            type="text"
            value={customField}
            onChange={(e) => {
              setCustomField(e.target.value);
              if (e.target.value.trim()) {
                setField(e.target.value.trim());
              }
            }}
            placeholder="Oder eigenes Fachgebiet eingeben..."
            className="w-full bg-card border border-input rounded-lg px-4 py-2.5 ds-small placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring/20"
          />
        </div>
      </div>

      {/* Goal selection */}
      <div className="mb-6">
        <h2 className="ds-label text-foreground mb-3">Was erhoffst du dir?</h2>
        <div className="flex flex-col gap-2">
          {goals.map((g) => (
            <button
              key={g}
              onClick={() => setGoal(g)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-200 text-left ${
                goal === g
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-primary/30"
              }`}
            >
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                goal === g ? "border-primary" : "border-muted-foreground"
              }`}>
                {goal === g && <div className="w-2 h-2 rounded-full bg-primary" />}
              </div>
              <span className="ds-small">{g}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Details */}
      <div className="mb-6">
        <h2 className="ds-label text-foreground mb-3">Noch Details? <span className="text-muted-foreground font-normal">(optional)</span></h2>
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="z.B. Ich interessiere mich besonders für NLP und suche jemanden mit Erfahrung in der Industrie..."
          className="w-full bg-card border border-input rounded-xl px-4 py-3 ds-small placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring/20 resize-none"
          rows={3}
        />
      </div>

      {/* Topic linking (only if projects exist) */}
      {projects.length > 0 && (
        <div className="mb-8">
          <h2 className="ds-label text-foreground mb-3">
            Thema verknüpfen? <span className="text-muted-foreground font-normal">(optional)</span>
          </h2>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setTopicId(undefined)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-200 text-left ${
                topicId === undefined
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-primary/30"
              }`}
            >
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                topicId === undefined ? "border-primary" : "border-muted-foreground"
              }`}>
                {topicId === undefined && <div className="w-2 h-2 rounded-full bg-primary" />}
              </div>
              <span className="ds-small text-muted-foreground">Kein Thema</span>
            </button>
            {projects.map((proj) => (
              <button
                key={proj.id}
                onClick={() => setTopicId(proj.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-200 text-left ${
                  topicId === proj.id
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-primary/30"
                }`}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  topicId === proj.id ? "border-primary" : "border-muted-foreground"
                }`}>
                  {topicId === proj.id && <div className="w-2 h-2 rounded-full bg-primary" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <FileText size={14} className="text-muted-foreground shrink-0" />
                    <span className="ds-small font-medium truncate">{proj.title}</span>
                  </div>
                  {proj.topic_title && (
                    <span className="ds-caption text-muted-foreground truncate block">{proj.topic_title}</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Submit */}
      <Button
        className="w-full rounded-xl py-6 ds-label gap-2"
        disabled={!isValid}
        onClick={() => onSubmit({ type, field, goal, details, topic_id: topicId })}
      >
        <Sparkles size={18} />
        Matches finden
        <ArrowRight size={18} />
      </Button>
    </div>
  );
}

// --- Step 2: Loading ---

function StepLoading() {
  const messages = [
    "Analysiere dein Profil...",
    "Suche passende Kontakte...",
    "Berechne Compatibility-Scores...",
    "Generiere personalisierte Matches...",
  ];
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % messages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-4">
      {/* Animated thinking Gini */}
      <div className="relative animate-genie-float">
        <img src={thesinatorThinking} alt="Gini denkt nach" className="h-40 w-40 object-contain" />
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-[hsl(var(--ai-from))] animate-sparkle"
            style={{
              top: `${[5, -5, 60, 90][i]}%`,
              left: `${[-10, 40, 105, -5][i]}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      <div className="text-center">
        <h2 className="ds-title-sm text-foreground mb-2">Gini sucht für dich...</h2>
        <AnimatePresence mode="wait">
          <motion.p
            key={msgIndex}
            className="ds-body text-muted-foreground"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {messages[msgIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      <Loader2 size={24} className="text-muted-foreground animate-spin" />
    </div>
  );
}

// --- Step 3: Evaluation ---

function StepEvaluation({
  connected,
  skipped,
  onContinue,
}: {
  connected: PersonaMatch[];
  skipped: PersonaMatch[];
  onContinue: () => void;
}) {
  const total = connected.length + skipped.length;
  const connectRate = total > 0 ? Math.round((connected.length / total) * 100) : 0;

  const allSwiped = [...connected, ...skipped];
  const weightedScore = (p: PersonaMatch) =>
    Math.round(p.scores.fit * 0.4 + p.scores.future_benefit * 0.35 + p.scores.rating * 0.25);

  const avgScore =
    allSwiped.length > 0
      ? Math.round(allSwiped.reduce((sum, p) => sum + weightedScore(p), 0) / allSwiped.length)
      : 0;

  // Score distribution
  const buckets = [
    { label: "90+", count: allSwiped.filter((p) => weightedScore(p) >= 90).length },
    { label: "80-89", count: allSwiped.filter((p) => weightedScore(p) >= 80 && weightedScore(p) < 90).length },
    { label: "70-79", count: allSwiped.filter((p) => weightedScore(p) >= 70 && weightedScore(p) < 80).length },
    { label: "60-69", count: allSwiped.filter((p) => weightedScore(p) >= 60 && weightedScore(p) < 70).length },
    { label: "<60", count: allSwiped.filter((p) => weightedScore(p) < 60).length },
  ];
  const maxBucket = Math.max(...buckets.map((b) => b.count), 1);

  // Top match
  const topMatch = connected.length > 0
    ? connected.reduce((best, p) => (weightedScore(p) > weightedScore(best) ? p : best))
    : null;

  return (
    <div className="max-w-2xl mx-auto w-full px-4 py-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[hsl(var(--ai-from))] to-[hsl(var(--ai-to))] flex items-center justify-center text-white mx-auto mb-4">
            <BarChart3 size={28} />
          </div>
          <h1 className="ds-title-lg text-foreground mb-2">Deine Auswertung</h1>
          <p className="ds-body text-muted-foreground">So hast du gematcht</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="p-4 text-center">
            <p className="ds-title-md text-foreground">{total}</p>
            <p className="ds-caption text-muted-foreground">Profile gesehen</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="ds-title-md text-[hsl(var(--ai-from))]">{connected.length}</p>
            <p className="ds-caption text-muted-foreground">Connected</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="ds-title-md text-muted-foreground">{skipped.length}</p>
            <p className="ds-caption text-muted-foreground">Übersprungen</p>
          </Card>
        </div>

        {/* Connect Rate */}
        <Card className="p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="ds-label text-foreground flex items-center gap-2">
              <TrendingUp size={16} className="text-[hsl(var(--ai-from))]" />
              Connect-Rate
            </span>
            <span className="ds-label text-[hsl(var(--ai-from))]">{connectRate}%</span>
          </div>
          <Progress value={connectRate} className="h-2" />
        </Card>

        {/* Avg Score */}
        <Card className="p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="ds-label text-foreground">Ø Gesamtscore</span>
            <span className="ds-label text-foreground">{avgScore}/100</span>
          </div>
          <Progress value={avgScore} className="h-2" />
          <p className="ds-caption text-muted-foreground mt-1">Gewichtet: 40% Fit · 35% Future · 25% Rating</p>
        </Card>

        {/* Score Distribution */}
        <Card className="p-4 mb-4">
          <h3 className="ds-label text-foreground mb-3 flex items-center gap-2">
            <BarChart3 size={16} />
            Score-Verteilung
          </h3>
          <div className="space-y-2">
            {buckets.map((bucket) => (
              <div key={bucket.label} className="flex items-center gap-3">
                <span className="ds-caption text-muted-foreground w-12 text-right">{bucket.label}</span>
                <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-[hsl(var(--ai-from))] to-[hsl(var(--ai-to))]"
                    initial={{ width: 0 }}
                    animate={{ width: `${(bucket.count / maxBucket) * 100}%` }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  />
                </div>
                <span className="ds-badge text-foreground w-6 text-right">{bucket.count}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Match Highlight */}
        {topMatch && (
          <Card className="p-4 mb-6 border-[hsl(var(--ai-from))]/30 bg-gradient-to-br from-[hsl(var(--ai-from)/0.05)] to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[hsl(var(--ai-from))] to-[hsl(var(--ai-to))] flex items-center justify-center text-white font-semibold shrink-0">
                {topMatch.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Trophy size={14} className="text-yellow-500" />
                  <span className="ds-badge text-[hsl(var(--ai-from))]">Top-Match</span>
                </div>
                <h3 className="ds-label text-foreground truncate">{topMatch.name}</h3>
                <span className="ds-caption text-muted-foreground truncate">
                  {topMatch.title} · {topMatch.institution}
                </span>
              </div>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-[hsl(var(--ai-from))] to-[hsl(var(--ai-to))] text-white font-bold text-lg">
                {weightedScore(topMatch)}
              </div>
            </div>
          </Card>
        )}

        {/* Continue button */}
        <Button className="w-full rounded-xl py-6 ds-label gap-2" onClick={onContinue}>
          Weiter zu deinen Connections
          <ArrowRight size={18} />
        </Button>
      </motion.div>
    </div>
  );
}

// --- Step 4: Connected overview ---

function StepConnected({
  connected,
  sessionId,
  onChatOpen,
  onSearchAgain,
}: {
  connected: PersonaMatch[];
  sessionId: string;
  onChatOpen: (persona: PersonaMatch) => void;
  onSearchAgain?: () => void;
}) {
  if (connected.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 px-4">
        <Users size={48} className="text-muted-foreground" />
        <h2 className="ds-title-sm text-foreground">Keine Connections</h2>
        <p className="ds-body text-muted-foreground text-center">
          Du hast noch keine Personen connected. Geh zurück und swipe nach rechts!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto w-full px-4">
      <div className="text-center mb-6">
        <h2 className="ds-title-md text-foreground mb-1">
          {connected.length} Connection{connected.length !== 1 ? "s" : ""}!
        </h2>
        <p className="ds-body text-muted-foreground">
          Chatte direkt mit deinen Connections — Gini coacht dich im Hintergrund
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {connected.map((persona) => (
          <Card
            key={persona.name}
            className="flex items-center gap-4 p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onChatOpen(persona)}
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[hsl(var(--ai-from))] to-[hsl(var(--ai-to))] flex items-center justify-center text-white font-semibold shrink-0">
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
              <div className="flex gap-1 mt-1">
                {persona.field_badges.slice(0, 2).map((b) => (
                  <Badge key={b} variant="secondary" className="ds-badge text-[11px]">{b}</Badge>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-1 text-[hsl(var(--ai-from))]">
                <MessageSquare size={16} />
                <span className="ds-badge">Chat</span>
              </div>
              <ChevronRight size={16} className="text-muted-foreground" />
            </div>
          </Card>
        ))}
      </div>

      {onSearchAgain && (
        <div className="mt-6 text-center">
          <Button variant="outline" className="rounded-xl gap-2" onClick={onSearchAgain}>
            <Sparkles size={16} />
            Neue Matches generieren
          </Button>
        </div>
      )}
    </div>
  );
}

// --- Main NetworkFlow ---

type FlowStep = "questionnaire" | "loading" | "swiping" | "evaluation" | "connected" | "chat";

interface NetworkFlowProps {
  onConnectionsChange?: (personas: PersonaMatch[]) => void;
  onSessionIdChange?: (sessionId: string) => void;
}

export default function NetworkFlow({ onConnectionsChange, onSessionIdChange }: NetworkFlowProps = {}) {
  const [step, setStep] = useState<FlowStep>("questionnaire");
  const [matches, setMatches] = useState<PersonaMatch[]>([]);
  const [connected, setConnected] = useState<PersonaMatch[]>([]);
  const [skipped, setSkipped] = useState<PersonaMatch[]>([]);
  const [sessionId, setSessionId] = useState<string>("");
  const [chatPersona, setChatPersona] = useState<PersonaMatch | null>(null);
  const [questionnaireData, setQuestionnaireData] = useState<QuestionnaireData | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup AbortController on unmount
  useEffect(() => {
    return () => { abortControllerRef.current?.abort(); };
  }, []);

  const handleQuestionnaireSubmit = useCallback(async (data: QuestionnaireData) => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setQuestionnaireData(data);
    setStep("loading");
    try {
      const res = await fetchMatches({
        student_id: STUDENT_ID,
        type: data.type,
        field: data.field,
        goal: data.goal,
        details: data.details,
      });
      if (controller.signal.aborted) return;
      setMatches(res.matches);
      setSessionId(res.session_id);
      onSessionIdChange?.(res.session_id);
      setStep("swiping");
    } catch (err) {
      if (controller.signal.aborted) return;
      console.error("Failed to generate matches:", err);
      toast.warning("Backend nicht erreichbar — Demo-Modus aktiv");
      setMatches(generateFallbackMatches(data));
      setSessionId("fallback-session");
      onSessionIdChange?.("fallback-session");
      setStep("swiping");
    }
  }, []);

  const handleSwipeAction = useCallback(
    (persona: PersonaMatch, action: "skip" | "connect") => {
      if (sessionId && sessionId !== "fallback-session") {
        logSwipe({ session_id: sessionId, persona_name: persona.name, action }).catch(() => {});
      }
    },
    [sessionId]
  );

  const handleSwipeComplete = useCallback(
    (connectedPersonas: PersonaMatch[], skippedPersonas: PersonaMatch[]) => {
      let finalConnected = connectedPersonas;
      if (connectedPersonas.length === 0 && questionnaireData) {
        finalConnected = [generatePerfectMatch(questionnaireData)];
        toast.success("Gini hat jemanden Spezielles für dich gefunden!", { icon: "✨" });
      }
      setConnected(finalConnected);
      setSkipped(skippedPersonas);
      onConnectionsChange?.(finalConnected);
      setStep("evaluation");
    },
    [onConnectionsChange, questionnaireData]
  );

  const handleChatOpen = useCallback((persona: PersonaMatch) => {
    setChatPersona(persona);
    setStep("chat");
  }, []);

  const handleChatBack = useCallback(() => {
    setChatPersona(null);
    setStep("connected");
  }, []);

  const handleSearchAgain = useCallback(() => {
    setMatches([]);
    setConnected([]);
    setSkipped([]);
    setQuestionnaireData(null);
    setStep("questionnaire");
  }, []);

  return (
    <div className="flex flex-col h-full w-full">
      {/* Step progress */}
      {step !== "chat" && (
        <div className="flex items-center justify-center gap-2 py-4 px-4">
          {(["questionnaire", "loading", "swiping", "evaluation", "connected"] as FlowStep[]).map((s, i) => {
            const stepLabels = ["Fragebogen", "AI-Matching", "Swipen", "Auswertung", "Connections"];
            const stepOrder = ["questionnaire", "loading", "swiping", "evaluation", "connected"];
            const currentIdx = stepOrder.indexOf(step);
            const thisIdx = i;
            const isDone = thisIdx < currentIdx;
            const isCurrent = thisIdx === currentIdx;
            const isClickable = isDone && s !== "loading";

            return (
              <div key={s} className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={!isClickable}
                  onClick={() => isClickable && setStep(s)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-colors ${
                    isCurrent
                      ? "bg-primary text-primary-foreground"
                      : isDone
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  } ${isClickable ? "cursor-pointer hover:bg-primary/20" : ""}`}
                >
                  {isDone ? <Check size={12} /> : <span className="ds-badge">{i + 1}</span>}
                  <span className="ds-badge hidden sm:inline">{stepLabels[i]}</span>
                </button>
                {i < 4 && (
                  <div className={`w-8 h-0.5 rounded ${isDone ? "bg-primary" : "bg-border"}`} />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            className="h-full"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {step === "questionnaire" && <StepQuestionnaire onSubmit={handleQuestionnaireSubmit} />}
            {step === "loading" && <StepLoading />}
            {step === "swiping" && (
              <div className="py-4">
                <SwipeStack
                  matches={matches}
                  onSwipeComplete={handleSwipeComplete}
                  onSwipeAction={handleSwipeAction}
                />
              </div>
            )}
            {step === "evaluation" && (
              <StepEvaluation
                connected={connected}
                skipped={skipped}
                onContinue={() => setStep("connected")}
              />
            )}
            {step === "connected" && (
              <StepConnected
                connected={connected}
                sessionId={sessionId}
                onChatOpen={handleChatOpen}
                onSearchAgain={handleSearchAgain}
              />
            )}
            {step === "chat" && chatPersona && (
              <NetworkChat
                persona={chatPersona}
                parentSessionId={sessionId}
                onBack={handleChatBack}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// --- Fallback mock matches (when backend is unavailable) ---

function generateFallbackMatches(data: QuestionnaireData): PersonaMatch[] {
  const mockMatches: PersonaMatch[] = [
    {
      name: "Prof. Dr. Sarah Müller",
      title: "Professorin für Machine Learning",
      institution: "ETH Zürich",
      type: "professor",
      field_badges: [data.field, "Machine Learning", "Deep Learning"],
      research_focus: "Forschung an erklärbarer KI und fairem maschinellem Lernen",
      bio: "Seit 12 Jahren an der ETH, vorher Google DeepMind. Betreut jährlich 8-10 Masterarbeiten mit Industriebezug.",
      scores: { fit: 92, future_benefit: 85, rating: 95 },
      match_reason: `Passt zu dir weil sie in ${data.field} forscht und starke Industrieverbindungen hat`,
      benefit_description: "Das bringt dir Zugang zu aktueller Forschung und einem starken Netzwerk in der Tech-Branche",
    },
    {
      name: "Dr. Marco Bernasconi",
      title: "Senior Data Scientist & Mentor",
      institution: "Swiss Re",
      type: "mentor",
      field_badges: [data.field, "Data Science", "Insurance Tech"],
      research_focus: "Angewandte KI in der Versicherungsindustrie",
      bio: "ETH-Alumnus, 8 Jahre in der Industrie. Engagierter Mentor für Studierende, die den Sprung in die Praxis wagen.",
      scores: { fit: 78, future_benefit: 91, rating: 88 },
      match_reason: `Passt zu dir weil er den Übergang von der Uni in die Industrie im Bereich ${data.field} selbst gemeistert hat`,
      benefit_description: "Das bringt dir praxisnahe Karriere-Insights und ein Netzwerk in der Schweizer Tech-Szene",
    },
    {
      name: "Prof. Dr. Lisa Wegener",
      title: "Assistenzprofessorin für Digital Innovation",
      institution: "Universität St. Gallen (HSG)",
      type: "professor",
      field_badges: ["Digital Transformation", data.field, "Innovation"],
      research_focus: "Digitale Transformation in traditionellen Branchen",
      bio: "Junge Professorin mit Startup-Erfahrung. Bekannt für praxisnahe Thesis-Themen und starkes Engagement.",
      scores: { fit: 86, future_benefit: 79, rating: 82 },
      match_reason: "Passt zu dir weil sie innovative, praxisnahe Thesis-Themen vergibt und eng mit Startups arbeitet",
      benefit_description: "Das bringt dir eine moderne Betreuung mit Entrepreneurship-Fokus",
    },
    {
      name: "Anna Kowalski",
      title: "Alumni & Product Manager",
      institution: "Spotify (Zürich)",
      type: "alumni",
      field_badges: [data.field, "Product Management", "UX"],
      research_focus: "User Experience und datengetriebene Produktentwicklung",
      bio: "Hat vor 2 Jahren ihre Masterarbeit in einem ähnlichen Bereich geschrieben. Jetzt PM bei Spotify Zürich.",
      scores: { fit: 71, future_benefit: 88, rating: 76 },
      match_reason: `Passt zu dir weil sie erst kürzlich in deiner Situation war und jetzt bei einem Top-Unternehmen arbeitet`,
      benefit_description: "Das bringt dir einen realistischen Einblick in den Karriereweg nach der Thesis",
    },
    {
      name: "Dr. Thomas Huber",
      title: "Head of Research",
      institution: "Roche Diagnostics",
      type: "expert",
      field_badges: ["Life Sciences", data.field, "R&D Management"],
      research_focus: "Leitung von Forschungsprojekten an der Schnittstelle von Technologie und Gesundheitswesen",
      bio: "20 Jahre Erfahrung in der Pharmabranche. Sucht aktiv Kooperationen mit Universitäten für innovative Projekte.",
      scores: { fit: 65, future_benefit: 82, rating: 93 },
      match_reason: "Passt zu dir weil er interdisziplinäre Projekte betreut und ein starkes Industrie-Netzwerk hat",
      benefit_description: "Das bringt dir Zugang zur pharmazeutischen Forschung und mögliche Thesis-Kooperationen",
    },
    {
      name: "Prof. Dr. Elena Rossi",
      title: "Ordentliche Professorin",
      institution: "EPFL Lausanne",
      type: "professor",
      field_badges: [data.field, "Computational Methods", "Simulation"],
      research_focus: "Numerische Methoden und computergestützte Modellierung komplexer Systeme",
      bio: "Internationale Top-Forscherin mit ERC Grant. Ihre Gruppe publiziert regelmässig in Nature-Journals.",
      scores: { fit: 88, future_benefit: 76, rating: 97 },
      match_reason: `Passt zu dir weil sie in ${data.field} zu den führenden Forscherinnen in Europa gehört`,
      benefit_description: "Das bringt dir Zugang zu Spitzenforschung und internationale Sichtbarkeit",
    },
    {
      name: "David Meier",
      title: "Gründer & CTO",
      institution: "NovaMind AI (Startup)",
      type: "mentor",
      field_badges: [data.field, "Entrepreneurship", "AI Engineering"],
      research_focus: "Aufbau von KI-Produkten von der Idee bis zum Markteintritt",
      bio: "ETHZ-Dropout, 3x Gründer. Sein aktuelles Startup hat gerade eine Series-A abgeschlossen.",
      scores: { fit: 62, future_benefit: 94, rating: 79 },
      match_reason: "Passt zu dir weil er zeigt, wie man akademisches Wissen in erfolgreiche Produkte verwandelt",
      benefit_description: "Das bringt dir Startup-Mentoring und ein unkonventionelles Netzwerk in der Gründerszene",
    },
    {
      name: "Dr. Sophie Laurent",
      title: "Research Fellow",
      institution: "ZHAW Winterthur",
      type: "expert",
      field_badges: [data.field, "Applied Research", "Sustainability"],
      research_focus: "Anwendungsorientierte Forschung mit Fokus auf nachhaltige Technologien",
      bio: "Verbindet akademische Rigorosität mit praktischer Relevanz. Kooperiert eng mit KMUs in der Region.",
      scores: { fit: 74, future_benefit: 70, rating: 85 },
      match_reason: "Passt zu dir weil sie praxisnahe Forschungsprojekte mit Nachhaltigkeitsfokus betreut",
      benefit_description: "Das bringt dir anwendungsnahe Forschungserfahrung und KMU-Kontakte",
    },
  ];

  return mockMatches;
}

function generatePerfectMatch(data: QuestionnaireData): PersonaMatch {
  const variants: Record<string, { name: string; title: string; institution: string; bio: string }> = {
    mentor: {
      name: "Dr. Katrin Meier",
      title: "Senior Researcher & Mentorin",
      institution: "ETH Zürich",
      bio: "15 Jahre Erfahrung in der Betreuung von Studierenden. Bekannt für ihre offene Art und praxisnahe Begleitung.",
    },
    professor: {
      name: "Prof. Dr. Michael Brunner",
      title: "Ordentlicher Professor",
      institution: "Universität Zürich",
      bio: "Leitet eine der aktivsten Forschungsgruppen im DACH-Raum. Betreut jährlich 6-8 Masterarbeiten mit starkem Praxisbezug.",
    },
    expert: {
      name: "Sandra Keller",
      title: "Head of Innovation",
      institution: "Swisscom Digital Lab",
      bio: "10 Jahre Industrieerfahrung, baut Brücken zwischen Forschung und Praxis. Aktive Speakerin an Hochschulen.",
    },
    alumni: {
      name: "Lukas Fischer",
      title: "Alumni & Senior Engineer",
      institution: "Google Zürich",
      bio: "Hat vor 3 Jahren seine Masterarbeit abgeschlossen und den Sprung in die Tech-Industrie geschafft. Engagierter Alumni-Mentor.",
    },
  };

  const v = variants[data.type] || variants.mentor;

  return {
    name: v.name,
    title: v.title,
    institution: v.institution,
    type: data.type as PersonaMatch["type"],
    field_badges: [data.field, "Interdisziplinär", "Networking"],
    research_focus: `Expertise in ${data.field} mit Fokus auf ${data.goal}`,
    bio: v.bio,
    scores: { fit: 95, future_benefit: 90, rating: 88 },
    match_reason: `Passt perfekt zu dir weil ${data.field} genau ${v.name.split(" ").pop()}s Spezialgebiet ist und ${data.goal} zu den Kernthemen gehört`,
    benefit_description: `Das bringt dir direkten Zugang zu Expertise in ${data.field} und Unterstützung bei deinem Ziel: ${data.goal}`,
  };
}

import { useState, useEffect } from "react";
import { Check, ArrowRight, ArrowLeft, Send, Sparkles, FileText, MessageSquare, Eye, PartyPopper, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChatMessageList } from "@/components/ChatMessageList";
import { useChatSession } from "@/hooks/use-chat-session";

const steps = [
  { id: 1, label: "Deine Idee" },
  { id: 2, label: "KI-Verfeinerung" },
  { id: 3, label: "Metadaten" },
  { id: 4, label: "Veröffentlichen" },
];

const fieldOptions = [
  "Informatik", "Wirtschaftsinformatik", "BWL", "VWL", "Maschinenbau",
  "Elektrotechnik", "Psychologie", "Soziologie", "Medizin", "Jura",
  "Physik", "Mathematik", "Chemie", "Biologie", "Architektur",
  "Philosophie", "Politikwissenschaft", "Kommunikationswissenschaft",
  "Pädagogik", "Sonstiges",
];

interface ThesisMetadata {
  field: string;
  type: string;
  language: string;
  duration: string;
  compensated: boolean;
  restrictions: string;
  tags: string[];
}

const ThesisProposal = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [thesisTitle, setThesisTitle] = useState("");
  const [thesisDescription, setThesisDescription] = useState("");
  const [metadata, setMetadata] = useState<ThesisMetadata>({
    field: "",
    type: "master",
    language: "deutsch",
    duration: "",
    compensated: false,
    restrictions: "",
    tags: [],
  });

  return (
    <div className="flex-1 min-h-screen w-full min-w-0">
      {/* Header + Progress bar combined with single border */}
      <header className="border-b border-border">
        <div className="mx-auto w-full max-w-[1400px] px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="ds-title-lg">Eigene Thesis vorschlagen</h1>
          <p className="ds-small text-muted-foreground mt-1">Verfeinere dein Thema mit KI und stelle es live</p>
        </div>

        {/* Progress bar inside header */}
        <div className="mx-auto w-full max-w-[1400px] px-4 pb-6 sm:px-6 lg:px-8">
          <div className="overflow-x-auto">
            <div className="flex min-w-[480px] items-center justify-between">
              {steps.map((step, i) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ds-label transition-all duration-300 ${
                        step.id < currentStep
                          ? "bg-primary text-primary-foreground"
                          : step.id === currentStep
                            ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {step.id < currentStep ? <Check size={18} /> : step.id}
                    </div>
                    <span className={`ds-caption mt-2 ${step.id <= currentStep ? "text-foreground" : "text-muted-foreground"}`}>
                      {step.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className={`w-16 h-0.5 mx-2 mt-[-20px] transition-colors duration-300 ${
                        step.id < currentStep ? "bg-primary" : "bg-border"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Step content */}
      <main className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8 animate-fade-in" key={currentStep}>
        {currentStep === 1 && (
          <StepIdea
            thesisTitle={thesisTitle}
            setThesisTitle={setThesisTitle}
            thesisDescription={thesisDescription}
            setThesisDescription={setThesisDescription}
            field={metadata.field}
            setField={(f) => setMetadata((m) => ({ ...m, field: f }))}
            onNext={() => setCurrentStep(2)}
          />
        )}
        {currentStep === 2 && (
          <StepRefinement
            thesisTitle={thesisTitle}
            thesisDescription={thesisDescription}
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
          />
        )}
        {currentStep === 3 && (
          <StepMetadata
            metadata={metadata}
            setMetadata={setMetadata}
            onNext={() => setCurrentStep(4)}
            onBack={() => setCurrentStep(2)}
          />
        )}
        {currentStep === 4 && (
          <StepPublish
            thesisTitle={thesisTitle}
            thesisDescription={thesisDescription}
            metadata={metadata}
            onBack={() => setCurrentStep(3)}
          />
        )}
      </main>
    </div>
  );
};

/* ─── Step 1: Thesis Idea ─── */
const StepIdea = ({
  thesisTitle, setThesisTitle,
  thesisDescription, setThesisDescription,
  field, setField,
  onNext,
}: {
  thesisTitle: string; setThesisTitle: (v: string) => void;
  thesisDescription: string; setThesisDescription: (v: string) => void;
  field: string; setField: (v: string) => void;
  onNext: () => void;
}) => {
  const canContinue = thesisTitle.trim().length > 3 && thesisDescription.trim().length > 20;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <FileText size={24} className="text-primary" />
        <h2 className="ds-title-md">Deine Thesis-Idee</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="ds-label text-foreground mb-2 block">Arbeitstitel *</label>
          <input
            type="text"
            value={thesisTitle}
            onChange={(e) => setThesisTitle(e.target.value)}
            placeholder="z.B. Einfluss von KI auf die Personalauswahl in KMUs"
            className="w-full bg-card ds-body outline-none placeholder:text-muted-foreground px-4 py-3 rounded-lg border border-input focus:ring-2 focus:ring-ring/20"
          />
        </div>

        <div>
          <label className="ds-label text-foreground mb-2 block">Beschreibung / Exposé / Fragestellung *</label>
          <textarea
            value={thesisDescription}
            onChange={(e) => setThesisDescription(e.target.value)}
            placeholder="Beschreibe deine Thesis-Idee. Was ist die zentrale Fragestellung? Welches Problem möchtest du lösen? Was motiviert dich?"
            rows={8}
            className="w-full bg-card ds-body outline-none placeholder:text-muted-foreground px-4 py-3 rounded-lg border border-input focus:ring-2 focus:ring-ring/20 resize-y"
          />
          <p className="ds-caption text-muted-foreground mt-1">
            {thesisDescription.length < 20
              ? `Mindestens 20 Zeichen (${thesisDescription.length}/20)`
              : `${thesisDescription.length} Zeichen`}
          </p>
        </div>

        <div>
          <label className="ds-label text-foreground mb-2 block">Fachgebiet (optional)</label>
          <select
            value={field}
            onChange={(e) => setField(e.target.value)}
            className="w-full bg-card ds-body outline-none px-4 py-3 rounded-lg border border-input focus:ring-2 focus:ring-ring/20"
          >
            <option value="">-- Fachgebiet wählen --</option>
            {fieldOptions.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
      </div>

      <Button
        onClick={onNext}
        disabled={!canContinue}
        className="mt-8 rounded-full gap-2"
      >
        Weiter zur KI-Verfeinerung <ArrowRight size={16} />
      </Button>
    </div>
  );
};

/* ─── Step 2: AI Refinement Chat ─── */
const StepRefinement = ({
  thesisTitle,
  thesisDescription,
  onNext,
  onBack,
}: {
  thesisTitle: string;
  thesisDescription: string;
  onNext: () => void;
  onBack: () => void;
}) => {
  const chat = useChatSession("thesis_proposal");
  const [textInput, setTextInput] = useState("");
  const [showFinalize, setShowFinalize] = useState(false);
  const [chatMinimized, setChatMinimized] = useState(false);

  useEffect(() => {
    chat.startSession({
      thesis_title: thesisTitle,
      thesis_description: thesisDescription,
    });
  }, []);

  // Unlock finalize after 1 user message (instead of 2)
  useEffect(() => {
    const userMsgCount = chat.messages.filter((m) => m.role === "user").length;
    if (userMsgCount >= 1) setShowFinalize(true);
  }, [chat.messages]);

  // Timeout: if no greeting after 15s, mark as disconnected
  useEffect(() => {
    if (chat.isConnected !== null) return;
    const timer = setTimeout(() => {
      if (chat.isConnected === null) {
        // Force fallback — session creation is hanging
        chat.startSession({
          thesis_title: thesisTitle,
          thesis_description: thesisDescription,
        });
      }
    }, 15000);
    return () => clearTimeout(timer);
  }, [chat.isConnected]);

  const handleSend = () => {
    if (!textInput.trim()) return;
    chat.sendMessage(textInput);
    setTextInput("");
  };

  if (chat.isConnected === null || chat.isLoading) {
    return (
      <div className="flex flex-col items-center gap-4 py-12">
        <span className="inline-flex gap-1.5">
          <span className="w-3 h-3 bg-primary rounded-full animate-bounce" />
          <span className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
          <span className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
        </span>
        <p className="ds-small text-muted-foreground">Gini bereitet sich vor...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles size={24} className="text-ai-from" />
        <h2 className="ds-title-md">KI-Verfeinerung</h2>
      </div>

      <div className="bg-card border border-border rounded-lg px-4 py-3 mb-4">
        <p className="ds-caption text-muted-foreground">Dein Arbeitstitel:</p>
        <p className="ds-body text-foreground font-medium">{thesisTitle}</p>
      </div>

      {chat.isConnected ? (
        chatMinimized ? (
          /* Minimized: floating pill button */
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setChatMinimized(false)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <MessageSquare size={16} />
              <span className="ds-small font-medium">Chat öffnen</span>
              {chat.messages.length > 0 && (
                <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-primary-foreground text-primary text-[11px] font-semibold">
                  {chat.messages.length}
                </span>
              )}
            </button>
          </div>
        ) : (
          /* Expanded chat */
          <div className="flex flex-col border border-border rounded-lg overflow-hidden" style={{ minHeight: "400px" }}>
            {/* Chat header with minimize button */}
            <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
              <span className="ds-small font-medium text-foreground flex items-center gap-2">
                <MessageSquare size={14} />
                Chat mit Gini
              </span>
              <button
                onClick={() => setChatMinimized(true)}
                className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                title="Chat minimieren"
              >
                <Minus size={16} />
              </button>
            </div>

            <ChatMessageList
              messages={chat.messages}
              className="mb-0 max-h-[400px] px-4 py-3"
            />

            <div className="border-t border-border bg-card p-3 flex gap-2">
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Schreib deine Antwort..."
                className="flex-1 bg-transparent ds-body outline-none placeholder:text-muted-foreground px-3 py-2 rounded-full border border-input focus:ring-2 focus:ring-ring/20"
              />
              <Button
                onClick={handleSend}
                size="icon"
                className="rounded-full shrink-0"
                disabled={chat.isStreaming || !chat.sessionId}
              >
                <Send size={16} />
              </Button>
            </div>
          </div>
        )
      ) : (
        <div className="bg-muted rounded-lg p-6 text-center">
          <p className="ds-body text-muted-foreground">
            KI gerade nicht verfügbar — du kannst trotzdem fortfahren und deine Thesis manuell verfeinern.
          </p>
        </div>
      )}

      <div className="flex items-center gap-3 mt-6">
        <Button variant="outline" onClick={onBack} className="rounded-full gap-2">
          <ArrowLeft size={16} /> Zurück
        </Button>
        {showFinalize || !chat.isConnected ? (
          <Button onClick={onNext} className="rounded-full gap-2 animate-fade-in">
            Thesis finalisieren <ArrowRight size={16} />
          </Button>
        ) : (
          <button
            onClick={onNext}
            className="ds-small text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
          >
            Überspringen
          </button>
        )}
      </div>
    </div>
  );
};

/* ─── Step 3: Metadata ─── */
const StepMetadata = ({
  metadata,
  setMetadata,
  onNext,
  onBack,
}: {
  metadata: ThesisMetadata;
  setMetadata: React.Dispatch<React.SetStateAction<ThesisMetadata>>;
  onNext: () => void;
  onBack: () => void;
}) => {
  const [tagInput, setTagInput] = useState("");

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !metadata.tags.includes(tag)) {
      setMetadata((m) => ({ ...m, tags: [...m.tags, tag] }));
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setMetadata((m) => ({ ...m, tags: m.tags.filter((t) => t !== tag) }));
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare size={24} className="text-primary" />
        <h2 className="ds-title-md">Metadaten</h2>
      </div>

      <div className="space-y-5">
        {!metadata.field && (
          <div>
            <label className="ds-label text-foreground mb-2 block">Fachgebiet *</label>
            <select
              value={metadata.field}
              onChange={(e) => setMetadata((m) => ({ ...m, field: e.target.value }))}
              className="w-full bg-card ds-body outline-none px-4 py-3 rounded-lg border border-input focus:ring-2 focus:ring-ring/20"
            >
              <option value="">-- Fachgebiet wählen --</option>
              {fieldOptions.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="ds-label text-foreground mb-2 block">Typ</label>
            <select
              value={metadata.type}
              onChange={(e) => setMetadata((m) => ({ ...m, type: e.target.value }))}
              className="w-full bg-card ds-body outline-none px-4 py-3 rounded-lg border border-input focus:ring-2 focus:ring-ring/20"
            >
              <option value="bachelor">Bachelorarbeit</option>
              <option value="master">Masterarbeit</option>
              <option value="phd">Dissertation (PhD)</option>
            </select>
          </div>

          <div>
            <label className="ds-label text-foreground mb-2 block">Sprache</label>
            <select
              value={metadata.language}
              onChange={(e) => setMetadata((m) => ({ ...m, language: e.target.value }))}
              className="w-full bg-card ds-body outline-none px-4 py-3 rounded-lg border border-input focus:ring-2 focus:ring-ring/20"
            >
              <option value="deutsch">Deutsch</option>
              <option value="englisch">Englisch</option>
              <option value="andere">Andere</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="ds-label text-foreground mb-2 block">Gewünschte Dauer</label>
            <input
              type="text"
              value={metadata.duration}
              onChange={(e) => setMetadata((m) => ({ ...m, duration: e.target.value }))}
              placeholder="z.B. 3-5 Monate oder 6 Monate"
              className="w-full bg-card ds-body outline-none placeholder:text-muted-foreground px-4 py-3 rounded-lg border border-input focus:ring-2 focus:ring-ring/20"
            />
          </div>

          <div>
            <label className="ds-label text-foreground mb-2 block">Vergütung erwartet?</label>
            <button
              onClick={() => setMetadata((m) => ({ ...m, compensated: !m.compensated }))}
              className={`w-full px-4 py-3 rounded-lg border ds-body text-left transition-colors ${
                metadata.compensated
                  ? "bg-primary/10 border-primary text-primary"
                  : "bg-card border-input text-muted-foreground"
              }`}
            >
              {metadata.compensated ? "Ja, Vergütung gewünscht" : "Nein, keine Vergütung nötig"}
            </button>
          </div>
        </div>

        <div>
          <label className="ds-label text-foreground mb-2 block">Einschränkungen / Restrictions</label>
          <textarea
            value={metadata.restrictions}
            onChange={(e) => setMetadata((m) => ({ ...m, restrictions: e.target.value }))}
            placeholder="z.B. Nur remote, Muss mit Firma X sein, Bestimmte Methodik erforderlich..."
            rows={3}
            className="w-full bg-card ds-body outline-none placeholder:text-muted-foreground px-4 py-3 rounded-lg border border-input focus:ring-2 focus:ring-ring/20 resize-y"
          />
        </div>

        <div>
          <label className="ds-label text-foreground mb-2 block">Tags / Keywords</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === ",") {
                  e.preventDefault();
                  addTag();
                }
              }}
              placeholder="Tag eingeben + Enter"
              className="flex-1 bg-card ds-body outline-none placeholder:text-muted-foreground px-4 py-3 rounded-lg border border-input focus:ring-2 focus:ring-ring/20"
            />
            <Button variant="outline" onClick={addTag} className="rounded-lg">
              Hinzufügen
            </Button>
          </div>
          {metadata.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {metadata.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="gap-1 cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors"
                  onClick={() => removeTag(tag)}
                >
                  {tag} ×
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 mt-8">
        <Button variant="outline" onClick={onBack} className="rounded-full gap-2">
          <ArrowLeft size={16} /> Zurück
        </Button>
        <Button onClick={onNext} className="rounded-full gap-2">
          Vorschau & Veröffentlichen <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
};

/* ─── Step 4: Publish ─── */
const StepPublish = ({
  thesisTitle,
  thesisDescription,
  metadata,
  onBack,
}: {
  thesisTitle: string;
  thesisDescription: string;
  metadata: ThesisMetadata;
  onBack: () => void;
}) => {
  const [published, setPublished] = useState(false);

  const typeLabel: Record<string, string> = {
    bachelor: "Bachelorarbeit",
    master: "Masterarbeit",
    phd: "Dissertation",
  };
  const langLabel: Record<string, string> = {
    deutsch: "Deutsch",
    englisch: "Englisch",
    andere: "Andere",
  };

  /** Smart duration display: if just a number, append "Monate" */
  const formatDuration = (d: string) => {
    if (!d) return null;
    const trimmed = d.trim();
    if (/^\d+$/.test(trimmed)) return `${trimmed} Monate`;
    return trimmed;
  };

  if (published) {
    return (
      <div className="mx-auto max-w-lg text-center py-12 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mx-auto mb-6">
          <PartyPopper size={36} className="text-primary-foreground" />
        </div>
        <h2 className="ds-title-md mb-3">Dein Thema ist live!</h2>
        <p className="ds-body text-muted-foreground mb-2">
          Dein Thesis-Vorschlag ist jetzt sichtbar für Betreuer:innen und Unternehmen.
        </p>
        <p className="ds-small text-muted-foreground">
          Du wirst benachrichtigt, sobald sich jemand für dein Thema interessiert.
        </p>
      </div>
    );
  }

  const durationDisplay = formatDuration(metadata.duration);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Eye size={24} className="text-primary" />
        <h2 className="ds-title-md">Vorschau</h2>
      </div>

      {/* Preview card */}
      <div className="border border-border rounded-lg bg-card overflow-hidden mb-6">
        <div className="p-6">
          <h3 className="ds-title-cards text-foreground mb-3">{thesisTitle}</h3>
          <p className="ds-body text-muted-foreground whitespace-pre-wrap mb-4">{thesisDescription}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {metadata.field && <Badge variant="secondary">{metadata.field}</Badge>}
            <Badge variant="outline">{typeLabel[metadata.type] || metadata.type}</Badge>
            <Badge variant="outline">{langLabel[metadata.language] || metadata.language}</Badge>
            {durationDisplay && <Badge variant="outline">{durationDisplay}</Badge>}
            {metadata.compensated && <Badge variant="outline">Vergütung gewünscht</Badge>}
          </div>

          {metadata.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {metadata.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
              ))}
            </div>
          )}

          {metadata.restrictions && (
            <div className="border-t border-border pt-3 mt-3">
              <p className="ds-caption text-muted-foreground mb-1">Einschränkungen:</p>
              <p className="ds-small text-foreground">{metadata.restrictions}</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" onClick={onBack} className="rounded-full gap-2">
          <ArrowLeft size={16} /> Zurück bearbeiten
        </Button>
        <Button onClick={() => setPublished(true)} className="rounded-full gap-2">
          <Sparkles size={16} /> Jetzt live stellen
        </Button>
      </div>
    </div>
  );
};

export default ThesisProposal;

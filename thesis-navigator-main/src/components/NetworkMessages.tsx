import { useState } from "react";
import { motion } from "framer-motion";
import NetworkChat from "./NetworkChat";
import type { PersonaMatch } from "@/api/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  MessageSquare,
  Building2,
  ArrowLeft,
  Sparkles,
  Lightbulb,
  GraduationCap,
  Briefcase,
  Users,
  X,
} from "lucide-react";

interface NetworkMessagesProps {
  connectedPersonas: PersonaMatch[];
  parentSessionId: string;
  onNavigateToConnect?: () => void;
}

const typeLabels: Record<string, string> = {
  professor: "Professor:in",
  expert: "Expert:in",
  alumni: "Alumni",
  mentor: "Mentor:in",
};

const typeIcons: Record<string, typeof GraduationCap> = {
  professor: GraduationCap,
  expert: Briefcase,
  alumni: Users,
  mentor: Users,
};

const networkingTips = [
  "Erwähne ein spezifisches Paper oder Projekt der Person",
  "Halte die Nachricht auf 3-5 Sätze",
  "Stelle eine konkrete, beantwortbare Frage",
  "Zeig, warum gerade DU interessant bist für die Person",
  "Vermeide generische Floskeln wie 'Ich bewundere Ihre Arbeit'",
  "Schliesse mit einer klaren Handlungsaufforderung ab",
];

function PersonaDetailPanel({
  persona,
  onClose,
}: {
  persona: PersonaMatch;
  onClose: () => void;
}) {
  const TypeIcon = typeIcons[persona.type] || Users;
  const weightedScore = Math.round(
    persona.scores.fit * 0.4 + persona.scores.future_benefit * 0.35 + persona.scores.rating * 0.25
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="ds-label text-foreground">Profil-Details</h3>
        <Button variant="ghost" size="icon" className="rounded-full w-8 h-8 lg:hidden" onClick={onClose}>
          <X size={16} />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-5">
          {/* Avatar + Name */}
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[hsl(var(--ai-from))] to-[hsl(var(--ai-to))] flex items-center justify-center text-white text-2xl font-semibold mb-3">
              {persona.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <h3 className="ds-title-sm text-foreground">{persona.name}</h3>
            <p className="ds-small text-muted-foreground">{persona.title}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <Building2 size={12} className="text-muted-foreground" />
              <span className="ds-caption text-muted-foreground">{persona.institution}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <TypeIcon size={14} className="text-muted-foreground" />
              <span className="ds-badge text-muted-foreground">{typeLabels[persona.type] || persona.type}</span>
            </div>
          </div>

          {/* Field badges */}
          <div className="flex flex-wrap gap-1.5 justify-center">
            {persona.field_badges.map((badge) => (
              <Badge key={badge} variant="secondary" className="ds-badge">
                {badge}
              </Badge>
            ))}
          </div>

          {/* Bio */}
          <div>
            <h4 className="ds-label text-foreground mb-1">Bio</h4>
            <p className="ds-small text-muted-foreground">{persona.bio}</p>
          </div>

          {/* Research Focus */}
          <div>
            <h4 className="ds-label text-foreground mb-1">Forschungsfokus</h4>
            <p className="ds-small text-muted-foreground">{persona.research_focus}</p>
          </div>

          {/* Scores */}
          <div>
            <h4 className="ds-label text-foreground mb-2">Scores</h4>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="ds-caption text-muted-foreground">Thesis-Fit</span>
                  <span className="ds-badge text-foreground">{persona.scores.fit}</span>
                </div>
                <Progress value={persona.scores.fit} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="ds-caption text-muted-foreground">Future-Benefit</span>
                  <span className="ds-badge text-foreground">{persona.scores.future_benefit}</span>
                </div>
                <Progress value={persona.scores.future_benefit} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="ds-caption text-muted-foreground">Rating</span>
                  <span className="ds-badge text-foreground">{persona.scores.rating}</span>
                </div>
                <Progress value={persona.scores.rating} className="h-2" />
              </div>
              <div className="pt-1 border-t border-border">
                <div className="flex justify-between">
                  <span className="ds-caption text-foreground font-medium">Gesamtscore</span>
                  <span className="ds-badge text-[hsl(var(--ai-from))] font-bold">{weightedScore}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Match reason */}
          <div className="rounded-lg bg-muted/50 p-3">
            <h4 className="ds-badge text-[hsl(var(--ai-from))] mb-1">Match-Grund</h4>
            <p className="ds-small text-foreground italic">"{persona.match_reason}"</p>
          </div>

          {/* Benefit */}
          <div>
            <h4 className="ds-label text-foreground mb-1">Benefit</h4>
            <p className="ds-small text-muted-foreground">{persona.benefit_description}</p>
          </div>

          {/* Networking tips */}
          <div>
            <h4 className="ds-label text-foreground mb-2 flex items-center gap-1.5">
              <Lightbulb size={14} />
              Networking-Tipps
            </h4>
            <ul className="space-y-1.5">
              {networkingTips.map((tip, i) => (
                <li key={i} className="ds-caption text-muted-foreground flex items-start gap-2">
                  <span className="text-[hsl(var(--ai-from))] mt-0.5">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

export default function NetworkMessages({
  connectedPersonas,
  parentSessionId,
  onNavigateToConnect,
}: NetworkMessagesProps) {
  const [selectedPersona, setSelectedPersona] = useState<PersonaMatch | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  // Mobile: show chat view when a persona is selected
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");

  const handleSelectPersona = (persona: PersonaMatch) => {
    setSelectedPersona(persona);
    setMobileView("chat");
    setShowDetail(false);
  };

  const handleBackToList = () => {
    setMobileView("list");
    setShowDetail(false);
  };

  // Empty state
  if (connectedPersonas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full gap-4 px-4">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
          <MessageSquare size={28} className="text-muted-foreground" />
        </div>
        <h2 className="ds-title-sm text-foreground">Noch keine Connections</h2>
        <p className="ds-body text-muted-foreground text-center max-w-sm">
          Besuche Gini Connect, um passende Personen zu finden und dich mit ihnen zu verbinden!
        </p>
        {onNavigateToConnect && (
          <Button className="rounded-xl gap-2" onClick={onNavigateToConnect}>
            <Sparkles size={16} />
            Zu Gini Connect
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-full w-full">
      {/* Contact list — always visible on desktop, toggleable on mobile */}
      <div
        className={`w-full lg:w-[280px] lg:block border-r border-border flex-shrink-0 flex flex-col ${
          mobileView === "list" ? "block" : "hidden lg:block"
        }`}
      >
        <div className="p-4 border-b border-border">
          <h2 className="ds-title-sm text-foreground">Nachrichten</h2>
          <p className="ds-caption text-muted-foreground mt-0.5">
            {connectedPersonas.length} Connection{connectedPersonas.length !== 1 ? "s" : ""}
          </p>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2">
            {connectedPersonas.map((persona) => (
              <button
                key={persona.name}
                onClick={() => handleSelectPersona(persona)}
                className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors duration-150 text-left ${
                  selectedPersona?.name === persona.name
                    ? "bg-accent"
                    : "hover:bg-accent/50"
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(var(--ai-from))] to-[hsl(var(--ai-to))] flex items-center justify-center text-white text-sm font-semibold shrink-0">
                  {persona.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="ds-small font-medium text-foreground truncate">{persona.name}</h3>
                  <div className="flex items-center gap-1">
                    <Building2 size={11} className="text-muted-foreground shrink-0" />
                    <span className="ds-caption text-muted-foreground truncate">
                      {persona.institution}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat area — always visible on desktop, toggleable on mobile */}
      <div
        className={`flex-1 flex flex-col min-w-0 ${
          mobileView === "chat" ? "block" : "hidden lg:flex"
        }`}
      >
        {selectedPersona ? (
          <NetworkChat
            key={selectedPersona.name}
            persona={selectedPersona}
            parentSessionId={parentSessionId}
            onBack={handleBackToList}
            onShowDetail={() => setShowDetail(true)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-4">
            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
              <MessageSquare size={24} className="text-muted-foreground" />
            </div>
            <p className="ds-body text-muted-foreground">Wähle einen Kontakt aus</p>
          </div>
        )}
      </div>

      {/* Detail panel — inline on desktop, Sheet on mobile */}
      {selectedPersona && showDetail && (
        <>
          {/* Desktop: inline panel */}
          <div className="hidden lg:flex w-[320px] border-l border-border flex-shrink-0 flex-col">
            <PersonaDetailPanel persona={selectedPersona} onClose={() => setShowDetail(false)} />
          </div>

          {/* Mobile: Sheet overlay */}
          <Sheet open={showDetail} onOpenChange={setShowDetail}>
            <SheetContent side="right" className="w-[85vw] sm:max-w-[400px] p-0 lg:hidden">
              <SheetHeader className="sr-only">
                <SheetTitle>Profil von {selectedPersona.name}</SheetTitle>
                <SheetDescription>Details und Scores</SheetDescription>
              </SheetHeader>
              <PersonaDetailPanel persona={selectedPersona} onClose={() => setShowDetail(false)} />
            </SheetContent>
          </Sheet>
        </>
      )}
    </div>
  );
}

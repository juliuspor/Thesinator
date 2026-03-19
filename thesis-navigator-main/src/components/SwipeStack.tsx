import { useState, useCallback, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SwipeCard from "./SwipeCard";
import type { PersonaMatch } from "@/api/types";
import { Check, X, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SwipeStackProps {
  matches: PersonaMatch[];
  onSwipeComplete: (connected: PersonaMatch[], skipped: PersonaMatch[]) => void;
  onSwipeAction: (persona: PersonaMatch, action: "skip" | "connect") => void;
}

export default function SwipeStack({ matches, onSwipeComplete, onSwipeAction }: SwipeStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [connected, setConnected] = useState<PersonaMatch[]>([]);
  const [skipped, setSkipped] = useState<PersonaMatch[]>([]);
  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(null);

  // Refs to avoid stale closures in setTimeout callbacks
  const connectedRef = useRef(connected);
  const skippedRef = useRef(skipped);
  useEffect(() => { connectedRef.current = connected; }, [connected]);
  useEffect(() => { skippedRef.current = skipped; }, [skipped]);

  // Fix 10: Empty state for no matches
  if (matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 px-4">
        <Users size={48} className="text-muted-foreground" />
        <h2 className="ds-title-sm text-foreground">Keine Matches gefunden</h2>
        <p className="ds-body text-muted-foreground text-center">
          Versuche es mit anderen Suchkriterien.
        </p>
      </div>
    );
  }

  const handleSwipe = useCallback(
    (direction: "left" | "right") => {
      const persona = matches[currentIndex];
      if (!persona) return;

      setExitDirection(direction);

      if (direction === "right") {
        setConnected((prev) => [...prev, persona]);
        onSwipeAction(persona, "connect");
      } else {
        setSkipped((prev) => [...prev, persona]);
        onSwipeAction(persona, "skip");
      }

      setTimeout(() => {
        setExitDirection(null);
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);

        if (nextIndex >= matches.length) {
          onSwipeComplete(
            direction === "right" ? [...connectedRef.current, persona] : connectedRef.current,
            direction === "left" ? [...skippedRef.current, persona] : skippedRef.current
          );
        }
      }, 300);
    },
    [currentIndex, matches, onSwipeAction, onSwipeComplete]
  );

  const remaining = matches.length - currentIndex;
  const isDone = currentIndex >= matches.length;

  if (isDone) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
      {/* Progress */}
      <div className="flex items-center gap-3 w-full">
        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[hsl(var(--ai-from))] to-[hsl(var(--ai-to))] rounded-full"
            animate={{ width: `${((currentIndex) / matches.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <span className="ds-caption text-muted-foreground whitespace-nowrap">
          {currentIndex + 1} / {matches.length}
        </span>
      </div>

      {/* Card stack */}
      <div className="relative w-full h-[420px] sm:h-[480px] md:h-[520px]">
        <AnimatePresence>
          {matches.slice(currentIndex, currentIndex + 2).map((persona, i) => (
            <motion.div
              key={persona.id ?? persona.name}
              className="absolute inset-0"
              exit={
                exitDirection
                  ? {
                      x: exitDirection === "right" ? 300 : -300,
                      opacity: 0,
                      rotate: exitDirection === "right" ? 15 : -15,
                      transition: { duration: 0.3 },
                    }
                  : undefined
              }
            >
              <SwipeCard
                persona={persona}
                onSwipe={handleSwipe}
                isTop={i === 0}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-6">
        <Button
          size="lg"
          variant="outline"
          className="rounded-full w-14 h-14 border-red-300 text-red-400 hover:bg-red-50 hover:text-red-500 hover:border-red-400"
          onClick={() => handleSwipe("left")}
        >
          <X size={24} />
        </Button>
        <Button
          size="lg"
          className="rounded-full w-14 h-14 bg-gradient-to-r from-[hsl(var(--ai-from))] to-[hsl(var(--ai-to))] text-white hover:opacity-90"
          onClick={() => handleSwipe("right")}
        >
          <Check size={24} />
        </Button>
      </div>

      {/* Connected counter */}
      {connected.length > 0 && (
        <p className="ds-small text-muted-foreground">
          {connected.length} Connection{connected.length !== 1 ? "s" : ""} gesammelt
        </p>
      )}
    </div>
  );
}

import { motion, useMotionValue, useTransform } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import type { PersonaMatch } from "@/api/types";
import { GraduationCap, Building2, Briefcase, Users } from "lucide-react";

interface SwipeCardProps {
  persona: PersonaMatch;
  onSwipe: (direction: "left" | "right") => void;
  isTop: boolean;
}

const typeIcons: Record<string, typeof GraduationCap> = {
  professor: GraduationCap,
  expert: Briefcase,
  alumni: Users,
  mentor: Users,
};

const typeLabels: Record<string, string> = {
  professor: "Professor:in",
  expert: "Expert:in",
  alumni: "Alumni",
  mentor: "Mentor:in",
};

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="ds-caption text-muted-foreground w-24 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        />
      </div>
      <span className="ds-badge text-foreground w-8 text-right">{value}</span>
    </div>
  );
}

export default function SwipeCard({ persona, onSwipe, isTop }: SwipeCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);

  // Overlay opacity for swipe indicators
  const connectOpacity = useTransform(x, [0, 100], [0, 1]);
  const skipOpacity = useTransform(x, [-100, 0], [1, 0]);

  const TypeIcon = typeIcons[persona.type] || Users;

  return (
    <motion.div
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      style={{ x, rotate, opacity, zIndex: isTop ? 10 : 0 }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={(_, info) => {
        if (info.offset.x > 100) {
          onSwipe("right");
        } else if (info.offset.x < -100) {
          onSwipe("left");
        }
      }}
      {...(isTop
        ? {}
        : { initial: { scale: 0.95, y: 10 }, animate: { scale: 0.95, y: 10 } })}
    >
      {/* Swipe indicators */}
      {isTop && (
        <>
          <motion.div
            className="absolute top-6 right-6 z-20 rounded-lg border-2 border-green-500 px-4 py-1"
            style={{ opacity: connectOpacity }}
          >
            <span className="ds-title-cards text-green-500 font-bold">CONNECT</span>
          </motion.div>
          <motion.div
            className="absolute top-6 left-6 z-20 rounded-lg border-2 border-red-400 px-4 py-1"
            style={{ opacity: skipOpacity }}
          >
            <span className="ds-title-cards text-red-400 font-bold">SKIP</span>
          </motion.div>
        </>
      )}

      <div className="h-full rounded-2xl border border-border bg-card shadow-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-br from-[hsl(var(--ai-from)/0.08)] to-[hsl(var(--ai-to)/0.08)] p-6 pb-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[hsl(var(--ai-from))] to-[hsl(var(--ai-to))] flex items-center justify-center text-white text-xl font-semibold shrink-0">
              {persona.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="ds-title-cards text-foreground truncate">{persona.name}</h3>
              <p className="ds-small text-muted-foreground truncate">{persona.title}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <Building2 size={14} className="text-muted-foreground shrink-0" />
                <span className="ds-caption text-muted-foreground truncate">{persona.institution}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-background/80">
                <TypeIcon size={14} className="text-muted-foreground" />
                <span className="ds-badge text-muted-foreground">{typeLabels[persona.type] || persona.type}</span>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(var(--ai-from))] to-[hsl(var(--ai-to))] text-white text-sm font-bold">
                {Math.round(persona.scores.fit * 0.4 + persona.scores.future_benefit * 0.35 + persona.scores.rating * 0.25)}
              </div>
            </div>
          </div>

          {/* Field badges */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {persona.field_badges.map((badge) => (
              <Badge key={badge} variant="secondary" className="ds-badge">
                {badge}
              </Badge>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 p-6 pt-4 flex flex-col gap-4 overflow-y-auto">
          {/* Research focus */}
          <p className="ds-small text-foreground">{persona.research_focus}</p>

          {/* Scores */}
          <div className="flex flex-col gap-2">
            <ScoreBar label="Thesis-Fit" value={persona.scores.fit} color="bg-[hsl(var(--ai-from))]" />
            <ScoreBar label="Future-Benefit" value={persona.scores.future_benefit} color="bg-[hsl(var(--ai-to))]" />
            <ScoreBar label="Rating" value={persona.scores.rating} color="bg-primary" />
          </div>

          {/* Match reason */}
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="ds-small text-foreground italic">"{persona.match_reason}"</p>
          </div>

          {/* Benefit */}
          <p className="ds-caption text-muted-foreground">{persona.benefit_description}</p>
        </div>
      </div>
    </motion.div>
  );
}

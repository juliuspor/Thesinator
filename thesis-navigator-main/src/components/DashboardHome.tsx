import { useState, useEffect } from "react";
import {
  Sparkles, Users, Search, FileText, Bell, UserPlus, MessageSquare,
  Bookmark, Building2, GraduationCap, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchFeaturedTopics, fetchProjects, fetchStudentProfile } from "@/services/data";
import type { FeaturedTopic, ThesisProject, StudentProfile } from "@/api/types";
import DashboardChatWidget from "./DashboardChatWidget";

const STUDENT_ID = import.meta.env.VITE_STUDENT_ID || "student-01";

interface DashboardHomeProps {
  onNavigate?: (item: string) => void;
}

const actionCards = [
  {
    icon: Sparkles,
    title: "KI findet dein perfektes Thema",
    description: "Erhalte personalisierte Vorschläge basierend auf Fähigkeiten und Interessen.",
    aiAccent: true,
    route: "thesis-finder",
  },
  {
    icon: Users,
    title: "Finde Experten für Interviews",
    description: "Vernetze dich mit Industrie-Expert:innen für Interviews und neue Einblicke.",
    route: "personen",
  },
  {
    icon: Search,
    title: "Alle relevanten Themen für dich",
    description: "Finde alle publizierten Themen deiner Uni und unserer Partnerunternehmen.",
    route: "themen",
  },
  {
    icon: FileText,
    title: "Schlage selbst ein Thema vor",
    description: "Verfeinere dein Thema mit KI und stelle es live.",
    route: "eigene-thesis",
  },
];

const DashboardHome = ({ onNavigate }: DashboardHomeProps) => {
  const [topics, setTopics] = useState<FeaturedTopic[]>([]);
  const [topicsLoading, setTopicsLoading] = useState(true);
  const [projects, setProjects] = useState<ThesisProject[]>([]);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    fetchFeaturedTopics(4)
      .then((res) => setTopics(res.topics))
      .catch(() => {})
      .finally(() => setTopicsLoading(false));

    fetchProjects(STUDENT_ID)
      .then((res) => setProjects(res.projects))
      .catch(() => {});

    fetchStudentProfile(STUDENT_ID)
      .then((res) => setProfile(res))
      .catch(() => {});
  }, []);

  return (
    <div className="flex-1 min-h-screen w-full min-w-0">
      {/* Top bar */}
      <header className="border-b border-border">
        <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div />
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full hover:bg-accent transition-colors">
              <Bell size={20} className="text-foreground" />
            </button>
            <Button variant="outline" className="rounded-full gap-2">
              <UserPlus size={16} />
              Einladen
            </Button>
            <button
              className={`p-2 rounded-full transition-colors ${
                chatOpen ? "bg-accent" : "hover:bg-accent"
              }`}
              onClick={() => setChatOpen((o) => !o)}
            >
              <MessageSquare size={20} className="text-foreground" />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="ds-title-xl mb-8">Willkommen zurück!</h1>

        {/* Action cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {actionCards.map((card, i) => (
            <div
              key={i}
              onClick={() => card.route && onNavigate?.(card.route)}
              className={`border border-border rounded-lg p-5 hover:shadow-md transition-shadow duration-300 bg-card ${
                card.route ? "cursor-pointer" : ""
              }`}
            >
              <div className="mb-4">
                <card.icon
                  size={24}
                  className={
                    card.aiAccent
                      ? "text-ai-from"
                      : "text-foreground"
                  }
                />
              </div>
              <h3 className="ds-title-cards mb-2">
                {card.aiAccent ? (
                  <>
                    <span className="text-ai">KI</span> findet dein perfektes Thema
                  </>
                ) : (
                  card.title
                )}
              </h3>
              <p className="ds-small text-muted-foreground">{card.description}</p>
            </div>
          ))}
        </div>

        {/* Gini Connect Teaser */}
        <Card
          className="mb-8 bg-gradient-to-r from-[hsl(var(--ai-from))]/10 to-[hsl(var(--ai-to))]/10 border-[hsl(var(--ai-from))]/20 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onNavigate?.("gini-connect")}
        >
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[hsl(var(--ai-from))] to-[hsl(var(--ai-to))] flex items-center justify-center text-white shrink-0">
              <Sparkles size={24} />
            </div>
            <div className="flex-1">
              <h3 className="ds-title-cards text-foreground">Gini Connect</h3>
              <p className="ds-small text-muted-foreground">
                Lass unsere KI passende Betreuer:innen und Expert:innen für dich finden.
              </p>
            </div>
            <Button className="rounded-full gap-2 shrink-0">
              <Sparkles size={16} />
              Entdecken
            </Button>
          </CardContent>
        </Card>

        {/* Featured Topics */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="ds-title-md">Aktuelle Themen</h2>
            <Button
              variant="ghost"
              className="gap-1 text-muted-foreground"
              onClick={() => onNavigate?.("themen")}
            >
              Alle anzeigen <ChevronRight size={16} />
            </Button>
          </div>
          {topicsLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-[160px] rounded-lg" />
              ))}
            </div>
          ) : topics.length === 0 ? (
            <p className="ds-body text-muted-foreground">Keine Themen verfügbar.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {topics.map((t) => (
                <Card
                  key={t.id}
                  className="cursor-pointer hover:shadow-md transition-shadow duration-300"
                  onClick={() => onNavigate?.("themen")}
                >
                  <CardContent className="p-4">
                    <h3 className="ds-small font-medium text-foreground line-clamp-2 mb-2">
                      {t.title}
                    </h3>
                    {t.field_names.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {t.field_names.slice(0, 2).map((fn) => (
                          <Badge key={fn} variant="secondary" className="text-xs">{fn}</Badge>
                        ))}
                      </div>
                    )}
                    <div className="space-y-1">
                      {t.company_name && (
                        <div className="flex items-center gap-1.5">
                          <Building2 size={12} className="text-muted-foreground" />
                          <span className="ds-caption text-muted-foreground truncate">{t.company_name}</span>
                        </div>
                      )}
                      {t.university_name && (
                        <div className="flex items-center gap-1.5">
                          <GraduationCap size={12} className="text-muted-foreground" />
                          <span className="ds-caption text-muted-foreground truncate">{t.university_name}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Favorites */}
        <h2 className="ds-title-md mb-6">Meine favorisierten Themen</h2>
        <div className="bg-muted rounded-lg p-8 sm:p-12 flex flex-col items-center justify-center min-h-[240px]">
          <Bookmark size={32} className="text-muted-foreground mb-4" />
          <p className="ds-body text-foreground mb-4">Keine Elemente</p>
          <Button
            variant="default"
            className="rounded-full"
            onClick={() => onNavigate?.("themen")}
          >
            Geh zu Themen
          </Button>
        </div>
      </main>

      <DashboardChatWidget
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        studentProfile={profile}
        projects={projects}
        topics={topics}
      />
    </div>
  );
};

export default DashboardHome;

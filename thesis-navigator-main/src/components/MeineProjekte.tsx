import { useState, useEffect } from "react";
import {
  FolderOpen, GraduationCap, Building2, Calendar, Users, Briefcase, ChevronRight, Search, X, Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { fetchProjects } from "@/services/data";
import type { ThesisProject } from "@/api/types";

const STUDENT_ID = import.meta.env.VITE_STUDENT_ID || "student-01";

interface MeineProjekteProps {
  onNavigate?: (item: string) => void;
}

const stateConfig: Record<string, { label: string; className: string }> = {
  proposed: { label: "Vorgeschlagen", className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" },
  applied: { label: "Beworben", className: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" },
  agreed: { label: "Vereinbart", className: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" },
  in_progress: { label: "In Arbeit", className: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" },
  completed: { label: "Abgeschlossen", className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200" },
  rejected: { label: "Abgelehnt", className: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" },
  canceled: { label: "Abgebrochen", className: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" },
  withdrawn: { label: "Zurückgezogen", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
};

function StateBadge({ state }: { state: string }) {
  const cfg = stateConfig[state] || stateConfig.proposed;
  return <Badge className={`${cfg.className} text-xs`}>{cfg.label}</Badge>;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  try {
    return new Intl.DateTimeFormat("de-CH", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

// ---------------------------------------------------------------------------
// Project Detail
// ---------------------------------------------------------------------------
function ProjectDetail({
  project,
  onClose,
  onNavigate,
}: {
  project: ThesisProject;
  onClose: () => void;
  onNavigate?: (item: string) => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="ds-label text-foreground">Projekt-Details</h3>
        <Button variant="ghost" size="icon" className="rounded-full w-8 h-8" onClick={onClose}>
          <X size={16} />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-5">
          {/* Title + State */}
          <div>
            <StateBadge state={project.state} />
            <h2 className="ds-title-sm text-foreground mt-2">{project.title}</h2>
          </div>

          {/* Topic */}
          {project.topic_title && (
            <div>
              <h4 className="ds-label text-foreground mb-1">Verknüpftes Thema</h4>
              <p className="ds-small text-muted-foreground">{project.topic_title}</p>
            </div>
          )}

          {/* Description */}
          {project.description && (
            <div>
              <h4 className="ds-label text-foreground mb-1">Beschreibung</h4>
              <p className="ds-small text-muted-foreground">{project.description}</p>
            </div>
          )}

          {/* Motivation */}
          {project.motivation && (
            <div>
              <h4 className="ds-label text-foreground mb-1">Motivation</h4>
              <p className="ds-small text-muted-foreground italic">{project.motivation}</p>
            </div>
          )}

          {/* Institution info */}
          <div className="space-y-2">
            {project.company_name && (
              <div className="flex items-center gap-2">
                <Building2 size={14} className="text-muted-foreground" />
                <span className="ds-small text-muted-foreground">{project.company_name}</span>
              </div>
            )}
            {project.university_name && (
              <div className="flex items-center gap-2">
                <GraduationCap size={14} className="text-muted-foreground" />
                <span className="ds-small text-muted-foreground">{project.university_name}</span>
              </div>
            )}
          </div>

          {/* Supervisors / Experts */}
          {project.supervisor_names.length > 0 && (
            <div>
              <h4 className="ds-label text-foreground mb-1">Betreuer:innen</h4>
              {project.supervisor_names.map((n, i) => (
                <p key={i} className="ds-small text-muted-foreground">{n}</p>
              ))}
            </div>
          )}
          {project.expert_names.length > 0 && (
            <div>
              <h4 className="ds-label text-foreground mb-1">Expert:innen</h4>
              {project.expert_names.map((n, i) => (
                <p key={i} className="ds-small text-muted-foreground">{n}</p>
              ))}
            </div>
          )}

          {/* Dates */}
          <div className="space-y-1">
            {project.created_at && (
              <div className="flex items-center gap-2">
                <Calendar size={12} className="text-muted-foreground" />
                <span className="ds-caption text-muted-foreground">Erstellt: {formatDate(project.created_at)}</span>
              </div>
            )}
            {project.updated_at && project.updated_at !== project.created_at && (
              <div className="flex items-center gap-2">
                <Calendar size={12} className="text-muted-foreground" />
                <span className="ds-caption text-muted-foreground">Aktualisiert: {formatDate(project.updated_at)}</span>
              </div>
            )}
          </div>

          {/* CTA */}
          <Button className="w-full rounded-xl gap-2" onClick={() => onNavigate?.("thesis-finder")}>
            <Search size={16} />
            Weitere Themen entdecken
          </Button>
        </div>
      </ScrollArea>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
const MeineProjekte = ({ onNavigate }: MeineProjekteProps) => {
  const [projects, setProjects] = useState<ThesisProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<ThesisProject | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchProjects(STUDENT_ID)
      .then((res) => setProjects(res.projects))
      .catch((err) => console.error("Failed to fetch projects", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex-1 min-h-screen w-full min-w-0">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="ds-title-md">Meine Projekte</h1>
            {!loading && projects.length > 0 && (
              <p className="ds-small text-muted-foreground mt-0.5">Deine Thesis-Projekte im Überblick</p>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-[140px] rounded-lg" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          /* Empty State — prominent CTA zum Thesis Finder */
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <div className="mb-6 flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[hsl(var(--ai-from))] to-[hsl(var(--ai-to))] flex items-center justify-center text-white">
                <Sparkles size={28} />
              </div>
              <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
                <GraduationCap size={28} className="text-muted-foreground" />
              </div>
            </div>
            <h2 className="ds-title-md mb-2">Finde zuerst dein Thesis-Thema</h2>
            <p className="ds-body text-muted-foreground mb-8 max-w-md">
              Sobald du dich für ein Thema entschieden hast, erscheinen deine Projekte hier.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                className="rounded-full gap-2 bg-gradient-to-r from-[hsl(var(--ai-from))] to-[hsl(var(--ai-to))] text-white hover:opacity-90 px-6 py-3 text-base"
                onClick={() => onNavigate?.("thesis-finder")}
              >
                <Sparkles size={18} />
                Zum Thesis Finder
              </Button>
              <Button variant="outline" className="rounded-full gap-2 px-6 py-3 text-base" onClick={() => onNavigate?.("themen")}>
                <Search size={18} />
                Themen durchsuchen
              </Button>
            </div>
          </div>
        ) : (
          /* Project list */
          <div className="space-y-4">
            {projects.map((p) => (
              <Card
                key={p.id}
                className="cursor-pointer hover:shadow-md transition-shadow duration-300"
                onClick={() => setSelectedProject(p)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <StateBadge state={p.state} />
                        {p.topic_title && (
                          <span className="ds-caption text-muted-foreground truncate">
                            {p.topic_title}
                          </span>
                        )}
                      </div>
                      <h3 className="ds-title-cards text-foreground mb-1">{p.title}</h3>
                      {(p.description || p.motivation) && (
                        <p className="ds-small text-muted-foreground line-clamp-2 mb-3">
                          {p.description || p.motivation}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-4">
                        {p.company_name && (
                          <div className="flex items-center gap-1.5">
                            <Building2 size={13} className="text-muted-foreground" />
                            <span className="ds-caption text-muted-foreground">{p.company_name}</span>
                          </div>
                        )}
                        {p.university_name && (
                          <div className="flex items-center gap-1.5">
                            <GraduationCap size={13} className="text-muted-foreground" />
                            <span className="ds-caption text-muted-foreground">{p.university_name}</span>
                          </div>
                        )}
                        {p.supervisor_names.length > 0 && (
                          <div className="flex items-center gap-1.5">
                            <Users size={13} className="text-muted-foreground" />
                            <span className="ds-caption text-muted-foreground">
                              {p.supervisor_names.join(", ")}
                            </span>
                          </div>
                        )}
                        {p.expert_names.length > 0 && (
                          <div className="flex items-center gap-1.5">
                            <Briefcase size={13} className="text-muted-foreground" />
                            <span className="ds-caption text-muted-foreground">
                              {p.expert_names.join(", ")}
                            </span>
                          </div>
                        )}
                        {p.updated_at && (
                          <div className="flex items-center gap-1.5">
                            <Calendar size={12} className="text-muted-foreground" />
                            <span className="ds-caption text-muted-foreground">{formatDate(p.updated_at)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-muted-foreground shrink-0 mt-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Project Detail Sheet */}
      <Sheet
        open={selectedProject !== null}
        onOpenChange={(open) => { if (!open) setSelectedProject(null); }}
      >
        <SheetContent side="right" className="w-[90vw] sm:max-w-[420px] p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>{selectedProject?.title || "Projekt"}</SheetTitle>
            <SheetDescription>Projekt-Details</SheetDescription>
          </SheetHeader>
          {selectedProject && (
            <ProjectDetail
              project={selectedProject}
              onClose={() => setSelectedProject(null)}
              onNavigate={onNavigate}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MeineProjekte;

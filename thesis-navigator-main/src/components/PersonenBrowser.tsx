import { useState, useEffect, useCallback } from "react";
import {
  Search, GraduationCap, Briefcase, Users, X, Sparkles, Building2, Mic,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { fetchPeople } from "@/services/data";
import { getFields } from "@/services/browse";
import type { Person, Field } from "@/api/types";

interface PersonenBrowserProps {
  onNavigate?: (item: string) => void;
}

const typeLabels: Record<string, string> = {
  supervisor: "Professor:in",
  expert: "Expert:in",
};

const typeIcons: Record<string, typeof GraduationCap> = {
  supervisor: GraduationCap,
  expert: Briefcase,
};

// ---------------------------------------------------------------------------
// PersonDetailSheet content
// ---------------------------------------------------------------------------
function PersonDetail({
  person,
  onClose,
  onNavigate,
}: {
  person: Person;
  onClose: () => void;
  onNavigate?: (item: string) => void;
}) {
  const TypeIcon = typeIcons[person.type] || Users;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="ds-label text-foreground">Profil-Details</h3>
        <Button variant="ghost" size="icon" className="rounded-full w-8 h-8" onClick={onClose}>
          <X size={16} />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-5">
          {/* Avatar + Name */}
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[hsl(var(--ai-from))] to-[hsl(var(--ai-to))] flex items-center justify-center text-white text-2xl font-semibold mb-3">
              {person.first_name?.[0]}{person.last_name?.[0]}
            </div>
            <h3 className="ds-title-sm text-foreground">
              {person.title} {person.first_name} {person.last_name}
            </h3>
            <div className="flex items-center gap-1.5 mt-1">
              {person.institution_type === "university" ? (
                <GraduationCap size={12} className="text-muted-foreground" />
              ) : (
                <Building2 size={12} className="text-muted-foreground" />
              )}
              <span className="ds-caption text-muted-foreground">{person.institution_name}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <TypeIcon size={14} className="text-muted-foreground" />
              <span className="ds-badge text-muted-foreground">{typeLabels[person.type]}</span>
            </div>
          </div>

          {/* Field badges */}
          {person.field_names.length > 0 && (
            <div className="flex flex-wrap gap-1.5 justify-center">
              {person.field_names.map((fn) => (
                <Badge key={fn} variant="secondary" className="ds-badge">{fn}</Badge>
              ))}
            </div>
          )}

          {/* Interview badge */}
          {person.offer_interviews && (
            <div className="flex justify-center">
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 gap-1">
                <Mic size={12} /> Bietet Interviews an
              </Badge>
            </div>
          )}

          {/* About / Bio */}
          {person.about && (
            <div>
              <h4 className="ds-label text-foreground mb-1">
                {person.type === "expert" ? "Expertise" : "Über"}
              </h4>
              <p className="ds-small text-muted-foreground">{person.about}</p>
            </div>
          )}

          {/* Research Interests */}
          {person.research_interests.length > 0 && (
            <div>
              <h4 className="ds-label text-foreground mb-1">Forschungsinteressen</h4>
              <div className="flex flex-wrap gap-1.5">
                {person.research_interests.map((ri) => (
                  <Badge key={ri} variant="outline" className="text-xs">{ri}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Objectives */}
          {person.objectives.length > 0 && (
            <div>
              <h4 className="ds-label text-foreground mb-1">Ziele</h4>
              <ul className="space-y-1">
                {person.objectives.map((obj, i) => (
                  <li key={i} className="ds-caption text-muted-foreground flex items-start gap-2">
                    <span className="text-[hsl(var(--ai-from))] mt-0.5">-</span>
                    {obj}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* CTA */}
          <Button
            className="w-full rounded-xl gap-2"
            onClick={() => onNavigate?.("gini-connect")}
          >
            <Sparkles size={16} />
            Via Gini Connect vernetzen
          </Button>
        </div>
      </ScrollArea>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
const PersonenBrowser = ({ onNavigate }: PersonenBrowserProps) => {
  const [fields, setFields] = useState<Field[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [selectedFields, setSelectedFields] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<"name" | "field">("name");

  // Detail
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  useEffect(() => {
    getFields().then((r) => setFields(r.fields)).catch(() => {});
  }, []);

  const loadPeople = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchPeople({
        type: typeFilter || undefined,
        field_id: selectedFields.size > 0 ? Array.from(selectedFields) : undefined,
        search: searchQuery || undefined,
        sort: sortBy,
      });
      setPeople(res.people);
      setTotal(res.total);
    } catch (err) {
      console.error("Failed to fetch people", err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, typeFilter, selectedFields, sortBy]);

  useEffect(() => {
    const timer = setTimeout(loadPeople, 300);
    return () => clearTimeout(timer);
  }, [loadPeople]);

  const toggleField = (fieldId: string) => {
    setSelectedFields((prev) => {
      const next = new Set(prev);
      if (next.has(fieldId)) next.delete(fieldId);
      else next.add(fieldId);
      return next;
    });
  };

  return (
    <div className="flex-1 min-h-screen w-full min-w-0">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="ds-title-md">Personen-Verzeichnis</h1>
            <p className="ds-small text-muted-foreground mt-0.5">
              Betreuer:innen und Expert:innen entdecken
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
        {/* Filter bar */}
        <div className="space-y-4 mb-6">
          {/* Search + Sort row */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Name, Titel oder Fachgebiet suchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-1 rounded-lg border border-border p-1">
              <button
                onClick={() => setSortBy("name")}
                className={`px-3 py-1.5 rounded-md ds-caption transition-colors ${
                  sortBy === "name" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Name
              </button>
              <button
                onClick={() => setSortBy("field")}
                className={`px-3 py-1.5 rounded-md ds-caption transition-colors ${
                  sortBy === "field" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Fachgebiet
              </button>
            </div>
          </div>

          {/* Type toggle */}
          <div className="flex items-center gap-2">
            <span className="ds-caption text-muted-foreground mr-1">Typ:</span>
            {[
              { value: null, label: "Alle" },
              { value: "supervisor", label: "Professor:innen" },
              { value: "expert", label: "Expert:innen" },
            ].map((opt) => (
              <button
                key={opt.label}
                onClick={() => setTypeFilter(opt.value)}
                className={`px-3 py-1.5 rounded-full ds-badge border transition-colors ${
                  typeFilter === opt.value
                    ? "border-[hsl(var(--ai-from))] bg-[hsl(var(--ai-from))]/10 text-[hsl(var(--ai-from))]"
                    : "border-border text-muted-foreground hover:border-foreground/30"
                }`}
              >
                {opt.label}
              </button>
            ))}
            <span className="ds-caption text-muted-foreground ml-2">
              {total} Ergebnis{total !== 1 ? "se" : ""}
            </span>
          </div>

          {/* Field pills */}
          {fields.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {fields.map((f) => (
                <button
                  key={f.id}
                  onClick={() => toggleField(f.id)}
                  className={`px-2.5 py-1 rounded-full ds-badge border transition-colors ${
                    selectedFields.has(f.id)
                      ? "border-[hsl(var(--ai-from))] bg-[hsl(var(--ai-from))]/10 text-[hsl(var(--ai-from))]"
                      : "border-border text-muted-foreground hover:border-foreground/30"
                  }`}
                >
                  {f.name}
                </button>
              ))}
              {selectedFields.size > 0 && (
                <button
                  onClick={() => setSelectedFields(new Set())}
                  className="px-2.5 py-1 rounded-full ds-badge text-destructive hover:bg-destructive/10 transition-colors"
                >
                  Filter zurücksetzen
                </button>
              )}
            </div>
          )}
        </div>

        {/* People Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-[180px] rounded-lg" />
            ))}
          </div>
        ) : people.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Users size={28} className="text-muted-foreground" />
            </div>
            <h2 className="ds-title-sm text-foreground mb-1">Keine Personen gefunden</h2>
            <p className="ds-body text-muted-foreground text-center max-w-sm">
              Passe deine Filter an, um passende Personen zu finden.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {people.map((p) => {
              const TypeIcon = typeIcons[p.type] || Users;
              return (
                <Card
                  key={p.id}
                  className="cursor-pointer hover:shadow-md transition-shadow duration-300"
                  onClick={() => setSelectedPerson(p)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[hsl(var(--ai-from))] to-[hsl(var(--ai-to))] text-white text-sm font-semibold">
                        {p.first_name?.[0]}{p.last_name?.[0]}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="ds-small font-medium truncate">
                          {p.title} {p.first_name} {p.last_name}
                        </p>
                        <div className="flex items-center gap-1">
                          {p.institution_type === "university" ? (
                            <GraduationCap size={12} className="text-muted-foreground shrink-0" />
                          ) : (
                            <Building2 size={12} className="text-muted-foreground shrink-0" />
                          )}
                          <span className="ds-caption text-muted-foreground truncate">
                            {p.institution_name}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <TypeIcon size={14} className="text-muted-foreground" />
                      </div>
                    </div>

                    {/* Field badges */}
                    {p.field_names.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {p.field_names.slice(0, 3).map((fn) => (
                          <Badge key={fn} variant="secondary" className="text-xs">{fn}</Badge>
                        ))}
                        {p.field_names.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{p.field_names.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Bio excerpt */}
                    {p.about && (
                      <p className="ds-caption text-muted-foreground line-clamp-2">{p.about}</p>
                    )}

                    {/* Interview badge */}
                    {p.offer_interviews && (
                      <div className="mt-2">
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs gap-1">
                          <Mic size={10} /> Bietet Interviews an
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Gini Connect Banner */}
        <div className="mt-8">
          <Card
            className="bg-gradient-to-r from-[hsl(var(--ai-from))]/10 to-[hsl(var(--ai-to))]/10 border-[hsl(var(--ai-from))]/20 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onNavigate?.("gini-connect")}
          >
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[hsl(var(--ai-from))] to-[hsl(var(--ai-to))] flex items-center justify-center text-white shrink-0">
                <Sparkles size={24} />
              </div>
              <div className="flex-1">
                <h3 className="ds-title-cards text-foreground">KI-gestützte Vernetzung</h3>
                <p className="ds-small text-muted-foreground">
                  Lass Gini Connect passende Personen für deine Thesis-Reise vorschlagen — basierend auf deinem Profil.
                </p>
              </div>
              <Button className="rounded-full gap-2 shrink-0" onClick={(e) => { e.stopPropagation(); onNavigate?.("gini-connect"); }}>
                <Sparkles size={16} />
                Starten
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Person Detail Sheet */}
      <Sheet
        open={selectedPerson !== null}
        onOpenChange={(open) => { if (!open) setSelectedPerson(null); }}
      >
        <SheetContent side="right" className="w-[90vw] sm:max-w-[420px] p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>
              {selectedPerson ? `${selectedPerson.first_name} ${selectedPerson.last_name}` : "Person"}
            </SheetTitle>
            <SheetDescription>Profil-Details</SheetDescription>
          </SheetHeader>
          {selectedPerson && (
            <PersonDetail
              person={selectedPerson}
              onClose={() => setSelectedPerson(null)}
              onNavigate={onNavigate}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default PersonenBrowser;

import { useState, useEffect, useCallback } from "react";
import { Search, Compass } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TopicDetailCard from "@/components/TopicDetailCard";
import { searchTopics, getFields, searchCompanies } from "@/services/browse";
import type { TopicDetail, Field, Company } from "@/api/types";

interface ThemenBrowserProps {
  typeFilter?: string;
}

const ThemenBrowser = ({ typeFilter }: ThemenBrowserProps) => {
  const [topics, setTopics] = useState<TopicDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [fieldFilter, setFieldFilter] = useState("all");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [fields, setFields] = useState<Field[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<TopicDetail | null>(null);

  useEffect(() => {
    getFields().then((r) => setFields(r.fields)).catch(() => {});
    searchCompanies({ limit: 100 }).then((r) => setCompanies(r.companies)).catch(() => {});
  }, []);

  const fetchTopics = useCallback(async () => {
    setLoading(true);
    try {
      const res = await searchTopics({
        q: query || undefined,
        field_id: fieldFilter !== "all" ? fieldFilter : undefined,
        company_id: companyFilter !== "all" ? companyFilter : undefined,
        type: typeFilter || undefined,
      });
      setTopics(res.topics);
    } catch (err) {
      console.error("Failed to fetch topics", err);
    } finally {
      setLoading(false);
    }
  }, [query, fieldFilter, companyFilter, typeFilter]);

  useEffect(() => {
    const timer = setTimeout(fetchTopics, 300);
    return () => clearTimeout(timer);
  }, [fetchTopics]);

  return (
    <div className="flex-1 min-h-screen w-full min-w-0">
      <header className="border-b border-border">
        <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="ds-title-md">{typeFilter === "job" ? "Jobs" : "Themen"}</h1>
        </div>
      </header>
      <main className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
        {/* Search & Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={typeFilter === "job" ? "Jobs suchen..." : "Themen suchen..."}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={fieldFilter} onValueChange={setFieldFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Fachgebiet" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Fachgebiete</SelectItem>
              {fields.map((f) => (
                <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={companyFilter} onValueChange={setCompanyFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Unternehmen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Unternehmen</SelectItem>
              {companies.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Loading */}
        {loading && (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-[100px] rounded-lg" />
            ))}
          </div>
        )}

        {/* Results */}
        {!loading && (
          <>
            <p className="ds-caption text-muted-foreground mb-4">{topics.length} Ergebnisse</p>
            {topics.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Compass size={32} className="text-muted-foreground mb-4" />
                <p className="ds-body text-muted-foreground">Keine Themen gefunden.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {topics.map((t) => (
                  <div key={t.id}>
                    {selectedTopic?.id === t.id ? (
                      <TopicDetailCard topic={t} onClose={() => setSelectedTopic(null)} />
                    ) : (
                      <Card
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => setSelectedTopic(t)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h3 className="ds-title-cards truncate">{t.title}</h3>
                              <p className="ds-small text-muted-foreground line-clamp-2 mt-1">{t.description}</p>
                            </div>
                            <div className="flex flex-col items-end gap-1 shrink-0">
                              <Badge variant={t.type === "job" ? "default" : "secondary"}>
                                {t.type === "job" ? "Job" : "Thesis"}
                              </Badge>
                              {t.company_name && (
                                <span className="ds-caption text-muted-foreground">{t.company_name}</span>
                              )}
                              {t.university_name && (
                                <span className="ds-caption text-muted-foreground">{t.university_name}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {t.field_names?.map((f) => (
                              <Badge key={f} variant="outline" className="text-xs">{f}</Badge>
                            ))}
                            {typeFilter === "job" && t.employment_type && (
                              <Badge variant="outline" className="text-xs">
                                {t.employment_type === "internship" ? "Praktikum" :
                                 t.employment_type === "working_student" ? "Werkstudent" :
                                 t.employment_type === "graduate_program" ? "Graduate Program" :
                                 t.employment_type === "direct_entry" ? "Direkteinstieg" : t.employment_type}
                              </Badge>
                            )}
                            {typeFilter === "job" && t.workplace_type && (
                              <Badge variant="outline" className="text-xs">
                                {t.workplace_type === "on_site" ? "Vor Ort" :
                                 t.workplace_type === "hybrid" ? "Hybrid" :
                                 t.workplace_type === "remote" ? "Remote" : t.workplace_type}
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default ThemenBrowser;

import { useState, useEffect, useCallback } from "react";
import { Search, Building2, ArrowLeft, Users, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TopicDetailCard from "@/components/TopicDetailCard";
import { searchCompanies, getCompany, getFields } from "@/services/browse";
import type { Company, CompanyDetail, TopicDetail, Field } from "@/api/types";

const sizeOptions = [
  { value: "all", label: "Alle Größen" },
  { value: "1-50", label: "1-50" },
  { value: "51-200", label: "51-200" },
  { value: "201-1000", label: "201-1000" },
  { value: "1001-5000", label: "1001-5000" },
  { value: "5001-10000", label: "5001-10000" },
  { value: "10001+", label: "10001+" },
];

const OrganizationenBrowser = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [sizeFilter, setSizeFilter] = useState("all");
  const [domainFilter, setDomainFilter] = useState("all");
  const [allDomains, setAllDomains] = useState<string[]>([]);
  const [detail, setDetail] = useState<CompanyDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<TopicDetail | null>(null);
  const [fields, setFields] = useState<Field[]>([]);
  const [fieldFilter, setFieldFilter] = useState("all");

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    try {
      const res = await searchCompanies({
        q: query || undefined,
        size: sizeFilter !== "all" ? sizeFilter : undefined,
        domain: domainFilter !== "all" ? domainFilter : undefined,
      });
      setCompanies(res.companies);
      // Collect unique domains
      const domains = new Set<string>();
      res.companies.forEach((c) => c.domains?.forEach((d) => domains.add(d)));
      setAllDomains(Array.from(domains).sort());
    } catch (err) {
      console.error("Failed to fetch companies", err);
    } finally {
      setLoading(false);
    }
  }, [query, sizeFilter, domainFilter]);

  useEffect(() => {
    const timer = setTimeout(fetchCompanies, 300);
    return () => clearTimeout(timer);
  }, [fetchCompanies]);

  useEffect(() => {
    getFields().then((res) => setFields(res.fields)).catch(() => {});
  }, []);

  const openDetail = async (id: string) => {
    setDetailLoading(true);
    setSelectedTopic(null);
    try {
      const res = await getCompany(id);
      setDetail(res);
    } catch (err) {
      console.error("Failed to fetch company detail", err);
    } finally {
      setDetailLoading(false);
    }
  };

  const filteredTopics = detail?.topics.filter((t) =>
    fieldFilter === "all" ? true : t.field_names?.some((fn) => {
      const f = fields.find((fi) => fi.name === fn);
      return f?.id === fieldFilter;
    })
  ) ?? [];

  // --- Detail View ---
  if (detail && !detailLoading) {
    const c = detail.company;
    return (
      <div className="flex-1 min-h-screen w-full min-w-0">
        <header className="border-b border-border">
          <div className="mx-auto flex w-full max-w-[1400px] items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
            <button
              onClick={() => { setDetail(null); setSelectedTopic(null); }}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={16} /> Zurück
            </button>
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
          {/* Company Header */}
          <div className="mb-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Building2 size={28} className="text-muted-foreground" />
              </div>
              <div>
                <h1 className="ds-title-xl">{c.name}</h1>
                <p className="ds-small text-muted-foreground mt-1">{c.description}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline">{c.size} Mitarbeitende</Badge>
              {c.domains?.map((d) => (
                <Badge key={d} variant="secondary">{d}</Badge>
              ))}
            </div>
            {c.about && <p className="ds-small text-muted-foreground">{c.about}</p>}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="topics" className="w-full">
            <TabsList>
              <TabsTrigger value="topics" className="gap-2">
                <FileText size={14} /> Thesis-Themen ({detail.topics.length})
              </TabsTrigger>
              <TabsTrigger value="experts" className="gap-2">
                <Users size={14} /> Expert:innen ({detail.experts.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="topics" className="mt-6">
              {/* Field filter */}
              <div className="mb-4">
                <Select value={fieldFilter} onValueChange={setFieldFilter}>
                  <SelectTrigger className="w-[240px]">
                    <SelectValue placeholder="Alle Fachgebiete" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle Fachgebiete</SelectItem>
                    {fields.map((f) => (
                      <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {filteredTopics.length === 0 ? (
                <p className="text-muted-foreground ds-small py-8 text-center">Keine Themen gefunden.</p>
              ) : (
                <div className="space-y-3">
                  {filteredTopics.map((t) => (
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
                              <Badge variant={t.type === "job" ? "default" : "secondary"} className="shrink-0">
                                {t.type === "job" ? "Job" : "Thesis"}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {t.field_names?.map((f) => (
                                <Badge key={f} variant="outline" className="text-xs">{f}</Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="experts" className="mt-6">
              {detail.experts.length === 0 ? (
                <p className="text-muted-foreground ds-small py-8 text-center">Keine Expert:innen gefunden.</p>
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {detail.experts.map((e) => (
                    <Card key={e.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium">
                            {e.first_name?.[0]}{e.last_name?.[0]}
                          </div>
                          <div className="min-w-0">
                            <p className="ds-small font-medium truncate">{e.first_name} {e.last_name}</p>
                            <p className="ds-caption text-muted-foreground truncate">{e.title}</p>
                          </div>
                        </div>
                        {e.expertise && (
                          <p className="ds-caption text-muted-foreground mt-2 line-clamp-2">{e.expertise}</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    );
  }

  // --- List View ---
  return (
    <div className="flex-1 min-h-screen w-full min-w-0">
      <header className="border-b border-border">
        <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="ds-title-md">Organisationen</h1>
        </div>
      </header>
      <main className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
        {/* Search & Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Unternehmen suchen..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={sizeFilter} onValueChange={setSizeFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Größe" />
            </SelectTrigger>
            <SelectContent>
              {sizeOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={domainFilter} onValueChange={setDomainFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Domain" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Domains</SelectItem>
              {allDomains.map((d) => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Loading */}
        {(loading || detailLoading) && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-[160px] rounded-lg" />
            ))}
          </div>
        )}

        {/* Results */}
        {!loading && !detailLoading && (
          <>
            {companies.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Building2 size={32} className="text-muted-foreground mb-4" />
                <p className="ds-body text-muted-foreground">Keine Organisationen gefunden.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {companies.map((c) => (
                  <Card
                    key={c.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => openDetail(c.id)}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                          <Building2 size={20} className="text-muted-foreground" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="ds-title-cards truncate">{c.name}</h3>
                          <p className="ds-caption text-muted-foreground">{c.size} Mitarbeitende</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {c.domains?.map((d) => (
                          <Badge key={d} variant="secondary" className="text-xs">{d}</Badge>
                        ))}
                      </div>
                      <p className="ds-caption text-muted-foreground">
                        {c.topic_count ?? 0} Thesis-Themen
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default OrganizationenBrowser;

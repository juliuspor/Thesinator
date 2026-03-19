import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, GraduationCap, MapPin, Briefcase, User } from "lucide-react";
import type { TopicDetail } from "@/api/types";

interface TopicDetailCardProps {
  topic: TopicDetail;
  onClose?: () => void;
}

const employmentLabel: Record<string, string> = {
  yes: "Anstellung",
  no: "Keine Anstellung",
  open: "Anstellung offen",
};

const employmentTypeLabel: Record<string, string> = {
  internship: "Praktikum",
  working_student: "Werkstudent",
  graduate_program: "Graduate Program",
  direct_entry: "Direkteinstieg",
};

const workplaceLabel: Record<string, string> = {
  on_site: "Vor Ort",
  hybrid: "Hybrid",
  remote: "Remote",
};

const degreeLabel: Record<string, string> = {
  bsc: "BSc",
  msc: "MSc",
  phd: "PhD",
};

const TopicDetailCard = ({ topic, onClose }: TopicDetailCardProps) => {
  return (
    <Card className="border-primary/20 bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="ds-title-cards leading-snug">{topic.title}</CardTitle>
          {onClose && (
            <button
              onClick={onClose}
              className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              &times;
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5 pt-1">
          <Badge variant={topic.type === "job" ? "default" : "secondary"}>
            {topic.type === "job" ? "Job" : "Thesis"}
          </Badge>
          {topic.employment && (
            <Badge variant="outline">{employmentLabel[topic.employment] ?? topic.employment}</Badge>
          )}
          {topic.employment_type && (
            <Badge variant="outline">{employmentTypeLabel[topic.employment_type] ?? topic.employment_type}</Badge>
          )}
          {topic.workplace_type && (
            <Badge variant="outline">
              <MapPin size={12} className="mr-1" />
              {workplaceLabel[topic.workplace_type] ?? topic.workplace_type}
            </Badge>
          )}
          {topic.degrees?.map((d) => (
            <Badge key={d} variant="outline">{degreeLabel[d] ?? d}</Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="ds-small text-muted-foreground">{topic.description}</p>

        {/* Fields */}
        {topic.field_names?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {topic.field_names.map((f) => (
              <Badge key={f} variant="secondary" className="text-xs">{f}</Badge>
            ))}
          </div>
        )}

        {/* Company / University */}
        <div className="flex flex-wrap gap-4 text-sm">
          {topic.company_name && (
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Building2 size={14} /> {topic.company_name}
            </span>
          )}
          {topic.university_name && (
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <GraduationCap size={14} /> {topic.university_name}
            </span>
          )}
        </div>

        {/* Supervisors */}
        {topic.supervisors?.length > 0 && (
          <div>
            <p className="ds-caption text-muted-foreground mb-1">Betreuer:innen</p>
            <div className="space-y-1">
              {topic.supervisors.map((s) => (
                <div key={s.id} className="flex items-center gap-2 text-sm">
                  <GraduationCap size={14} className="text-muted-foreground shrink-0" />
                  <span>{s.title} {s.first_name} {s.last_name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experts */}
        {topic.experts?.length > 0 && (
          <div>
            <p className="ds-caption text-muted-foreground mb-1">Expert:innen</p>
            <div className="space-y-1">
              {topic.experts.map((e) => (
                <div key={e.id} className="flex items-center gap-2 text-sm">
                  <Briefcase size={14} className="text-muted-foreground shrink-0" />
                  <span>{e.first_name} {e.last_name}</span>
                  <span className="text-muted-foreground">- {e.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopicDetailCard;

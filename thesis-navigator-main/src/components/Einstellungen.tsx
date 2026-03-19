import { useState, useEffect } from "react";
import { Settings, User, Bell, Shield, Download, Trash2, Eye, EyeOff, Lock, X, Plus, Loader2, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { fetchStudentProfile } from "@/services/data";
import type { StudentProfile } from "@/api/types";

const STUDENT_ID = import.meta.env.VITE_STUDENT_ID || "student-01";

const fallbackProfile: StudentProfile = {
  id: STUDENT_ID,
  first_name: "Luca",
  last_name: "Meier",
  email: "luca.meier@student.ethz.ch",
  degree: "msc",
  university_name: "ETH Zurich",
  study_program_name: "MSc Computer Science",
  skills: ["Python", "Machine Learning", "Data Analysis", "React", "TypeScript", "SQL"],
  field_names: ["Computer Science", "Artificial Intelligence"],
  bio: "",
};

const Einstellungen = () => {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [dirty, setDirty] = useState(false);

  // Editable fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  const [notifications, setNotifications] = useState({
    thesisMatches: true,
    messages: true,
    connections: false,
    updates: true,
  });
  const [profileVisible, setProfileVisible] = useState(true);

  useEffect(() => {
    fetchStudentProfile(STUDENT_ID)
      .then((p) => {
        setProfile(p);
        setFirstName(p.first_name);
        setLastName(p.last_name);
        setEmail(p.email);
        setBio(p.bio);
        setSkills(p.skills);
      })
      .catch(() => {
        // Fallback to hardcoded values
        const p = fallbackProfile;
        setProfile(p);
        setFirstName(p.first_name);
        setLastName(p.last_name);
        setEmail(p.email);
        setBio(p.bio);
        setSkills(p.skills);
      })
      .finally(() => setLoading(false));
  }, []);

  const markDirty = () => setDirty(true);

  const addSkill = () => {
    const tag = skillInput.trim();
    if (tag && !skills.includes(tag)) {
      setSkills((prev) => [...prev, tag]);
      markDirty();
    }
    setSkillInput("");
  };

  const removeSkill = (skill: string) => {
    setSkills((prev) => prev.filter((s) => s !== skill));
    markDirty();
  };

  const handleSave = () => {
    // Local-only save for demo — update profile state
    if (profile) {
      setProfile({
        ...profile,
        first_name: firstName,
        last_name: lastName,
        email,
        bio,
        skills,
      });
    }
    setDirty(false);
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const initials = firstName && lastName
    ? `${firstName[0]}${lastName[0]}`.toUpperCase()
    : "??";

  const degreeLabel: Record<string, string> = {
    bsc: "Bachelor of Science",
    msc: "Master of Science",
    phd: "Doctorate / PhD",
  };

  return (
    <div className="flex-1 min-h-screen w-full min-w-0">
      <header className="border-b border-border">
        <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="ds-title-md">Einstellungen</h1>
        </div>
      </header>
      <main className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 ds-title-cards">
              <User size={18} /> Profil
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {loading ? (
              <div className="flex items-center gap-3 py-8 justify-center">
                <Loader2 size={20} className="animate-spin text-muted-foreground" />
                <span className="ds-small text-muted-foreground">Profil wird geladen...</span>
              </div>
            ) : (
              <>
                {/* Avatar + Name row */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl font-semibold shrink-0">
                    {initials}
                  </div>
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="ds-caption text-muted-foreground block mb-1">Vorname</label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => { setFirstName(e.target.value); markDirty(); }}
                        className="w-full bg-card ds-small font-medium outline-none px-3 py-2 rounded-lg border border-input focus:ring-2 focus:ring-ring/20"
                      />
                    </div>
                    <div>
                      <label className="ds-caption text-muted-foreground block mb-1">Nachname</label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => { setLastName(e.target.value); markDirty(); }}
                        className="w-full bg-card ds-small font-medium outline-none px-3 py-2 rounded-lg border border-input focus:ring-2 focus:ring-ring/20"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="ds-caption text-muted-foreground block mb-1">E-Mail</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); markDirty(); }}
                    className="w-full bg-card ds-small font-medium outline-none px-3 py-2 rounded-lg border border-input focus:ring-2 focus:ring-ring/20"
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <p className="ds-caption text-muted-foreground">Universität</p>
                    <p className="ds-small font-medium">{profile?.university_name || "–"}</p>
                  </div>
                  <div>
                    <p className="ds-caption text-muted-foreground">Studiengang</p>
                    <p className="ds-small font-medium">{profile?.study_program_name || "–"}</p>
                  </div>
                  <div>
                    <p className="ds-caption text-muted-foreground">Abschluss</p>
                    <p className="ds-small font-medium">{degreeLabel[profile?.degree || ""] || profile?.degree || "–"}</p>
                  </div>
                  <div>
                    <p className="ds-caption text-muted-foreground">Fachgebiete</p>
                    <div className="flex flex-wrap gap-1.5 mt-0.5">
                      {(profile?.field_names || []).map((f) => (
                        <Badge key={f} variant="outline" className="text-xs">{f}</Badge>
                      ))}
                      {(!profile?.field_names || profile.field_names.length === 0) && (
                        <span className="ds-small font-medium">–</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="ds-caption text-muted-foreground block mb-1">Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => { setBio(e.target.value); markDirty(); }}
                    placeholder="Erzähl etwas über dich..."
                    rows={3}
                    className="w-full bg-card ds-small outline-none placeholder:text-muted-foreground px-3 py-2 rounded-lg border border-input focus:ring-2 focus:ring-ring/20 resize-y"
                  />
                </div>

                {/* Skills */}
                <div>
                  <p className="ds-caption text-muted-foreground mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="gap-1 cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors"
                        onClick={() => removeSkill(skill)}
                      >
                        {skill} <X size={12} />
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === ",") {
                          e.preventDefault();
                          addSkill();
                        }
                      }}
                      placeholder="Neuen Skill hinzufügen..."
                      className="flex-1 bg-card ds-small outline-none placeholder:text-muted-foreground px-3 py-2 rounded-lg border border-input focus:ring-2 focus:ring-ring/20"
                    />
                    <Button variant="outline" size="sm" onClick={addSkill} className="gap-1">
                      <Plus size={14} /> Hinzufügen
                    </Button>
                  </div>
                </div>

                {/* Save button */}
                {dirty && (
                  <div className="pt-2">
                    <Button onClick={handleSave} className="gap-2">
                      <Save size={16} /> Änderungen speichern
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 ds-title-cards">
              <Bell size={18} /> Benachrichtigungen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {([
              { key: "thesisMatches" as const, label: "Thesis-Matches", desc: "Neue Thesis-Themen die zu deinem Profil passen" },
              { key: "messages" as const, label: "Nachrichten", desc: "Neue Nachrichten von Kontakten und Betreuern" },
              { key: "connections" as const, label: "Connections", desc: "Neue Connection-Anfragen und Bestätigungen" },
              { key: "updates" as const, label: "Plattform-Updates", desc: "Neuigkeiten und Feature-Updates" },
            ]).map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between py-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="ds-small font-medium text-foreground">{item.label}</p>
                  <p className="ds-caption text-muted-foreground">{item.desc}</p>
                </div>
                <button
                  onClick={() => toggleNotification(item.key)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${
                    notifications[item.key] ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 mt-0.5 ${
                      notifications[item.key] ? "translate-x-[22px]" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Account */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 ds-title-cards">
              <Shield size={18} /> Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start gap-3">
              <Lock size={16} />
              Passwort ändern
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start gap-3"
              onClick={() => setProfileVisible(!profileVisible)}
            >
              {profileVisible ? <Eye size={16} /> : <EyeOff size={16} />}
              Profil-Sichtbarkeit: {profileVisible ? "Öffentlich" : "Privat"}
            </Button>

            <Button variant="outline" className="w-full justify-start gap-3">
              <Download size={16} />
              Meine Daten exportieren
            </Button>

            <Separator />

            <Button variant="outline" className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30">
              <Trash2 size={16} />
              Account löschen
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Einstellungen;

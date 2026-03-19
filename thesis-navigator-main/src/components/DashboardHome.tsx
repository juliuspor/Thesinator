import { Sparkles, Users, Search, FileText, Play, Bell, UserPlus, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";

const actionCards = [
  {
    icon: Sparkles,
    title: "KI findet dein perfektes Thema",
    description: "Erhalte personalisierte Vorschläge basierend auf Fähigkeiten und Interessen.",
    aiAccent: true,
  },
  {
    icon: Users,
    title: "Finde Experten für Interviews",
    description: "Vernetze dich mit Industrie-Expert:innen für Interviews und neue Einblicke.",
  },
  {
    icon: Search,
    title: "Alle relevanten Themen für dich",
    description: "Finde alle publizierten Themen deiner Uni und unserer Partnerunternehmen.",
  },
  {
    icon: FileText,
    title: "Schlage selbst ein Thema vor",
    description: "Finde Praxispartner, die offen sind für deinen Themenvorschlag.",
  },
  {
    icon: Play,
    title: "Videos: Thesis Writing 101",
    description: "Tipps von unseren PhDs zum Thema Abschlussarbeiten in Sozialwissenschaften.",
    videoAccent: true,
  },
];

const DashboardHome = () => {
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
            <button className="p-2 rounded-full hover:bg-accent transition-colors">
              <MessageSquare size={20} className="text-foreground" />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="ds-title-xl mb-8">Nachtschicht, Sebas? 🦉</h1>

        {/* Action cards */}
        <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {actionCards.map((card, i) => (
            <div
              key={i}
              className="border border-border rounded-lg p-5 hover:shadow-md transition-shadow duration-300 cursor-pointer bg-card"
            >
              <div className="mb-4">
                <card.icon
                  size={24}
                  className={
                    card.aiAccent
                      ? "text-ai-from"
                      : card.videoAccent
                      ? "text-destructive"
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

        {/* Favorites */}
        <h2 className="ds-title-md mb-6">Meine favorisierten Themen</h2>
        <div className="bg-muted rounded-lg p-8 sm:p-12 flex flex-col items-center justify-center min-h-[240px]">
          <Bookmark size={32} className="text-muted-foreground mb-4" />
          <p className="ds-body text-foreground mb-4">Keine Elemente</p>
          <Button variant="default" className="rounded-full">
            Geh zu Themen
          </Button>
        </div>
      </main>
    </div>
  );
};

export default DashboardHome;

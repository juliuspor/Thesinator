import { Home, MessageSquare, FolderOpen, Compass, Search, Users, Building2, Settings, GraduationCap, ChevronDown } from "lucide-react";
import studyondLogo from "@/assets/studyond.svg";

interface AppSidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

const personalItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "nachrichten", label: "Nachrichten", icon: MessageSquare },
  { id: "projekte", label: "Meine Projekte", icon: FolderOpen },
];

const erkundenItems = [
  { id: "themen", label: "Themen", icon: Compass },
  { id: "thesis-finder", label: "Thesis Finder", icon: GraduationCap },
  { id: "jobs", label: "Jobs", icon: Search },
  { id: "personen", label: "Personen", icon: Users, hasSubmenu: true },
  { id: "organisationen", label: "Organisationen", icon: Building2, hasSubmenu: true },
];

const AppSidebar = ({ activeItem, onItemClick }: AppSidebarProps) => {
  return (
    <aside className="flex w-full flex-col justify-between border-b border-border bg-background px-3 py-4 lg:w-[240px] lg:border-b-0 lg:border-r lg:min-h-screen">
      <div>
        <div className="mb-6 px-2">
          <img src={studyondLogo} alt="Studyond" className="h-6" />
        </div>

        <div className="mb-6">
          <p className="ds-caption text-muted-foreground px-2 mb-2">Persönlich</p>
          {personalItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={`flex items-center gap-3 w-full px-2 py-2 rounded-lg ds-small transition-colors duration-200 ${
                activeItem === item.id
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-foreground hover:bg-accent"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </div>

        <div>
          <p className="ds-caption text-muted-foreground px-2 mb-2">Erkunden</p>
          {erkundenItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={`flex items-center justify-between gap-3 w-full px-2 py-2 rounded-lg ds-small transition-colors duration-200 ${
                activeItem === item.id
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-foreground hover:bg-accent"
              }`}
            >
              <span className="flex items-center gap-3">
                <item.icon size={18} />
                {item.label}
              </span>
              {item.hasSubmenu && <ChevronDown size={16} className="text-muted-foreground" />}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-border pt-3">
        <button
          onClick={() => onItemClick("einstellungen")}
          className="flex items-center gap-3 w-full px-2 py-2 rounded-lg ds-small text-foreground hover:bg-accent transition-colors duration-200"
        >
          <Settings size={18} />
          Meine Einstellungen
        </button>
        <div className="flex items-center gap-3 px-2 py-2 mt-1">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center ds-badge text-muted-foreground">
            MH
          </div>
          <div className="flex-1 min-w-0">
            <p className="ds-small font-medium truncate">Marvin Heine</p>
            <p className="ds-caption text-muted-foreground truncate">marvin.heine@student.hpi.de</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;

import { useEffect, useState } from "react";
import AppSidebar from "@/components/AppSidebar";
import DashboardHome from "@/components/DashboardHome";
import ThesisFinder from "@/components/ThesisFinder";
import ThesisProposal from "@/components/ThesisProposal";
import NetworkFlow from "@/components/NetworkFlow";
import NetworkMessages from "@/components/NetworkMessages";
import OrganizationenBrowser from "@/components/OrganizationenBrowser";
import ThemenBrowser from "@/components/ThemenBrowser";
import JobsBrowser from "@/components/JobsBrowser";
import PersonenBrowser from "@/components/PersonenBrowser";
import MeineProjekte from "@/components/MeineProjekte";
import Einstellungen from "@/components/Einstellungen";
import type { PersonaMatch } from "@/api/types";

const ACTIVE_ITEM_STORAGE_KEY = "starthack-active-sidebar-item";
const FUTURE_SESSION_STORAGE_KEY = "starthack-active-future-session";

const Index = () => {
  const [activeItem, setActiveItem] = useState(() => {
    if (typeof window === "undefined") {
      return "home";
    }

    const storedActiveItem = window.sessionStorage.getItem(ACTIVE_ITEM_STORAGE_KEY);
    if (storedActiveItem) {
      return storedActiveItem;
    }

    return window.sessionStorage.getItem(FUTURE_SESSION_STORAGE_KEY) ? "thesis-finder" : "home";
  });

  const [connectedPersonas, setConnectedPersonas] = useState<PersonaMatch[]>([]);
  const [networkSessionId, setNetworkSessionId] = useState<string>("");

  // Persist active sidebar item to session storage
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.sessionStorage.setItem(ACTIVE_ITEM_STORAGE_KEY, activeItem);
  }, [activeItem]);

  const renderContent = () => {
    switch (activeItem) {
      case "thesis-finder":
        return <ThesisFinder />;
      case "eigene-thesis":
        return <ThesisProposal />;
      case "gini-connect":
        return (
          <NetworkFlow
            onConnectionsChange={setConnectedPersonas}
            onSessionIdChange={setNetworkSessionId}
          />
        );
      case "nachrichten":
        return (
          <NetworkMessages
            connectedPersonas={connectedPersonas}
            parentSessionId={networkSessionId}
            onNavigateToConnect={() => setActiveItem("gini-connect")}
          />
        );
      case "projekte":
        return <MeineProjekte onNavigate={setActiveItem} />;
      case "einstellungen":
        return <Einstellungen />;
      default:
        return <DashboardHome onNavigate={setActiveItem} />;
    }
  };

  return (
    <div className="min-h-dvh bg-background">
      <div className="mx-auto flex min-h-dvh w-full max-w-[1600px] flex-col lg:flex-row">
        <AppSidebar
          activeItem={activeItem}
          onItemClick={setActiveItem}
          messageCount={connectedPersonas.length}
        />
        <main className="flex min-w-0 flex-1">
          {/* Browse tabs always mounted for state pinning */}
          <div className={activeItem === "themen" ? "flex min-w-0 flex-1" : "hidden"}>
            <ThemenBrowser />
          </div>
          <div className={activeItem === "personen" ? "flex min-w-0 flex-1" : "hidden"}>
            <PersonenBrowser onNavigate={setActiveItem} />
          </div>
          <div className={activeItem === "organisationen" ? "flex min-w-0 flex-1" : "hidden"}>
            <OrganizationenBrowser />
          </div>
          <div className={activeItem === "jobs" ? "flex min-w-0 flex-1" : "hidden"}>
            <JobsBrowser />
          </div>
          {!["themen", "personen", "organisationen", "jobs"].includes(activeItem) && renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;

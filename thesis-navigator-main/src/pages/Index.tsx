import { useEffect, useState } from "react";
import AppSidebar from "@/components/AppSidebar";
import DashboardHome from "@/components/DashboardHome";
import ThesisFinder from "@/components/ThesisFinder";

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

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.sessionStorage.setItem(ACTIVE_ITEM_STORAGE_KEY, activeItem);
  }, [activeItem]);

  return (
    <div className="min-h-dvh bg-background">
      <div className="mx-auto flex min-h-dvh w-full max-w-[1600px] flex-col lg:flex-row">
        <AppSidebar activeItem={activeItem} onItemClick={setActiveItem} />
        <main className="flex min-w-0 flex-1">
          {activeItem === "thesis-finder" ? <ThesisFinder /> : <DashboardHome />}
        </main>
      </div>
    </div>
  );
};

export default Index;

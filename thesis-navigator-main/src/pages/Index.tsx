import { useState } from "react";
import AppSidebar from "@/components/AppSidebar";
import DashboardHome from "@/components/DashboardHome";
import ThesisFinder from "@/components/ThesisFinder";

const Index = () => {
  const [activeItem, setActiveItem] = useState("home");

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

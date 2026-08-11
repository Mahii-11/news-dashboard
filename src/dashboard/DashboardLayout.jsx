import { useState } from "react";
import { Outlet, useNavigate } from "react-router";

import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function DashboardLayout() {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onNavigate={(path) => navigate(path)}
      />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <TopBar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <div className="flex-1 overflow-auto no-scrollbar bg-background">
          <div className="p-6 md:p-8  max-w-[1400px]  mx-auto w-full">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
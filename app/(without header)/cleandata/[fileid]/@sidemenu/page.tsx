// SideMenu.tsx
"use client";

import { Input } from "@/components/ui/input";
import DatasetsSection from "@/components/workstationUi/DatasetsSection";
import IssuesSection from "@/components/workstationUi/IssuesSection";

export default function SideMenu() {
  
  return (
    <div className="w-full h-screen py-4 overflow-y-auto custom-scrollbar" style={{ color: "hsl(var(--sidebar-foreground))" }}>
      <Input
        type="search"
        placeholder="Search..."
        className="w-11/12 px-3 py-5 rounded-lg mb-3 secondaryBg focus:outline-none border-none border-gray-300 mx-auto"
        onChange={(e) => console.log(e.target.value)}
      />

      <DatasetsSection  />
      <IssuesSection  />
    </div>
  );
}
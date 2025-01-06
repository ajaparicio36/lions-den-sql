"use client";
import React, { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "../ui/sidebar";
import TeamSwitcher from "./TeamSwitcher";
import { getUserTeams } from "./teamActions";

interface Team {
  name: string;
  logoUrl: string | null;
}

interface TeamWrapper {
  team: Team;
}

const AppSidebar = ({ uid }: { uid: string }) => {
  const [teams, setTeams] = useState<TeamWrapper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getTeams = async () => {
      const teams = await getUserTeams(uid);
      setTeams(teams);
      setLoading(false);
    };
    getTeams();
  }, [uid]);

  if (!!loading) {
    return (
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <div className="skeleton h-8 w-8 rounded-full bg-accent animate-pulse " />
            <div className="skeleton h-4 w-[100px] bg-accent animate-pulse rounded-lg" />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <div className="space-y-4 p-2">
            <div className="flex items-center gap-2">
              <div className="skeleton h-8 w-8 rounded-full bg-accent animate-pulse" />
              <div className="skeleton h-4 w-[120px] bg-accent animate-pulse rounded-lg" />
            </div>
            <div className="flex items-center gap-2">
              <div className="skeleton h-8 w-8 rounded-full bg-accent animate-pulse" />
              <div className="skeleton h-4 w-[120px] bg-accent animate-pulse rounded-lg" />
            </div>
            <div className="flex items-center gap-2">
              <div className="skeleton h-8 w-8 rounded-full bg-accent animate-pulse" />
              <div className="skeleton h-4 w-[120px] bg-accent animate-pulse rounded-lg" />
            </div>
          </div>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center gap-2 p-2">
            <div className="skeleton h-8 w-8 rounded-full bg-accent animate-pulse" />
            <div className="skeleton h-4 w-[100px] bg-accent animate-pulse rounded-lg" />
          </div>
        </SidebarFooter>
      </Sidebar>
    );
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <TeamSwitcher
          teams={teams.map((wrapper) => ({
            name: wrapper.team.name,
            logoUrl: wrapper.team.logoUrl ?? "",
          }))}
        />
      </SidebarHeader>
      <SidebarContent></SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;

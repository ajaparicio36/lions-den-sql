"use client";
import React, { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "../ui/sidebar";
import { getUserTeams } from "./teamActions";
import TeamSwitcher from "./TeamSwitcher";
import { User } from "@prisma/client";
import { getUser } from "@/app/hub/actions";
import { UserGroup } from "./UserGroup";
import { LayoutDashboard, Users } from "lucide-react";
import { SidebarLinks } from "./SidebarLinks";

interface TeamPreview {
  id: string;
  name: string;
  logoUrl: string | null;
}

/*
{
  items,
}: {
  items: {
    title: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}
*/

const Items = [
  {
    title: "The Den",
    icon: LayoutDashboard,
    items: [
      {
        title: "Feed",
        url: "/hub/posts",
      },
      {
        title: "Scrimmages",
        url: "/hub/scrims",
      },
      {
        title: "Events",
        url: "/hub/schedule",
      },
    ],
  },
  {
    title: "Management",
    icon: Users,
    items: [
      {
        title: "Members",
        url: "/hub/members",
      },
      {
        title: "Team",
        url: "/hub/settings",
      },
    ],
  },
];

const AppSidebar = ({
  uid,
  email,
  teamId,
}: {
  uid: string;
  email: string;
  teamId: string;
}) => {
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState<TeamPreview[]>([]);
  const [userData, setUserData] = useState<User | null>(null);
  const user = {
    uid,
    email,
  };

  useEffect(() => {
    const getTeams = async () => {
      const { teams: userTeams } = await getUserTeams(uid);
      setTeams(userTeams ?? []);
    };
    const getUserData = async () => {
      const data = await getUser(uid);
      setUserData(data.user);
    };
    getUserData();
    getTeams();
    setLoading(false);
  }, [uid, teamId]);

  if (!teamId || !uid) {
    return null;
  }

  if (!!loading || teams.length === 0) {
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
          teams={teams.map((team) => ({
            ...team,
            logoUrl: team.logoUrl || "",
          }))}
          teamId={teamId}
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarLinks items={Items} />
      </SidebarContent>
      <SidebarFooter>
        <UserGroup user={user} userData={userData} />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;

"use client";
import { ChevronsUpDown, PawPrint, Plus } from "lucide-react";
import React, { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { switchTeam } from "./teamActions";
import CreateTeamDialog from "../teams/create/CreateTeamDialog";

interface Team {
  teams: {
    id: string;
    name: string;
    logoUrl: string;
  }[];
  teamId: string;
}

const TeamSwitcher: React.FC<Team> = ({ teams, teamId }) => {
  const { isMobile } = useSidebar();
  const [activeTeam, setActiveTeam] = useState(
    teams.find((team) => team.id === teamId) || teams[0]
  );
  const [loading, setLoading] = useState(true);
  const [addTeamDialogOpen, setAddTeamDialogOpen] = useState(false);
  console.log(teams);
  console.log("Active", activeTeam);
  console.log("TeamId", teamId);

  useEffect(() => {
    setActiveTeam(teams.find((team) => team.id === teamId) || teams[0]);
    setLoading(false);
  }, [teams, teamId]);

  const handleSwitchTeam = async (id: string) => {
    setActiveTeam(teams.find((team) => team.id === id) || teams[0]);
    await switchTeam(id);
  };

  if (loading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground justify-center"
          >
            <div className="flex items-center gap-2 p-2 ml-2">
              <div className="h-6 w-6 rounded-full flex items-center justify-center animate-pulse">
                <PawPrint size={36} />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Loading Teams</span>
              </div>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (teams.length === 0) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground justify-center"
          >
            <div className="flex items-center gap-2 p-2 ml-2">
              <div className="h-6 w-6 rounded-full flex items-center justify-center animate-pulse">
                <PawPrint size={36} />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">No Teams Yet</span>
                <span className="truncate text-xs">Click here to add!</span>
              </div>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <CreateTeamDialog
          isOpen={addTeamDialogOpen}
          setIsOpen={setAddTeamDialogOpen}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="size-8">
                <AvatarImage
                  asChild
                  className="rounded-lg"
                  src={activeTeam.logoUrl}
                >
                  <Image
                    src={activeTeam.logoUrl}
                    alt={`${activeTeam.name} logo`}
                    width={32}
                    height={32}
                  />
                </AvatarImage>
                <AvatarFallback className="rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  {activeTeam.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeTeam.name}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Teams
            </DropdownMenuLabel>
            {teams.map((team, index) => (
              <DropdownMenuItem
                key={team.name}
                onClick={() => handleSwitchTeam(team.id)}
                className="gap-2 p-2"
              >
                <Avatar className="size-8">
                  <AvatarImage
                    asChild
                    className="rounded-lg"
                    src={team.logoUrl}
                  >
                    <Image
                      src={team.logoUrl}
                      alt={`${team.name} logo`}
                      width={32}
                      height={32}
                    />
                  </AvatarImage>
                  <AvatarFallback className="rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    {team.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {team.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div
                className="font-medium text-muted-foreground"
                onClick={() => setAddTeamDialogOpen(true)}
              >
                Add team
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default TeamSwitcher;

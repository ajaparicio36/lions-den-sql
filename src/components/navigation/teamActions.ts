"use server";
import { getSession } from "@/lib/auth/auth-cookies";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export interface UserTeams {
  team: {
    id: string;
    name: string;
    logoUrl: string;
  };
}

export const getUserTeams = async (userId: string) => {
  const userTeams = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      teams: {
        select: {
          team: {
            select: {
              id: true,
              name: true,
              logoUrl: true,
            },
          },
        },
      },
    },
  });

  if (!userTeams) {
    return { teams: [] };
  }

  return { teams: userTeams.teams.map((member) => member.team) };
};

export const getCurrentTeam = async () => {
  try {
    const cookieStore = await cookies();
    const teamId = cookieStore.get("currentTeamId");
    const user = await getSession();

    if (!user) {
      throw new Error("User not found");
    }

    if (!teamId) {
      const firstTeam = await prisma.teamMember.findFirst({
        where: {
          userId: user.uid,
        },
        select: {
          team: true,
        },
      });

      if (!firstTeam) {
        return null;
      }

      return firstTeam.team;
    }

    const team = await prisma.team.findUnique({
      where: {
        id: teamId.value,
      },
    });

    return team;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const switchTeam = async (teamId: string) => {
  const cookieStore = await cookies();
  cookieStore.delete("currentTeamId");
  cookieStore.set("currentTeamId", teamId);
};

"use server";
import { prisma } from "@/lib/prisma";

export interface UserTeams {
  team: {
    id: string;
    name: string;
    logoUrl: string;
  };
}

export const getUserTeams = async (userId: string) => {
  const userTeams = await prisma.teamMember.findMany({
    where: {
      userId,
    },
    select: {
      team: {
        select: {
          id: true,
          name: true,
          logoUrl: true,
        },
      },
    },
  });

  return userTeams;
};

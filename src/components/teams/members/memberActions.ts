"use server";
import prisma from "@/lib/prisma";

export const getTeamMembers = async (teamId: string) => {
  return await prisma.teamMember.findMany({
    where: {
      teamId,
    },
    include: {
      user: true,
    },
  });
};

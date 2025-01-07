"use server";
import { getSession } from "@/lib/auth/auth-cookies";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import { cookies } from "next/headers";

export const generateInviteLink = async (
  teamId: string,
  teamMemberId: string,
  expiry: Date
) => {
  try {
    const inviteCode = crypto.randomBytes(6).toString("hex").toUpperCase();

    const member = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId: teamId,
          userId: teamMemberId,
        },
      },
    });

    if (!member) {
      throw new Error("You are not a member of this team");
    }

    const inviteObject = await prisma.inviteCode.create({
      data: {
        code: inviteCode,
        teamId,
        teamMemberId: member.id,
        expiresAt: expiry,
      },
    });

    return inviteObject;
  } catch (error) {
    if (error instanceof Error) {
      return { error: true, message: error.message };
    }
    return { error: true, message: "An error occurred" };
  }
};

export const joinTeam = async (inviteCode: string) => {
  try {
    const cookieStore = await cookies();
    const user = await getSession();

    if (!user) {
      throw new Error("You must be logged in to join a team");
    }

    const invite = await prisma.inviteCode.findUnique({
      where: {
        code: inviteCode,
      },
    });

    if (!invite || !invite.expiresAt) {
      throw new Error("Invite not found");
    }

    if (invite.expiresAt < new Date()) {
      throw new Error("Invite has expired");
    }

    const teamMember = await prisma.teamMember.create({
      data: {
        userId: user.uid,
        teamId: invite.teamId,
        role: "MEMBER",
      },
    });

    cookieStore.set("currentTeamId", invite.teamId);

    return teamMember;
  } catch (error) {
    if (error instanceof Error) {
      return { error: true, message: error.message };
    }
    return { error: true, message: "An error occurred" };
  }
};

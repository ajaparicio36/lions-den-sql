"use server";
import prisma from "@/lib/prisma";

export const createUser = async (uid: string, ign: string) => {
  try {
    const user = await prisma.user.create({
      data: {
        id: uid,
        ign: ign,
      },
    });

    return user;
  } catch (error) {
    console.error(error);
  }
};

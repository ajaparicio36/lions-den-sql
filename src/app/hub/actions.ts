"use server";
import { handleFirebaseError } from "@/lib/auth/firebaseErrors";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export const checkIfUserExists = async (uid: string | null) => {
  try {
    if (!uid) {
      throw new Error("User not found");
    }
    const userEntry = await prisma.user.findUnique({
      where: {
        id: uid,
      },
    });

    if (!userEntry) {
      return { user: null };
    }

    return { user: userEntry };
  } catch (error) {
    const { message } = handleFirebaseError(error);
    redirect(`/error?message=${encodeURIComponent(message)}`);
  }
};

export const getUser = async (uid: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: uid,
      },
    });

    if (!user) {
      return { user: null };
    }

    return { user };
  } catch (error) {
    console.error(error);
    redirect(`/error?message=${encodeURIComponent("User not found")}`);
  }
};

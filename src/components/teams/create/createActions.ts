"use server";
import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";
import { z } from "zod";
import { createTeamFormSchema } from "./CreateTeamForm";
import { getSession } from "@/lib/auth/auth-cookies";
import { handleSupabaseStorageError } from "@/lib/supabase/supabaseErrors";
import { cookies } from "next/headers";

export const createTeam = async (
  values: z.infer<typeof createTeamFormSchema>
) => {
  try {
    const supabase = await createClient();
    const user = await getSession();
    const cookieStore = await cookies();

    if (!user) {
      throw new Error("User not found");
    }

    const path = `${values.name}_${crypto.randomBytes(4).toString("hex")}`;

    const { data, error } = await supabase.storage
      .from("photos")
      .upload(`teams/${path}`, values.logo);

    if (error) {
      const { message } = handleSupabaseStorageError(error);
      throw new Error(message);
    }

    const { data: photoData } = await supabase.storage
      .from("photos")
      .getPublicUrl(data.path);

    const newTeam = await prisma.team.create({
      data: {
        name: values.name,
        bio: values.bio,
        logoUrl: photoData.publicUrl,
        ownerId: user.uid,
      },
    });

    cookieStore.set("currentTeamId", newTeam.id);

    await prisma.teamMember.create({
      data: {
        userId: user.uid,
        teamId: newTeam.id,
        role: "ADMIN",
      },
    });

    return newTeam;
  } catch (error) {
    if (error instanceof Error) {
      return error.message;
    } else {
      return { error: true, message: "An unknown error occurred" };
    }
  }
};

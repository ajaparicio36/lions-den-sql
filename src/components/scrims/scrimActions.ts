"use server";
import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";
import sharp from "sharp";
import { z } from "zod";
import { getSession } from "@/lib/auth/auth-cookies";
import { handleSupabaseStorageError } from "@/lib/supabase/supabaseErrors";
import { createScrimFormSchema } from "./CreateScrimForm";

async function processImage(file: Buffer) {
  try {
    // Process image with Sharp
    const processedImage = await sharp(file)
      .jpeg({ quality: 80 }) // Convert to JPEG with 80% quality
      .resize(1920, 1080, {
        // Resize to max dimensions while maintaining aspect ratio
        fit: "inside",
        withoutEnlargement: true,
      })
      .toBuffer();

    return processedImage;
  } catch (error) {
    console.error("Error processing image:", error);
    throw new Error("Failed to process image");
  }
}

export const createScrimLog = async (
  teamId: string,
  values: z.infer<typeof createScrimFormSchema>
) => {
  try {
    const supabase = await createClient();
    const user = await getSession();

    if (!user) {
      throw new Error("User not found");
    }

    // Check if user is a member of the team
    const teamMember = await prisma.teamMember.findFirst({
      where: {
        userId: user.uid,
        teamId: teamId,
      },
    });

    if (!teamMember) {
      throw new Error("User is not a member of this team");
    }

    // Handle multiple photo uploads
    const photoUrls: string[] = [];

    if (values.photos && values.photos.length > 0) {
      for (const photo of values.photos) {
        try {
          // Convert File/Blob to Buffer for Sharp processing
          const buffer = Buffer.from(await photo.arrayBuffer());

          // Process the image with Sharp
          const processedImageBuffer = await processImage(buffer);

          const path = `scrim_logs/${teamId}/${crypto
            .randomBytes(4)
            .toString("hex")}.jpg`;

          // Upload processed image to Supabase
          const { data, error } = await supabase.storage
            .from("photos")
            .upload(path, processedImageBuffer, {
              contentType: "image/jpeg",
              cacheControl: "3600",
            });

          if (error) {
            const { message } = handleSupabaseStorageError(error);
            throw new Error(message);
          }

          const { data: photoData } = await supabase.storage
            .from("photos")
            .getPublicUrl(data.path);

          photoUrls.push(photoData.publicUrl);
        } catch (error) {
          console.error(`Failed to process and upload image:`, error);
          throw new Error("Failed to process and upload image");
        }
      }
    }

    // Create the ScrimLog entry
    const newScrimLog = await prisma.scrimLog.create({
      data: {
        name: values.name,
        description: values.description,
        photos: photoUrls,
        scrimDate: values.scrimDate,
        teamId: teamId,
        teamMemberId: teamMember.id,
      },
    });

    return newScrimLog;
  } catch (error) {
    if (error instanceof Error) {
      return error.message;
    } else {
      return { error: true, message: "An unknown error occurred" };
    }
  }
};

export const getScrims = async (teamId: string) => {
  try {
    const scrims = await prisma.scrimLog.findMany({
      where: {
        teamId: teamId,
      },
      include: {
        teamMember: {
          include: {
            user: {
              select: {
                ign: true,
              },
            },
          },
        },
      },
      orderBy: {
        scrimDate: "desc",
      },
    });

    return scrims;
  } catch (error) {
    console.error("Failed to fetch scrims:", error);
    return null;
  }
};

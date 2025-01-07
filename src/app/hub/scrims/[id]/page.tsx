import { getSession } from "@/lib/auth/auth-cookies";
import React from "react";
import { checkIfUserExists } from "../../actions";
import { redirect } from "next/navigation";
import UserSetupCard from "@/components/user-setup/UserSetupCard";
import {
  getCurrentTeam,
  getUserTeams,
} from "@/components/navigation/teamActions";
import prisma from "@/lib/prisma";
import ScrimPageCard from "@/components/scrims/ScrimPageCard";

const ScrimPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const decodedClaims = await getSession();
  const { id: scrimId } = await params;

  if (!decodedClaims) {
    redirect("/login");
  }

  const { user } = await checkIfUserExists(decodedClaims?.uid);
  if (!user) {
    return (
      <div className="flex flex-col gap-2 w-full h-screen justify-center items-center">
        <UserSetupCard uid={decodedClaims.uid} />
      </div>
    );
  }

  const { teams: userTeams } = await getUserTeams(decodedClaims.uid);

  if (userTeams.length === 0) {
    redirect("/hub");
  }

  const currentTeam = await getCurrentTeam();

  if (!currentTeam) {
    redirect("/hub");
  }

  const currentScrim = await prisma.scrimLog.findUnique({
    where: {
      id: scrimId,
    },
  });

  if (!currentScrim) {
    redirect("/hub/scrims");
  }

  return (
    <div className="flex flex-col gap-2 h-[90vh] justify-center items-center">
      <ScrimPageCard scrim={currentScrim} />
    </div>
  );
};

export default ScrimPage;

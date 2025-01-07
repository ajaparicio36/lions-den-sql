import SignoutTry from "@/components/auth/SignoutTry";
import { getSession } from "@/lib/auth/auth-cookies";
import React from "react";
import { checkIfUserExists } from "../actions";
import { redirect } from "next/navigation";
import UserSetupCard from "@/components/user-setup/UserSetupCard";
import {
  getCurrentTeam,
  getUserTeams,
} from "@/components/navigation/teamActions";

const Scrims = async () => {
  const decodedClaims = await getSession();

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

  return (
    <div className="flex flex-col gap-2 h-[90vh] justify-center items-center">
      This is the scrim log for {currentTeam.name} <SignoutTry />{" "}
    </div>
  );
};

export default Scrims;

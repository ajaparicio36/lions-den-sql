import SignoutTry from "@/components/auth/SignoutTry";
import { getSession } from "@/lib/auth/auth-cookies";
import React from "react";
import { checkIfUserExists } from "./actions";
import { redirect } from "next/navigation";
import UserSetupCard from "@/components/user-setup/UserSetupCard";
import {
  getCurrentTeam,
  getUserTeams,
} from "@/components/navigation/teamActions";
import CreateOrJoin from "@/components/navigation/CreateOrJoin";

const Hub = async () => {
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

  const currentTeam = await getCurrentTeam();

  if (userTeams.length === 0) {
    return (
      <div className="flex flex-col gap-2 h-[90vh] justify-center items-center">
        <div className="text-2xl font-bold">You have no teams</div>
        <CreateOrJoin />
      </div>
    );
  }

  return (
    <div>
      Hello user {user.ign || decodedClaims.uid}, you are viewing{" "}
      {currentTeam?.name} <SignoutTry />{" "}
    </div>
  );
};

export default Hub;

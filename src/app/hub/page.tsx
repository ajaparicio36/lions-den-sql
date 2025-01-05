import SignoutTry from "@/components/auth/SignoutTry";
import { getSession } from "@/lib/auth/auth-cookies";
import React from "react";
import { checkIfUserExists } from "./actions";
import { redirect } from "next/navigation";
import UserSetupCard from "@/components/user-setup/UserSetupCard";

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

  return (
    <div>
      Hello user {user.ign || decodedClaims.uid} <SignoutTry />{" "}
    </div>
  );
};

export default Hub;

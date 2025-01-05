import SignoutTry from "@/components/auth/SignoutTry";
import { getSession } from "@/lib/auth/auth-cookies";
import React from "react";

const Hub = async () => {
  const decodedClaims = await getSession();

  return (
    <div>
      Hello user {decodedClaims?.uid || decodedClaims?.email} <SignoutTry />
    </div>
  );
};

export default Hub;

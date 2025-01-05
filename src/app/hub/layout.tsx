import { getSession } from "@/lib/auth/auth-cookies";
import { redirect } from "next/navigation";
import React from "react";

const HubLayout = async ({ children }: { children: React.ReactNode }) => {
  const decodedClaims = await getSession();
  if (!decodedClaims) {
    redirect("/login");
  }
  return <section>{children}</section>;
};

export default HubLayout;

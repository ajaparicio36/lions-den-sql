import AccountTabs from "@/components/auth/AccountTabs";
import { getSession } from "@/lib/auth/auth-cookies";
import { GuitarIcon } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";

const LoginPage = async () => {
  const decodedClaims = await getSession();
  if (!!decodedClaims) {
    redirect("/hub");
  }
  return (
    <div className="flex flex-col gap-2 w-full h-screen justify-center items-center">
      <div className="flex flex-row items-center gap-2">
        <GuitarIcon size={36} />
        <span className="text-4xl font-bold">Lions Den</span>
      </div>
      <AccountTabs />
    </div>
  );
};

export default LoginPage;

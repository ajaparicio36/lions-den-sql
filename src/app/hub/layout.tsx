import AppSidebar from "@/components/navigation/AppSidebar";
import AppSidebarInset from "@/components/navigation/AppSidebarInset";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getSession } from "@/lib/auth/auth-cookies";
import { redirect } from "next/navigation";
import React from "react";

const HubLayout = async ({ children }: { children: React.ReactNode }) => {
  const decodedClaims = await getSession();
  if (!decodedClaims) {
    redirect("/login");
  }

  return (
    <SidebarProvider>
      <AppSidebar uid={decodedClaims.uid} />
      <AppSidebarInset>
        <section>{children}</section>
      </AppSidebarInset>
    </SidebarProvider>
  );
};

export default HubLayout;

import AppSidebar from "@/components/navigation/AppSidebar";
import AppSidebarInset from "@/components/navigation/AppSidebarInset";
import { getCurrentTeam } from "@/components/navigation/teamActions";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getSession } from "@/lib/auth/auth-cookies";
import { redirect } from "next/navigation";
import React from "react";

const HubLayout = async ({ children }: { children: React.ReactNode }) => {
  const decodedClaims = await getSession();

  if (!decodedClaims) {
    redirect("/login");
  }

  const currentTeam = await getCurrentTeam();

  if (!currentTeam) {
    return (
      <SidebarProvider>
        <AppSidebarInset>
          <section>{children}</section>
        </AppSidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar
        uid={decodedClaims.uid}
        email={decodedClaims.email || "none"}
        teamId={currentTeam.id}
      />
      <AppSidebarInset>
        <section>{children}</section>
      </AppSidebarInset>
    </SidebarProvider>
  );
};

export default HubLayout;

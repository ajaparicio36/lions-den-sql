"use client";
import React from "react";
import { SidebarInset, SidebarTrigger } from "../ui/sidebar";

const AppSidebarInset = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarInset>
      <header className="flex border-b h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
        </div>
      </header>
      <div className="m-4">{children}</div>
    </SidebarInset>
  );
};

export default AppSidebarInset;

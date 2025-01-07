"use client";
import React, { useState } from "react";
import CreateScrimDialog from "./CreateScrimDialog";
import { Button } from "../ui/button";

const ScrimHeader = ({ teamId }: { teamId: string }) => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  return (
    <div>
      <CreateScrimDialog
        teamId={teamId}
        isOpen={dialogOpen}
        setIsOpen={setDialogOpen}
      />
      <Button onClick={() => setDialogOpen(true)}>Create Scrim</Button>
    </div>
  );
};

export default ScrimHeader;

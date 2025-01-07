"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import CreateTeamDialog from "../teams/create/CreateTeamDialog";

const CreateOrJoin = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="flex flex-row text-lg gap-4 items-center">
      <CreateTeamDialog isOpen={dialogOpen} setIsOpen={setDialogOpen} />
      <Button onClick={() => setDialogOpen(true)}>Create Team</Button>
      <span>OR</span>
      <Button>Join Team</Button>
    </div>
  );
};

export default CreateOrJoin;

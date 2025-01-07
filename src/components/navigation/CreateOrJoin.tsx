"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import CreateTeamDialog from "../teams/create/CreateTeamDialog";
import JoinTeamDialog from "../teams/invite/JoinTeamDialog";

const CreateOrJoin = () => {
  const [addTeamDialogOpen, setAddTeamDialogOpen] = useState(false);
  const [joinTeamDialogOpen, setJoinTeamDialogOpen] = useState(false);

  return (
    <div className="flex flex-row text-lg gap-4 items-center">
      <CreateTeamDialog
        isOpen={addTeamDialogOpen}
        setIsOpen={setAddTeamDialogOpen}
      />
      <JoinTeamDialog
        isOpen={joinTeamDialogOpen}
        setIsOpen={setJoinTeamDialogOpen}
      />
      <Button onClick={() => setAddTeamDialogOpen(true)}>Create Team</Button>
      <span>OR</span>
      <Button onClick={() => setJoinTeamDialogOpen(true)}>Join Team</Button>
    </div>
  );
};

export default CreateOrJoin;

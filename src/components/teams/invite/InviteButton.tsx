"use client";
import React, { Fragment, useState } from "react";
import { Button } from "@/components/ui/button";
import CreateInviteDialog from "./CreateInviteDialog";

const InviteButton = ({
  teamId,
  teamMemberId,
}: {
  teamId: string;
  teamMemberId: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Fragment>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-blue-500 text-white"
      >
        Invite
      </Button>
      <CreateInviteDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        teamId={teamId}
        teamMemberId={teamMemberId}
      />
    </Fragment>
  );
};

export default InviteButton;

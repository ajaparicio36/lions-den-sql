"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CreateInviteForm from "./CreateInviteForm";
import { useRouter } from "next/navigation";

const CreateInviteDialog = ({
  teamId,
  teamMemberId,
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  teamId: string;
  teamMemberId: string;
}) => {
  const router = useRouter();

  const handleClose = () => {
    router.refresh();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create A Team</DialogTitle>
          <DialogDescription>
            Create a new team to collaborate with your friends and colleagues.
          </DialogDescription>
        </DialogHeader>

        <CreateInviteForm
          onSubmitSuccess={handleClose}
          teamId={teamId}
          teamMemberId={teamMemberId}
        />

        <DialogFooter>
          <p className="text-sm text-gray-500">
            This will create a new team invite.
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateInviteDialog;

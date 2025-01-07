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
import CreateTeamForm from "./CreateTeamForm";
import { useRouter } from "next/navigation";

const CreateTeamDialog = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
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
          <CreateTeamForm onSubmitSuccess={handleClose} />
        </DialogHeader>
        <DialogFooter>
          <p className="text-sm text-gray-500">
            This will take you to the new team.
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTeamDialog;

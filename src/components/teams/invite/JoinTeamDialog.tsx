"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { joinTeam } from "./inviteActions";

export const createInviteFormSchema = z.object({
  inviteCode: z.string(),
});

const JoinTeamDialog = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    router.refresh();
    setIsOpen(false);
  };

  const form = useForm<z.infer<typeof createInviteFormSchema>>({
    resolver: zodResolver(createInviteFormSchema),
    defaultValues: {
      inviteCode: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof createInviteFormSchema>) => {
    try {
      const newTeam = await joinTeam(values.inviteCode);

      if ("error" in newTeam) {
        throw new Error(newTeam.message);
      }

      handleClose();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join A Team</DialogTitle>
          <DialogDescription>
            Join an already existing team by entering the invite code.
          </DialogDescription>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="inviteCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Name</FormLabel>
                    <FormControl className="flex flex-row">
                      <Input placeholder="Invite Code" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is the code you received to join the team.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && <FormMessage>{error}</FormMessage>}
              <Button type="submit">Join Team</Button>
            </form>
          </Form>
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

export default JoinTeamDialog;

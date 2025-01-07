"use client";
import React, { Fragment, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
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
import { generateInviteLink } from "./inviteActions";
import { Copy } from "lucide-react";

export const createInviteFormSchema = z.object({
  expiry: z.date(),
});

const CreateInviteForm = ({
  onSubmitSuccess,
  teamId,
  teamMemberId,
}: {
  onSubmitSuccess: () => void;
  teamId: string;
  teamMemberId: string;
}) => {
  const [error, setError] = useState<string | null>(null);
  const [inviteLink, setInviteLink] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<number>(1);
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm<z.infer<typeof createInviteFormSchema>>({
    resolver: zodResolver(createInviteFormSchema),
    defaultValues: {
      expiry: new Date(Date.now() + 5 * 60 * 1000),
    },
  });

  const handleTime = (option: number, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    setSelectedTime(option);
    switch (option) {
      case 1:
        form.setValue("expiry", new Date(Date.now() + 5 * 60 * 1000));
        break;
      case 2:
        form.setValue("expiry", new Date(Date.now() + 30 * 60 * 1000));
        break;
      case 3:
        form.setValue("expiry", new Date(Date.now() + 12 * 60 * 60 * 1000));
        break;
      case 4:
        form.setValue("expiry", new Date(Date.now() + 24 * 60 * 60 * 1000));
        break;
    }
  };

  const copyToClipboard = (inviteLink: string, e: React.FormEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(inviteLink);
  };

  const onSubmit = async (values: z.infer<typeof createInviteFormSchema>) => {
    try {
      setIsGenerating(true);
      const newInvite = await generateInviteLink(
        teamId,
        teamMemberId,
        values.expiry
      );

      if ("error" in newInvite) {
        throw new Error(newInvite.message);
      }

      setInviteLink(newInvite.code);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input readOnly value={inviteLink} placeholder="Invite Link" />
          <Button
            onClick={(e) => copyToClipboard(inviteLink, e)}
            disabled={!inviteLink}
          >
            <Copy />
          </Button>
        </div>
        <FormField
          control={form.control}
          name="expiry"
          render={() => (
            <FormItem>
              <div className="flex flex-col gap-2">
                <FormLabel>Expiry Time</FormLabel>
                <FormControl>
                  <Fragment>
                    <div className="flex flex-row space-x-2">
                      <Button
                        onClick={(e) => handleTime(1, e)}
                        variant={selectedTime === 1 ? "default" : "outline"}
                      >
                        5 minutes
                      </Button>
                      <Button
                        onClick={(e) => handleTime(2, e)}
                        variant={selectedTime === 2 ? "default" : "outline"}
                      >
                        30 minutes
                      </Button>
                      <Button
                        onClick={(e) => handleTime(3, e)}
                        variant={selectedTime === 3 ? "default" : "outline"}
                      >
                        12 hours
                      </Button>
                      <Button
                        onClick={(e) => handleTime(4, e)}
                        variant={selectedTime === 4 ? "default" : "outline"}
                      >
                        1 day
                      </Button>
                    </div>
                  </Fragment>
                </FormControl>
              </div>
              <FormDescription>
                This is the expiry time for the invite link.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && <FormMessage>{error}</FormMessage>}
        <div className="flex flex-row justify-end gap-2">
          <Button type="submit" disabled={isGenerating}>
            {isGenerating ? "Generating..." : "Generate"}
          </Button>
          <Button onClick={onSubmitSuccess} variant="outline">
            Done
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateInviteForm;

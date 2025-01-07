"use client";
import React, { useState } from "react";
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
import { createTeam } from "./createActions";

export const createTeamFormSchema = z.object({
  name: z.string(),
  bio: z.string(),
  logo: z.instanceof(File),
});

const CreateTeamForm = ({
  onSubmitSuccess,
}: {
  onSubmitSuccess: () => void;
}) => {
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof createTeamFormSchema>>({
    resolver: zodResolver(createTeamFormSchema),
    defaultValues: {
      name: "",
      bio: "",
      logo: undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof createTeamFormSchema>) => {
    try {
      const newTeam = await createTeam(values);

      if (newTeam) {
        console.log("Team created", newTeam);
      }

      onSubmitSuccess();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team Name</FormLabel>
              <FormControl>
                <Input placeholder="My Team's Name" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your {"team's"} description on your profile
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="logo"
          render={({ field: { ...fieldProps } }) => (
            <FormItem>
              <FormLabel>Team Logo</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    fieldProps.onChange(file);
                  }}
                />
              </FormControl>
              <FormDescription>
                Upload your {"team's"} logo image.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && <FormMessage>{error}</FormMessage>}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default CreateTeamForm;

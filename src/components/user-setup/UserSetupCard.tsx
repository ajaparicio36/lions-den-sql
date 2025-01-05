"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { createUser } from "./setupActions";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  ign: z
    .string()
    .min(4, { message: "In-game name must be at least 4 characters long" }),
});

interface UserSetupCardProps {
  uid: string;
}

const UserSetupCard: React.FC<UserSetupCardProps> = ({ uid }) => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ign: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const user = await createUser(uid, values.ign);

      if (user) {
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      setError("Failed to create user, try again.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>First Time Login</CardTitle>
        <CardDescription>Set up your user account</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="ign"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="tatayless" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                  {error && (
                    <FormMessage className="self-center">{error}</FormMessage>
                  )}
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit">
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UserSetupCard;

"use client";
import { handleFirebaseError } from "@/lib/auth/firebaseErrors";
import { auth } from "@/lib/firebase/firebaseConfig";
import { FirebaseError } from "firebase/app";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

const formSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

const LoginForm = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);

      const idToken = await user.getIdToken();
      if (!idToken) {
        throw new Error("Failed to get ID token");
      }

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken: idToken }),
      });
    } catch (error) {
      const { message } = handleFirebaseError(error);
      setError(message);
    }
  };

  const handleLogin = async (values: z.infer<typeof formSchema>) => {
    try {
      const email = values.email;
      const password = values.password;
      const { user } = await signInWithEmailAndPassword(auth, email, password);

      if (!user.emailVerified) {
        throw new FirebaseError(
          "auth/email-not-verified",
          "Email not verified"
        );
      }

      const idToken = await user.getIdToken();
      if (!idToken) {
        throw new Error("Failed to get ID token");
      }

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken: idToken }),
      });

      if (!response.ok) {
        throw new Error("Failed to log in");
      }

      router.push("/hub");
    } catch (error) {
      const { message } = handleFirebaseError(error);
      setError(message);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Welcome Back!</CardTitle>
        <CardDescription>Login to your Account</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleLogin)}
            className="flex flex-col space-y-8"
          >
            <div className="flex flex-col gap-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="example@email.com" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {error && (
              <FormMessage className="items-center self-center ">
                {error}
              </FormMessage>
            )}
            <Button
              type="submit"
              className="bg-gradient-to-r from-primary-500 to-primary hover:font-bold"
            >
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col items-center justify-center gap-4">
        <div className="flex flex-row items-center justify-center gap-4 ">
          <Separator /> OR <Separator />
        </div>
        <Button
          variant="outline"
          className="w-full hover:bg-gradient-to-r hover:from-secondary-300 hover:to-secondary-500 hover:text-white border-secondary-300"
          onClick={handleGoogleSignIn}
        >
          <span className="font-bold">G</span> Sign up with Google
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;

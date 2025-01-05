"use client";
import React, { useState } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { auth } from "@/lib/firebase/firebaseConfig";
import { handleFirebaseError } from "@/lib/auth/firebaseErrors";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Checkbox } from "../ui/checkbox";
import VerifyEmail from "./VerifyEmail";

const formSchema = z
  .object({
    email: z.string().email(),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" }),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

const RegisterForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [signUpDone, setSignUpDone] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      acceptTerms: false,
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

      if (!response.ok) {
        throw new Error("Failed to log in");
      }

      router.push("/hub");
    } catch (error) {
      const { message } = handleFirebaseError(error);
      setError(message);
    }
  };

  const handleRegister = async (values: z.infer<typeof formSchema>) => {
    try {
      const email = values.email;
      const password = values.password;
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await sendEmailVerification(user);
      await signOut(auth);
      setSignUpDone(true);
    } catch (error) {
      const { message } = handleFirebaseError(error);
      setError(message);
    }
  };

  if (!!signUpDone) {
    return <VerifyEmail />;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Join the Den!</CardTitle>
        <CardDescription>Register a new Account</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleRegister)}
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
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="acceptTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2 justify-center">
                    <div className="flex flex-row gap-2 items-center">
                      <FormControl className="flex items-center">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm flex items-center">
                        I agree to the terms and conditions
                      </FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {error && (
              <FormMessage className="self-center items-center">
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

export default RegisterForm;

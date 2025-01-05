"use client";
import React from "react";
import { Button } from "../ui/button";

const SignoutTry = () => {
  const signOut = async () => {
    const response = await fetch("/api/auth/logout");
  };
  return <Button onClick={signOut}>Signout</Button>;
};

export default SignoutTry;

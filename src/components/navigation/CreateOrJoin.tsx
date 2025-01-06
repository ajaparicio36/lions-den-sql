"use client";
import React from "react";
import { Button } from "../ui/button";

const CreateOrJoin = () => {
  return (
    <div className="flex flex-row text-lg gap-4 items-center">
      <Button className="">Create Team</Button>
      <span>OR</span>
      <Button>Join Team</Button>
    </div>
  );
};

export default CreateOrJoin;

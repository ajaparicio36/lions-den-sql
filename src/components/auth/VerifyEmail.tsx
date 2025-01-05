import React from "react";
import { Card, CardContent } from "../ui/card";

const VerifyEmail = () => {
  return (
    <Card className="w-full py-8">
      <CardContent>
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">Verify your Email</h1>
          <p className="text-gray-500">
            We have sent you an email to verify your email address. Please check
            your inbox and click on the link to verify your email.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default VerifyEmail;

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const AccountTabs = () => {
  return (
    <Tabs defaultValue="login" className="flex flex-col w-3/4 max-w-[400px]">
      <TabsList className="flex flex-row shadow-md border border-1 py-4 gap-8">
        <TabsTrigger
          value="login"
          className="flex flex-1 data-[state=active]:bg-gradient-to-r from-primary to-primary-500 data-[state=active]:text-primary-foreground"
        >
          Login
        </TabsTrigger>
        <TabsTrigger
          className="flex flex-1 data-[state=active]:bg-gradient-to-r from-primary to-primary-500 data-[state=active]:text-primary-foreground"
          value="register"
        >
          Register
        </TabsTrigger>
      </TabsList>
      <TabsContent className="flex w-full" value="login">
        <LoginForm />
      </TabsContent>
      <TabsContent className="flex" value="register">
        <RegisterForm />
      </TabsContent>
    </Tabs>
  );
};

export default AccountTabs;

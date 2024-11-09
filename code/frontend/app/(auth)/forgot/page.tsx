import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ResetPassword = () => {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="flex flex-col gap-5">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Reset password
        </h3>
        <p>We'll email you a password reset link.</p>
        <Input type="email" placeholder="Email" className="border-black" />
            <Button className="bg-[#6BB5FF]">Start Password Reset</Button>
      </div>
    </div>
  );
};

export default ResetPassword;

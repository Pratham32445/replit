import Image from "next/image";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link"

const authLogins = ["google", "github"];

const Login = () => {
  return (
    <div className="w-full min-h-screen flex">
      <div className="relative w-2/4 h-screen"> 
        <Image src={"/coding.avif"} alt="image" fill className="object-cover" />
      </div>
      <div className="w-2/4">
        <div className="p-10">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-4xl">
            Login
          </h1>
          <div className="my-14">
            <Input
              type="email"
              placeholder="Email..."
              className="border-black my-5 p-6"
            />
            <Input
              type="password"
              placeholder="Password..."
              className="border-black my-5 p-6"
            />
            <Button className="w-full p-6">Login</Button>
            <p className="leading-7 [&:not(:first-child)]:mt-6 text-center cursor-pointer">
              Forgot Password?
            </p>
          </div>
          {/* social logins */}
          <div className="px-10">
            {authLogins.map((type) => (
              <div
                key={type}
                className="bg-[#E5E5E5] hover:bg-[#ded7d7] my-5 flex justify-center p-2 gap-5 items-center rounded cursor-pointer"
              >
                <Image
                  src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${type}/${type}-original.svg`}
                  alt="google"
                  width={30}
                  height={30}
                />
                <p className="scroll-m-20 tracking-tight">
                  Continue with <span className="capitalize">{type}</span>
                </p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <p className="scroll-m-20 tracking-tight text-center cursor-pointer">
              New to Replit? <Link href="/signup">Signup</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

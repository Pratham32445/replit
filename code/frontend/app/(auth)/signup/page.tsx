"use client";
import Image from "next/image";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import axios from "axios";
import { signIn } from "next-auth/react";

const authLogins = ["google", "github"];

const Signup = () => {
  const BACKEND_URL = "http://localhost:5000";
  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<null | string>(null);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const createAccount = async () => {
    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/v1/user/signup`,
        credentials
      );
    } catch (error) {
      console.log(error);
    }
  };
  const AuthProviderLogin = (type: string) => {
    console.log(type);
    switch (type) {
      case "google":
        signIn("google", {
          callbackUrl: "/",
          redirect: false,
        });
        break;

      default:
        break;
    }
  };
  return (
    <div className="w-full min-h-screen flex">
      <div className="relative w-2/4 h-screen">
        <Image src={"/coding.avif"} alt="image" fill className="object-cover" />
      </div>
      <div className="w-2/4">
        <div className="p-10">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-4xl">
            Signup
          </h1>
          {error && (
            <div className="bg-red-300 p-2 mt-4 rounded">
              <p>Please Provide all the fields</p>
            </div>
          )}
          <div className="my-14">
            <Input
              type="text"
              placeholder="Username..."
              className="border-black my-5 p-6"
              name="username"
              onChange={handleChange}
            />
            <Input
              type="email"
              placeholder="Email..."
              className="border-black my-5 p-6"
              name="email"
              onChange={handleChange}
            />
            <Input
              type="password"
              placeholder="Password..."
              className="border-black my-5 p-6"
              name="password"
              onChange={handleChange}
            />
            <Button className="w-full p-6" onClick={createAccount}>
              Create
            </Button>
            <p className="text-center my-5">
              By continuing, you agree to Replit's <br /> Terms of Service and
              Privacy Policy
            </p>
          </div>
          {/* social logins */}
          <div className="px-10">
            {authLogins.map((type) => (
              <div
                key={type}
                className="bg-[#E5E5E5] hover:bg-[#ded7d7] mb-5 flex justify-center p-2 gap-5 items-center rounded cursor-pointer"
                onClick={()=>AuthProviderLogin(type)}
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
              Already have an account ? <Link href={"/login"}>Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;

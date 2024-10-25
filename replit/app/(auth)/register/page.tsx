"use client";
import Image from "next/image";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import axios from "axios";
import { authErrors } from "@/app/types";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const Register = () => {
  const [authState, setAuthState] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<authErrors>({});
  const router = useRouter();
  const createAccount = async () => {
    if (authState.email && authState.password) {
      setErrors({});
      setLoading(true);
      await axios
        .post("/api/register", authState)
        .then(async (res) => {
          setLoading(false);
          const response = res.data;
          if (response?.status == 200) {
            const res = await signIn("credentials", {
              email: authState.email,
              password: authState.password,
            });
            if (res?.ok) router.push("/repl/create");
          } else if (response?.status == 400) {
            setErrors(response.errors);
          }
        })
        .catch(() => {
          setLoading(false);
        });
    }
  };
  return (
    <div className="flex">
      <div className="w-1/2 h-screen relative">
        <Image
          src="/coding.jpg"
          alt="coding"
          fill
          objectFit="cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
        />
      </div>
      <div className="w-1/2 h-screen flex justify-center items-center">
        <div className="w-4/5 flex flex-col gap-8">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Create a Repl Account
          </h2>
          <div>
            <Input
              type="email"
              placeholder="Email"
              className="my-2 p-5"
              onChange={(e) =>
                setAuthState({ ...authState, email: e.target.value })
              }
            />
            <p className="leading-7 [&:not(:first-child)]:mt-6 text-[#FF0000] text-xs">
              {errors?.email}
            </p>
          </div>
          <div>
            <Input
              type="password"
              placeholder="Password"
              className="my-2 p-5"
              onChange={(e) =>
                setAuthState({ ...authState, password: e.target.value })
              }
            />
            <p className="leading-7 [&:not(:first-child)]:mt-6 text-[#FF0000] text-xs">
              {errors?.password}
            </p>
          </div>
          <Button
            onClick={createAccount}
            className="p-5 bg-[#EC4E02] !important"
            disabled={loading}
          >
            Create account
          </Button>
          <p className="leading-7 [&:not(:first-child)]:mt-6 text-center">
            Already have a account ?{" "}
            <Link href={"/login"} className="text-[#EC4E02] font-bold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

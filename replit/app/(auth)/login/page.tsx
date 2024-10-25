"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const Login = () => {
  const [authState, setAuthState] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const getClient = async () => {
      console.log(await getSession());
    };
    getClient();
  }, []);

  const loginUser = async () => {
    setLoading(true);
    const res = await signIn("credentials", {
      redirect: false,
      email: authState.email,
      password: authState.password,
    });
    setLoading(false);
    console.log(res);
    if (res?.status == 200) router.push("/repl/create");
  };

  const googleLogin = async () => {
    await signIn("google", {
      callbackUrl: "/",
      redirect: true,
    });
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
            Log in to your account
          </h2>
          <Input
            type="email"
            placeholder="Email"
            className="my-2 p-5"
            onChange={(e) =>
              setAuthState((prev) => ({ ...prev, email: e.target.value }))
            }
          />
          <Input
            type="password"
            placeholder="Password"
            className="my-2 p-5"
            onChange={(e) =>
              setAuthState((prev) => ({ ...prev, password: e.target.value }))
            }
          />
          <Button
            className="p-5 bg-[#EC4E02] !important"
            onClick={loginUser}
            disabled={loading}
          >
            Login
          </Button>
          <p className="leading-7 [&:not(:first-child)]:mt-6 text-center">
            New to Repl ?{" "}
            <Link href={"/register"} className="text-[#EC4E02] font-bold">
              Signup
            </Link>
          </p>
          <div className="flex justify-center" onClick={googleLogin}>
            <div className="bg-[#E5E5E5] hover:bg-[#E4E5E6] p-3 w-4/5 rounded cursor-pointer flex items-center justify-center gap-3">
              <Image
                src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg`}
                alt="google"
                width={20}
                height={20}
              />
              <p className="leading-7 [&:not(:first-child)] text-center text-md ">
                Continue with google
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

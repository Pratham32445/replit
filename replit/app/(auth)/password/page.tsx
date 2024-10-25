"use client";
import Image from "next/image";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";

const CreatePassword = () => {
  const { data } = useSession();

  const router = useRouter();

  const [password, setPassword] = useState("");

  const createPassword = async () => {
    const res = await axios.put("/api/register", {
      email: data?.user?.email,
      password,
    });
    if (res.status == 201) {
      if (!data || !data.user) return;

      const res = await signIn("credentials", {
        redirect: false,
        email: data?.user.email,
        password,
      });
      if (res?.status == 200) router.push("/repl/create");
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
            Create Password
          </h2>
          <Input
            type="email"
            placeholder="Email"
            className="my-2 p-5 text-lg"
            value={data?.user?.email}
            disabled={true}
          />
          <Input
            type="password"
            placeholder="Password"
            className="my-2 p-5"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            className="p-5 bg-[#EC4E02] !important"
            onClick={createPassword}
          >
            Create
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreatePassword;

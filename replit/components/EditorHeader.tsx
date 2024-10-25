import React from "react";
import { House } from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";

const EditorHeader = ({ baseName }: { baseName: string }) => {
  console.log(baseName);
  const accountType = "Premium";
  return (
    <div className="flex items-center justify-between p-2 px-4 bg-[#0A1520] shadow-custom">
      <div className="flex items-center gap-5">
        <House color="white" />
        <div className="flex items-center gap-5">
          <Image
            src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${baseName}/${baseName}-original.svg`}
            width={30}
            height={30}
            alt="baseRepl"
          />
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight text-white">
            People stopped telling jokes
          </h4>
          <div
            className={`${
              accountType === "current" ? "bg-[#EBE1AD]" : "bg-[#00A11B]"
            } px-5 py-1 rounded`}
          >
            <p className="text-xs">
              {accountType === "current" ? "Limited" : "Premium"}
            </p>
          </div>
        </div>
      </div>
      <div>
        <Button className="bg-[#7AEB8D] hover:bg-[#00A11B] p-5 px-10">
          Run
        </Button>
      </div>
      <div>
        <Button>Signup</Button>
      </div>
    </div>
  );
};

export default EditorHeader;

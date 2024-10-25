"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { Plus } from "lucide-react";
import CreateReplDialog from "./_Dialog";

const Create = () => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Button
        className="bg-[#0F87FF] flex items-center gap-2"
        onClick={() => setOpen(true)}
      >
        <Plus />
        <p className="text-lg">Create Repl</p>
      </Button>
      <CreateReplDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default Create;

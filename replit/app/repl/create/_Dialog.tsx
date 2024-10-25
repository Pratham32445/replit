import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";

const templateData = [
  {
    name: "Python",
    image: "python",
    baseLanguage: "python",
  },
  {
    name: "Nodejs",
    image: "nodejs",
    baseLanguage: "nodejs",
  },
  {
    name: "c++",
    image: "cplusplus",
    baseLanguage: "nodejs",
  },
  {
    name: "Nextjs",
    image: "nextjs",
    baseLanguage: "next-typescript",
  },
];

const CreateReplDialog = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: () => void;
}) => {
  const [selectedRepl, setSelectedRepl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const createRepl = async () => {
    setLoading(true);
    const res = await axios.post("/api/repl", { baseLanguage: selectedRepl });
    if (res.status == 201) {
      console.log(res.data.repl);
      const {Id,replIp} = res.data.repl;
      router.push(`/repl/${Id}?ip=${replIp}`);
    }
  };
  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Choose Template</DialogTitle>
          </DialogHeader>
          <div>
            <div>
              <div>
                <p>Template</p>
                <div className="mt-5">
                  <Input type="text" placeholder="Search Template..." />
                </div>
              </div>
              <div className="mt-3">
                {templateData.map((data, key) => (
                  <div
                    key={key}
                    className={`flex py-4 px-2 items-center gap-4 cursor-pointer ${
                      selectedRepl === data.baseLanguage && "bg-[#6BB5FF]"
                    } hover:bg-[#6BB5FF]`}
                    onClick={() => setSelectedRepl(data.baseLanguage)}
                  >
                    <div>
                      <Image
                        src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${data.image}/${data.image}-original.svg`}
                        alt="image"
                        width={30}
                        height={30}
                      />
                    </div>
                    <div>
                      <h4 className="scroll-m-20 text-lg tracking-tight">
                        {data.name}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                {selectedRepl && (
                  <Button onClick={createRepl}>
                    {loading ? <p>Loading...</p> : <p>Create</p>}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateReplDialog;

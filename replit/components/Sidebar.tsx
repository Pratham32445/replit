"use client";
import React, { useRef, useState } from "react";
import { FilePlus, FolderPlus, Folder } from "lucide-react";
import Image from "next/image";
import { extensionMap } from "@/app/utils/extensionTable";
import { Input } from "./ui/input";
import { useRecoilState } from "recoil";
import { selectedFile } from "@/store/atoms";
import Consumption from "./Consumption";

// interface FileObject {
//   name: string;
//   extension: string;
//   isFile: boolean;
// }

const Sidebar = ({ files }) => {
  const [createFile, setCreateFile] = useState(false);
  const [fileName, setFileName] = useState("");
  const sideBarRef = useRef<HTMLDivElement>(null);
  const [openFile, setOpenFile] = useRecoilState(selectedFile);
  const [searchQuery, setSearchQuery] = useState<string>("");

  console.log(files); 

  const filteredFiles = searchQuery
    ? files && files
        .filter((file) =>
          file.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort()
    : files && files.sort();

  const createNewFile = (e: any) => {
    if (e.key == "Enter") {
      console.log(fileName.trim());
    }
  };

  return (
    <div ref={sideBarRef} className="bg-[#242838] w-full h-[100vh]">
      <div className="p-4">
        <Input
          type="text"
          placeholder="Search..."
          className="text-white"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="flex p-4 justify-between items-center">
        <div>
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight text-white">
            Files
          </h4>
        </div>
        <div className="flex gap-3">
          <FilePlus
            size={20}
            color="white"
            className="cursor-pointer"
            onClick={() => setCreateFile(true)}
          />
          <FolderPlus size={20} color="white" className="cursor-pointer" />
        </div>
      </div>
      <div className="mt-2 p-2 h-[90vh] overflow-auto pb-16 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 custom-scrollbar">
        {filteredFiles && filteredFiles.map((file, key) => {
          if (file.name != ".git") {
            return (
              <div
                onClick={() => setOpenFile(file)}
                key={key}
                className={`${
                  openFile == file && "bg-[#393c49]"
                } hover:bg-[#393c49] flex items-center px-2 gap-4 cursor-pointer mb-1`}
              >
                <div>
                  {file?.isFile ? (
                    <Image
                      src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${
                        extensionMap[file.extension]
                      }/${extensionMap[file.extension]}-original.svg`}
                      width={20}
                      height={20}
                      alt="Icon"
                    />
                  ) : (
                    <Folder
                      width={20}
                      height={20}
                      color="#FFD949"
                      fill="true"
                    />
                  )}
                </div>
                <div>
                  <p className="leading-7 [&:not(:first-child)]:mt-6 text-white">
                    {file.name}
                  </p>
                </div>
              </div>
            );
          }
        })}
        {createFile && (
          <div className="p-2">
            <Input
              type="text"
              className="text-white"
              onchange={(e) => setFileName(e.target.value)}
              onKeyDown={createNewFile}
            />
          </div>
        )}
        <div className="mb-16">
          <Consumption />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

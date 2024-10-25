"use client";
import Editor from "@/components/Editor";
import EditorHeader from "@/components/EditorHeader";
import Sidebar from "@/components/Sidebar";
import Terminal from "@/components/Terminal";
import { Progress } from "@/components/ui/progress";
import { userSocket } from "@/store/atoms";
import { useParams ,useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

const Repl = () => {
  const [loading, setLoading] = useState(true);
  const [loaderstatus, setLoaderstatus] = useState(20);
  const [files, setFiles] = useState();
  const [, setSocket] = useRecoilState(userSocket);
  const { id } = useParams();
  const searchParams = useSearchParams();
  const ip = searchParams.get("ip");
  useEffect(() => {
    setLoading(true);
    const ws: WebSocket = new WebSocket(`ws://localhost:8080`);
    ws.onopen = () => {
      setSocket(ws);
      setLoaderstatus(60);
      ws.send(
        JSON.stringify({
          type: "replId",
          replId: id,
        })
      );
    };
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type == "setUpCompleted") {
        setLoaderstatus(80);
        ws.send(JSON.stringify({ type: "getFiles", path: "/" }));
      } else if (message.type == "files") {
        console.log(message);
        setFiles(message.filesMap);
        setLoaderstatus(100);
        setLoading(false);
      } else if (message.type == "UpdatedStructure") {
      }
    };
  }, []);

  if (loading)
    return <Progress value={loaderstatus} className="w-full rounded-none" />;

  return (
    <div className="w-full h-full min-h-full">
      <EditorHeader baseName="nextjs" />
      <div className="w-full h-full min-h-full flex">
        <div className="w-1/5 h-full bg-red-900">
          <Sidebar files={files} />
        </div>
        <div className="w-2/4 h-full">
          <Editor />
        </div>
        <div className="w-2/5 h-full">
          <Terminal />
        </div>
      </div>
    </div>
  );
};

export default Repl;

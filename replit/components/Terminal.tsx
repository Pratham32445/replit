"use client";

import React, { useEffect, useRef, useState } from "react";
import { Terminal as xTerminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import { useRecoilValue } from "recoil";
import { userSocket } from "@/store/atoms";
import { FitAddon } from "@xterm/addon-fit";
import { WebLinksAddon } from "@xterm/addon-web-links";
import { SearchAddon } from "@xterm/addon-search";      

const Terminal = () => {
  const terminalRef = useRef<xTerminal | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const [cmd, setCmd] = useState("");
  const [execute, setExecute] = useState(false);
  const socket = useRecoilValue(userSocket);
  const fitAddon = new FitAddon();
  const webLinks = new WebLinksAddon();
  const searchAddon = new SearchAddon();

  useEffect(() => {
    if (editorRef.current && !terminalRef.current) {
      terminalRef.current = new xTerminal({
        cursorBlink: true,
        rows: 50,
        cols: 50,
        fontSize: 19,
        theme: {
          background: "#242838",
          foreground: "#ffffff",
        },
      });
      terminalRef.current.loadAddon(fitAddon);
      terminalRef.current.loadAddon(webLinks);
      terminalRef.current.loadAddon(searchAddon);
      terminalRef.current.open(editorRef.current);
      terminalRef?.current?.write("\x1b[1m> /code $ \b \b \x1b[22m");
      fitAddon.fit();

      let currentCmd: string = "";

      terminalRef.current.onData((data) => {
        switch (data) {
          case "\r":
            if (currentCmd.length > 0) {
              terminalRef.current?.write(`\r\n ${cmd}\r\n`);
              setCmd(currentCmd);
              currentCmd = "";
              setExecute(true);
            }
            break;
          case "\u007f":
            if (currentCmd.length > 0) {
              currentCmd = currentCmd.slice(0, -1);
              terminalRef.current?.write("\b \b");
            }
            break;
          default:
            currentCmd += data;
            terminalRef.current?.write(data);
            break;
        }
      });
    }
  }, []);

  useEffect(() => {
    if (execute && socket) {
      if (cmd === "clear" || cmd === "cls") {
        terminalRef.current?.clear();
        terminalRef?.current?.write("\x1b[1m> \\code $ \b \b \x1b[22m");
        setCmd("");
        setExecute(false);
        return;
      }
      socket.send(JSON.stringify({ type: "executeCommand", command: cmd }));
      setCmd("");
      setExecute(false);
    }
  }, [execute, socket, cmd]);

  useEffect(() => {
    if (!socket || !cmd || cmd.length === 0) return;

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log(message);
      if (message.type === "terminal") {
        const res = message.data.split("\n");
        res.forEach((data: string) => {
          terminalRef?.current?.write(`${data}\r\n`);
        });
      } else if (message.type == "commandOver") {
        terminalRef?.current?.write("\x1b[1m> \\code $ \b \b \x1b[22m");
      }
    };
  }, [socket, cmd]);

  return (
    <div className="w-full h-full bg-[#242838]">
      <div className="flex gap-5 bg-[#4b5563] mb-5">
        <p className="text-white cursor-pointer p-3 ">Console</p>
        <p className="text-white cursor-pointer p-3">Shell</p>
      </div>

      <div
        ref={editorRef}
        className="w-full h-full pb-20 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 custom-scrollbar"
      ></div>
    </div>
  );
};

export default Terminal;

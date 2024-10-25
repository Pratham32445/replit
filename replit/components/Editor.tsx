"use client";
import React, { useEffect, useRef, useState } from "react";
import * as monaco from "monaco-editor";
import { useRecoilState, useRecoilValue } from "recoil";
import { selectedFile, userSocket } from "@/store/atoms";
import { extensionMap } from "@/app/utils/extensionTable";
import Image from "next/image";
import { updateFiles } from "@/app/aws";
import { X } from "lucide-react";

const MonacoEditor: React.FC = () => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [file, setFile] = useRecoilState(selectedFile);
  const fileRef = useRef(file);
  const socket = useRecoilValue(userSocket);
  const [filedata, setFiledata] = useState({
    extension: "",
    content: "No file Selected",
  });

  const debounceSearch = updateFiles(updateFile, 5000);

  // Sync file ref with latest file
  useEffect(() => {
    fileRef.current = file;
  }, [file]);

  // Initialize Monaco editor
  useEffect(() => {
    monaco.editor.defineTheme("customTheme", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#0A1520",
        "editor.foreground": "#FFFFFF",
        "editorCursor.foreground": "#FFFFFF",
        "editor.lineHighlightBackground": "#2a2a2a",
        "editorLineNumber.foreground": "#858585",
      },
    });

    if (containerRef.current) {
      editorRef.current = monaco.editor.create(containerRef.current, {
        value: filedata.content,
        language: filedata.extension,
        automaticLayout: true,
        theme: "customTheme",
        fontSize: 20,
      });

      editorRef.current.onDidChangeModelContent(() => {
        const value = editorRef.current.getValue();
        debounceSearch(fileRef.current, value);
      });
    }

    return () => {
      if (editorRef.current) {
        const model = editorRef.current.getModel();

        // Safely dispose model and editor if they exist
        if (model && !model.isDisposed) {
          try {
            model.dispose();
          } catch (err) {
            console.warn("Error while disposing the model:", err);
          }
        }

        if (editorRef.current) {
          editorRef.current.dispose();
          editorRef.current = null;
        }
      }
    };
  }, []); // Empty dependency array to run once on mount

  // Fetch file content from socket
  useEffect(() => {
    if (!socket || !file) return;

    socket.send(JSON.stringify({ type: "getFileContent", content: file }));

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "fileContent") {
        const data = message.data;
        if (data.isFile) {
          setFiledata({ extension: data.extension, content: data.content });
        }
      }
    };
  }, [file, socket]);

  // Update editor content and language when filedata changes
  useEffect(() => {
    if (editorRef.current) {
      const model = editorRef.current.getModel();
      if (model) {
        const newLanguage =
          extensionMap[filedata.extension || "text"] || "plaintext";
        monaco.editor.setModelLanguage(model, newLanguage);
        editorRef.current.setValue(filedata.content);
      }
    }
  }, [filedata]);

  function updateFile(fileName: object, fileContent: string) {
    if (!socket) return;
    if (fileName && fileContent) {
      socket.send(
        JSON.stringify({
          type: "updateFile",
          Info: {
            fileName: fileName.name!,
            fileContent,
            replId: "df2b81ae-e25b-463e-b2db-deda9e5ab20d",
          },
        })
      );
    }
  }

  return (
    <div className="w-full h-full">
      {file && file.isFile! && (
        <div className="bg-[#0A1520]">
          <div className="flex items-center gap-2 bg-[#2e303a] p-2 w-fit">
            <Image
              src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${
                extensionMap[file.extension]
              }/${extensionMap[file.extension]}-original.svg`}
              width={20}
              height={20}
              alt="Icon"
            />
            <p className="text-white border-b-0 border-yellow-500">
              {file && file.name}
            </p>
            <X
              size={15}
              color="white"
              className="cursor-pointer"
              onClick={() => setFile(null)}
            />
          </div>
        </div>
      )}
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};

export default MonacoEditor;

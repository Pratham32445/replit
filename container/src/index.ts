import { WebSocketServer, WebSocket } from "ws";
import { getRepl } from "./aws";
import { getFileContent, getFiles, updateFile } from "./fs";
import { executeCommand } from "./terminal";
import { getComsumption } from "./health";
import express from "express";
import { router as terminalRoutes } from "./http/routes/terminal.routes";

const app = express();

app.use("/", terminalRoutes);

app.listen(5000, () => {
  console.log("server running");
});

const initSocketAndServer = () => {
  const wss = new WebSocketServer({ port: 8080 });

  wss.on("connection", (ws: WebSocket) => {
    ws.onmessage = async (event) => {
      const message = JSON.parse(event.data.toString());
      console.log(message);
      if (message.type == "replId") {
        const replId = message.replId;
        getRepl(replId, ws);
      } else if (message.type == "getFiles") {
        const filesMap = await getFiles(message.path);
        ws.send(JSON.stringify({ type: "files", files : filesMap }));
      } else if (message.type == "getFileContent") {
        const content = await getFileContent(message.content.name);
        if (Array.isArray(content)) {
          ws.send(
            JSON.stringify({ type: "UpdatedStructure", structure: content })
          );
        } else {
          const data = message.content;
          data.content = content;
          ws.send(JSON.stringify({ type: "fileContent", data }));
        }
      } else if (message.type == "executeCommand") {
        executeCommand(message.command, ws);
      } else if (message.type == "Consumption") {
        getComsumption(ws);
      } else if (message.type == "updateFile") {
        updateFile(
          message.Info.fileName,
          message.Info.fileContent,
          message.Info.replId
        );
      }
      else if(message.type == "runFile") {
        
      }
    };
  });
};

initSocketAndServer();

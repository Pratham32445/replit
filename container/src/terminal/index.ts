import path from "path";
import { WebSocket } from "ws";
import shell from "shelljs";

let childProcess;

const cwd = path.join(__dirname, "../../", "code");

export const executeCommand = (command: string, socket: WebSocket) => {
  
  shell.cd(cwd);

  const childProcess = shell.exec(command, { async: true, silent: true });

  childProcess.stdout?.on("data", (data) => {
    console.log(data.toString());
    socket.send(JSON.stringify({ type: "terminal", data: data.toString() }));
  });

  childProcess.stderr?.on("data", (data) => {
    console.log(data.toString());
    socket.send(JSON.stringify({ type: "terminal", data: data.toString() }));
  });

  childProcess.on("exit", (data) => {
    socket.send(JSON.stringify({ type: "commandOver", isOver: true }));
    console.log(data);
  });
};

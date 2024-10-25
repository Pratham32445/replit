import os from "os";
import { WebSocket } from "ws";

export const getMemoryUsage = () => {
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = totalMemory - freeMemory;
  return {
    totalMemory: formatBytes(totalMemory),
    usedMemory: formatBytes(usedMemory),
    freeMemory: formatBytes(freeMemory),
  };
};

function formatBytes(bytes: number) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes == 0) return "0 Bytes";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + " " + sizes[i];
}

export function getComsumption(socket: WebSocket) {
  setInterval(() => {
    socket.send(
      JSON.stringify({
        type: "getConsumption",
        consumption: getMemoryUsage(),
      })
    );
  }, 10000);
}

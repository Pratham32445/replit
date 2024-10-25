import React, { useEffect, useState } from "react";
import { Cpu, Database } from "lucide-react";
import { useRecoilValue } from "recoil";
import { userSocket } from "@/store/atoms";

const Consumption = () => {
  const socket = useRecoilValue(userSocket);
  const [Consumption, setConsumption] = useState<any>(null);
  useEffect(() => {
    if (!socket) return;

    // Send the initial message
    socket.send(JSON.stringify({ type: "Consumption" }));

    const handleMessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data);
      if (message.type === "getConsumption") {
        setConsumption(message.consumption);
      }
    };

    socket.addEventListener("message", handleMessage);

    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket]);
  return (
    <div className="mt-5 p-2">
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight text-white">
        Consumption
      </h4>
      <div className="flex gap-2 mt-5">
        <div className="bg-white p-2 rounded">
          <Cpu />
        </div>
        <div className="bg-white p-2 rounded">
          <Database />
        </div>
      </div>
      {Consumption ? (
        <div className="bg-[#0A1520] text-white mt-3 rounded p-2">
          <div>
            <p className="leading-7 [&:not(:first-child)]">Memory</p>
            <div>
              <p className="leading-7 [&:not(:first-child)] text-sm">
                TotalMemory : {Consumption.totalMemory}
              </p>
              <p className="leading-7 [&:not(:first-child)] text-sm">
                UsedMemory : {Consumption.usedMemory}
              </p>
              <p className="leading-7 [&:not(:first-child)] text-sm">
                FreeMemory : {Consumption.freeMemory}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {" "}
          <p className="text-white mt-5">Calculating...</p>
        </div>
      )}
    </div>
  );
};

export default Consumption;

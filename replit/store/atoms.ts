import { atom } from "recoil";

export const selectedFile = atom({
  default: null,
  key: "selectedFile",
});

export const userSocket = atom<WebSocket | null>({
  default: null,
  key: "userSocket",
});

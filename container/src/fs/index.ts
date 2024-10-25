import fs from "fs";
import { isFile } from "../util";
import path from "path";
import { createClient } from "redis";
import dotenv from "dotenv";
import { updateS3 } from "../aws";

dotenv.config();

let publisher: any;
let subscriber: any;

interface File {
  name: string;
  isFile: boolean;
  path: string;
  extension?: string;
}

const Map: Record<string, File[]> = {};

const connectRedis = async () => {
  try {
    publisher = createClient({
      url: process.env.REDIS_URL,
    });
    subscriber = createClient({
      url: process.env.REDIS_URL,
    });

    await publisher.connect();
    await subscriber.connect();

    publisher.on("error", function (err: any) {
      console.log(err);
    });
    subscriber.on("error", function (err: any) {
      console.log(err);
    });
  } catch (error) {
    console.error("Error connecting to Redis:", error);
  }
};

connectRedis();

export const createPath = (path: string) => {
  if (!fs.existsSync(path)) {
    fs.mkdir(path, { recursive: true }, (err) => {
      if (err) return false;
      return true;
    });
  }
  return true;
};

export const createFile = (path: string, content: string) => {
  fs.writeFile(path, content, "utf-8", (err) => {
    if (err) return;
  });
};

export const setUpFiles = async (path: string, content: string) => {
  try {
    if (isFile(path)) {
      if (createPath(path.split("/").slice(0, -1).join("/"))) {
        createFile(path, content);
      }
    } else {
      createPath(path);
    }
  } catch (error) {}
};

export const getFiles = async (basePath: string) => {
  basePath = basePath == "/" ? "" : basePath;
  const mainPath = path.join(__dirname, "../../", "code", basePath);
  const files =
    (await fs.promises.readdir(mainPath, { recursive: true })) || [];
  const fileInfo: any = [];
  files.forEach((file) => {
    const Key = path.dirname(file);
    if (isFile(file)) {
      fileInfo.push({
        name: file,
        extension: file.split(".")[file.split(".").length - 1],
        isFile: true,
      });
      if (Key in Map) {
        Map[Key].push({
          name: path.basename(file),
          isFile: true,
          extension: file.split(".")[file.split(".").length - 1],
          path: file,
        });
      } else {
        Map[Key] = [
          {
            name: path.basename(file),
            isFile: true,
            extension: file.split(".")[file.split(".").length - 1],
            path: file,
          },
        ];
      }
    } else {
      fileInfo.push({
        name: file,
        isFile: false,
      });
      if (Key in Map) {
        Map[Key].push({
          name: path.basename(file),
          isFile: false,
          path: file,
        });
      } else {
        Map[Key] = [
          {
            name: path.basename(file),
            isFile: false,
            path: file,
          },
        ];
      }
    }
  });
  return Map;
};

export const getFileContent = async (fileName: string) => {
  const fullPath = path.join(__dirname, "../../", "code", fileName);
  const stat = await fs.promises.lstat(fullPath);
  if (stat.isDirectory()) {
    return getFiles(fileName);
  } else {
    const redis_path = `redis_${fullPath}`;
    const cachedValue = await subscriber.get(redis_path);
    if (cachedValue) {
      return cachedValue;
    }
    const fileData = await fs.promises.readFile(fullPath, "utf-8");
    await publisher.set(redis_path, `${fileData}`);
    return fileData;
  }
};

export const updateFile = (
  filePath: string,
  fileContent: string,
  replId: string
) => {
  const fullPath = path.join(__dirname, "../../", "code", filePath);
  fs.writeFile(fullPath, fileContent, "utf-8", function (err) {
    if (err) console.log(err);
    updateS3(replId, filePath, fileContent);
  });
};

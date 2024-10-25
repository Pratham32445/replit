import {
  GetObjectCommand,
  ListObjectsV2Command,
  S3Client,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import { createPath, setUpFiles } from "../fs";
import path from "path";
import { isFile } from "../util";
import { Readable } from "stream";
import { WebSocket } from "ws";

dotenv.config();

const credentials = {
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
};

const src_bucket = process.env.AWS_REAL_BUCKET;

const client = new S3Client(credentials);

export const getRepl = async (replId: string, socket: WebSocket) => {
  try {
    const listParams = {
      Bucket: src_bucket,
      Prefix: `${replId}/`,
    };
    const listObjects = await client.send(new ListObjectsV2Command(listParams));
    if (
      !listObjects ||
      !listObjects.Contents ||
      listObjects.Contents.length == 0
    )
      return;
    // create a base path
    const basePath = path.join(__dirname, "../../", "code");
    createPath(basePath);

    for (const object of listObjects.Contents) {
      const path = object.Key?.split("/").slice(1).join("/")!;

      if (isFile(path)) {
        const getObjectParams = {
          Bucket: src_bucket,
          Key: object.Key!,
        };

        const fileStream = await client.send(
          new GetObjectCommand(getObjectParams)
        );

        if (fileStream.Body instanceof Readable) {
          const fileContent = await streamToString(fileStream.Body);

          setUpFiles(`${basePath}/${path}`, fileContent);
        }
      } else setUpFiles(`${basePath}/${path}`, "");
    }
    socket.send(JSON.stringify({ type: "setUpCompleted" }));
  } catch (error) {
    console.log(error);
  }
};

const streamToString = (stream: Readable): Promise<string> => {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", (err) => reject(err));
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
  });
};

export const updateS3 = async (
  replId: string,
  fileName: string,
  fileContent: string
) => {
  try {
    const listParams = {
      Bucket: process.env.AWS_REAL_BUCKET,
      Key: `${replId}/${fileName}`,
      Body: fileContent,
      ContentType: "application/javascript",
    };

    const command = new PutObjectCommand(listParams);

    const res = await client.send(command);

  } catch (error) {
    console.log(error);
  }
};

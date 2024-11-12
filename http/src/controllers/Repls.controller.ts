import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { copyS3Folder } from "../aws";
import { client } from "../client";

export const createRepl = async (req: Request, res: Response) => {
  try {
    const { baseLanguage } = req.body;

    const replId = uuidv4();

    if (await copyS3Folder(baseLanguage, replId)) {
      const result = await client.repls.create({
        data: {
          baseLanguage,
          Id: replId,
          // @ts-ignore
          userId: req.user.Id,
        },
      });

      if (result) return res.status(201).send(result.Id);
    }
    return res.status(401).send("some error occured");
  } catch (error) {
    return res.status(401).send("some error occured");
  }
};

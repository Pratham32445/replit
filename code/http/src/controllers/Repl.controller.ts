import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { copyRepl } from "../aws";
import { prisma } from "../client";

export const createRepl = async (req: Request, res: Response) => {
  try {
    const { baseLanguage } = req.body;

    const replId = uuidv4();

    const isOk = await copyRepl(baseLanguage, replId);

    if (isOk) {
      // @ts-ignore
      const UserId = req.userId;

      const repl = await prisma.repl.create({
        data: {
          Id: replId,
          baseLanguage,
          userId: UserId,
        },
      });

      res.status(201).json({ mesage: "repl created successfully", repl });
    }
  } catch (error) {
    res.status(401).send(error);
  }
};

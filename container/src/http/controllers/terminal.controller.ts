import { Request, Response } from "express";

export const Execute = (req: Request, res: Response) => {
  try {
    const cmd = req.body.cmd;
    
  } catch (error) {
    console.log(error);
  }
};

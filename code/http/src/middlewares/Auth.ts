import { NextFunction, Request, response, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "../client";

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(403).send("Please authenticate yourself");

  const tokenData = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

  const user = await prisma.user.findFirst({
    where: {
      email: tokenData.email,
    },
  });

  if (user) {
    
    // @ts-ignore
    req.userId = user.Id;

    next();
  }
};

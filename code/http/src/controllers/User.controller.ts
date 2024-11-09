import { Request, Response } from "express";
import { prisma } from "../client";
import bcrypt from "bcryptjs"

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, username } = req.body;
    if (!username || !email || !password)
      return res.status(401).json({
        message: "Please send all details",
      });
    const isUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (isUser)
      return res.status(401).json({
        message: "user already exist",
      });
    const hashedPassword = await bcrypt.hash(password,10); 
    const User = await prisma.user.create({
      data: {
        email,
        username,
        password : hashedPassword,
        isVerfied: true,
      },
    });
    res.status(201).json({
      message: "User Created",
      User,
    });
  } catch (error) {}
};

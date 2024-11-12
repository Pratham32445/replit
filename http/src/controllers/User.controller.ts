import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { client } from "../client";

export const signUp = async (req: Request, res: Response) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username)
      return res.status(401).send("Please send all the details");

    const isUser = await client.user.findFirst({ where: { email } });

    if (isUser) return res.status(409).send("User already exist");

    const hashedPassword = await bcrypt.hash(password, 10);

    const User = await client.user.create({
      data: {
        email,
        name: username,
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ Id: User.Id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    res.cookie("authToken", token, {
      httpOnly: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).send(User);
  } catch (error) {
    console.log(error);
    return res.status(401).send(error);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const User = await client.user.findFirst({ where: { email } });

    if (User) {
      const isPassword = await bcrypt.compare(password, User.password);

      if (isPassword) {
        const token = jwt.sign({ Id: User.Id }, process.env.JWT_SECRET!, {
          expiresIn: "7d",
        });

        res.cookie("authToken", token, {
          httpOnly: false,
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(201).send(User);
      }
    }
    return res.status(401).send("User not exist");
  } catch (error) {
    console.log(error);
  }
};

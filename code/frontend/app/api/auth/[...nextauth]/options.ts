import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "email",
          type: "email",
          placeholder: "Enter email...",
        },
        password: {
          label: "password",
          type: "password",
          placeholder: "Enter password",
        },
      },
      async authorize(credentials, req) {
        const email = credentials?.email;
        const password = credentials?.password;
        if (email && password) {
          const user = await prisma.user.findFirst({
            where: {
              email,
            },
          });
          if (user) {
            const isPassword = await bcrypt.compare(password, user.password!);
            return isPassword ? user : null;
          }
        }
        return null;
      },
    }),
  ],
};

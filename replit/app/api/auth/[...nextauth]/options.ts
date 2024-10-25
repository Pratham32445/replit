import { prisma } from "@/app/client";
import bcrypt from "bcryptjs";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { type: "email", placeholder: "email" },
        password: { type: "password", placeholder: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials) return null;
        const user = await prisma.user.findFirst({
          where: { email: credentials?.email },
        });
        if (user) {
          const isPassword = await bcrypt.compare(
            credentials.password,
            user.password!
          );
          if (isPassword) {
            await prisma.user.update({
              where: {
                email: user.email,
              },
              data: {
                isVerified: true,
              },
            });
            return { email: user.email, isVerified: true };
          }
          return null;
        }
        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider == "google") {
        const User = await prisma.user.findFirst({
          where: {
            email: user.email!,
          },
        });
        if (User) {
          if (User.isVerified) user.isVerified = true;
          user.isVerified = false;
        } else {
          await prisma.user.create({
            data: {
              email: user.email!,
            },
          });
          user.isVerified = false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.isVerified = user.isVerified!;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).isVerified = token.isVerified;
      }
      return session;
    },
  },
};

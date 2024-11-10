import { getToken } from "next-auth/jwt";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET! });
    if (!token) {
      return NextResponse.json({ error: "Not Authenticated" }, { status: 401 });
    }
    const backendToken = jwt.sign(
      { email: token.email },
      process.env.NEXTAUTH_SECRET!
    );
    return NextResponse.json({ token: backendToken }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Failed to get token" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import vine, { errors } from "@vinejs/vine";
import { authSchema } from "@/app/validator/authSchema";
import ErrorReporter from "@/app/validator/ErrorReporter";
import { prisma } from "@/app/client";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validator = vine.compile(authSchema);

    validator.errorReporter = () => new ErrorReporter();

    const res = await validator.validate(body);

    const user = await prisma.user.findFirst({
      where: {
        email: res.email,
      },
    });

    if (user)
      return NextResponse.json(
        {
          status: 400,
          errors: {
            email: "User already exist",
          },
        },
        { status: 200 }
      );

    res.password = await bcrypt.hash(body.password, 10);

    await prisma.user.create({
      data: {
        email: res.email,
        password: res.password,
        isVerified: true,
      },
    });

    return NextResponse.json(
      { status: 200, message: "user created successfully" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      return NextResponse.json(
        { errors: error.messages, status: 400 },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { status: 500, message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const user = await prisma.user.update({
      where: {
        email: body.email,
      },
      data: {
        password: hashedPassword,
      },
    });

    if (user) return NextResponse.json(user, { status: 201 });

    return NextResponse.json("some error occured", { status: 401 });
  } catch (error) {
    console.log("error is", error);
    return NextResponse.json(error, { status: 401 });
  }
}

import { copyRepl, createRepl } from "@/app/aws";
import { prisma } from "@/app/client";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const replId = uuid();
    const requestData = await request.json();
    const repl = await prisma.repl.create({
      data: {
        Id: replId,
        userId: 1,
        baseImage: `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${requestData.baseLanguage}/${requestData.baseLanguage}.svg`,
        baseLanguage: requestData.baseLanguage,
        title: "firstRepl",
      },
    });

    if (repl) {
      if (await copyRepl(requestData.baseLanguage, replId)) {
        const ReplIp = await createRepl(replId);

        // @ts-ignore
        repl.replIp = ReplIp;

        return NextResponse.json(
          {
            message: "repl created",
            repl,
          },
          { status: 201 }
        );
      }
    }
    return NextResponse.json({ error: "some error occured" }, { status: 401 });
  } catch (error) {
    console.log(error);
  }
}

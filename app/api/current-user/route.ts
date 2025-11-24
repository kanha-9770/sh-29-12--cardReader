// app/api/current-user/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();

    if (!session?.id) {
      return NextResponse.json({ isAdmin: false });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: { isAdmin: true },
    });

    return NextResponse.json({
      isAdmin: user?.isAdmin || false,
    });
  } catch (error) {
    console.error("[/api/current-user] Error:", error);
    return NextResponse.json({ isAdmin: false });
  }
}
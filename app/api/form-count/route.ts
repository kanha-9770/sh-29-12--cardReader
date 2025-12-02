// app/api/form-count/route.ts

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();

    // Debug log
    console.log("Form Count API → Session:", {
      userId: session?.id,
      email: session?.email,
      isAdmin: session?.isAdmin,
      timestamp: new Date().toISOString(),
    });

    // Guest / unauthenticated
    if (!session?.id) {
      return NextResponse.json({
        count: 0,
        limitReached: false,
        isAdmin: false,
        limit: 1500,
      });
    }

    const userId = session.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        formCount: true,
        formLimit: true,
        isAdmin: true,
        email: true,
      },
    });

    if (!user) {
      console.warn("Form-count API → User not found:", userId);
      return NextResponse.json({
        count: 0,
        limitReached: false,
        isAdmin: false,
        limit: 1500,
      });
    }

    const count = user.formCount ?? 0;
    const limit = user.formLimit ?? 1500;
    const limitReached = !user.isAdmin && count >= limit;

    // Final log
    console.log("Form Count Result →", {
      userId,
      email: user.email,
      count,
      limit,
      isAdmin: user.isAdmin,
      limitReached,
    });

    return NextResponse.json({
      count,
      limit,
      limitReached,
      isAdmin: user.isAdmin,
    });
  } catch (error: any) {
    console.error("Form Count API Error:", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { error: "Failed to fetch form count" },
      { status: 500 }
    );
  }
}

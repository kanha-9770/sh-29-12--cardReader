import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();

    if (!session?.email) {
      return NextResponse.json({ count: 0 });
    }

    const count = await prisma.form.count({
      where: {
        user: {
          email: session.email,
        },
      },
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch count" },
      { status: 500 }
    );
  }
}

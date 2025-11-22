// app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const token = cookies().get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const payload = await verifyToken(token);

    // Critical: payload must have `id`
    if (!payload || !payload.id) {
      console.error("Token missing user ID:", payload);
      return NextResponse.json(
        { error: "Invalid token: missing user ID" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      user: {
        id: payload.id as string,
        email: payload.email as string,
        name: payload.name as string | null,
        isAdmin: !!payload.isAdmin,
        organizationId: payload.organizationId as number | null,
      },
    });
  } catch (error) {
    console.error("Invalid or expired token:", error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

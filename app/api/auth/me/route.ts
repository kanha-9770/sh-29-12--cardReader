import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  const token = cookies().get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const decoded = await verifyToken(token);

    return NextResponse.json({
      user: {
        id: decoded.id,
        email: decoded.email,
        isAdmin: decoded.isAdmin,
        organizationId: decoded.organizationId,
      },
    });
  } catch (error) {
    console.error("❌ Invalid token:", error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

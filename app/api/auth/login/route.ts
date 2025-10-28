import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      console.log("❌ Missing email or password:", { email, password });
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    console.log("🔑 Login attempt:", { email });

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log("❌ User not found for email:", email);
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      console.log("❌ Password verification failed for user:", email);
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // ✅ Extract organization ID from email domain or base email
    const organizationId = email; 

    // ✅ Add organization ID to payload
    const payload = {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
      organizationId,
    };

    console.log("✅ Token payload:", payload);

    // Create JWT token
    const token = await createToken(payload);

    // Set cookie
    cookies().set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    console.log("✅ Token created for user:", user.email);
    console.log("🏢 Organization ID:", organizationId);

    // ✅ Return user + org info
    return NextResponse.json({
      user: payload,
    });
  } catch (error: any) {
    console.error("💥 Login error:", error.message, error.stack);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

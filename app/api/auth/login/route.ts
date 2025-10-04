import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      console.log("Missing email or password:", { email, password });
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }
    console.log("Login attempt:", { email });

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log("User not found for email:", email);
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      console.log("Password verification failed for user:", email);
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create token with user data
    const payload = {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    };
    console.log("Token payload:", payload); // Log payload to ensure values are correct
    const token = await createToken(payload);

    // Set cookie
    cookies().set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure in production
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    console.log("Created token:", token); // Log token for verification
    console.log("User data:", payload);

    return NextResponse.json({
      user: payload,
    });
  } catch (error: any) {
    console.error("Login error:", error.message, error.stack);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
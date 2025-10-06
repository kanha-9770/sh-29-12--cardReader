import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, createToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    console.log("Register request body:", { email, password });

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);
    console.log("Hashed password:", hashedPassword);

    // Create the user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        isAdmin: false, // Default value
      },
    });
    console.log("Created user:", { id: user.id, email: user.email });

    // Create a session token for auto-login
    const token = await createToken({
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    });
    console.log("Generated token:", token);

    // Set the token in a cookie
    cookies().set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return NextResponse.json(
      { message: "User created and logged in successfully", user: { id: user.id, email: user.email } },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error.message);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
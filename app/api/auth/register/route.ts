// /api/auth/register (Corrected)
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { jwtVerify } from "jose";
import { cookies } from "next/headers"; // Import cookies

export async function POST(req: Request) {
  try {
    const cookieStore = cookies(); // Get the cookie store
    const token = cookieStore.get("token")?.value; // Get the token from the cookie
    console.log("Received token:", token);

    if (!token) {
      // Check if token exists first
      return NextResponse.json(
        { error: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    let isAdmin = false;
    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET)
      );
      isAdmin = payload.isAdmin === true;
    } catch (error) {
      console.error("JWT Verification Error:", error);
      return NextResponse.json(
        { error: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized: Not an admin" },
        { status: 401 }
      );
    }

    const { email, password, role } = await req.json();

    const exists = await prisma.user.findUnique({
      where: { email },
    });

    if (exists) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        isAdmin: role === "admin", // Set isAdmin based on role
      },
    });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error: any) {
    console.error("Register API Error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
// import { NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import { prisma } from "@/lib/prisma";
// import { verifyPassword, createToken } from "@/lib/auth";

// export async function POST(req: Request) {
//   try {
//     const { email, password } = await req.json();

//     if (!email || !password) {
//       console.log("❌ Missing email or password:", { email, password });
//       return NextResponse.json(
//         { error: "Email and password are required" },
//         { status: 400 }
//       );
//     }

//     console.log("🔑 Login attempt:", { email });

//     // Find user by email
//     const user = await prisma.user.findUnique({
//       where: { email },
//     });

//     if (!user) {
//       console.log("❌ User not found for email:", email);
//       return NextResponse.json(
//         { error: "Invalid credentials" },
//         { status: 401 }
//       );
//     }

//     // Verify password
//     const isValid = await verifyPassword(password, user.password);
//     if (!isValid) {
//       console.log("❌ Password verification failed for user:", email);
//       return NextResponse.json(
//         { error: "Invalid credentials" },
//         { status: 401 }
//       );
//     }

//     // ✅ Extract organization ID from email domain or base email
//     const organizationId = email; 

//     // ✅ Add organization ID to payload
//     const payload = {
//       id: user.id,
//       email: user.email,
//       isAdmin: user.isAdmin,
//       organizationId,
//     };

//     console.log("✅ Token payload:", payload);

//     // Create JWT token
//     const token = await createToken(payload);

//     // Set cookie
//     cookies().set("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//       maxAge: 60 * 60 * 24, // 24 hours
//       path: "/",
//     });

//     console.log("✅ Token created for user:", user.email);
//     console.log("🏢 Organization ID:", organizationId);

//     // ✅ Return user + org info
//     return NextResponse.json({
//       user: payload,
//     });
//   } catch (error: any) {
//     console.error("💥 Login error:", error.message, error.stack);
//     return NextResponse.json(
//       { error: "Internal server error", details: error.message },
//       { status: 500 }
//     );
//   }
// }


// app/api/login/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user with organization relation
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        isAdmin: true,
        organizationId: true, // ← This is critical!
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create proper JWT payload
    const payload = {
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin || false,
      organizationId: user.organizationId, // ← Use actual DB value, not email!
    };

    // Generate token
    const token = await createToken(payload);

    // Set secure cookie
    cookies().set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    console.log("Login successful:", { email: user.email, isAdmin: user.isAdmin, organizationId: user.organizationId });

    // Return success (without sensitive data)
    return NextResponse.json({
      success: true,
      user: {
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
        organizationId: user.organizationId,
      },
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
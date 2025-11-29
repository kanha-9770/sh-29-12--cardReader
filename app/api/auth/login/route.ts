// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, loginAndSetCookie } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        isAdmin: true,
        organizationId: true,
      },
    });

    if (!user || !user.password) {
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

    // Use shared helper to set cookie + generate token with `id`
    await loginAndSetCookie({
      id: user.id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin || false,
      organizationId: user.organizationId,
    });

    console.log("Login Success", {
      userId: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
      organizationId: user.organizationId,
    });

    // Return clean user object (no password!)
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
        organizationId: user.organizationId,
      },
    });
  } catch (error: any) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


// // app/api/auth/login/route.ts
// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { verifyPassword, loginAndSetCookie } from "@/lib/auth";

// export async function POST(req: Request) {
//   try {
//     const { email, password } = await req.json();

//     if (!email || !password) {
//       return NextResponse.json(
//         { error: "Please enter both email and password" },
//         { status: 400 }
//       );
//     }

//     const normalizedEmail = email.trim().toLowerCase();

//     // Find user
//     const user = await prisma.user.findUnique({
//       where: { email: normalizedEmail },
//       select: {
//         id: true,
//         email: true,
//         name: true,
//         password: true,
//         isAdmin: true,
//         organizationId: true,
//         emailVerified: true, // we'll use this
//       },
//     });

//     // 1. User not found
//     if (!user) {
//       return NextResponse.json(
//         { error: "No account found with this email" },
//         { status: 401 }
//       );
//     }

//     // 2. Email not verified yet
//     if (!user.emailVerified) {
//       return NextResponse.json(
//         { 
//           error: "Please verify your email first",
//           needsVerification: true 
//         },
//         { status: 403 }
//       );
//     }

//     // 3. Wrong password
//     if (!user.password) {
//       return NextResponse.json(
//         { error: "Invalid login method" },
//         { status: 401 }
//       );
//     }

//     const isValidPassword = await verifyPassword(password, user.password);
//     if (!isValidPassword) {
//       return NextResponse.json(
//         { error: "Incorrect password. Please try again." },
//         { status: 401 }
//       );
//     }

//     // SUCCESS: Login
//     await loginAndSetCookie({
//       id: user.id,
//       email: user.email,
//       name: user.name,
//       isAdmin: user.isAdmin || false,
//       organizationId: user.organizationId,
//     });

//     return NextResponse.json({
//       success: true,
//       user: {
//         id: user.id,
//         email: user.email,
//         name: user.name,
//         isAdmin: user.isAdmin,
//         organizationId: user.organizationId,
//       },
//     });

//   } catch (error: any) {
//     console.error("Login API Error:", error);
//     return NextResponse.json(
//       { error: "Something went wrong. Please try again." },
//       { status: 500 }
//     );
//   }
// }
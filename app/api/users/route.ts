// // import { NextResponse } from "next/server";
// // import { prisma } from "@/lib/prisma";
// // import { hash } from "bcryptjs";
// // import { getUserFromToken } from "@/lib/auth"; // helper to decode JWT cookie

// // // POST → Create a new user
// // export async function POST(req: Request) {
// //   try {
// //     const currentUser = await getUserFromToken();

// //     if (!currentUser || !currentUser.email) {
// //       return NextResponse.json(
// //         { error: "Unauthorized - please login first" },
// //         { status: 401 }
// //       );
// //     }

// //     const organizationId = currentUser.email; // use login email as org ID
// //     const { name, email, password } = await req.json();

// //     if (!name || !email || !password) {
// //       return NextResponse.json(
// //         { error: "Missing name, email, or password" },
// //         { status: 400 }
// //       );
// //     }

// //     // Check if user already exists
// //     const existingUser = await prisma.user.findUnique({ where: { email } });
// //     if (existingUser) {
// //       return NextResponse.json(
// //         { error: "User with this email already exists" },
// //         { status: 400 }
// //       );
// //     }

// //     // Hash password
// //     const hashedPassword = await hash(password, 10);

// //     // Create new user in DB
// //     const newUser = await prisma.user.create({
// //       data: {
// //         name,
// //         email,
// //         password: hashedPassword,
// //         organizationId, // link to org (using email as org ID)
// //       },
// //     });

// //     console.log("✅ User created:", newUser);

// //     return NextResponse.json(
// //       { message: "User created successfully", user: newUser },
// //       { status: 201 }
// //     );
// //   } catch (error: any) {
// //     console.error("❌ Error creating user:", error);
// //     return NextResponse.json(
// //       { error: "Internal Server Error", details: error.message },
// //       { status: 500 }
// //     );
// //   }
// // }

// // // GET → Fetch all users belonging to the same organization
// // export async function GET() {
// //   try {
// //     const currentUser = await getUserFromToken();

// //     if (!currentUser || !currentUser.email) {
// //       return NextResponse.json(
// //         { error: "Unauthorized - please login first" },
// //         { status: 401 }
// //       );
// //     }

// //     const organizationId = currentUser.email;

// //     const users = await prisma.user.findMany({
// //       where: { organizationId },
// //       select: { id: true, name: true, email: true, organizationId: true },
// //       orderBy: { createdAt: "desc" },
// //     });

// //     return NextResponse.json({ users });
// //   } catch (error: any) {
// //     console.error("❌ Error fetching users:", error);
// //     return NextResponse.json(
// //       { error: "Internal Server Error", details: error.message },
// //       { status: 500 }
// //     );
// //   }
// // }

// // /app/api/users/route.ts
// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { hashPassword, getSession } from "@/lib/auth";

// /**
//  * POST -> Create a new user (Admin creates)
//  * - Requires admin session
//  * - Validates email/password/name
//  * - Prevents duplicate email even if soft-deleted (B4)
//  * - Hashes password and stores user with organizationId from admin's organization
//  */
// export async function POST(req: Request) {
//   try {
//     const session = await getSession();
//     if (!session || !session.email) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const body = await req.json();
//     const name = body?.name?.trim();
//     const email = body?.email?.trim().toLowerCase();
//     const password = body?.password;

//     // Basic validation
//     if (!name || !email || !password) {
//       return NextResponse.json(
//         { error: "Name, email and password are required" },
//         { status: 400 }
//       );
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
//     }

//     if (password.length < 8) {
//       return NextResponse.json(
//         { error: "Password must be at least 8 characters long" },
//         { status: 400 }
//       );
//     }

//     // Prevent creating duplicate email even if soft-deleted
//     const existing = await prisma.user.findUnique({ where: { email } });
//     if (existing) {
//       // If already soft-deleted, instruct to restore instead of recreate
//       if (existing.isDeleted) {
//         return NextResponse.json(
//           { error: "A user with this email exists but is deleted. Please restore the user instead of creating a new one." },
//           { status: 409 }
//         );
//       }

//       return NextResponse.json({ error: "Email already registered" }, { status: 409 });
//     }

//     // Hash password
//     const hashed = await hashPassword(password);

//     // Fetch admin's organizationId
//     const adminOrg = await prisma.user.findUnique({
//       where: { email: session.email },
//       select: { organizationId: true },
//     });

//     if (!adminOrg?.organizationId) {
//       return NextResponse.json(
//         { error: "Admin's organization not found. Please ensure the admin has an associated organization." },
//         { status: 500 }
//       );
//     }

//     const organizationId = adminOrg.organizationId;

//     const newUser = await prisma.user.create({
//       data: {
//         name,
//         email,
//         password: hashed,
//         organizationId,
//         isAdmin: false,
//         isDeleted: false,
//       },
//     });

//     // Do not set any cookie/token for admin (Option A behavior)
//     return NextResponse.json(
//       {
//         message: "User created successfully",
//         user: { id: newUser.id, name: newUser.name, email: newUser.email, createdAt: newUser.createdAt },
//       },
//       { status: 201 }
//     );
//   } catch (err: any) {
//     console.error("Error in POST /api/users:", err);
//     return NextResponse.json({ error: "Internal server error", details: err.message }, { status: 500 });
//   }
// }

// /**
//  * GET -> Fetch active users (isDeleted = false)
//  * - Requires session
//  * - Returns users ordered by createdAt desc
//  */
// export async function GET() {
//   try {
//     const session = await getSession();
//     if (!session || !session.email) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     // Fetch admin's organizationId
//     const adminOrg = await prisma.user.findUnique({
//       where: { email: session.email },
//       select: { organizationId: true },
//     });

//     if (!adminOrg?.organizationId) {
//       return NextResponse.json(
//         { error: "Organization not found. Please ensure the admin has an associated organization." },
//         { status: 404 }
//       );
//     }

//     const organizationId = adminOrg.organizationId;

//     const users = await prisma.user.findMany({
//       where: {
//         organizationId,
//         isDeleted: false,
//       },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         organizationId: true,
//         isAdmin: true,
//         createdAt: true,
//       },
//       orderBy: { createdAt: "desc" },
//     });

//     return NextResponse.json({ users }, { status: 200 });
//   } catch (err: any) {
//     console.error("Error in GET /api/users:", err);
//     return NextResponse.json({ error: "Internal server error", details: err.message }, { status: 500 });
//   }
// }

// /**
//  * PATCH -> Soft delete a user (isDeleted = true)
//  * Body: { userId: string }
//  * - Requires session
//  */
// export async function PATCH(req: Request) {
//   try {
//     const session = await getSession();
//     if (!session || !session.email) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { userId } = await req.json();
//     if (!userId) {
//       return NextResponse.json({ error: "userId is required" }, { status: 400 });
//     }

//     // Optional: ensure the user belongs to the same organization
//     const user = await prisma.user.findUnique({ where: { id: userId } });
//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     if (user.isDeleted) {
//       return NextResponse.json({ error: "User is already deleted" }, { status: 400 });
//     }

//     // Fetch admin's organizationId
//     const adminOrg = await prisma.user.findUnique({
//       where: { email: session.email },
//       select: { organizationId: true },
//     });

//     if (!adminOrg?.organizationId) {
//       return NextResponse.json(
//         { error: "Admin's organization not found." },
//         { status: 500 }
//       );
//     }

//     // Make sure admin and target user share same organization (prevent deleting other orgs)
//     if (user.organizationId !== adminOrg.organizationId) {
//       return NextResponse.json({ error: "Forbidden" }, { status: 403 });
//     }

//     await prisma.user.update({
//       where: { id: userId },
//       data: { isDeleted: true },
//     });

//     return NextResponse.json({ message: "User soft-deleted" }, { status: 200 });
//   } catch (err: any) {
//     console.error("Error in PATCH /api/users:", err);
//     return NextResponse.json({ error: "Internal server error", details: err.message }, { status: 500 });
//   }
// }

// /**
//  * PUT -> Restore a soft-deleted user (isDeleted = false)
//  * Body: { userId: string }
//  * - Requires session
//  */
// export async function PUT(req: Request) {
//   try {
//     const session = await getSession();
//     if (!session || !session.email) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { userId } = await req.json();
//     if (!userId) {
//       return NextResponse.json({ error: "userId is required" }, { status: 400 });
//     }

//     const user = await prisma.user.findUnique({ where: { id: userId } });
//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     // Fetch admin's organizationId
//     const adminOrg = await prisma.user.findUnique({
//       where: { email: session.email },
//       select: { organizationId: true },
//     });

//     if (!adminOrg?.organizationId) {
//       return NextResponse.json(
//         { error: "Admin's organization not found." },
//         { status: 500 }
//       );
//     }

//     // Ensure same organization
//     if (user.organizationId !== adminOrg.organizationId) {
//       return NextResponse.json({ error: "Forbidden" }, { status: 403 });
//     }

//     if (!user.isDeleted) {
//       return NextResponse.json({ error: "User is not deleted" }, { status: 400 });
//     }

//     await prisma.user.update({
//       where: { id: userId },
//       data: { isDeleted: false },
//     });

//     return NextResponse.json({ message: "User restored" }, { status: 200 });
//   } catch (err: any) {
//     console.error("Error in PUT /api/users:", err);
//     return NextResponse.json({ error: "Internal server error", details: err.message }, { status: 500 });
//   }
// }
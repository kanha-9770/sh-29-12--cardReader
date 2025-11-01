// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { hashPassword, getSession } from "@/lib/auth";

// /**
//  * POST → Create a new user (Admin creates user inside their organization)
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

//     // Validate
//     if (!name || !email || !password) {
//       return NextResponse.json(
//         { error: "Name, email & password are required" },
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

//     // Check if email exists (including deleted)
//     const existing = await prisma.user.findUnique({ where: { email } });
//     if (existing) {
//       if (existing.isDeleted) {
//         return NextResponse.json(
//           { error: "User exists but is deleted — restore instead", userId: existing.id },
//           { status: 409 }
//         );
//       }
//       return NextResponse.json({ error: "Email already registered" }, { status: 409 });
//     }

//     // Fetch admin org
//     const admin = await prisma.user.findUnique({
//       where: { email: session.email },
//       select: { organizationId: true },
//     });

//     if (!admin?.organizationId) {
//       return NextResponse.json(
//         { error: "Admin does not belong to an organization" },
//         { status: 500 }
//       );
//     }

//     const hashed = await hashPassword(password);

//     const newUser = await prisma.user.create({
//       data: {
//         name,
//         email,
//         password: hashed,
//         organizationId: admin.organizationId,
//         isAdmin: false,
//       },
//     });

//     return NextResponse.json(
//       { message: "User created successfully", user: { id: newUser.id, name, email } },
//       { status: 201 }
//     );
//   } catch (err: any) {
//     console.error("❌ Error creating user:", err);
//     return NextResponse.json({ error: "Internal server error", details: err.message }, { status: 500 });
//   }
// }

// /**
//  * GET → Fetch all active users of admin's organization
//  */
// export async function GET() {
//   try {
//     const session = await getSession();
//     if (!session || !session.email) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     // Fetch admin with more fields
//     let admin = await prisma.user.findUnique({
//       where: { email: session.email },
//       select: { id: true, organizationId: true, isAdmin: true, name: true },
//     });

//     if (!admin) {
//       return NextResponse.json({ error: "Admin user not found" }, { status: 404 });
//     }

//     // Auto-create org if missing (only for admins)
//     if (!admin.organizationId) {
//       if (!admin.isAdmin) {
//         return NextResponse.json(
//           { error: "Only admins can manage organizations" },
//           { status: 403 }
//         );
//       }

//       // Create the organization
//       const newOrg = await prisma.organization.create({
//         data: {
//           organizationId: session.email, // Use email as unique string ID
//           name: admin.name ? `Organization for ${admin.name}` : `Organization for ${session.email}`,
//           createdBy: session.email,
//         },
//       });

//       console.log(`🔍 Created org for ${session.email}: ID ${newOrg.id}`);

//       // Link it to the admin user
//       admin = await prisma.user.update({
//         where: { id: admin.id },
//         data: { organizationId: newOrg.id },
//         select: { organizationId: true },
//       });

//       console.log(`🔍 Linked org ${newOrg.id} to admin ${admin.id}`);
//     }

//     const users = await prisma.user.findMany({
//       where: { organizationId: admin.organizationId, isDeleted: false },
//       orderBy: { createdAt: "desc" },
//       select: { id: true, name: true, email: true, isAdmin: true, createdAt: true },
//     });

//     return NextResponse.json({ users }, { status: 200 });
//   } catch (err: any) {
//     console.error("❌ Error fetching users:", err);
//     return NextResponse.json({ error: "Internal server error", details: err.message }, { status: 500 });
//   }
// }

// /**
//  * PATCH → Soft Delete a User
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

//     const user = await prisma.user.findUnique({ where: { id: userId } });
//     if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

//     if (user.isDeleted) {
//       return NextResponse.json({ error: "User already deleted" }, { status: 400 });
//     }

//     await prisma.user.update({
//       where: { id: userId },
//       data: { isDeleted: true },
//     });

//     return NextResponse.json({ message: "User deleted" }, { status: 200 });
//   } catch (err: any) {
//     console.error("❌ Error deleting user:", err);
//     return NextResponse.json({ error: "Internal server error", details: err.message }, { status: 500 });
//   }
// }

// /**
//  * PUT → Restore a soft deleted user
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
//     if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

//     if (!user.isDeleted) {
//       return NextResponse.json({ error: "User is not deleted" }, { status: 400 });
//     }

//     await prisma.user.update({
//       where: { id: userId },
//       data: { isDeleted: false },
//     });

//     return NextResponse.json({ message: "User restored" }, { status: 200 });
//   } catch (err: any) {
//     console.error("❌ Error restoring user:", err);
//     return NextResponse.json({ error: "Internal server error", details: err.message }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, getSession } from "@/lib/auth";

interface CreateUserBody {
  name?: string;
  email?: string;
  password?: string;
}

interface UpdateUserBody {
  userId: string;
}

/**
 * POST → Create a new user (Admin creates user inside their organization)
 */
export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || !session.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as CreateUserBody;
    const name = (body?.name ?? "").trim();
    const email = ((body?.email ?? "") as string).trim().toLowerCase();
    const password = body?.password as string;

    // Validate
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email & password are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // Check if email exists (including deleted)
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      if (existing.isDeleted) {
        return NextResponse.json(
          { error: "User exists but is deleted — restore instead", userId: existing.id },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    // Fetch admin org
    const admin = await prisma.user.findUnique({
      where: { email: session.email },
      select: { organizationId: true },
    });

    if (!admin?.organizationId) {
      return NextResponse.json(
        { error: "Admin does not belong to an organization" },
        { status: 500 }
      );
    }

    const hashed = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        organizationId: admin.organizationId,
        isAdmin: false,
      },
    });

    return NextResponse.json(
      { message: "User created successfully", user: { id: newUser.id, name, email } },
      { status: 201 }
    );
  } catch (err) {
    console.error("❌ Error creating user:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: "Internal server error", details: errorMessage }, { status: 500 });
  }
}

/**
 * GET → Fetch all active users of admin's organization
 */
export async function GET() {
  try {
    const session = await getSession();
    if (!session || !session.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch admin with more fields
    let admin = await prisma.user.findUnique({
      where: { email: session.email },
      select: { id: true, organizationId: true, isAdmin: true, name: true },
    });

    if (!admin) {
      return NextResponse.json({ error: "Admin user not found" }, { status: 404 });
    }

    // Auto-create org if missing (only for admins)
    if (!admin.organizationId) {
      if (!admin.isAdmin) {
        return NextResponse.json(
          { error: "Only admins can manage organizations" },
          { status: 403 }
        );
      }

      // Create the organization
      const newOrg = await prisma.organization.create({
        data: {
          organizationId: session.email, // Use email as unique string ID
          name: admin.name ? `Organization for ${admin.name}` : `Organization for ${session.email}`,
          createdBy: session.email,
        },
      });

      console.log(`🔍 Created org for ${session.email}: ID ${newOrg.id}`);

      // Link it to the admin user
      admin = await prisma.user.update({
        where: { id: admin.id },
        data: { organizationId: newOrg.id },
        select: { id: true, organizationId: true, isAdmin: true, name: true },
      });

      console.log(`🔍 Linked org ${newOrg.id} to admin ${admin.id}`);
    }

    const users = await prisma.user.findMany({
      where: { organizationId: admin.organizationId, isDeleted: false },
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, isAdmin: true, createdAt: true },
    });

    return NextResponse.json({ users }, { status: 200 });
  } catch (err) {
    console.error("❌ Error fetching users:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: "Internal server error", details: errorMessage }, { status: 500 });
  }
}

/**
 * PATCH → Soft Delete a User
 */
export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session || !session.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = (await req.json()) as UpdateUserBody;
    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (user.isDeleted) {
      return NextResponse.json({ error: "User already deleted" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { isDeleted: true },
    });

    return NextResponse.json({ message: "User deleted" }, { status: 200 });
  } catch (err) {
    console.error("❌ Error deleting user:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: "Internal server error", details: errorMessage }, { status: 500 });
  }
}

/**
 * PUT → Restore a soft deleted user
 */
export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session || !session.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = (await req.json()) as UpdateUserBody;
    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (!user.isDeleted) {
      return NextResponse.json({ error: "User is not deleted" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { isDeleted: false },
    });

    return NextResponse.json({ message: "User restored" }, { status: 200 });
  } catch (err) {
    console.error("❌ Error restoring user:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: "Internal server error", details: errorMessage }, { status: 500 });
  }
}
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
 * POST → Create user inside admin organization
 */
export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as CreateUserBody;
    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email & password are required" },
        { status: 400 }
      );
    }

    // email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Existing check
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    // Get admin org
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
      { message: "User created", user: newUser },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/users error", err);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}

/**
 * GET → Fetch users of admin's organization
 */
export async function GET() {
  try {
    const session = await getSession();
    if (!session?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let admin = await prisma.user.findUnique({
      where: { email: session.email },
      select: { id: true, organizationId: true, isAdmin: true, name: true },
    });

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    // If admin has no org, auto-create
    if (!admin.organizationId) {
      if (!admin.isAdmin) {
        return NextResponse.json(
          { error: "Only admins may create organizations" },
          { status: 403 }
        );
      }

      const newOrg = await prisma.organization.create({
        data: {
          uniqueOrgId: session.email,              // ✅ correct field
          name: `Organization of ${admin.name || session.email}`,
          createdBy: session.email,
        },
      });

      admin = await prisma.user.update({
        where: { id: admin.id },
        data: { organizationId: newOrg.id },
        select: { id: true, organizationId: true, isAdmin: true, name: true },
      });
    }

    // Fetch users
    const users = await prisma.user.findMany({
      where: { organizationId: admin.organizationId, isDeleted: false },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            uniqueOrgId: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ users }, { status: 200 });
  } catch (err) {
    console.error("GET /api/users error", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

/**
 * PATCH → Soft Delete user
 */
export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = (await req.json()) as UpdateUserBody;

    await prisma.user.update({
      where: { id: userId },
      data: { isDeleted: true },
    });

    return NextResponse.json({ message: "User deleted" });
  } catch (err) {
    console.error("PATCH /api/users error", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

/**
 * PUT → Restore soft deleted user
 */
export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = (await req.json()) as UpdateUserBody;

    await prisma.user.update({
      where: { id: userId },
      data: { isDeleted: false },
    });

    return NextResponse.json({ message: "User restored" });
  } catch (err) {
    console.error("PUT /api/users error", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}


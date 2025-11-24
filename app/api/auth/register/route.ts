import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, createToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";  // For uniqueOrgId fallback; or use 'cuid' if installed

export async function POST(req: Request) {
  try {
    const { email, password, name, organizationId } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);

    let user;
    let finalOrgId: number | null = null;

    if (organizationId) {
      // ✅ Join existing org: Count users in provided org
      const userCount = await prisma.user.count({
        where: {
          organizationId,
          isDeleted: false
        }
      });

      const isAdmin = userCount === 0;

      // Create user directly with org ID
      user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: name ?? null,
          organizationId,  // Use provided
          isAdmin,
        },
      });

      finalOrgId = organizationId;
    } else {
      // 🚀 New org flow: Create user first (temp null org), then org, then link
      // Create temp user without org
      user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: name ?? null,
          organizationId: null,  // Temp
          isAdmin: true,  // Will be org admin
        },
      });

      // Create org with user as creator
      const orgName = name ? `${name}'s Organization` : `${email.split('@')[0]}'s Organization`;
      const uniqueOrgId = `org_${randomUUID().replace(/-/g, '')}`;  // Safe unique; adjust if using cuid

      const newOrg = await prisma.organization.create({
        data: {
          name: orgName,
          uniqueOrgId,
          createdBy: user.id,  // Now we have user.id
        },
      });

      // Link user to new org
      await prisma.user.update({
        where: { id: user.id },
        data: { organizationId: newOrg.id },
      });

      finalOrgId = newOrg.id;
    }

    // Refresh user with final data (include org if needed)
    user = await prisma.user.findUnique({
      where: { id: user.id },
      include: { organization: true },  // Optional: For response
    });

    const token = await createToken({
      id: user!.id,
      email: user!.email,
      isAdmin: user!.isAdmin,
    });

    cookies().set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return NextResponse.json(
      {
        message: user!.isAdmin
          ? "Admin user created & logged in successfully"
          : "User created & logged in successfully",
        user,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
// app/api/form-template/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth"; // ← Your custom auth file
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getSession();

  // If no session → still return empty/default fields (non-logged-in fallback)
  if (!session?.user?.email) {
    return NextResponse.json({ fields: [] });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organizationId: true,
      isAdmin: true,
    },
  });

  // No org → fallback to defaults
  if (!user?.organizationId) {
    return NextResponse.json({ fields: [] });
  }

  const template = await prisma.formTemplate.findUnique({
    where: { organizationId: user.organizationId },
    select: { fields: true },
  });

  return NextResponse.json({ fields: template?.fields || [] });
}

export async function POST(req: NextRequest) {
  const session = await getSession();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      isAdmin: true,
      organizationId: true,
    },
  });

  if (!user?.isAdmin) {
    return NextResponse.json({ error: "Forbidden: Admin only" }, { status: 403 });
  }

  if (!user.organizationId) {
    return NextResponse.json({ error: "No organization found" }, { status: 400 });
  }

  const { fields } = await req.json();

  const template = await prisma.formTemplate.upsert({
    where: { organizationId: user.organizationId },
    update: { fields },
    create: {
      organizationId: user.organizationId,
      fields,
    },
  });

  return NextResponse.json({ success: true, message: "Form published to your organization!" });
}
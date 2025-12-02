// app/api/forms/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

/* ========== GET: Admin sees all forms in organization ========== */
export async function GET() {
  try {
    const session = await getSession();

    const userEmail = (session as any)?.user?.email || (session as any)?.email;
    const isAdmin = (session as any)?.user?.isAdmin || (session as any)?.isAdmin;

    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden - Admin only" }, { status: 403 });
    }

    const adminUser = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { organizationId: true },
    });

    if (!adminUser?.organizationId) {
      return NextResponse.json({ error: "No organization found" }, { status: 400 });
    }

    const forms = await prisma.form.findMany({
      where: {
        user: { organizationId: adminUser.organizationId },
      },
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { email: true, name: true } },
        extractedData: true,
        mergedData: true,
      },
    });

    return NextResponse.json({ forms });
  } catch (error) {
    console.error("GET /api/forms error:", error);
    return NextResponse.json({ error: "Failed to fetch forms" }, { status: 500 });
  }
}

/* ========== POST: Create new form + Trigger Background Job ========== */
export async function POST(req: Request) {
  try {
    const session = await getSession();
    const userEmail = (session as any)?.user?.email || (session as any)?.email;

    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: userEmail },
      select: {
        id: true,
        subscriptionPlan: true,
        formLimit: true,
      },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Free plan limit check
    if (currentUser.subscriptionPlan === "FREE") {
      const count = await prisma.form.count({ where: { userId: currentUser.id } });
      const limit = currentUser.formLimit ?? 1500;
      if (count >= limit) {
        return NextResponse.json(
          { error: "Limit reached", message: "Upgrade your plan to submit more forms" },
          { status: 403 }
        );
      }
    }

    const formData = await req.formData();
    const jsonData = formData.get("jsonData") as string;
    if (!jsonData) return NextResponse.json({ error: "Missing data" }, { status: 400 });

    let data;
    try {
      data = JSON.parse(jsonData);
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const newForm = await prisma.form.create({
      data: {
        ...data,
        userId: currentUser.id,
        date: new Date(data.date || Date.now()),
        cardFrontPhoto: data.cardFrontPhoto || "",
        cardBackPhoto: data.cardBackPhoto || null,
        meetingAfterExhibition: Boolean(data.meetingAfterExhibition),
        additionalData: data.additionalData || {},
      },
    });

    // ================================================
    // THIS IS THE FIX: Trigger background job properly
    // ================================================
    const backgroundUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/background-job`;

    setTimeout(() => {
      fetch(backgroundUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formId: newForm.id }),
      })
        .then((res) => res.json())
        .then((result) => console.log("Background job triggered:", result))
        .catch((err) => console.error("Failed to trigger background job:", err));
    }, 1000); // 1-second delay ensures parent function completes first (safe on Vercel)

    return NextResponse.json({ success: true, formId: newForm.id }, { status: 201 });
  } catch (error) {
    console.error("POST /api/forms error:", error);
    return NextResponse.json({ error: "Failed to save form" }, { status: 500 });
  }
} 
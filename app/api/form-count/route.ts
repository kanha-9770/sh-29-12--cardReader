// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getSession } from "@/lib/auth";

// const FORM_LIMIT = 15; // ⬅️ change limit here

// export async function GET() {
//   try {
//     const session = await getSession();

//     // User not logged in
//     if (!session?.id) {
//       return NextResponse.json({ count: 0 });
//     }

//     // Count total forms created by this user
//     const count = await prisma.form.count({
//       where: {
//         userId: session.id,
//         user: {
//           isDeleted: false, // ignore soft-deleted accounts
//         },
//       },
//     });

//     // ✅ If limit reached, return count = 0 instead
//     if (count >= FORM_LIMIT) {
//       return NextResponse.json(
//         {
//           count: 0,              // ⬅️ Always zero when limit hit
//           limitReached: true,
//           message: "Form submission limit reached. Please upgrade your plan.",
//         },
//         { status: 403 }
//       );
//     }

//     return NextResponse.json({ count, limitReached: false });
//   } catch (error) {
//     console.error("Error counting forms:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch form count" },
//       { status: 500 }
//     );
//   }
// }

// app/api/form-count/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();

    if (!session?.id) {
      return NextResponse.json({ forms: [] });
    }

    const isAdmin = session.role === "admin";
    if (isAdmin) {
      const forms = await prisma.form.findMany({
        where: { user: { isDeleted: false } },
        include: { user: true },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ forms, limitReached: false, isAdmin: true });
    }

    const user = await prisma.user.findUnique({ where: { id: session.id } });
    const FORM_LIMIT = user?.formLimit ?? 15;

    const count = await prisma.form.count({
      where: {
        userId: session.id,
        user: { isDeleted: false },
      },
    });

    if (count >= FORM_LIMIT) {
      return NextResponse.json(
        {
          forms: [],
          limitReached: true,
          message: "Form submission limit reached. Please upgrade your plan.",
        },
        { status: 403 }
      );
    }

    const forms = await prisma.form.findMany({
      where: { userId: session.id, user: { isDeleted: false } },
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ forms, limitReached: false, count: forms.length });
  } catch (error) {
    console.error("Error fetching forms:", error);
    return NextResponse.json({ forms: [], error: "Failed to fetch forms" }, { status: 500 });
  }
}

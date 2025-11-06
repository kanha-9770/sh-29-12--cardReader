// export const dynamic = "force-dynamic";
// export const revalidate = 0;

// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getSession } from "@/lib/auth";

// export async function GET() {
//   try {
//     const session = await getSession();

//     if (!session?.id) {
//       return NextResponse.json({ forms: [] });
//     }

//     const isAdmin = session.role === "admin";

//     if (isAdmin) {
//       const forms = await prisma.form.findMany({
//         include: { user: true },
//         orderBy: { createdAt: "desc" },
//       });
//       return NextResponse.json({ forms, limitReached: false, isAdmin: true });
//     }

//     const user = await prisma.user.findUnique({
//       where: { id: session.id },
//       select: { formLimit: true },
//     });

//     const FORM_LIMIT = user?.formLimit ?? 15;

//     const count = await prisma.form.count({
//       where: { userId: session.id },
//     });

//     if (count >= FORM_LIMIT) {
//       return NextResponse.json(
//         {
//           forms: [],
//           limitReached: true,
//           message: "Form submission limit reached",
//         },
//         { status: 403 }
//       );
//     }

//     const forms = await prisma.form.findMany({
//       where: { userId: session.id },
//       include: { user: true },
//       orderBy: { createdAt: "desc" },
//     });

//     return NextResponse.json({ forms, limitReached: false });
//   } catch (error) {
//     return NextResponse.json({ error: "Failed to fetch forms" }, { status: 500 });
//   }
// }


// export const dynamic = "force-dynamic";
// export const revalidate = 0;

// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getSession } from "@/lib/auth";

// export async function GET() {
//   try {
//     const session = await getSession();

//     if (!session?.id) {
//       return NextResponse.json({ forms: [], isAdmin: false });
//     }

//     const isAdmin = session.isAdmin === true || session.role === "admin";

//     // ✅ Admins see ALL forms, no limit
//     if (isAdmin) {
//       const forms = await prisma.form.findMany({
//         include: { user: true },
//         orderBy: { createdAt: "desc" },
//       });

//       return NextResponse.json({
//         forms,
//         limitReached: false,
//         isAdmin: true,
//       });
//     }

//     // ✅ Fetch user's current limit
//     const user = await prisma.user.findUnique({
//       where: { id: session.id },
//       select: { formLimit: true },
//     });

//     const FORM_LIMIT = user?.formLimit ?? 15;

//     // ✅ How many forms user already has
//     const count = await prisma.form.count({
//       where: { userId: session.id },
//     });

//     // ✅ Block if reached
//     if (count >= FORM_LIMIT) {
//       return NextResponse.json(
//         {
//           forms: [],
//           limitReached: true,
//           message:
//             "Form submission limit reached. Upgrade your plan for more forms.",
//         },
//         { status: 403 }
//       );
//     }

//     // ✅ Retrieve user forms
//     const forms = await prisma.form.findMany({
//       where: { userId: session.id },
//       include: { user: true },
//       orderBy: { createdAt: "desc" },
//     });

//     return NextResponse.json({
//       forms,
//       limitReached: false,
//       isAdmin: false,
//     });
//   } catch (error) {
//     console.error("❌ Fetch forms error:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch forms" },
//       { status: 500 }
//     );
//   }
// }

// app/api/form-count/route.ts
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.id) {
      return NextResponse.json({ count: 0, limitReached: false, isAdmin: false });
    }

    const isAdmin = session.isAdmin === true || session.role === "admin";

    // Admins see all forms
    if (isAdmin) {
      const forms = await prisma.form.findMany({
        include: { user: true },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({
        count: forms.length,
        forms,
        limitReached: false,
        isAdmin: true,
      });
    }

    // Normal user
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: { formLimit: true },
    });

    const FORM_LIMIT = user?.formLimit ?? 15;

    const count = await prisma.form.count({
      where: { userId: session.id },
    });

    const limitReached = count >= FORM_LIMIT;

    if (limitReached) {
      return NextResponse.json(
        {
          count,
          forms: [],
          limitReached: true,
          message: "Form submission limit reached. Upgrade your plan.",
        },
        { status: 403 }
      );
    }

    const forms = await prisma.form.findMany({
      where: { userId: session.id },
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      count,           // ← THIS WAS MISSING
      forms,
      limitReached: false,
      isAdmin: false,
    });
  } catch (error) {
    console.error("Fetch forms error:", error);
    return NextResponse.json(
      { error: "Failed to fetch forms", count: 0 },
      { status: 500 }
    );
  }
}
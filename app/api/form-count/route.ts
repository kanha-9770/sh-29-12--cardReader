// // app/api/form-count/route.ts
// export const dynamic = "force-dynamic";
// export const revalidate = 0;

// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getSession } from "@/lib/auth";

// export async function GET() {
//   try {
//     const session = await getSession();

//     // Log session for debugging
//     console.log("Form Count API → Session:", {
//       userId: session?.id,
//       email: session?.email,
//       isAdmin: session?.isAdmin,
//       hasSession: !!session,
//       timestamp: new Date().toISOString(),
//     });

//     // Guest / unauthenticated
//     if (!session?.id) {
//       return NextResponse.json({
//         count: 0,
//         limitReached: false,
//         isAdmin: false,
//         limit: 15,
//       });
//     }

//     const userId = session.id;

//     // Use transaction to ensure data consistency + self-healing
//     const result = await prisma.$transaction(async (tx) => {
//       // Fetch user
//       const user = await tx.user.findUnique({
//         where: { id: userId },
//         select: {
//           formCount: true,
//           formLimit: true,
//           isAdmin: true,
//           email: true,
//         },
//       });

//       if (!user) {
//         console.warn("User not found in form-count API:", userId);
//         return {
//           count: 0,
//           limit: 15,
//           limitReached: false,
//           isAdmin: false,
//           needsFix: false,
//         };
//       }

//       // Count actual forms submitted by this user
//       const realCount = await tx.form.count({
//         where: { userId },
//       });

//       let count = user.formCount ?? 0;
//       const limit = user.formLimit ?? 15;
//       let limitReached = count >= limit;
//       let wasFixed = false;

//       // Self-healing: fix if stored count doesn't match reality
//       if (count !== realCount) {
//         console.warn("Form count mismatch detected! Fixing...", {
//           userId,
//           email: user.email,
//           storedCount: count,
//           actualCount: realCount,
//         });

//         await tx.user.update({
//           where: { id: userId },
//           data: { formCount: realCount },
//         });

//         count = realCount;
//         limitReached = count >= limit;
//         wasFixed = true;
//       }

//       return {
//         count,
//         limit,
//         limitReached,
//         isAdmin: user.isAdmin,
//         wasFixed,
//       };
//     });

//     // Final log
//     console.log("Form Count Result →", {
//       userId,
//       email: session.email,
//       count: result.count,
//       limit: result.limit,
//       limitReached: result.limitReached,
//       isAdmin: result.isAdmin,
//       wasFixed: result.wasFixed,
//     });

//     return NextResponse.json({
//       count: result.count,
//       limitReached: result.limitReached,
//       isAdmin: result.isAdmin,
//       limit: result.limit,
//     });
//   } catch (error: any) {
//     console.error("Form Count API Critical Error:", {
//       message: error.message,
//       stack: error.stack,
//       timestamp: new Date().toISOString(),
//     });

//     return NextResponse.json(
//       { error: "Failed to fetch form count" },
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

    // Debug log
    console.log("Form Count API → Session:", {
      userId: session?.id,
      email: session?.email,
      isAdmin: session?.isAdmin,
      timestamp: new Date().toISOString(),
    });

    // Guest / unauthenticated
    if (!session?.id) {
      return NextResponse.json({
        count: 0,
        limitReached: false,
        isAdmin: false,
        limit: 15,
      });
    }

    const userId = session.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        formCount: true,
        formLimit: true,
        isAdmin: true,
        email: true,
      },
    });

    if (!user) {
      console.warn("Form-count API → User not found:", userId);
      return NextResponse.json({
        count: 0,
        limitReached: false,
        isAdmin: false,
        limit: 15,
      });
    }

    const count = user.formCount ?? 0;
    const limit = user.formLimit ?? 15;
    const limitReached = !user.isAdmin && count >= limit;

    // Final log
    console.log("Form Count Result →", {
      userId,
      email: user.email,
      count,
      limit,
      isAdmin: user.isAdmin,
      limitReached,
    });

    return NextResponse.json({
      count,
      limit,
      limitReached,
      isAdmin: user.isAdmin,
    });
  } catch (error: any) {
    console.error("Form Count API Error:", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { error: "Failed to fetch form count" },
      { status: 500 }
    );
  }
}

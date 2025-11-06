// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getSession } from "@/lib/auth";

// // Define the expected session type
// interface Session {
//   id: string;
//   [key: string]: any; // Add other properties if needed
// }

// export const dynamic = "force-dynamic";
// export const revalidate = 0;

// export async function GET(req: Request) {
//   try {
//     const session = await getSession() as Session | null; // Type assertion

//     if (!session) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     // Get only forms belonging to the current user
//     const forms = await prisma.form.findMany({
//       where: {
//         userId: session.id, // Now TypeScript knows this is a string
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//       include: {
//         user: {
//           select: {
//             email: true,
//           },
//         },
//         extractedData: true,
//         mergedData: true,
//       },
//     });

//     return NextResponse.json(forms);
//   } catch (error: any) {
//     console.error("Error fetching user forms:", error);
//     return NextResponse.json(
//       {
//         error: "Failed to fetch forms",
//         details: error instanceof Error ? error.message : "Unknown error",
//       },
//       { status: 500 },
//     );
//   }
// }
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Session {
  id: string;
  isAdmin?: boolean;
}

export async function GET(req: Request) {
  try {
    const session = (await getSession()) as Session | null;

    if (!session?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch the current user with organization
    const currentUser = await prisma.user.findUnique({
      where: { id: session.id },
      select: { organizationId: true, isAdmin: true },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let forms;

    // ✅ Admin can see all forms of their organization
    if (currentUser.isAdmin) {
      forms = await prisma.form.findMany({
        where: {
          user: {
            organizationId: currentUser.organizationId,
          },
        },
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { email: true } },
          extractedData: true,
          mergedData: true,
        },
      });
    } else {
      // ✅ Regular user sees only their data
      forms = await prisma.form.findMany({
        where: { userId: session.id },
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { email: true } },
          extractedData: true,
          mergedData: true,
        },
      });
    }

    return NextResponse.json(forms);
  } catch (error: any) {
    console.error("Error fetching user forms:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch forms",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

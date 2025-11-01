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

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const FORM_LIMIT = 15; // ⬅️ change limit here

export async function GET() {
  try {
    const session = await getSession();

    // User not logged in
    if (!session?.id) {
      return NextResponse.json({ forms: [] });
    }

    // Check if user is admin (assuming session has a 'role' field; adjust if needed)
    const isAdmin = session.role === 'admin'; // ⬅️ Add role check based on your auth schema

    if (isAdmin) {
      // For admins: Fetch all forms (no limit)
      const forms = await prisma.form.findMany({
        where: {
          user: {
            isDeleted: false, // ignore soft-deleted accounts
          },
        },
        include: {
          user: true, // Include user details if needed
          // Add other includes as per your FormData type (e.g., extractedData, mergedData)
        },
        orderBy: {
          createdAt: 'desc', // Optional: Sort by creation date
        },
      });
      return NextResponse.json({ 
        forms, 
        limitReached: false,
        isAdmin: true 
      });
    }

    // For regular users: Check form count
    const count = await prisma.form.count({
      where: {
        userId: session.id,
        user: {
          isDeleted: false,
        },
      },
    });

    // If limit reached, return empty forms array with flag
    if (count >= FORM_LIMIT) {
      return NextResponse.json(
        {
          forms: [], // ⬅️ Empty array when limit hit
          limitReached: true,
          message: "Form submission limit reached. Please upgrade your plan.",
        },
        { status: 403 }
      );
    }

    // For regular users under limit: Fetch their forms
    const forms = await prisma.form.findMany({
      where: {
        userId: session.id,
        user: {
          isDeleted: false,
        },
      },
      include: {
        user: true,
        // Add other includes as needed
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ 
      forms, 
      limitReached: false,
      count: forms.length 
    });
  } catch (error) {
    console.error("Error fetching forms:", error);
    return NextResponse.json(
      { 
        forms: [], 
        error: "Failed to fetch forms" 
      },
      { status: 500 }
    );
  }
}

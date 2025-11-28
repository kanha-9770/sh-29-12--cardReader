// // app/api/auth/me/route.ts
// import { NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import { verifyToken } from "@/lib/auth";

// export const dynamic = "force-dynamic";
// export const revalidate = 0;

// export async function GET() {
//   const token = cookies().get("token")?.value;

//   if (!token) {
//     return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
//   }

//   try {
//     const payload = await verifyToken(token);

//     // Critical: payload must have `id`
//     if (!payload || !payload.id) {
//       console.error("Token missing user ID:", payload);
//       return NextResponse.json(
//         { error: "Invalid token: missing user ID" },
//         { status: 401 }
//       );
//     }

//     return NextResponse.json({
//       user: {
//         id: payload.id as string,
//         email: payload.email as string,
//         name: payload.name as string | null,
//         isAdmin: !!payload.isAdmin,
//         organizationId: payload.organizationId as number | null,
//       },
//     });
//   } catch (error) {
//     console.error("Invalid or expired token:", error);
//     return NextResponse.json({ error: "Invalid token" }, { status: 401 });
//   }
// }


// // app/api/auth/me/route.ts
// import { NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import { verifyToken } from "@/lib/auth";
// import { prisma } from "@/lib/prisma";

// export const dynamic = "force-dynamic";
// export const revalidate = 0;

// export async function GET() {
//   const token = cookies().get("token")?.value;

//   if (!token) {
//     return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
//   }

//   try {
//     const payload = await verifyToken(token);

//     if (!payload || !payload.id) {
//       console.error("Token missing user ID:", payload);
//       return NextResponse.json(
//         { error: "Invalid token: missing user ID" },
//         { status: 401 }
//       );
//     }

//     return NextResponse.json({
//       user: {
//         id: payload.id as string,
//         email: payload.email as string,
//         name: payload.name as string | null,
//         isAdmin: !!payload.isAdmin,
//         organizationId: payload.organizationId as number | null,
//       },
//     });
//   } catch (error) {
//     console.error("Invalid or expired token:", error);
//     return NextResponse.json({ error: "Invalid token" }, { status: 401 });
//   }
// }

// // NEW: Allow users to update their name
// export async function PATCH(request: Request) {
//   const token = cookies().get("token")?.value;

//   if (!token) {
//     return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
//   }

//   try {
//     const payload = await verifyToken(token);

//     if (!payload?.id) {
//       return NextResponse.json({ error: "Invalid token" }, { status: 401 });
//     }

//     const { name } = await request.json();

//     // Validate name (optional but recommended)
//     if (name !== undefined && typeof name !== "string") {
//       return NextResponse.json({ error: "Name must be a string" }, { status: 400 });
//     }

//     const trimmedName = name?.trim();
//     if (trimmedName === "") {
//       // Allow clearing the name
//       await prisma.user.update({
//         where: { id: payload.id as string },
//         data: { name: null },
//       });
//     } else if (trimmedName) {
//       await prisma.user.update({
//         where: { id: payload.id as string },
//         data: { name: trimmedName },
//       });
//     }
//     // If name is undefined → do nothing (partial update)

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error("Profile update failed:", error);
//     return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
//   }
// }


// app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const token = cookies().get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const payload = await verifyToken(token);

    if (!payload?.id) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Fetch FULL user with formCount & formLimit
    const user = await prisma.user.findUnique({
      where: { id: payload.id as string },
      select: {
        id: true,
        email: true,
        name: true,
        isAdmin: true,
        organizationId: true,
        formCount: true,
        formLimit: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Invalid token:", error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}



// PATCH remains the same (only updates name)
export async function PATCH(request: Request) {
  const token = cookies().get("token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const payload = await verifyToken(token);
    if (!payload?.id) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const { name } = await request.json();

    await prisma.user.update({
      where: { id: payload.id as string },
      data: { name: name?.trim() || null },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
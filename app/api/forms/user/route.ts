import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
   const session = await getSession();

   // Make sure we have a logged-in user
   if (!session?.user?.email) {
     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
   }

   const userEmail = session.user.email;

   // Get user from DB
   const currentUser = await prisma.user.findUnique({
     where: { email: userEmail },
     select: { id: true, isAdmin: true, organizationId: true },
   });

   if (!currentUser) {
     return NextResponse.json({ error: "User not found" }, { status: 404 });
   }

   let forms;

   if (currentUser.isAdmin && currentUser.organizationId) {
     // Admin → sees everyone's forms in their org
     forms = await prisma.form.findMany({
       where: { user: { organizationId: currentUser.organizationId } },
       orderBy: { createdAt: "desc" },
       include: {
         user: { select: { email: true, name: true } },
         extractedData: true,
         mergedData: true,
       },
     });
   } else {
     // Regular user → ONLY their own forms
     forms = await prisma.form.findMany({
       where: { userId: currentUser.id },
       orderBy: { createdAt: "desc" },
       include: {
         extractedData: true,
         mergedData: true,
       },
     });
   }

   return NextResponse.json(forms); // ← Return array directly
 } catch (error) {
   console.error("GET /api/forms/user error:", error);
   return NextResponse.json({ error: "Failed to load forms" }, { status: 500 });
 }
}
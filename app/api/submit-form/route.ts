// // app/api/submit-form/route.ts
// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getSession } from "@/lib/auth";

// export const dynamic = "force-dynamic";

// export async function POST(req: Request) {
//   try {
//     const session = await getSession();

//     // Use session.id directly — no email lookup needed!
//     if (!session?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const userId = session.id;

//     // Optional: Early fetch user with limit check (still safe)
//     const user = await prisma.user.findUnique({
//       where: { id: userId },
//       select: { id: true, formCount: true, formLimit: true, isAdmin: true },
//     });

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     const maxLimit = user.formLimit ?? 15;

//     // Check limit BEFORE creating form
//     if (!user.isAdmin && user.formCount >= maxLimit) {
//       return NextResponse.json(
//         {
//           error: "LIMIT_REACHED",
//           message: `You have reached your limit of ${maxLimit} submissions.`,
//           current: user.formCount,
//           limit: maxLimit,
//         },
//         { status: 403 }
//       );
//     }

//     const body = await req.json();

//     const {
//       cardNo = "",
//       salesPerson = "",
//       date: dateStr,
//       country = "",
//       cardFrontPhoto = "",
//       cardBackPhoto = null,
//       leadStatus = "",
//       dealStatus = "",
//       meetingAfterExhibition = false,
//       description = "",
//       industryCategories = "",
//       ...additionalData
//     } = body;

//     // Validation
//     if (!cardFrontPhoto) {
//       return NextResponse.json(
//         { error: "Card front image is required" },
//         { status: 400 }
//       );
//     }

//     if (!dateStr) {
//       return NextResponse.json({ error: "Date is required" }, { status: 400 });
//     }

//     const date = new Date(dateStr);
//     if (isNaN(date.getTime())) {
//       return NextResponse.json({ error: "Invalid date" }, { status: 400 });
//     }

//     // Atomic transaction: create form + increment count
//     const result = await prisma.$transaction(async (tx) => {
//       const newForm = await tx.form.create({
//         data: {
//           cardNo,
//           salesPerson,
//           date,
//           country,
//           cardFrontPhoto,
//           cardBackPhoto,
//           leadStatus,
//           dealStatus,
//           meetingAfterExhibition: Boolean(meetingAfterExhibition),
//           industryCategories: industryCategories || "",
//           description: description || "",
//           status: "SUBMITTED",
//           extractionStatus: "PENDING",
//           zohoStatus: "PENDING",
//           additionalData:
//             Object.keys(additionalData).length > 0 ? additionalData : null,
//           user: { connect: { id: userId } },
//         },
//         select: { id: true, cardNo: true },
//       });

//       // This is the ONLY place formCount should ever be incremented
//       await tx.user.update({
//         where: { id: userId },
//         data: { formCount: { increment: 1 } },
//       });

//       return newForm;
//     });

//     // Fire and forget background job
//     fetch(
//       `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/background-job`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ formId: result.id }),
//       }
//     ).catch((err) => {
//       console.error("Background job trigger failed:", err);
//     });

//     console.log("Form submitted successfully", {
//       userId,
//       formId: result.id,
//       cardNo: result.cardNo,
//       newCount: user.formCount + 1,
//     });

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Form submitted successfully",
//         formId: result.id,
//         cardNo: result.cardNo,
//       },
//       { status: 201 }
//     );
//   } catch (error: any) {
//     console.error("Submit form error:", error);
//     return NextResponse.json(
//       { error: "Failed to submit form", details: error.message },
//       { status: 500 }
//     );
//   }
// }


// app/api/submit-form/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await getSession();

    if (!session?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.id;
    const body = await req.json();

    const {
      cardNo = "",
      salesPerson = "",
      date: dateStr,
      country = "",
      cardFrontPhoto = "",
      cardBackPhoto = null,
      leadStatus = "",
      dealStatus = "",
      meetingAfterExhibition = false,
      description = "",
      industryCategories = "",
      ...additionalData
    } = body;

    // Validation
    if (!cardFrontPhoto) {
      return NextResponse.json(
        { error: "Card front image is required" },
        { status: 400 }
      );
    }

    if (!dateStr) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 });
    }

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return NextResponse.json({ error: "Invalid date" }, { status: 400 });
    }

    // ✅ One atomic transaction for safety
    const result = await prisma.$transaction(async (tx) => {
      // Lock user row and check limit safely
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: {
          formCount: true,
          formLimit: true,
          isAdmin: true,
          email: true,
        },
      });

      if (!user) throw new Error("User not found");

      const limit = user.formLimit ?? 1500;

      // ✅ Lifetime cap check (never decreases)
      if (!user.isAdmin && user.formCount >= limit) {
        throw new Error("LIMIT_REACHED");
      }

      // Create Form
      const newForm = await tx.form.create({
        data: {
          cardNo,
          salesPerson,
          date,
          country,
          cardFrontPhoto,
          cardBackPhoto,
          leadStatus,
          dealStatus,
          meetingAfterExhibition: Boolean(meetingAfterExhibition),
          industryCategories: industryCategories || "",
          description: description || "",
          status: "SUBMITTED",
          extractionStatus: "PENDING",
          zohoStatus: "PENDING",
          additionalData:
            Object.keys(additionalData).length > 0 ? additionalData : null,
          userId,
        },
        select: { id: true, cardNo: true },
      });

      // ✅ Lifetime increment
      await tx.user.update({
        where: { id: userId },
        data: {
          formCount: { increment: 1 },
        },
      });

      return newForm;
    });

    // Background job (non-blocking)
    fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/background-job`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formId: result.id }),
      }
    ).catch((err) => {
      console.error("Background job trigger failed:", err);
    });

    console.log("Form submitted successfully", {
      userId,
      formId: result.id,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Form submitted successfully",
        formId: result.id,
        cardNo: result.cardNo,
      },
      { status: 201 }
    );
  } catch (error: any) {
    // ✅ Handle limit cleanly
    if (error.message === "LIMIT_REACHED") {
      return NextResponse.json(
        {
          error: "LIMIT_REACHED",
          message: "You have reached your submission limit.",
        },
        { status: 403 }
      );
    }

    console.error("Submit form error:", error);

    return NextResponse.json(
      { error: "Failed to submit form", details: error.message },
      { status: 500 }
    );
  }
}
  
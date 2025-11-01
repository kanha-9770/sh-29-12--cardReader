// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getSession } from "@/lib/auth";
// import { parseISO, isValid } from "date-fns";

// export async function POST(req: Request) {
//   try {
//     // Check session
//     const session = await getSession();
//     if (!session || !session.id) {
//       console.error("[Submit Form] Unauthorized access attempt: No valid session");
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const userId = String(session.id);
//     const user = await prisma.user.findUnique({ where: { id: userId } });

//     if (!user) {
//       console.error(`[Submit Form] User not found for ID: ${userId}`);
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     // ✅ LIMIT CHECK (max 15 submissions per user)
//     const formCount = await prisma.form.count({
//       where: { userId },
//     });

//     if (formCount >= 15) {
//       return NextResponse.json(
//         {
//           error: "LIMIT_REACHED",
//           message: "You have reached your free submission limit (15). Please upgrade your plan.",
//         },
//         { status: 403 }
//       );
//     }

//     // Parse form data
//     const formData = await req.json();
//     console.log("[Submit Form] Received form data:", JSON.stringify(formData, null, 2));

//     const {
//       cardNo = "",
//       salesPerson = "",
//       date,
//       country = "",
//       cardFrontPhoto = "",
//       cardBackPhoto = null,
//       leadStatus = "",
//       dealStatus = "",
//       meetingAfterExhibition = false,
//       industryCategories = "",
//       description = "",
//     } = formData;

//     // Validate date
//     if (!date || !isValid(parseISO(date))) {
//       console.error("[Submit Form] Invalid date provided:", date);
//       return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
//     }

//     const parsedDate = parseISO(date);

//     // Save form in a transaction
//     const form = await prisma.$transaction(async (tx: typeof prisma) => {
//       const newForm = await tx.form.create({
//         data: {
//           cardNo,
//           salesPerson,
//           date: parsedDate,
//           country,
//           cardFrontPhoto,
//           cardBackPhoto,
//           leadStatus,
//           dealStatus,
//           meetingAfterExhibition,
//           industryCategories,
//           description,
//           status: "SUBMITTED",
//           extractionStatus: "PENDING",
//           zohoStatus: "PENDING",
//           user: { connect: { id: userId } },
//         },
//         select: { id: true },
//       });

//       console.log(`[Submit Form] Form created with ID: ${newForm.id}`);

//       return newForm;
//     });

//     // Background job
//     try {
//       console.log("[Submit Form] Triggering background job for form ID:", form.id);
//       const bgResp = await fetch("http://localhost:3000/api/background-job", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ formId: form.id }),
//       });

//       if (!bgResp.ok) {
//         console.error("[Submit Form] Background job failed");
//       }
//     } catch (error) {
//       console.error("[Submit Form] Background job error:", error);
//     }

//     return NextResponse.json({ success: true, formId: form.id });
//   } catch (error) {
//     console.error("[Submit Form] Error submitting form:", error);
//     return NextResponse.json(
//       {
//         error: "Failed to submit form",
//         details: error instanceof Error ? error.message : "Unknown error",
//       },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { parseISO, isValid } from "date-fns";

interface SubmitFormData {
  cardNo?: string;
  salesPerson?: string;
  date: string;
  country?: string;
  cardFrontPhoto?: string;
  cardBackPhoto?: string | null;
  leadStatus?: string;
  dealStatus?: string;
  meetingAfterExhibition?: boolean;
  industryCategories?: string;
  description?: string;
}

export async function POST(req: Request) {
  try {
    // Check session
    const session = await getSession();
    if (!session || !session.id) {
      console.error("[Submit Form] Unauthorized access attempt: No valid session");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = String(session.id);
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      console.error(`[Submit Form] User not found for ID: ${userId}`);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ LIMIT CHECK (max 15 submissions per user)
    const formCount = await prisma.form.count({
      where: { userId },
    });

    if (formCount >= 15) {
      return NextResponse.json(
        {
          error: "LIMIT_REACHED",
          message: "You have reached your free submission limit (15). Please upgrade your plan.",
        },
        { status: 403 }
      );
    }

    // Parse form data
    const formData = (await req.json()) as SubmitFormData;
    console.log("[Submit Form] Received form data:", JSON.stringify(formData, null, 2));

    const {
      cardNo = "",
      salesPerson = "",
      date,
      country = "",
      cardFrontPhoto = "",
      cardBackPhoto = null,
      leadStatus = "",
      dealStatus = "",
      meetingAfterExhibition = false,
      industryCategories = "",
      description = "",
    } = formData;

    // Validate date
    if (!date || !isValid(parseISO(date))) {
      console.error("[Submit Form] Invalid date provided:", date);
      return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
    }

    const parsedDate = parseISO(date);

    // Save form in a transaction
    const form = await prisma.$transaction(async (tx) => {
      const newForm = await tx.form.create({
        data: {
          cardNo,
          salesPerson,
          date: parsedDate,
          country,
          cardFrontPhoto,
          cardBackPhoto,
          leadStatus,
          dealStatus,
          meetingAfterExhibition,
          industryCategories,
          description,
          status: "SUBMITTED",
          extractionStatus: "PENDING",
          zohoStatus: "PENDING",
          user: { connect: { id: userId } },
        },
        select: { id: true },
      });

      console.log(`[Submit Form] Form created with ID: ${newForm.id}`);

      return newForm;
    });

    // Background job
    try {
      console.log("[Submit Form] Triggering background job for form ID:", form.id);
      const bgResp = await fetch("http://localhost:3000/api/background-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formId: form.id }),
      });

      if (!bgResp.ok) {
        console.error("[Submit Form] Background job failed");
      }
    } catch (error) {
      console.error("[Submit Form] Background job error:", error);
    }

    return NextResponse.json({ success: true, formId: form.id });
  } catch (error) {
    console.error("[Submit Form] Error submitting form:", error);
    return NextResponse.json(
      {
        error: "Failed to submit form",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

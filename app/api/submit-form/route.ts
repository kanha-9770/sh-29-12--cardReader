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

// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getSession } from "@/lib/auth";
// import { parseISO, isValid } from "date-fns";

// interface SubmitFormData {
//   cardNo?: string;
//   salesPerson?: string;
//   date: string;
//   country?: string;
//   cardFrontPhoto?: string;
//   cardBackPhoto?: string | null;
//   leadStatus?: string;
//   dealStatus?: string;
//   meetingAfterExhibition?: boolean;
//   industryCategories?: string;
//   description?: string;
// }

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
//     const formData = (await req.json()) as SubmitFormData;
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
//     const form = await prisma.$transaction(async (tx) => {
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

  //     // Parse form data (no strict interface to allow dynamic fields)
  //     const body = await req.json();
  //     console.log("[Submit Form] Received form data:", JSON.stringify(body, null, 2));

  //     // Destructure fixed fields, capture dynamic ones in rest
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
  //       status = "PENDING", // Allow client to send, but default to PENDING
  //       extractionStatus = "PENDING",
  //       zohoStatus = "PENDING",
  //       ...rest // ✅ Captures all dynamic fields (e.g., { company: "...", phone: "...", interestLevel: "hot" })
  //     } = body;

  //     // Validate date
  //     if (!date || !isValid(parseISO(date))) {
  //       console.error("[Submit Form] Invalid date provided:", date);
  //       return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
  //     }

  //     const parsedDate = parseISO(date);

  //     // Save form in a transaction
  //     const form = await prisma.$transaction(async (tx) => {
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
  //           // ✅ Use client-provided statuses if valid, else defaults
  //           status,
  //           extractionStatus,
  //           zohoStatus,
  //           // ✅ Store dynamic fields as JSON (only if present)
  //           additionalData: Object.keys(rest).length > 0 ? rest : undefined,
  //           user: { connect: { id: userId } },
  //         },
  //         select: { id: true },
  //       });

  //       console.log(`[Submit Form] Form created with ID: ${newForm.id}`);
  //       console.log(`[Submit Form] Dynamic data saved:`, JSON.stringify(rest, null, 2));

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


  // app/api/submit-form/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await getSession();

    // This matches your current getSession() shape
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email;

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

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
      ...additionalData // All dynamic fields
    } = body;

    // Validation
    if (!cardFrontPhoto) {
      return NextResponse.json({ error: "Card front image is required" }, { status: 400 });
    }

    if (!dateStr) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 });
    }

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return NextResponse.json({ error: "Invalid date" }, { status: 400 });
    }

    // Create form
    const form = await prisma.form.create({
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
        additionalData: Object.keys(additionalData).length > 0 ? additionalData : null,
        user: { connect: { id: user.id } },
      },
    });

    // Trigger background job (fire and forget)
    fetch(`https://exhibition-lead-generator-nu.vercel.app/api/background-job`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ formId: form.id }),
    }).catch(() => {});

    return NextResponse.json({ success: true, formId: form.id }, { status: 201 });
  } catch (error: any) {
    console.error("Submit form error:", error);
    return NextResponse.json(
      { error: "Failed to submit form", details: error.message },
      { status: 500 }
    );
  }
}


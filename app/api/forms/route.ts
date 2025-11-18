// import { NextResponse } from "next/server"
// import { prisma } from "@/lib/prisma"
// import { getSession } from "@/lib/auth"
// import { submitToZoho } from "@/lib/zoho-submit"

// export const dynamic = "force-dynamic"
// export const revalidate = 0

// export async function GET(req: Request) {
//   try {
//     const session = await getSession()

//     if (!session?.isAdmin) {
//       console.error("Unauthorized access attempt in GET")
//       return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 401 })
//     }

//     const forms = await prisma.form.findMany({
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
//     })

//     return NextResponse.json(forms)
//   } catch (error) {
//     console.error("Error in GET /api/forms:", error)
//     return NextResponse.json(
//       {
//         error: "Failed to fetch forms",
//         details: error instanceof Error ? error.message : "Unknown error",
//       },
//       { status: 500 },
//     )
//   }
// }

// export async function POST(req: Request) {
//   try {
//     const session = await getSession()

//     if (!session) {
//       console.error("Unauthorized access attempt")
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const userId = String(session.id)

//     const user = await prisma.user.findUnique({
//       where: { id: userId },
//     })

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 401 })
//     }

//     const formData = await req.formData()
//     const jsonData = formData.get("jsonData") as string
//     const data = JSON.parse(jsonData)

//     console.log("Received form data:", JSON.stringify(data, null, 2))

//     // Merge form data with extracted data
//     const mergedData = {
//       ...data,
//       userId: user.id,
//       date: new Date(data.date), // Convert date string to Date object
//     }

//     console.log("Attempting to save merged data to MySQL:", mergedData)

//     // Save to MySQL
//     // const form = await prisma.form.create({
//     //   data: mergedData,
//     // })

//     // console.log("Successfully saved to MySQL with ID:", form.id)

//     // Submit to Zoho
//     console.log("Attempting to submit to Zoho...")
//     const zohoResponse = await submitToZoho(mergedData)
//     console.log("Zoho submission successful:", zohoResponse)

//     return NextResponse.json({
//       success: true,
//       // mysqlData: form,
//       zohoResponse,
//       message: "Data successfully saved to MySQL and submitted to Zoho.",
//     })
//   } catch (error) {
//     console.error("Error in POST /api/forms:", error)

//     const err = error as { code?: string; message?: string; stack?: string }

//     if (err.code === "P2002") {
//       return NextResponse.json(
//         {
//           error: "Database constraint violation",
//           details: "A record with this card number already exists",
//         },
//         { status: 400 },
//       )
//     }

//     return NextResponse.json(
//       {
//         error: "Internal server error",
//         details: err.message || "Unknown error",
//         stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
//       },
//       { status: 500 },
//     )
//   }
// }

// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getSession } from "@/lib/auth";
// import { submitToZoho } from "@/lib/zoho-submit";

// export const dynamic = "force-dynamic";
// export const revalidate = 0;

// /* ========== ADMIN: GET ALL FORMS ========== */
// /* ========== ADMIN: GET ALL FORMS (Org Scoped) ========== */
// export async function GET(req: Request) {
//   try {
//     const session = await getSession();

//     if (!session?.isAdmin) {
//       return NextResponse.json(
//         { error: "Unauthorized - Admin access required" },
//         { status: 401 }
//       );
//     }

//     // ✅ Fetch admin with its organization
//     const admin = await prisma.user.findUnique({
//       where: { id: String(session.id) },
//       select: { organizationId: true },
//     });

//     if (!admin?.organizationId) {
//       return NextResponse.json(
//         { error: "Admin has no organization assigned" },
//         { status: 400 }
//       );
//     }

//     // ✅ Query only forms that belong to users of the same organization
//     const forms = await prisma.form.findMany({
//       where: {
//         user: {
//           organizationId: admin.organizationId,
//         },
//       },
//       orderBy: { createdAt: "desc" },
//       include: {
//         user: { select: { email: true } },
//         extractedData: true,
//         mergedData: true,
//       },
//     });

//     return NextResponse.json(forms);
//   } catch (error) {
//     console.error("Error in GET /api/forms:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch forms" },
//       { status: 500 }
//     );
//   }
// }


// /* ========== USER: CREATE FORM ========== */
// export async function POST(req: Request) {
//   try {
//     const session = await getSession();
//     if (!session?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const userId = String(session.id);

//     const user = await prisma.user.findUnique({
//       where: { id: userId },
//       select: {
//         id: true,
//         subscriptionPlan: true,
//         formLimit: true,
//       },
//     });

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 401 });
//     }

//     // === ENFORCE FORM LIMIT (FREE users only) ===
//     if (user.subscriptionPlan === "FREE") {
//       const formCount = await prisma.form.count({
//         where: { userId: user.id },
//       });

//       const limit = user.formLimit ?? 15;
//       if (formCount >= limit) {
//         return NextResponse.json(
//           {
//             error: "Form limit reached",
//             message: `You've used all ${limit} free submissions. Upgrade to continue.`,
//             upgradeUrl: "/pricing",
//           },
//           { status: 403 }
//         );
//       }
//     }

//     // === PARSE FORM DATA ===
//     const formData = await req.formData();
//     const jsonData = formData.get("jsonData") as string;
//     if (!jsonData) {
//       return NextResponse.json(
//         { error: "Missing jsonData" },
//         { status: 400 }
//       );
//     }

//     let data;
//     try {
//       data = JSON.parse(jsonData);
//     } catch {
//       return NextResponse.json(
//         { error: "Invalid JSON in jsonData" },
//         { status: 400 }
//       );
//     }

//     // === PREPARE DATA FOR DB ===
//     const dbData = {
//       ...data,
//       userId: user.id,
//       date: new Date(data.date),
//       cardFrontPhoto: data.cardFrontPhoto || "",
//       cardBackPhoto: data.cardBackPhoto || null,
//       leadStatus: data.leadStatus || "",
//       dealStatus: data.dealStatus || "",
//       meetingAfterExhibition: Boolean(data.meetingAfterExhibition),
//       industryCategories: data.industryCategories || "",
//       description: data.description || "",
//     };

//     // === SAVE TO DATABASE ===
//     let form;
//     try {
//       form = await prisma.form.create({
//         data: dbData,
//       });
//     } catch (error: any) {
//       if (error.code === "P2002") {
//         return NextResponse.json(
//           {
//             error: "Duplicate card number",
//             message: "A form with this card number already exists.",
//           },
//           { status: 400 }
//         );
//       }
//       throw error;
//     }

//     // === SUBMIT TO ZOHO ===
//     let zohoResponse;
//     try {
//       zohoResponse = await submitToZoho(dbData);
//     } catch (zohoError) {
//       console.error("Zoho submission failed:", zohoError);
//       // Don't fail the whole request — still saved to DB
//       zohoResponse = { success: false, error: zohoError };
//     }

//     return NextResponse.json(
//       {
//         success: true,
//         formId: form.id,
//         zohoResponse,
//         message: "Form saved and submitted to Zoho.",
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Error in POST /api/forms:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// app/api/forms/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { submitToZoho } from "@/lib/zoho-submit";

export const dynamic = "force-dynamic";

/* ========== GET: Admin sees all forms in organization ========== */
export async function GET() {
  try {
    const session = await getSession();

    // Accept both shapes: { user: { ... } } or direct { email, isAdmin }
    const userEmail = (session as any)?.user?.email || (session as any)?.email;
    const isAdmin = (session as any)?.user?.isAdmin || (session as any)?.isAdmin;

    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden - Admin only" }, { status: 403 });
    }

    // Find the admin and their organization
    const adminUser = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { organizationId: true },
    });

    if (!adminUser?.organizationId) {
      return NextResponse.json({ error: "No organization found" }, { status: 400 });
    }

    const forms = await prisma.form.findMany({
      where: {
        user: { organizationId: adminUser.organizationId },
      },
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { email: true, name: true } },
        extractedData: true,
        mergedData: true,
      },
    });

    return NextResponse.json({ forms });
  } catch (error) {
    console.error("GET /api/forms error:", error);
    return NextResponse.json({ error: "Failed to fetch forms" }, { status: 500 });
  }
}

/* ========== POST: Create new form (any logged-in user) ========== */
export async function POST(req: Request) {
  try {
    const session = await getSession();

    const userEmail = (session as any)?.user?.email || (session as any)?.email;
    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: userEmail },
      select: {
        id: true,
        subscriptionPlan: true,
        formLimit: true,
      },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Free plan limit check
    if (currentUser.subscriptionPlan === "FREE") {
      const count = await prisma.form.count({ where: { userId: currentUser.id } });
      const limit = currentUser.formLimit ?? 15;
      if (count >= limit) {
        return NextResponse.json(
          { error: "Limit reached", message: "Upgrade your plan to submit more forms" },
          { status: 403 }
        );
      }
    }

    const formData = await req.formData();
    const jsonData = formData.get("jsonData") as string;
    if (!jsonData) return NextResponse.json({ error: "Missing data" }, { status: 400 });

    let data;
    try {
      data = JSON.parse(jsonData);
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const newForm = await prisma.form.create({
      data: {
        ...data,
        userId: currentUser.id,
        date: new Date(data.date || Date.now()),
        cardFrontPhoto: data.cardFrontPhoto || "",
        cardBackPhoto: data.cardBackPhoto || null,
        meetingAfterExhibition: Boolean(data.meetingAfterExhibition),
        additionalData: data.additionalData || {},
      },
    });

    // Submit to Zoho (fire and forget)
    submitToZoho({ ...data, id: newForm.id }).catch(console.error);

    return NextResponse.json({ success: true, formId: newForm.id }, { status: 201 });
  } catch (error) {
    console.error("POST /api/forms error:", error);
    return NextResponse.json({ error: "Failed to save form" }, { status: 500 });
  }
}
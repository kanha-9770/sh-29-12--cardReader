import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { parseISO, isValid } from "date-fns";

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

    // Parse form data
    const formData = await req.json();
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

    // Validation: Only check types, no mandatory fields
    if (typeof cardNo !== "string") {
      console.error("[Submit Form] Validation failed: Card number must be a string");
      return NextResponse.json(
        { error: "Validation failed", details: "Card number must be a string" },
        { status: 400 }
      );
    }
    if (typeof salesPerson !== "string") {
      console.error("[Submit Form] Validation failed: Sales Person must be a string");
      return NextResponse.json(
        { error: "Validation failed", details: "Sales Person must be a string" },
        { status: 400 }
      );
    }
    if (typeof country !== "string") {
      console.error("[Submit Form] Validation failed: Country must be a string");
      return NextResponse.json(
        { error: "Validation failed", details: "Country must be a string" },
        { status: 400 }
      );
    }
    if (typeof cardFrontPhoto !== "string") {
      console.error("[Submit Form] Validation failed: Card front photo must be a string");
      return NextResponse.json(
        { error: "Validation failed", details: "Card front photo must be a string" },
        { status: 400 }
      );
    }
    if (cardBackPhoto !== null && typeof cardBackPhoto !== "string") {
      console.error("[Submit Form] Validation failed: Card back photo must be a string or null");
      return NextResponse.json(
        { error: "Validation failed", details: "Card back photo must be a string or null" },
        { status: 400 }
      );
    }
    if (typeof leadStatus !== "string") {
      console.error("[Submit Form] Validation failed: Lead Status must be a string");
      return NextResponse.json(
        { error: "Validation failed", details: "Lead Status must be a string" },
        { status: 400 }
      );
    }
    if (typeof dealStatus !== "string") {
      console.error("[Submit Form] Validation failed: Deal Status must be a string");
      return NextResponse.json(
        { error: "Validation failed", details: "Deal Status must be a string" },
        { status: 400 }
      );
    }
    if (typeof industryCategories !== "string") {
      console.error("[Submit Form] Validation failed: Industry Categories must be a string");
      return NextResponse.json(
        { error: "Validation failed", details: "Industry Categories must be a string" },
        { status: 400 }
      );
    }
    if (typeof description !== "string") {
      console.error("[Submit Form] Validation failed: Description must be a string");
      return NextResponse.json(
        { error: "Validation failed", details: "Description must be a string" },
        { status: 400 }
      );
    }
    if (typeof meetingAfterExhibition !== "boolean") {
      console.error("[Submit Form] Validation failed: Meeting After Exhibition must be a boolean");
      return NextResponse.json(
        { error: "Validation failed", details: "Meeting After Exhibition must be a boolean" },
        { status: 400 }
      );
    }

    // Date parsing with date-fns
    let parsedDate: Date;
    if (!date || !isValid(parseISO(date))) {
      console.error("[Submit Form] Invalid date provided:", date);
      return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
    }
    parsedDate = parseISO(date);

    // Save form within a transaction (exclude background job)
    const form = await prisma.$transaction(async (tx: typeof prisma) => {
      const newForm = await tx.form.create({
        data: {
          cardNo: cardNo || "",
          salesPerson: salesPerson || "",
          date: parsedDate,
          country: country || "",
          cardFrontPhoto: cardFrontPhoto || "",
          cardBackPhoto: cardBackPhoto || null,
          leadStatus: leadStatus || "",
          dealStatus: dealStatus || "",
          meetingAfterExhibition,
          industryCategories: industryCategories || "",
          description: description || "",
          status: "SUBMITTED",
          extractionStatus: "PENDING",
          zohoStatus: "PENDING",
          user: { connect: { id: userId } },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        select: { id: true, cardFrontPhoto: true },
      });

      console.log(`[Submit Form] Form created with ID: ${newForm.id}, cardFrontPhoto: ${newForm.cardFrontPhoto}`);

      return newForm;
    });

    // Trigger background job outside transaction
    try {
      console.log("[Submit Form] Triggering background job for form ID:", form.id);
      const bgJobResponse = await fetch("http://localhost:3000/api/background-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formId: form.id }),
      });
      if (!bgJobResponse.ok) {
        console.error(`[Submit Form] Background job failed: ${bgJobResponse.status} ${bgJobResponse.statusText}`);
      } else {
        console.log("[Submit Form] Background job triggered successfully");
      }
    } catch (error) {
      console.error("[Submit Form] Error triggering background job:", error);
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
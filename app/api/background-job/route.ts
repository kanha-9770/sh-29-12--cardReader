import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { extractCardDetails } from "@/lib/card-extractor";
import { submitToZoho } from "@/lib/zoho-submit";
import { appendToGoogleSheet } from "@/lib/googleSheetsSubmit";
import { z } from "zod";

const BackgroundJobSchema = z.object({
  formId: z.string().min(1, "Form ID is required"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validationResult = BackgroundJobSchema.safeParse(body);

    if (!validationResult.success) {
      console.error("Invalid background job data:", validationResult.error);
      return NextResponse.json(
        { error: "Invalid background job data", details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { formId } = validationResult.data;

    const form = await prisma.form.findUnique({
      where: { id: formId },
    });

    if (!form) {
      console.error(`Form not found for ID: ${formId}`);
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    console.log(`Initiating background job for form ID: ${formId}`);

    // Update form status to processing
    await prisma.form.update({
      where: { id: formId },
      data: {
        status: "PROCESSING",
        extractionStatus: "PROCESSING",
      },
    });

    // Start the background process without awaiting it
    processFormInBackground(form).catch((error) => {
      console.error(`Error in background processing for form ID ${formId}:`, error);
    });

    return NextResponse.json({
      success: true,
      message: "Background job initiated successfully",
    });
  } catch (error) {
    console.error("Error initiating background job:", error);
    return NextResponse.json(
      {
        error: "Failed to initiate background job",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

async function processFormInBackground(form: any) {
  try {
    console.log(`Starting background processing for form ID: ${form.id}`);

    // Step 1: Extract data from image using Gemini API
    let extractedData;
    try {
      console.log(`Extracting data for form ID: ${form.id}`);
      extractedData = await extractCardDetails(
        form.cardFrontPhoto,
        form.cardBackPhoto || null
      );
      console.log(`Data extracted for form ID: ${form.id}`, extractedData);

      await prisma.extractedData.upsert({
        where: { formId: form.id },
        update: extractedData,
        create: { ...extractedData, formId: form.id },
      });

      await prisma.form.update({
        where: { id: form.id },
        data: { extractionStatus: "COMPLETED" },
      });
    } catch (error) {
      console.error(`Error extracting data for form ID ${form.id}:`, error);
      await prisma.form.update({
        where: { id: form.id },
        data: { extractionStatus: "ERROR" },
      });
      extractedData = {
        name: null,
        companyName: null,
        website: null,
        email: null,
        address: null,
        contactNumbers: null,
        state: null,
        country: null,
        description: null, // Optional in ExtractedData
      };
    }

    // Step 2: Merge form data and extracted data
    console.log(`Merging data for form ID: ${form.id}`);
    const mergedDescription = form.description
      ? `${form.description}\nImg Desc: ${extractedData.description || ''}`
      : (extractedData.description ? `Img Desc: ${extractedData.description}` : '');

    const mergedData = {
      cardNo: form.cardNo,
      salesPerson: form.salesPerson,
      date: form.date,
      country: form.country,
      cardFrontPhoto: form.cardFrontPhoto,
      cardBackPhoto: form.cardBackPhoto,
      leadStatus: form.leadStatus,
      dealStatus: form.dealStatus,
      meetingAfterExhibition: form.meetingAfterExhibition,
      industryCategories: form.industryCategories,
      description: mergedDescription ?? "",
      name: extractedData.name,
      companyName: extractedData.companyName,
      website: extractedData.website,
      email: extractedData.email,
      address: extractedData.address,
      contactNumbers: extractedData.contactNumbers,
      state: extractedData.state,
      extractedCountry: extractedData.country,
      status: "COMPLETED",
    };

    await prisma.mergedData.upsert({
      where: { formId: form.id },
      update: mergedData,
      create: {
        ...mergedData,
        form: { connect: { id: form.id } },
      },
    });

    await prisma.form.update({
      where: { id: form.id },
      data: { status: "MERGED" },
    });

    console.log(`Data merged for form ID: ${form.id}`);

    // Step 3: Submit to Zoho
    try {
      console.log(`Submitting to Zoho for form ID: ${form.id}`);
      await prisma.form.update({
        where: { id: form.id },
        data: { zohoStatus: "PROCESSING" },
      });

      const zohoResponse = await submitToZoho(mergedData);
      if ("error" in zohoResponse) {
        throw new Error(`Zoho API Error: ${zohoResponse.error}`);
      }

      await prisma.form.update({
        where: { id: form.id },
        data: { status: "COMPLETED", zohoStatus: "COMPLETED" },
      });
      console.log(`Zoho submission successful for form ID: ${form.id}`);

      // Step 4: Submit to Google Sheets
      console.log(`Submitting to Google Sheets for form ID: ${form.id}`);
      const sheetSubmissionSuccess = await appendToGoogleSheet(
        form,
        extractedData,
        mergedData
      );

      if (sheetSubmissionSuccess) {
        console.log(`Google Sheets submission successful for form ID: ${form.id}`);
      } else {
        console.error(`Google Sheets submission failed for form ID: ${form.id}`);
      }
    } catch (error) {
      console.error(`Error updating Zoho or Google Sheets for form ID ${form.id}:`, error);
      await prisma.form.update({
        where: { id: form.id },
        data: { status: "ERROR", zohoStatus: "ERROR" },
      });
    }

    console.log(`Background processing completed for form ID: ${form.id}`);
  } catch (error) {
    console.error(`Error in background processing for form ID ${form.id}:`, error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    await prisma.form.update({
      where: { id: form.id },
      data: {
        status: "ERROR",
        extractionStatus: "ERROR",
        zohoStatus: "ERROR",
      },
    });
  }
}
// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { extractCardDetails } from "@/lib/card-extractor";
// import { submitToZoho } from "@/lib/zoho-submit";
// import { appendToGoogleSheet } from "@/lib/googleSheetsSubmit";
// import { z } from "zod";

// const BackgroundJobSchema = z.object({
//   formId: z.string().min(1, "Form ID is required"),
// });

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const validationResult = BackgroundJobSchema.safeParse(body);

//     if (!validationResult.success) {
//       console.error("Invalid background job data:", validationResult.error);
//       return NextResponse.json(
//         { error: "Invalid background job data", details: validationResult.error.format() },
//         { status: 400 }
//       );
//     }

//     const { formId } = validationResult.data;

//     const form = await prisma.form.findUnique({
//       where: { id: formId },
//     });

//     if (!form) {
//       console.error(`Form not found for ID: ${formId}`);
//       return NextResponse.json({ error: "Form not found" }, { status: 404 });
//     }

//     console.log(`Initiating background job for form ID: ${formId}`);

//     // Update form status to processing
//     await prisma.form.update({
//       where: { id: formId },
//       data: {
//         status: "PROCESSING",
//         extractionStatus: "PROCESSING",
//       },
//     });

//     // Start the background process without awaiting it
//     processFormInBackground(form).catch((error) => {
//       console.error(`Error in background processing for form ID ${formId}:`, error);
//     });

//     return NextResponse.json({
//       success: true,
//       message: "Background job initiated successfully",
//     });
//   } catch (error) {
//     console.error("Error initiating background job:", error);
//     return NextResponse.json(
//       {
//         error: "Failed to initiate background job",
//         details: error instanceof Error ? error.message : "Unknown error",
//       },
//       { status: 500 }
//     );
//   }
// }

// async function processFormInBackground(form: any) {
//   try {
//     console.log(`Starting background processing for form ID: ${form.id}`);

//     // Step 1: Extract data from image
//     let extractedData;
//     try {
//       extractedData = await extractCardDetails(form.cardFrontPhoto, form.cardBackPhoto || null);
//       console.log(`Extracted data:`, extractedData);

//       // Save only extracted data to DB
//       await prisma.extractedData.upsert({
//         where: { formId: form.id },
//         update: extractedData,
//         create: { ...extractedData, formId: form.id },
//       });

//       await prisma.form.update({
//         where: { id: form.id },
//         data: { extractionStatus: "COMPLETED" },
//       });
//     } catch (err) {
//       console.error("Error extracting data:", err);
//       await prisma.form.update({
//         where: { id: form.id },
//         data: { extractionStatus: "ERROR" },
//       });
//       extractedData = {
//         name: null,
//         companyName: null,
//         website: null,
//         email: null,
//         address: null,
//         contactNumbers: null,
//         state: null,
//         country: null,
//         description: null,
//       };
//     }

//     // Step 2: Merge form + extracted data (in memory only)
//     const mergedDescription = form.description
//       ? `${form.description}\nImg Desc: ${extractedData.description || ''}`
//       : (extractedData.description ? `Img Desc: ${extractedData.description}` : '');

//     const mergedData = {
//       cardNo: form.cardNo,
//       salesPerson: form.salesPerson,
//       date: form.date,
//       country: form.country,
//       cardFrontPhoto: form.cardFrontPhoto,
//       cardBackPhoto: form.cardBackPhoto,
//       leadStatus: form.leadStatus,
//       dealStatus: form.dealStatus,
//       meetingAfterExhibition: form.meetingAfterExhibition,
//       industryCategories: form.industryCategories,
//       description: mergedDescription ?? "",
//       name: extractedData.name,
//       companyName: extractedData.companyName,
//       website: extractedData.website,
//       email: extractedData.email,
//       address: extractedData.address,
//       contactNumbers: extractedData.contactNumbers,
//       state: extractedData.state,
//       extractedCountry: extractedData.country,
//       status: "COMPLETED",
//     };

//     console.log("Merged data (in memory):", mergedData);

//     // ← UNCOMMENT AND USE THIS
//     await prisma.mergedData.upsert({
//       where: { formId: form.id },
//       update: mergedData,
//       create: {
//         ...mergedData,
//         formId: form.id,   // This matches your schema perfectly
//       },
//     });

//     await prisma.form.update({
//       where: { id: form.id },
//       data: { status: "MERGED" },
//     });

//     // Step 3: Submit to Zoho
//     try {
//       await prisma.form.update({
//         where: { id: form.id },
//         data: { zohoStatus: "PROCESSING" },
//       });

//       const zohoResponse = await submitToZoho(mergedData);
//       if ("error" in zohoResponse) throw new Error(`Zoho API Error: ${zohoResponse.error}`);

//       await prisma.form.update({
//         where: { id: form.id },
//         data: { status: "COMPLETED", zohoStatus: "COMPLETED" },
//       });
//       console.log("Zoho submission successful");

//       // Step 4: Submit to Google Sheets
//       const sheetSuccess = await appendToGoogleSheet(form, extractedData, mergedData);
//       if (sheetSuccess) console.log("Google Sheets submission successful");
//       else console.error("Google Sheets submission failed");

//     } catch (err) {
//       console.error("Zoho / Google Sheets error:", err);
//       await prisma.form.update({
//         where: { id: form.id },
//         data: { status: "ERROR", zohoStatus: "ERROR" },
//       });
//     }

//     console.log(`Background processing completed for form ID: ${form.id}`);
//   } catch (error) {
//     console.error(`Background processing error for form ID ${form.id}:`, error);
//     if (error instanceof Error) {
//       console.error("Error message:", error.message);
//       console.error("Error stack:", error.stack);
//     }
//     await prisma.form.update({
//       where: { id: form.id },
//       data: {
//         status: "ERROR",
//         extractionStatus: "ERROR",
//         zohoStatus: "ERROR",
//       },
//     });
//   }
// }


// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { extractCardDetails } from "@/lib/card-extractor";
// import axios from "axios";
// import { appendToGoogleSheet } from "@/lib/googleSheetsSubmit";
// import { z } from "zod";

// const BackgroundJobSchema = z.object({
//   formId: z.string().min(1, "Form ID is required"),
// });

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const validationResult = BackgroundJobSchema.safeParse(body);

//     if (!validationResult.success) {
//       console.error("Invalid background job data:", validationResult.error);
//       return NextResponse.json(
//         { error: "Invalid background job data", details: validationResult.error.format() },
//         { status: 400 }
//       );
//     }

//     const { formId } = validationResult.data;

//     // Fetch form with user → organization relation
//     const form = await prisma.form.findUnique({
//       where: { id: formId },
//       include: {
//         user: {
//           select: {
//             organizationId: true,
//           },
//         },
//       },
//     });

//     if (!form) {
//       console.error(`Form not found for ID: ${formId}`);
//       return NextResponse.json({ error: "Form not found" }, { status: 404 });
//     }

//     if (!form.user?.organizationId) {
//       console.error(`No organization found for form ${formId}`);
//       return NextResponse.json({ error: "Organization not found" }, { status: 400 });
//     }

//     console.log(`Initiating background job for form ID: ${formId} (org: ${form.user.organizationId})`);

//     // Update form status to processing
//     await prisma.form.update({
//       where: { id: formId },
//       data: {
//         status: "PROCESSING",
//         extractionStatus: "PROCESSING",
//       },
//     });

//     // Start background process (fire-and-forget)
//     processFormInBackground(form).catch((error) => {
//       console.error(`Background processing error for form ${formId}:`, error);
//     });

//     return NextResponse.json({
//       success: true,
//       message: "Background job initiated successfully",
//     });
//   } catch (error) {
//     console.error("Error initiating background job:", error);
//     return NextResponse.json(
//       {
//         error: "Failed to initiate background job",
//         details: error instanceof Error ? error.message : "Unknown error",
//       },
//       { status: 500 }
//     );
//   }
// }

// async function processFormInBackground(form: any) {
//   const formId = form.id;
//   const organizationId = form.user.organizationId;

//   try {
//     console.log(`Starting background processing for form ${formId}`);

//     // ────────────────────────────────────────────────
//     // Step 1: Extract data from images
//     // ────────────────────────────────────────────────
//     let extractedData: any = {
//       name: null,
//       companyName: null,
//       website: null,
//       email: null,
//       address: null,
//       contactNumbers: null,
//       state: null,
//       country: null,
//       description: null,
//     };

//     try {
//       extractedData = await extractCardDetails(form.cardFrontPhoto, form.cardBackPhoto || null);
//       console.log("Extracted data:", extractedData);

//       await prisma.extractedData.upsert({
//         where: { formId },
//         update: extractedData,
//         create: { ...extractedData, formId },
//       });

//       await prisma.form.update({
//         where: { id: formId },
//         data: { extractionStatus: "COMPLETED" },
//       });
//     } catch (err) {
//       console.error("Extraction failed:", err);
//       await prisma.form.update({
//         where: { id: formId },
//         data: { extractionStatus: "ERROR" },
//       });
//     }

//     // ────────────────────────────────────────────────
//     // Step 2: Merge data (form + extracted)
//     // ────────────────────────────────────────────────
//     const mergedDescription = form.description
//       ? `${form.description}\n${extractedData.description || ''}`.trim()
//       : (extractedData.description || '');

//     const mergedData = {
//       cardNo: form.cardNo,
//       salesPerson: form.salesPerson,
//       date: form.date,
//       country: form.country,
//       city: form.city || extractedData.country || null, // fallback
//       cardFrontPhoto: form.cardFrontPhoto,
//       cardBackPhoto: form.cardBackPhoto,
//       leadStatus: form.leadStatus,
//       dealStatus: form.dealStatus,
//       meetingAfterExhibition: form.meetingAfterExhibition,
//       industryCategories: form.industryCategories,
//       description: mergedDescription,
//       name: extractedData.name,
//       companyName: extractedData.companyName,
//       website: extractedData.website,
//       email: extractedData.email,
//       address: extractedData.address,
//       contactNumbers: extractedData.contactNumbers,
//       state: extractedData.state,
//       extractedCountry: extractedData.country,
//     };

//     console.log("Merged data:", mergedData);

//     await prisma.mergedData.upsert({
//       where: { formId },
//       update: mergedData,
//       create: { ...mergedData, formId },
//     });

//     await prisma.form.update({
//       where: { id: formId },
//       data: { status: "MERGED" },
//     });

//     // ────────────────────────────────────────────────
//     // Step 3: Submit to user-provided Zoho endpoint
//     // ────────────────────────────────────────────────
//     await prisma.form.update({
//       where: { id: formId },
//       data: { zohoStatus: "PROCESSING" },
//     });

//     const integration = await prisma.zohoIntegration.findUnique({
//       where: { organizationId },
//     });

//     let zohoSuccess = false;

//     if (integration?.apiEndpoint) {
//       try {
//         const payload = {
//           business_cards: [
//             {
//               Card_No: mergedData.cardNo || null,
//               Sales_Person: mergedData.salesPerson || null,
//               Date: mergedData.date ? new Date(mergedData.date).toISOString() : null,
//               Country: mergedData.country || null,
//               City: mergedData.city || null,
//               Card_Front_Photo: mergedData.cardFrontPhoto || null,
//               Card_Back_Photo: mergedData.cardBackPhoto || null,
//               Lead_Status: mergedData.leadStatus || null,
//               Deal_Status: mergedData.dealStatus || null,
//               Meeting_After_Exhibition: mergedData.meetingAfterExhibition ? "Yes" : "No",
//               Industry_Categories: mergedData.industryCategories || null,
//               Description: mergedData.description || null,
//               Last_Name: mergedData.name || mergedData.cardNo || null,
//               Company: mergedData.companyName || "No Company",
//               Mobile: mergedData.contactNumbers ? mergedData.contactNumbers.split(",")[0]?.trim() : null,
//               Mobile_2: mergedData.contactNumbers ? mergedData.contactNumbers.split(",")[1]?.trim() : null,
//               Phone: mergedData.contactNumbers ? mergedData.contactNumbers.split(",")[2]?.trim() : null,
//               Address: mergedData.address || "No Address Provided",
//               State: mergedData.state || null,
//               Email: mergedData.email || null,
//               Website: mergedData.website || "No Website Provided",
//               Extracted_Country: mergedData.extractedCountry || null,
//             },
//           ],
//         };

//         console.log(`Sending to Zoho endpoint: ${integration.apiEndpoint}`);
//         console.log("Payload:", JSON.stringify(payload, null, 2));

//         const response = await axios.post(integration.apiEndpoint, payload, {
//           headers: { "Content-Type": "application/json" },
//           timeout: 20000, // 20 seconds
//         });

//         console.log("Zoho response:", response.status, response.data);

//         zohoSuccess = true;
//         await prisma.form.update({
//           where: { id: formId },
//           data: { zohoStatus: "COMPLETED" },
//         });
//       } catch (err: any) {
//         console.error("Zoho submission failed:", err.message);
//         if (err.response) {
//           console.error("Zoho error response:", err.response.data);
//         }
//         await prisma.form.update({
//           where: { id: formId },
//           data: { zohoStatus: "ERROR" },
//         });
//       }
//     } else {
//       console.log("No Zoho integration configured → skipping Zoho submission");
//       await prisma.form.update({
//         where: { id: formId },
//         data: { zohoStatus: "SKIPPED" }, // optional – or leave as PENDING
//       });
//     }

//     // ────────────────────────────────────────────────
//     // Step 4: Google Sheets (independent of Zoho)
//     // ────────────────────────────────────────────────
//     try {
//       const sheetSuccess = await appendToGoogleSheet(form, extractedData, mergedData);
//       console.log(sheetSuccess ? "Google Sheets success" : "Google Sheets failed");
//     } catch (sheetErr) {
//       console.error("Google Sheets error:", sheetErr);
//     }

//     // Final success status (even if Zoho failed – as long as core processing worked)
//     await prisma.form.update({
//       where: { id: formId },
//       data: { status: "COMPLETED" },
//     });

//     console.log(`Background job completed for form ${formId}`);
//   } catch (criticalError) {
//     console.error("Critical background error:", criticalError);
//     await prisma.form.update({
//       where: { id: formId },
//       data: {
//         status: "ERROR",
//         extractionStatus: "ERROR",
//         zohoStatus: "ERROR",
//       },
//     });
//   }
// }


import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { extractCardDetails } from "@/lib/card-extractor";
import axios from "axios";
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

    // Fetch form with user → organization relation
    const form = await prisma.form.findUnique({
      where: { id: formId },
      include: {
        user: {
          select: {
            organizationId: true,
          },
        },
      },
    });

    if (!form) {
      console.error(`Form not found for ID: ${formId}`);
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    if (!form.user?.organizationId) {
      console.error(`No organization found for form ${formId}`);
      return NextResponse.json({ error: "Organization not found" }, { status: 400 });
    }

    console.log(`Initiating background job for form ID: ${formId} (org: ${form.user.organizationId})`);

    // Update form status to processing
    await prisma.form.update({
      where: { id: formId },
      data: {
        status: "PROCESSING",
        extractionStatus: "PROCESSING",
      },
    });

    // Start background process (fire-and-forget)
    processFormInBackground(form).catch((error) => {
      console.error(`Background processing error for form ${formId}:`, error);
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
  const formId = form.id;
  const organizationId = form.user.organizationId;

  try {
    console.log(`Starting background processing for form ${formId}`);

    // ────────────────────────────────────────────────
    // Step 1: Extract data from images
    // ────────────────────────────────────────────────
    let extractedData: any = {
      name: null,
      companyName: null,
      website: null,
      email: null,
      address: null,
      contactNumbers: null,
      state: null,
      country: null,
      description: null,
    };

    try {
      extractedData = await extractCardDetails(form.cardFrontPhoto, form.cardBackPhoto || null);
      console.log("Extracted data:", extractedData);

      await prisma.extractedData.upsert({
        where: { formId },
        update: extractedData,
        create: { ...extractedData, formId },
      });

      await prisma.form.update({
        where: { id: formId },
        data: { extractionStatus: "COMPLETED" },
      });
    } catch (err) {
      console.error("Extraction failed:", err);
      await prisma.form.update({
        where: { id: formId },
        data: { extractionStatus: "ERROR" },
      });
    }

    // ────────────────────────────────────────────────
    // Step 2: Merge data (form + extracted)
    // ────────────────────────────────────────────────
    const mergedDescription = form.description
      ? `${form.description}\n${extractedData.description || ''}`.trim()
      : (extractedData.description || '');

    const mergedData = {
      cardNo: form.cardNo,
      salesPerson: form.salesPerson,
      date: form.date,
      country: form.country,
      city: form.city || extractedData.country || null,
      cardFrontPhoto: form.cardFrontPhoto,
      cardBackPhoto: form.cardBackPhoto,
      leadStatus: form.leadStatus,
      dealStatus: form.dealStatus,
      meetingAfterExhibition: form.meetingAfterExhibition,
      industryCategories: form.industryCategories,
      description: mergedDescription,
      name: extractedData.name,
      companyName: extractedData.companyName,
      website: extractedData.website,
      email: extractedData.email,
      address: extractedData.address,
      contactNumbers: extractedData.contactNumbers,
      state: extractedData.state,
      extractedCountry: extractedData.country,
    };

    console.log("Merged data:", mergedData);

    await prisma.mergedData.upsert({
      where: { formId },
      update: mergedData,
      create: { ...mergedData, formId },
    });

    await prisma.form.update({
      where: { id: formId },
      data: { status: "MERGED" },
    });

    // ────────────────────────────────────────────────
    // Step 3: Submit ALL data to Zoho (including additionalData)
    // ────────────────────────────────────────────────
    await prisma.form.update({
      where: { id: formId },
      data: { zohoStatus: "PROCESSING" },
    });

    const integration = await prisma.zohoIntegration.findUnique({
      where: { organizationId },
    });

    let zohoSuccess = false;
    let zohoRecordId: string | null = null;

    if (integration?.apiEndpoint) {
      try {
        // Build complete payload — send EVERYTHING
        const payload = {
          // Core form fields
          cardNo: form.cardNo,
          salesPerson: form.salesPerson,
          date: form.date.toISOString(),
          country: form.country,
          cardFrontPhoto: form.cardFrontPhoto,
          cardBackPhoto: form.cardBackPhoto || null,
          leadStatus: form.leadStatus,
          dealStatus: form.dealStatus,
          meetingAfterExhibition: form.meetingAfterExhibition,
          industryCategories: form.industryCategories || '',
          description: form.description || '',

          // Merged data (flattened)
          merged: {
            name: mergedData.name,
            companyName: mergedData.companyName,
            website: mergedData.website,
            email: mergedData.email,
            address: mergedData.address,
            contactNumbers: mergedData.contactNumbers,
            state: mergedData.state,
            city: mergedData.city,
            extractedCountry: mergedData.extractedCountry,
          },

          // ── Most important: full additionalData JSON ──
          additionalData: form.additionalData || {},

          // Optional: full snapshot of submitted fields
          submittedFieldSnapshot: form.submittedFieldSnapshot || {},

          // Metadata
          formId: form.id,
          userId: form.userId,
          submittedAt: form.createdAt.toISOString(),
          updatedAt: form.updatedAt.toISOString(),
          status: form.status,
          source: "Web Form",
        };

        console.log(`Sending full payload to Zoho endpoint: ${integration.apiEndpoint}`);
        console.log("Payload keys:", Object.keys(payload));
        if (payload.additionalData && Object.keys(payload.additionalData).length > 0) {
          console.log("additionalData keys:", Object.keys(payload.additionalData));
        }

        const response = await axios.post(integration.apiEndpoint, payload, {
          headers: { "Content-Type": "application/json" },
          timeout: 30000, // 30 seconds – Zoho can be slow
        });

        console.log("Zoho response:", response.status, response.data);

        zohoSuccess = true;
        zohoRecordId = response.data?.recordId || response.data?.id || null;

        await prisma.form.update({
          where: { id: formId },
          data: {
            zohoStatus: "COMPLETED",
            zohoRecordId: zohoRecordId || null,
            zohoModule: "Leads", // change if different module
            zohoSyncAt: new Date(),
          },
        });
      } catch (err: any) {
        console.error("Zoho submission failed:", err.message);
        if (err.response) {
          console.error("Zoho error response:", err.response.data);
        }
        await prisma.form.update({
          where: { id: formId },
          data: { zohoStatus: "ERROR" },
        });
      }
    } else {
      console.log("No Zoho integration configured → skipping Zoho submission");
      await prisma.form.update({
        where: { id: formId },
        data: { zohoStatus: "SKIPPED" },
      });
    }

    // ────────────────────────────────────────────────
    // Step 4: Google Sheets (independent)
    // ────────────────────────────────────────────────
    try {
      const sheetSuccess = await appendToGoogleSheet(form, extractedData, mergedData);
      console.log(sheetSuccess ? "Google Sheets success" : "Google Sheets failed");
    } catch (sheetErr) {
      console.error("Google Sheets error:", sheetErr);
    }

    // Final success status
    await prisma.form.update({
      where: { id: formId },
      data: { status: "COMPLETED" },
    });

    console.log(`Background job completed for form ${formId}`);
  } catch (criticalError) {
    console.error("Critical background error:", criticalError);
    await prisma.form.update({
      where: { id: formId },
      data: {
        status: "ERROR",
        extractionStatus: "ERROR",
        zohoStatus: "ERROR",
      },
    });
  }
}
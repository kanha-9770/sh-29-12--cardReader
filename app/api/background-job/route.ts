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

//     // Do NOT save merged data to DB
    
//     // await prisma.mergedData.upsert({ 
//     // where: { formId: form.id }, 
//     // update: mergedData, 
//     // create: { 
//     // ...mergedData, 
//     // form: { connect: { id: form.id } }, 
//     // }, 
//     // });

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
// import { submitToZoho } from "@/lib/zoho-submit";
// import { appendToGoogleSheet } from "@/lib/googleSheetsSubmit";
// import { z } from "zod";
// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

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

//     // Step 1: Extract data from images (front/back)
//     let extractedData;
//     try {
//       extractedData = await extractCardDetails(form.cardFrontPhoto, form.cardBackPhoto || null);
//       console.log(`[BG] Extracted data for form ${form.id}:`, extractedData);

//       // Save or upsert extracted data to DB
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
//       console.error("[BG] Error extracting data:", err);
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

//     // Step 1.5: Attempt automatic email send (only once)
//     try {
//       const candidateEmail = extractedData?.email?.toString()?.trim() || null;

//       // basic validation
//       const isValidEmail = candidateEmail && candidateEmail.includes("@") && candidateEmail.length < 254;

//       // fetch latest form record to check emailSent flag (avoid race)
//       const latestForm = await prisma.form.findUnique({ where: { id: form.id } });

//       if (isValidEmail && latestForm && !latestForm.emailSent) {
//         // Find the user who submitted the form (to use as reply-to)
//         const senderUser = await prisma.user.findUnique({ where: { id: latestForm.userId } });

//         // Build email content (personalize)
//         const senderName = senderUser?.name ?? "Someone from CardSync";
//         const senderEmail = senderUser?.email ?? "no-reply@cardsync.ai";

//         const html = `
//           <div style="font-family:system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;">
//             <p>Hello ${extractedData.name ?? ""},</p>
//             <p>It was great meeting you! Thanks for sharing your details — we’ll follow up soon.</p>
//             <p style="margin-top:12px;">Best,<br/>${senderName}</p>
//             <p style="font-size:12px;color:#666;margin-top:8px;">Reply to: ${senderEmail}</p>
//           </div>
//         `;

//         // Send via Resend (recommended to use verified sender domain)
//         await resend.emails.send({
//           from: "no-reply@cardsync.ai",     // recommended: verified sending domain
//           to: candidateEmail,
//           subject: "Great meeting you!",
//           html,
//           // include reply-to header pointing to the submitting user (so replies go to them)
//           headers: {
//             "Reply-To": senderEmail,
//           },
//         });

//         console.log(`[BG] Auto email sent to ${candidateEmail} for form ${form.id}`);

//         // mark as sent to avoid duplicates
//         await prisma.form.update({
//           where: { id: form.id },
//           data: { emailSent: true },
//         });

//         // Optionally, you can persist an email log
//         try {
//           await prisma.emailLog.create({
//             data: {
//               formId: form.id,
//               to: candidateEmail,
//               from: "no-reply@cardsync.ai",
//               subject: "Great meeting you!",
//               status: "SENT",
//             },
//           });
//         } catch (logErr) {
//           console.warn("[BG] Could not create email log:", logErr);
//         }
//       } else {
//         if (!isValidEmail) console.log(`[BG] No valid extracted email for form ${form.id}`);
//         else if (latestForm?.emailSent) console.log(`[BG] Email already sent for form ${form.id}`);
//       }
//     } catch (emailErr) {
//       console.error(`[BG] Auto email failed for form ${form.id}:`, emailErr);
//       // don't throw — continue pipeline
//       await prisma.form.update({
//         where: { id: form.id },
//         data: { emailSent: false }, // ensure flagged as not sent
//       });
//     }

//     // Step 2: Merge form + extracted data (in memory only)
//     const mergedDescription = form.description
//       ? `${form.description}\nImg Desc: ${extractedData.description || ""}`
//       : extractedData.description
//       ? `Img Desc: ${extractedData.description}`
//       : "";

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

//     console.log(`[BG] Merged data (in memory) for form ${form.id}:`, mergedData);

//     // Update form status to merged
//     await prisma.form.update({
//       where: { id: form.id },
//       data: { status: "MERGED" },
//     });

//     // Step 3: Submit to Zoho + Google Sheets
//     try {
//       await prisma.form.update({
//         where: { id: form.id },
//         data: { zohoStatus: "PROCESSING" },
//       });

//       const zohoResponse = await submitToZoho(mergedData);
//       if ("error" in zohoResponse) throw new Error(`Zoho API Error: ${zohoResponse.error}`);

//       // Mark completed
//       await prisma.form.update({
//         where: { id: form.id },
//         data: { status: "COMPLETED", zohoStatus: "COMPLETED" },
//       });
//       console.log(`[BG] Zoho submission successful for form ${form.id}`);

//       // Step 4: Submit to Google Sheets
//       const sheetSuccess = await appendToGoogleSheet(form, extractedData, mergedData);
//       if (sheetSuccess) console.log(`[BG] Google Sheets submission successful for form ${form.id}`);
//       else console.error(`[BG] Google Sheets submission failed for form ${form.id}`);
//     } catch (err) {
//       console.error(`[BG] Zoho / Google Sheets error for form ${form.id}:`, err);
//       await prisma.form.update({
//         where: { id: form.id },
//         data: { status: "ERROR", zohoStatus: "ERROR" },
//       });
//     }

//     console.log(`[BG] Background processing completed for form ID: ${form.id}`);
//   } catch (error) {
//     console.error(`[BG] Background processing error for form ID ${form.id}:`, error);
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


// app/api/background-job/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { extractCardDetails } from "@/lib/card-extractor";
import { submitToZoho } from "@/lib/zoho-submit";
import { appendToGoogleSheet } from "@/lib/googleSheetsSubmit";
import { z } from "zod";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const BackgroundJobSchema = z.object({
  formId: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { formId } = BackgroundJobSchema.parse(body);

    const form = await prisma.form.findUnique({ where: { id: formId } });
    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    await prisma.form.update({
      where: { id: formId },
      data: { status: "PROCESSING", extractionStatus: "PROCESSING" },
    });

    // Fire and forget — safe background job
    processFormInBackground(form).catch(console.error);

    return NextResponse.json({ success: true, message: "Job started" });
  } catch (error) {
    console.error("Failed to start background job:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ────────────────────────────────────────────────────────────────
// MAIN BACKGROUND WORKER — FIXED & SAFE
// ────────────────────────────────────────────────────────────────
async function processFormInBackground(form: any) {
  let extractedData: any = {};

  try {
    console.log(`[BG] Processing form ${form.id}`);

    // === STEP 1: Extract from card ===
    let rawExtracted;
    try {
      rawExtracted = await extractCardDetails(form.cardFrontPhoto, form.cardBackPhoto || null);
      console.log("[BG] Extracted:", rawExtracted);
    } catch (err) {
      console.error("[BG] OCR failed:", err);
      throw err;
    }

    // === CLEAN & SAFE DATA (only allowed fields) ===
    extractedData = {
      name: rawExtracted.name || null,
      companyName: rawExtracted.companyName || null,
      website: rawExtracted.website || null,
      email: rawExtracted.email || null,
      address: rawExtracted.address || null,
      contactNumbers: rawExtracted.contactNumbers || null,
      state: rawExtracted.state || null,
      country: rawExtracted.country || null,
       city: rawExtracted.city || null, 
      description: rawExtracted.description || null,
      // city will be added later via migration
    };

    // === SAVE EXTRACTED DATA SAFELY ===
    await prisma.extractedData.upsert({
      where: { formId: form.id },
      update: extractedData,
      create: { ...extractedData, formId: form.id },
    });

    await prisma.form.update({
      where: { id: form.id },
      data: { extractionStatus: "COMPLETED" },
    });

    // === AUTO EMAIL (safe) ===
    try {
      const email = extractedData.email?.trim();
      if (email && email.includes("@") && email.length < 254) {
        const latestForm = await prisma.form.findUnique({ where: { id: form.id } });
        if (!latestForm?.emailSent) {
          const user = await prisma.user.findUnique({ where: { id: form.userId } });
          await resend.emails.send({
            from: "no-reply@cardsync.ai",
            to: email,
            subject: "Great meeting you!",
            html: `<p>Hello ${extractedData.name || "there"},</p><p>Thanks for connecting!</p><p>Best,<br/>${user?.name || "Team"}</p>`,
            headers: { "Reply-To": user?.email || "no-reply@cardsync.ai" },
          });

          await prisma.form.update({
            where: { id: form.id },
            data: { emailSent: true },
          });
        }
      }
    } catch (e) {
      console.warn("[BG] Email failed (continuing):", e);
    }

    // === MERGE DATA ===
    const mergedData = {
      cardNo: form.cardNo,
      salesPerson: form.salesPerson,
      date: form.date,
      country: extractedData.country || form.country,
      cardFrontPhoto: form.cardFrontPhoto,
      cardBackPhoto: form.cardBackPhoto,
      leadStatus: form.leadStatus,
      dealStatus: form.dealStatus,
      meetingAfterExhibition: form.meetingAfterExhibition,
      industryCategories: form.industryCategories,
      description: form.description || extractedData.description || "",
      name: extractedData.name,
      companyName: extractedData.companyName,
      website: extractedData.website,
      email: extractedData.email,
      address: extractedData.address,
      contactNumbers: extractedData.contactNumbers,
      state: extractedData.state,
      city: extractedData.city,
      extractedCountry: extractedData.country,
      status: "COMPLETED",
    };

    // === SAVE MERGED DATA ===
    await prisma.mergedData.upsert({
      where: { formId: form.id },
      update: mergedData,
      create: { ...mergedData, formId: form.id },
    });

    await prisma.form.update({
      where: { id: form.id },
      data: { status: "MERGED" },
    });

    // === ZOHO + GOOGLE SHEETS ===
    try {
      await prisma.form.update({ where: { id: form.id }, data: { zohoStatus: "PROCESSING" } });

      const zohoRes = await submitToZoho(mergedData);
      if (zohoRes && "error" in zohoRes) throw new Error(zohoRes.error);

      await appendToGoogleSheet(form, extractedData, mergedData);

      await prisma.form.update({
        where: { id: form.id },
        data: { status: "COMPLETED", zohoStatus: "COMPLETED" },
      });
    } catch (err) {
      console.error("[BG] Zoho/Sheets failed:", err);
      await prisma.form.update({
        where: { id: form.id },
        data: { status: "ERROR", zohoStatus: "ERROR" },
      });
    }

    console.log(`[BG] Form ${form.id} processed successfully`);
  } catch (error) {
    console.error(`[BG] FATAL ERROR for form ${form.id}:`, error);
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
// import { NextResponse } from "next/server"
// import { prisma } from "@/lib/prisma"
// import { getSession } from "@/lib/auth"

// export const dynamic = "force-dynamic"
// export const revalidate = 10

// export async function GET(req: Request, { params }: { params: { id: string } }) {
//   try {
//     const session = await getSession()

//     if (!session) {
//       console.error("Unauthorized access attempt")
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const id = params.id
//     const form = await prisma.form.findUnique({
//       where: { id },
//       include: {
//         extractedData: true,
//         mergedData: true,
//       },
//     })

//     if (!form) {
//       return NextResponse.json({ error: "Form not found" }, { status: 404 })
//     }

//     return NextResponse.json(form)
//   } catch (error) {
//     console.error("Error fetching form:", error)
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
//   }
// }


import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 10;

// ✅ GET: Fetch a single form by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();

    if (!session) {
      console.error("Unauthorized access attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = params.id;
    if (!id) {
      console.error("Missing form ID in GET request");
      return NextResponse.json({ error: "Missing form ID" }, { status: 400 });
    }

    const form = await prisma.form.findUnique({
      where: { id },
      include: {
        extractedData: true,
        mergedData: true,
      },
    });

    if (!form) {
      console.error(`Form not found: ${id}`);
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    console.log(`Form fetched successfully: ${id}`);
    return NextResponse.json(form);
  } catch (error) {
    console.error("Error fetching form:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ✅ PATCH: Update a single form by ID
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();

    if (!session) {
      console.error("Unauthorized update attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = params.id;
    if (!id) {
      console.error("Missing form ID in PATCH request");
      return NextResponse.json({ error: "Missing form ID" }, { status: 400 });
    }

    const updatedData = await req.json();
    if (!updatedData) {
      console.error("Empty request body in PATCH request");
      return NextResponse.json({ error: "Request body is required" }, { status: 400 });
    }

    console.log(`Updating form ${id} with data:`, updatedData);

    // Update the form in the database
    const updatedForm = await prisma.form.update({
      where: { id },
      data: {
        cardNo: updatedData.cardNo,
        salesPerson: updatedData.salesPerson,
        date: updatedData.date ? new Date(updatedData.date) : undefined,
        country: updatedData.country,
        cardFrontPhoto: updatedData.cardFrontPhoto,
        cardBackPhoto: updatedData.cardBackPhoto,
        leadStatus: updatedData.leadStatus,
        dealStatus: updatedData.dealStatus,
        meetingAfterExhibition: updatedData.meetingAfterExhibition,
        industryCategories: updatedData.industryCategories,
        description: updatedData.description,
        // Include other fields as needed, but exclude extractedData and mergedData
        // since they are likely handled by separate tables
      },
    });

    console.log(`Form updated successfully: ${id}`, updatedForm);
    return NextResponse.json({ message: "Form updated successfully", form: updatedForm }, { status: 200 });
  } catch (error: any) {
    console.error("Error updating form:", error);

    // Handle Prisma-specific errors
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Failed to update form", details: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}

// ✅ DELETE: Remove a single form by ID
export async function DELETE(req: Request, { params }: { params: { id?: string } }) {
  try {
    const session = await getSession();

    if (!session) {
      console.error("Unauthorized delete attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = params.id;
    if (!id) {
      console.error("Missing form ID in DELETE request");
      return NextResponse.json({ error: "Missing form ID" }, { status: 400 });
    }

    // Attempt to delete the record
    const deletedForm = await prisma.form.delete({
      where: { id },
    });

    console.log(`Form deleted successfully: ${id}`);
    return NextResponse.json({ message: "Form deleted successfully", deletedForm });
  } catch (error: any) {
    console.error("Error deleting form:", error);

    // Prisma-specific "record not found" code
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    return NextResponse.json({ error: "Failed to delete form" }, { status: 500 });
  }
}
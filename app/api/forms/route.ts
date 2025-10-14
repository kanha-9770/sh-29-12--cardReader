import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { submitToZoho } from "@/lib/zoho-submit"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(req: Request) {
  try {
    const session = await getSession()

    if (!session?.isAdmin) {
      console.error("Unauthorized access attempt in GET")
      return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 401 })
    }

    const forms = await prisma.form.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
        extractedData: true,
        mergedData: true,
      },
    })

    return NextResponse.json(forms)
  } catch (error) {
    console.error("Error in GET /api/forms:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch forms",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession()

    if (!session) {
      console.error("Unauthorized access attempt")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = String(session.id)

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 })
    }

    const formData = await req.formData()
    const jsonData = formData.get("jsonData") as string
    const data = JSON.parse(jsonData)

    console.log("Received form data:", JSON.stringify(data, null, 2))

    // Merge form data with extracted data
    const mergedData = {
      ...data,
      userId: user.id,
      date: new Date(data.date), // Convert date string to Date object
    }

    console.log("Attempting to save merged data to MySQL:", mergedData)

    // Save to MySQL
    // const form = await prisma.form.create({
    //   data: mergedData,
    // })

    // console.log("Successfully saved to MySQL with ID:", form.id)

    // Submit to Zoho
    console.log("Attempting to submit to Zoho...")
    const zohoResponse = await submitToZoho(mergedData)
    console.log("Zoho submission successful:", zohoResponse)

    return NextResponse.json({
      success: true,
      // mysqlData: form,
      zohoResponse,
      message: "Data successfully saved to MySQL and submitted to Zoho.",
    })
  } catch (error) {
    console.error("Error in POST /api/forms:", error)

    const err = error as { code?: string; message?: string; stack?: string }

    if (err.code === "P2002") {
      return NextResponse.json(
        {
          error: "Database constraint violation",
          details: "A record with this card number already exists",
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        details: err.message || "Unknown error",
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
      },
      { status: 500 },
    )
  }
}


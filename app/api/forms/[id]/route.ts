import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export const dynamic = "force-dynamic"
export const revalidate = 10

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()

    if (!session) {
      console.error("Unauthorized access attempt")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = params.id
    const form = await prisma.form.findUnique({
      where: { id },
      include: {
        extractedData: true,
        mergedData: true,
      },
    })

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 })
    }

    return NextResponse.json(form)
  } catch (error) {
    console.error("Error fetching form:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}


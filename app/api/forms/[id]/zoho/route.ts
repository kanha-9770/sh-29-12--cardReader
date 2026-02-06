import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getZohoAccessToken } from "@/lib/zoho-auth"; // ← you'll create this next

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const form = await prisma.form.findUnique({
      where: { id: params.id },
      select: {
        zohoRecordId: true,
        zohoModule: true,
        organizationId: true,
      },
    });

    if (!form?.zohoRecordId || !form.organizationId) {
      return NextResponse.json(
        { error: "No Zoho record ID or organization found for this form" },
        { status: 404 }
      );
    }

    // Get OAuth token (see step 5)
    const accessToken = await getZohoAccessToken(form.organizationId);

    const module = form.zohoModule || "Leads";
    const url = `https://www.zohoapis.com/crm/v7/${module}/${form.zohoRecordId}`;

    const zohoRes = await fetch(url, {
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
      },
    });

    if (!zohoRes.ok) {
      const err = await zohoRes.json();
      return NextResponse.json(
        { error: "Failed to fetch from Zoho CRM", details: err },
        { status: zohoRes.status }
      );
    }

    const data = await zohoRes.json();

    return NextResponse.json({
      success: true,
      zohoRecord: data.data?.[0] || null, // Zoho returns array even for single record
      formData: form, // optional
    });
  } catch (err: any) {
    console.error("Zoho fetch error:", err);
    return NextResponse.json(
      { error: "Server error", message: err.message },
      { status: 500 }
    );
  }
}
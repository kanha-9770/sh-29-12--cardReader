import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

async function getOrganizationIdOrError(req: NextRequest): Promise<number | NextResponse> {
  const token = cookies().get('token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const payload = await verifyToken(token);

    if (!payload?.id) {
      return NextResponse.json({ error: 'Invalid token – missing user ID' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.id as string },
      select: { organizationId: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.organizationId) {
      return NextResponse.json({ error: 'User is not part of any organization' }, { status: 403 });
    }

    return user.organizationId;
  } catch (err) {
    console.error('Token verification failed:', err);
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }
}

// POST /api/zoho — Save the Zoho Function Endpoint
export async function POST(req: NextRequest) {
  const orgIdResult = await getOrganizationIdOrError(req);

  if (orgIdResult instanceof NextResponse) {
    return orgIdResult;
  }

  const organizationId = orgIdResult;

  try {
    const body = await req.json();
    const { apiEndpoint } = body;

    if (!apiEndpoint) {
      return NextResponse.json(
        { success: false, message: 'Zoho Function API Endpoint is required' },
        { status: 400 }
      );
    }

    // Validate it looks like a Zoho Functions execute URL
    if (
      !apiEndpoint.startsWith('https://www.zohoapis.') ||
      !apiEndpoint.includes('/functions/') ||
      !apiEndpoint.includes('actions/execute') ||
      !apiEndpoint.includes('zapikey=')
    ) {
      return NextResponse.json(
        { success: false, message: 'Invalid Zoho Function URL – must include /functions/.../execute?auth_type=apikey&zapikey=...' },
        { status: 400 }
      );
    }

    console.log('Saving Zoho Function Endpoint:', { organizationId, apiEndpoint });

    const integration = await prisma.zohoIntegration.upsert({
      where: { organizationId },
      update: {
        apiEndpoint,
        status: 'CONNECTED',
        connectedAt: new Date(),
        errorMessage: null,
      },
      create: {
        organizationId,
        apiEndpoint,
        status: 'CONNECTED',
        connectedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Zoho Function Endpoint saved successfully',
      status: integration.status,
    });
  } catch (error: any) {
    console.error('Zoho endpoint save error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to save endpoint' },
      { status: 500 }
    );
  }
}

// POST /api/zoho/test — Test if the endpoint accepts POST
export async function POST_test(req: NextRequest) {
  const orgIdResult = await getOrganizationIdOrError(req);

  if (orgIdResult instanceof NextResponse) {
    return orgIdResult;
  }

  const organizationId = orgIdResult;

  try {
    const integration = await prisma.zohoIntegration.findUnique({
      where: { organizationId },
    });

    if (!integration || !integration.apiEndpoint) {
      return NextResponse.json(
        { success: false, message: 'No Zoho Function endpoint saved' },
        { status: 404 }
      );
    }

    // Test POST with dummy data (Zoho Functions usually accept POST)
    const dummyPayload = { test: "ping" };

    const testRes = await fetch(integration.apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dummyPayload),
    });

    if (!testRes.ok) {
      const text = await testRes.text();
      throw new Error(`Endpoint test failed: ${testRes.status} - ${text}`);
    }

    await prisma.zohoIntegration.update({
      where: { organizationId },
      data: { status: 'CONNECTED', errorMessage: null },
    });

    return NextResponse.json({
      success: true,
      message: 'Endpoint accepts POST requests – integration ready',
    });
  } catch (error: any) {
    console.error('Endpoint test error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to test endpoint' },
      { status: 400 }
    );
  }
}
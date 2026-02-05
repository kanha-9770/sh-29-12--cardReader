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

// POST /api/zoho/test — Test the user-provided API endpoint
export async function POST(req: NextRequest) {
  const orgIdResult = await getOrganizationIdOrError(req);

  if (orgIdResult instanceof NextResponse) {
    return orgIdResult;
  }

  const organizationId = orgIdResult;

  try {
    const integration = await prisma.zohoIntegration.findUnique({
      where: { organizationId },
    });

    if (!integration) {
      return NextResponse.json(
        { success: false, message: 'No Zoho integration found for this organization' },
        { status: 404 }
      );
    }

    if (!integration.apiEndpoint) {
      return NextResponse.json(
        { success: false, message: 'No API endpoint configured – please save one first' },
        { status: 400 }
      );
    }

    // Send a simple dummy POST to test if the endpoint accepts requests
    const dummyPayload = {
      test: "ping_from_cardsync",
      timestamp: new Date().toISOString(),
    };

    console.log(`Testing user-provided endpoint: ${integration.apiEndpoint}`);

    const testResponse = await fetch(integration.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dummyPayload),
    });

    if (!testResponse.ok) {
      const errorText = await testResponse.text().catch(() => 'No response body');
      throw new Error(
        `Endpoint test failed: ${testResponse.status} ${testResponse.statusText} - ${errorText}`
      );
    }

    // Optional: update status in Prisma
    await prisma.zohoIntegration.update({
      where: { organizationId },
      data: {
        status: 'CONNECTED',
        lastTokenFetch: new Date(), // repurposed as last successful test
        errorMessage: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'API endpoint test successful – it accepts POST requests',
    });
  } catch (error: any) {
    console.error('Zoho API endpoint test error:', error);

    try {
      await prisma.zohoIntegration.update({
        where: { organizationId },
        data: {
          status: 'ERROR',
          errorMessage: error.message?.substring(0, 500) || 'Test failed – unknown error',
        },
      });
    } catch (dbErr) {
      console.error('Failed to update error status in DB:', dbErr);
    }

    return NextResponse.json(
      { success: false, message: error.message || 'Failed to test API endpoint' },
      { status: 400 }
    );
  }
}
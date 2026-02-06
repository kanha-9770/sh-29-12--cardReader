// lib/zoho-auth.ts
export async function getZohoAccessToken(organizationId: number): Promise<string> {
  const integration = await prisma.zohoIntegration.findUnique({
    where: { organizationId },
  });

  if (!integration?.clientId || !integration?.clientSecret || !integration?.refreshToken) {
    throw new Error("Zoho OAuth credentials not configured");
  }

  // Check if token is still valid
  if (integration.accessToken && integration.tokenExpiry && integration.tokenExpiry > new Date()) {
    return integration.accessToken;
  }

  // Refresh token
  const params = new URLSearchParams({
    refresh_token: integration.refreshToken,
    client_id: integration.clientId,
    client_secret: integration.clientSecret,
    grant_type: "refresh_token",
  });

  const res = await fetch("https://accounts.zoho.com/oauth/v2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  if (!res.ok) {
    throw new Error("Failed to refresh Zoho token");
  }

  const data = await res.json();

  // Save new tokens
  await prisma.zohoIntegration.update({
    where: { organizationId },
    data: {
      accessToken: data.access_token,
      tokenExpiry: new Date(Date.now() + data.expires_in * 1000),
    },
  });

  return data.access_token;
}
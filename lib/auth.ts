// lib/auth.ts
import { hash, compare } from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

// ========================
// JWT Setup
// ========================
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error(
    "JWT_SECRET must be defined in .env and at least 32 characters long!"
  );
}

const secret = new TextEncoder().encode(JWT_SECRET);

// ========================
// Password Helpers
// ========================
export async function hashPassword(password: string) {
  return await hash(password, 12);
}

export async function verifyPassword(plain: string, hashed: string) {
  return await compare(plain, hashed);
}

// ========================
// Token: Create & Verify
// ========================
export async function createToken(payload: {
  id: string;                    // Must include user ID
  email: string;
  name?: string | null;
  isAdmin?: boolean;
  organizationId?: number | null;
}) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")           // 7 days – better UX
    .sign(secret);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as {
      id: string;
      email: string;
      name?: string | null;
      isAdmin?: boolean;
      organizationId?: number | null;
      iat?: number;
      exp?: number;
    };
  } catch (error) {
    console.error("JWT Verification Failed:", error);
    return null;
  }
}

// ========================
// Session Helper (Used in route handlers)
// ========================
export async function getSession() {
  const token = cookies().get("token")?.value;
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload?.id) return null;

  return {
    id: payload.id,
    email: payload.email,
    name: payload.name || null,
    isAdmin: !!payload.isAdmin,
    organizationId: payload.organizationId || null,
    // Optional: attach user object for frontend convenience
    user: {
      id: payload.id,
      email: payload.email,
      name: payload.name || null,
      isAdmin: !!payload.isAdmin,
      organizationId: payload.organizationId || null,
    },
  };
}

// ========================
// Login & Logout Helpers
// ========================
export async function loginAndSetCookie(user: {
  id: string;
  email: string;
  name?: string | null;
  isAdmin?: boolean;
  organizationId?: number | null;
}) {
  const token = await createToken(user);

  cookies().set({
    name: "token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export function logout() {
  cookies().delete("token");
}
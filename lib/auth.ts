// import { hash, compare } from "bcryptjs";
// import { SignJWT, jwtVerify, type JWK, type KeyLike } from "jose";
// import { cookies } from "next/headers";

// // Validate JWT_SECRET at module load and ensure it's a Uint8Array
// const JWT_SECRET = process.env.JWT_SECRET;
// if (!JWT_SECRET) {
//   throw new Error("JWT_SECRET is not defined in environment variables. Please set it in your .env file.");
// }
// const secret: Uint8Array = new TextEncoder().encode(JWT_SECRET);

// export async function hashPassword(password: string): Promise<string> {
//   if (!password) {
//     throw new Error("Password cannot be empty");
//   }
//   console.log("Hashing password"); // Debugging
//   return await hash(password, 12);
// }

// export async function verifyPassword(
//   password: string,
//   hashedPassword: string
// ): Promise<boolean> {
//   if (!password || !hashedPassword) {
//     console.log("Invalid password or hashedPassword:", { password, hashedPassword });
//     return false;
//   }
//   console.log("Verifying password"); // Debugging
//   return await compare(password, hashedPassword);
// }

// export async function createToken(payload: any): Promise<string> {
//   if (!payload || Object.keys(payload).length === 0) {
//     console.error("Payload is empty or invalid:", payload);
//     throw new Error("Payload is empty or invalid");
//   }
//   console.log("Creating token with payload:", payload); // Debugging
//   try {
//     const token = await new SignJWT(payload)
//       .setProtectedHeader({ alg: "HS256" })
//       .setExpirationTime("24h")
//       .sign(secret);
//     console.log("Generated token:", token); // Debugging
//     return token;
//   } catch (error: any) {
//     console.error("Error creating token:", error.message);
//     throw new Error(`Failed to create token: ${error.message}`);
//   }
// }

// export async function verifyToken(token: string): Promise<any> {
//   if (!token) {
//     console.error("No token provided to verifyToken");
//     return null;
//   }
//   try {
//     console.log("Verifying token:", token); // Debugging
//     const verified = await jwtVerify(token, secret);
//     console.log("Verified payload:", verified.payload); // Debugging
//     return verified.payload;
//   } catch (error: any) {
//     console.error("Token verification error:", error.message); // Detailed error logging
//     return null;
//   }
// }

// export async function getSession(): Promise<any> {
//   const token = cookies().get("token")?.value;
//   console.log("Retrieved token in getSession:", token); // Debugging
//   if (!token) {
//     console.log("No token found in cookies");
//     return null;
//   }
//   const payload = await verifyToken(token);
//   console.log("getSession payload:", payload); // Debugging
//   return payload;
// }



// import { hash, compare } from "bcryptjs";
// import { SignJWT, jwtVerify } from "jose";
// import { cookies } from "next/headers";

// // ========================
// // Environment Validation
// // ========================
// const JWT_SECRET = process.env.JWT_SECRET;
// if (!JWT_SECRET || JWT_SECRET.length < 32) {
//   throw new Error(
//     "JWT_SECRET must be set in .env and be at least 32 characters long!"
//   );
// }

// const secret = new TextEncoder().encode(JWT_SECRET);

// // ========================
// // Password Helpers
// // ========================
// export async function hashPassword(password: string): Promise<string> {
//   if (!password || password.trim() === "") {
//     throw new Error("Password cannot be empty");
//   }
//   return await hash(password, 12);
// }

// export async function verifyPassword(
//   plainPassword: string,
//   hashedPassword: string
// ): Promise<boolean> {
//   if (!plainPassword || !hashedPassword) return false;
//   return await compare(plainPassword, hashedPassword);
// }

// // ========================
// // JWT Token Functions
// // ========================
// export async function createToken(payload: {
//   email: string;
//   name?: string | null;
//   isAdmin?: boolean;
//   organizationId?: number | null;
// }): Promise<string> {
//   return await new SignJWT(payload)
//     .setProtectedHeader({ alg: "HS256" })
//     .setIssuedAt()
//     .setExpirationTime("24h") // adjust as needed
//     .sign(secret);
// }

// export async function verifyToken(token: string): Promise<any | null> {
//   try {
//     const { payload } = await jwtVerify(token, secret);
//     return payload;
//   } catch (error) {
//     console.error("JWT verification failed:", error);
//     return null;
//   }
// }

// // ========================
// // Session Helper (Critical for API routes)
// // ========================
// export async function getSession(): Promise<{
//   user: {
//     email: string;
//     name?: string | null;
//     isAdmin?: boolean;
//     organizationId?: number | null;
//   };
// } | null> {
//   const token = cookies().get("token")?.value;

//   if (!token) {
//     return null;
//   }

//   const payload = await verifyToken(token);

//   if (!payload || !payload.email) {
//     return null;
//   }

//   return {
//     user: {
//       email: payload.email as string,
//       name: (payload.name as string) || null,
//       isAdmin: (payload.isAdmin as boolean) || false,
//       organizationId: payload.organizationId ? Number(payload.organizationId) : null,
//     },
//   };
// }

// // ========================
// // Optional: Login Helper (use in your login API)
// // ========================
// export async function loginAndSetCookie(user: {
//   email: string;
//   name?: string | null;
//   isAdmin?: boolean;
//   organizationId?: number | null;
// }) {
//   const token = await createToken({
//     email: user.email,
//     name: user.name || null,
//     isAdmin: user.isAdmin || false,
//     organizationId: user.organizationId || null,
//   });

//   cookies().set({
//     name: "token",
//     value: token,
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "lax",
//     path: "/",
//     maxAge: 60 * 60 * 24, // 24 hours
//   });
// }

// // ========================
// // Optional: Logout Helper
// // ========================
// export function logout() {
//   cookies().delete("token");
// }

import { hash, compare } from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

// ========================
// Environment Validation
// ========================
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error("JWT_SECRET must be set and at least 32 characters long!");
}
const secret = new TextEncoder().encode(JWT_SECRET);

// ========================
// Password & Token
// ========================
export async function hashPassword(password: string) {
  return await hash(password, 12);
}

export async function verifyPassword(plain: string, hashed: string) {
  return await compare(plain, hashed);
}

export async function createToken(payload: {
  email: string;
  name?: string | null;
  isAdmin?: boolean;
  organizationId?: number | null;
}) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

// ========================
// getSession — Returns BOTH shapes for compatibility
// ========================
export async function getSession() {
  const token = cookies().get("token")?.value;
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload?.email) return null;

  // Return the shape your OLD code expects (dashboard, /api/forms/user)
  const legacySession = {
    id: payload.email, // some old code used email as id
    email: payload.email,
    isAdmin: payload.isAdmin || false,
    organizationId: payload.organizationId || null,
  };

  // Also return the new shape for ExhibitionForm
  const newSession = {
    user: {
      email: payload.email,
      name: payload.name || null,
      isAdmin: payload.isAdmin || false,
      organizationId: payload.organizationId || null,
    },
  };

  // Attach both so any code works
  return Object.assign(legacySession, newSession);
}

// ========================
// Login Helper
// ========================
export async function loginAndSetCookie(user: {
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
    maxAge: 60 * 60 * 24,
  });
}

export function logout() {
  cookies().delete("token");
}
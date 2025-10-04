import { hash, compare } from "bcryptjs";
import { SignJWT, jwtVerify, type JWK, type KeyLike } from "jose";
import { cookies } from "next/headers";

// Validate JWT_SECRET at module load and ensure it's a Uint8Array
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables. Please set it in your .env file.");
}
const secret: Uint8Array = new TextEncoder().encode(JWT_SECRET);

export async function hashPassword(password: string): Promise<string> {
  if (!password) {
    throw new Error("Password cannot be empty");
  }
  console.log("Hashing password"); // Debugging
  return await hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  if (!password || !hashedPassword) {
    console.log("Invalid password or hashedPassword:", { password, hashedPassword });
    return false;
  }
  console.log("Verifying password"); // Debugging
  return await compare(password, hashedPassword);
}

export async function createToken(payload: any): Promise<string> {
  if (!payload || Object.keys(payload).length === 0) {
    console.error("Payload is empty or invalid:", payload);
    throw new Error("Payload is empty or invalid");
  }
  console.log("Creating token with payload:", payload); // Debugging
  try {
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h")
      .sign(secret);
    console.log("Generated token:", token); // Debugging
    return token;
  } catch (error: any) {
    console.error("Error creating token:", error.message);
    throw new Error(`Failed to create token: ${error.message}`);
  }
}

export async function verifyToken(token: string): Promise<any> {
  if (!token) {
    console.error("No token provided to verifyToken");
    return null;
  }
  try {
    console.log("Verifying token:", token); // Debugging
    const verified = await jwtVerify(token, secret);
    console.log("Verified payload:", verified.payload); // Debugging
    return verified.payload;
  } catch (error: any) {
    console.error("Token verification error:", error.message); // Detailed error logging
    return null;
  }
}

export async function getSession(): Promise<any> {
  const token = cookies().get("token")?.value;
  console.log("Retrieved token in getSession:", token); // Debugging
  if (!token) {
    console.log("No token found in cookies");
    return null;
  }
  const payload = await verifyToken(token);
  console.log("getSession payload:", payload); // Debugging
  return payload;
}
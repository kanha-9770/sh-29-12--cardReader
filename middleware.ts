// import { NextResponse } from "next/server";
// import { jwtVerify, type JWTPayload } from "jose";
// import type { NextRequest } from "next/server";

// export async function middleware(req: NextRequest) {
//   const pathname = req.nextUrl.pathname;
//   const token = req.cookies.get("token")?.value; // Use cookies instead of Authorization header

//   // If the user is trying to access the signup page
//   if (pathname.startsWith("/signup")) {
//     if (!token) {
//       // If no token is present, redirect to unauthorized page
//       return NextResponse.redirect(new URL("/unauthorized", req.url));
//     }

//     try {
//       // Verify the token
//       const { payload } = await jwtVerify(
//         token,
//         new TextEncoder().encode(process.env.JWT_SECRET!)
//       );

//       // Check if the user is an admin.  Explicitly check for true.
//       const isAdmin = (payload as JWTPayload & { isAdmin?: boolean }).isAdmin === true;

//       if (!isAdmin) {
//         // If the user is not an admin, redirect to unauthorized page
//         return NextResponse.redirect(new URL("/unauthorized", req.url));
//       }

//       // If the user is an admin, allow access to the signup page
//       return NextResponse.next();

//     } catch (error) {
//       // If the token is invalid, redirect to unauthorized page
//       console.error("JWT Verification Error:", error);
//       return NextResponse.redirect(new URL("/unauthorized", req.url));
//     }
//   }

//   // For other routes, allow access
//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/signup"],
// };


import { NextResponse } from "next/server";
import { jwtVerify, type JWTPayload } from "jose";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const token = req.cookies.get("token")?.value; // Use cookies instead of Authorization header

  // If the user is trying to access the signup page
  if (pathname.startsWith("/signup")) {
    // Commented out authentication/authorization logic to allow unrestricted access
    /*
    if (!token) {
      // If no token is present, redirect to unauthorized page
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    try {
      // Verify the token
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET!)
      );

      // Check if the user is an admin. Explicitly check for true.
      const isAdmin = (payload as JWTPayload & { isAdmin?: boolean }).isAdmin === true;

      if (!isAdmin) {
        // If the user is not an admin, redirect to unauthorized page
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }

      // If the user is an admin, allow access to the signup page
      return NextResponse.next();

    } catch (error) {
      // If the token is invalid, redirect to unauthorized page
      console.error("JWT Verification Error:", error);
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
    */
    // Allow access to signup page without restrictions
    return NextResponse.next();
  }

  // For other routes, allow access
  return NextResponse.next();
}

export const config = {
  matcher: ["/signup"],
};
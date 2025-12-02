// // /api/auth/forgot-password/route.ts
// export const dynamic = "force-dynamic";

// import { prisma } from "@/lib/prisma";
// import { transporter } from "@/lib/mail";
// import { NextResponse } from "next/server";
// import crypto from "crypto";

// export async function POST(req: Request) {
//   try {
//     const { email } = await req.json();

//     const user = await prisma.user.findUnique({
//       where: { email },
//       select: { name: true }, // only fetch name for personalization
//     });

//     // Always return the same message (security – no email enumeration)
//     const genericResponse = {
//       message:
//         "If your email is registered, you'll receive a reset link shortly.",
//     };

//     if (!user) {
//       return NextResponse.json(genericResponse, { status: 200 });
//     }

//     const token = crypto.randomBytes(32).toString("hex");

//     await prisma.user.update({
//       where: { email },
//       data: {
//         resetToken: token,
//         resetTokenExpiry: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
//       },
//     });

//     const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
//     const firstName = user.name?.split(" ")[0] || "there";

//     await transporter.sendMail({
//       from: `"CardSync" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: "🔑 Reset Your Password",
//       html: `
// <!DOCTYPE html>
// <html>
// <head>
//   <meta charset="utf-8">
//   <meta name="viewport" content="width=device-width,initial-scale=1">
//   <title>Reset Your Password</title>
// </head>
// <body style="margin:0; padding:0; background:#f8f9fc; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
//   <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f8f9fc; padding:40px 0;">
//     <tr>
//       <td align="center">
//         <!-- Main Card -->
//         <table width="100%" style="max-width:600px; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 10px 40px rgba(0,0,0,0.08);">

//           <!-- Gradient Header (pure CSS, no image) -->
//           <tr>
//             <td style="background:linear-gradient(135deg, #483d73 0%, #6b5b95 100%); height:140px; position:relative;">
//               <div style="position:absolute; bottom:20px; left:0; right:0; text-align:center;">
//                 <h1 style="color:#ffffff; font-size:32px; font-weight:700; margin:0; letter-spacing:-0.5px;">
//                   CardSync
//                 </h1>
//               </div>
//             </td>
//           </tr>

//           <!-- Content -->
//           <tr>
//             <td style="padding:50px 40px; text-align:center;">
//               <h2 style="font-size:28px; color:#1f2937; margin:0 0 16px; font-weight:700;">
//                 Hey ${firstName}!
//               </h2>

//               <p style="font-size:17px; color:#4b5563; line-height:1.7; margin:0 0 32px;">
//                 We received a request to reset your password.<br>
//                 Don’t worry — it happens to everyone!
//               </p>

//               <!-- Big Purple Button -->
//               <a href="${resetLink}"
//                  style="display:inline-block; background:#483d73; color:#ffffff; font-size:18px; font-weight:600;
//                         padding:18px 48px; border-radius:12px; text-decoration:none;
//                         box-shadow:0 10px 25px rgba(72,61,115,0.4);">
//                 Reset Password
//               </a>
//               </p>

//               <div style="margin:40px 0 0; padding-top:32px; border-top:1px solid #e2e8f0;">
//                 <p style="color:#94a3b8; font-size:14px; margin:0; line-height:1.6;">
//                   This link expires in <strong>15 minutes</strong> for your security.<br>
//                   Not you? No action needed — your account remains safe.
//                 </p>
//               </div>
//             </td>
//           </tr>

//           <!-- Footer -->
//           <tr>
//             <td style="background:#e5e2f0; padding:40px 30px; text-align:center;">
//               <p style="color:#64748b; font-size:14px; margin:0;">
//                 Thanks for being part of the CardSync family!
//               </p>
//               <p style="color:#94a3b8; font-size:13px; margin:20px 0 0;">
//                 Need help? Just reply to this email — we’re here 24/7.<br>
//                 © ${new Date().getFullYear()} CardSync. All rights reserved.
//               </p>
//             </td>
//           </tr>
//         </table>

//         <!-- Subtle bottom accent -->
//         <div style="margin-top:30px; font-size:12px; color:#94a3b8;">

//         </div>
//       </td>
//     </tr>
//   </table>
// </body>
// </html>`,
//     });

//     return NextResponse.json(genericResponse, { status: 200 });
//   } catch (err) {
//     console.error("FORGOT PASSWORD ERROR:", err);
//     return NextResponse.json(
//       { message: "Something went wrong. Please try again later." },
//       { status: 500 }
//     );
//   }
// }

// app/api/auth/forgot-password/route.ts
export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { transporter } from "@/lib/mail";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, message: "Valid email is required." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: { id: true, name: true },
    });

    // CASE 1: No user found → Tell frontend (safe, no enumeration)
    if (!user) {
      return NextResponse.json(
        {
          success: true,
          userExists: false,
          message: "No account found with that email.",
        },
        { status: 200 }
      );
    }

    // CASE 2: User exists → Send reset email
    const token = crypto.randomBytes(32).toString("hex");

    await prisma.user.update({
      where: { email: email.toLowerCase().trim() },
      data: {
        resetToken: token,
        resetTokenExpiry: new Date(Date.now() + 15 * 60 * 1000), // 15 mins
      },
    });

    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
    const firstName = user.name?.split(" ")[0] || "there";

    await transporter.sendMail({
      from: `"CardSync" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset Your Password",
       html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Reset Your Password</title>
</head>
<body style="margin:0; padding:0; background:#f8f9fc; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f8f9fc; padding:40px 0;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table width="100%" style="max-width:600px; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 10px 40px rgba(0,0,0,0.08);">

          <!-- Gradient Header (pure CSS, no image) -->
          <tr>
            <td style="background:linear-gradient(135deg, #483d73 0%, #6b5b95 100%); height:140px; position:relative;">
              <div style="position:absolute; bottom:20px; left:0; right:0; text-align:center;">
                <h1 style="color:#ffffff; font-size:32px; font-weight:700; margin:0; letter-spacing:-0.5px;">
                  CardSync
                </h1>
              </div>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:50px 40px; text-align:center;">
              <h2 style="font-size:28px; color:#1f2937; margin:0 0 16px; font-weight:700;">
                Hey ${firstName}!
              </h2>

              <p style="font-size:17px; color:#4b5563; line-height:1.7; margin:0 0 32px;">
                We received a request to reset your password.<br>
                Don’t worry — it happens to everyone!
              </p>

              <!-- Big Purple Button -->
              <a href="${resetLink}"
                 style="display:inline-block; background:#483d73; color:#ffffff; font-size:18px; font-weight:600;
                        padding:18px 48px; border-radius:12px; text-decoration:none;
                        box-shadow:0 10px 25px rgba(72,61,115,0.4);">
                Reset Password
              </a>
              </p>

              <div style="margin:40px 0 0; padding-top:32px; border-top:1px solid #e2e8f0;">
                <p style="color:#94a3b8; font-size:14px; margin:0; line-height:1.6;">
                  This link expires in <strong>15 minutes</strong> for your security.<br>
                  Not you? No action needed — your account remains safe.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#e5e2f0; padding:40px 30px; text-align:center;">
              <p style="color:#64748b; font-size:14px; margin:0;">
                Thanks for being part of the CardSync family!
              </p>
              <p style="color:#94a3b8; font-size:13px; margin:20px 0 0;">
                Need help? Just reply to this email — we’re here 24/7.<br>
                © ${new Date().getFullYear()} CardSync. All rights reserved.
              </p>
            </td>
          </tr>
        </table>

        <!-- Subtle bottom accent -->
        <div style="margin-top:30px; font-size:12px; color:#94a3b8;">

        </div>
      </td>
    </tr>
  </table>
</body>
</html>`,
    });

    return NextResponse.json(
      {
        success: true,
        userExists: true,
        message: "Reset link sent to your email.",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

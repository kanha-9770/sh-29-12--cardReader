// This route is for verifying the OTP on the Sign UP  

import { transporter } from "./mail";

export async function sendOTP(email: string, otp: string) {
  try {
    await transporter.sendMail({
      from: `"Your App Name" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your verification code",
      text: `Your verification code is ${otp}. It expires in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 2rem; background: #f9fafb; border-radius: 12px; text-align: center;">
          <h2 style="color: #1f2937;">Verify your email</h2>
          <p style="font-size: 16px; color: #4b5563; margin: 1.5rem 0;">
            Here is your 6-digit verification code:
          </p>
          <div style="font-size: 36px; font-weight: bold; letter-spacing: 12px; color: #483d73; background: white; padding: 1rem; border-radius: 8px; display: inline-block;">
            ${otp}
          </div>
          <p style="color: #6b7280; margin-top: 1.5rem;">
            This code expires in <strong>10 minutes</strong>.
          </p>
        </div>
      `,
    });

    console.log("OTP email successfully sent to:", email);
  } catch (error) {
    console.error("Failed to send OTP email:", error);
    throw new Error("Failed to send verification email");
  }
}
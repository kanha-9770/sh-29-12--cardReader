export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const rawBody = await req.text();
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET!;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-09-30.clover",
  });

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig!, secret);
  } catch (err: any) {
    console.log("❌ Signature verification failed");
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  console.log("📌 Event:", event.type);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Only process if payment succeeded
    if (session.payment_status !== "paid") {
      console.log("⚠️ Payment not completed");
      return NextResponse.json({ received: true });
    }

    let { userId, plan } = session.metadata;

    if (!userId || !plan) {
      console.log("❌ Missing metadata in session");
      // Optional: Add more logging here, e.g., console.log("Session metadata:", session.metadata);
      return NextResponse.json({ received: true });
    }

    // Plan limits
    let limit = 15;
    const lower = plan.toLowerCase();
    if (lower === "starter") limit = 500;
    if (lower === "professional" || lower === "pro") limit = 2000;
    if (lower === "enterprise") limit = 9999999;

    await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionPlan: plan,
        formLimit: limit,
      },
    });

    console.log(`✅ Updated user ${userId} => ${plan}`);
  }

  return NextResponse.json({ received: true });
}
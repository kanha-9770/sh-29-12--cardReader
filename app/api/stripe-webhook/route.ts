// app/api/stripe-webhook/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  console.log("🚨 Stripe webhook triggered");

  const rawBody = await req.text();
  const sig = req.headers.get("stripe-signature");
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!endpointSecret) {
    console.log("❌ Missing STRIPE_WEBHOOK_SECRET env variable");
    return NextResponse.json({ error: "Missing webhook secret" }, { status: 500 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig!, endpointSecret);
    console.log("✅ Webhook signature verified");
  } catch (err: any) {
    console.log("❌ Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  console.log("📌 Event type:", event.type);

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      console.log("🧾 Session object received:", {
        id: session.id,
        amount_total: session.amount_total,
      });

      console.log("📎 Metadata received:", session.metadata);

      const userId = session.metadata?.userId;
      const plan = session.metadata?.plan;

      if (!userId || !plan) {
        console.log("❌ Missing metadata:", session.metadata);
      } else {
        console.log(`⚙️ Mapping plan for user ${userId} -> ${plan}`);

        let limit = 15;
        const lower = plan.toLowerCase();

        if (lower === "starter") limit = 500;
        if (lower === "professional" || lower === "pro") limit = 2000;
        if (lower === "enterprise") limit = 9999999;

        console.log(`📈 Calculated limit: ${limit}`);

        const updateResult = await prisma.user.update({
          where: { id: userId },
          data: {
            subscriptionPlan: plan,
            formLimit: limit,
          },
        });

        console.log("✅ Prisma update result:", updateResult);
        console.log(
          `🎉 Successfully updated user ${userId} to plan "${plan}" with limit ${limit}`
        );
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.log("💥 Webhook handler crashed:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

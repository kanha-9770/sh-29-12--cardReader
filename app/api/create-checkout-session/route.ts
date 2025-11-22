import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getSession } from "@/lib/auth";

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://cardsync-hazel.vercel.app";

if (!stripeSecret) {
  console.error("❌ STRIPE_SECRET_KEY missing in .env.local");
}

const stripe = new Stripe(stripeSecret!, {
  apiVersion: "2025-09-30.clover",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("✅ Received body:", body);

    const { planName, price } = body;

    if (!planName || !price) {
      return NextResponse.json(
        { error: "Missing plan data" },
        { status: 400 }
      );
    }

    const sessionData = await getSession();

    if (!sessionData?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

// In the session creation:
const session = await stripe.checkout.sessions.create({
  mode: "payment",
  customer_email: sessionData.email,
  payment_method_types: ["card"],

  line_items: [
    {
      price_data: {
        currency: "usd",
        product_data: {
          name: planName,
          description: `Access to ${planName} features`,
          images: ["https://yourapp.com/logo.png"],
        },
        unit_amount: price * 100,
      },
      quantity: 1,
    },
  ],

  // Metadata only on session (for webhook use)
  metadata: {
    userId: sessionData.id,
    plan: planName,
  },

  // Remove payment_intent_data entirely (not needed anymore)

  success_url: `${appUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`, // Use placeholder here for query param
  cancel_url: `${appUrl}/pricing`,
});

    console.log("✅ Stripe session created:", session.url);
    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("❌ Stripe Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

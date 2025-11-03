// import { NextResponse } from "next/server";
// import Stripe from "stripe";

// const stripeSecret = process.env.STRIPE_SECRET_KEY;
// const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// if (!stripeSecret) {
//   console.error("❌ STRIPE_SECRET_KEY missing in .env.local");
// }

// const stripe = new Stripe(stripeSecret!, {
//   apiVersion: "2025-09-30.clover",
// });

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     console.log("✅ Received body:", body);

//     const { planName, price } = body;

//     if (!planName || !price) {
//       console.error("❌ Missing planName or price");
//       return NextResponse.json(
//         { error: "Missing plan data" },
//         { status: 400 }
//       );
//     }

//     const session = await stripe.checkout.sessions.create({
//       mode: "payment",
//       payment_method_types: ["card"],
//       line_items: [
//         {
//           price_data: {
//             currency: "usd",
//             product_data: {
//               name: planName,
//               description: `Access to ${planName} features`,
//               images: ["https://yourapp.com/logo.png"], // Replace with your logo URL
//             },
//             unit_amount: price * 100,
//           },
//           quantity: 1,
//         },
//       ],
//       success_url: `${appUrl}/payment-success`,
//       cancel_url: `${appUrl}/pricing`,
//       custom_text: {
//         submit: {
//           message: "We’re securing your payment... 💳",
//         },
//       },
//       metadata: { plan: planName },
//     });

//     console.log("✅ Stripe session created successfully:", session.url);
//     return NextResponse.json({ url: session.url });
//   } catch (err: any) {
//     console.error("❌ Stripe Error:", err);
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }

// app/api/create-checkout-session/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getSession } from "@/lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover",
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function POST(req: Request) {
  console.log("➡️  /api/create-checkout-session called");

  try {
    const body = await req.json();
    const { planName, price } = body;

    console.log("📦 Received checkout payload:", body);

    const session = await getSession();
    console.log("👤 User session:", session);

    if (!session?.id) {
      console.log("❌ Not authenticated");
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: planName,
            },
            unit_amount: Math.round(price * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/payment-success`,
      cancel_url: `${appUrl}/pricing`,
      metadata: {
        plan: planName,
        userId: session.id, // ✅ IMPORTANT
      },
    });

    console.log("✅ Stripe checkout session successfully created:", checkoutSession.id);
    console.log("🧾 Metadata attached:", checkoutSession.metadata);

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err: any) {
    console.log("❌ Checkout session error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

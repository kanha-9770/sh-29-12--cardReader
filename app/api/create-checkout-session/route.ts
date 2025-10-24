// import { NextResponse } from "next/server";
// import Stripe from "stripe";

// const stripeSecret = process.env.STRIPE_SECRET_KEY;
// const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// if (!stripeSecret) {
//   console.error("❌ STRIPE_SECRET_KEY missing in .env.local");
// }

// const stripe = new Stripe(stripeSecret!, { apiVersion: "2024-06-20" });

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     console.log("✅ Received body:", body);

//     const { planName, price } = body;

//     if (!planName || !price) {
//       console.error("❌ Missing planName or price");
//       return NextResponse.json({ error: "Missing plan data" }, { status: 400 });
//     }

//     // ✅ Create Stripe Checkout session
//     const session = await stripe.checkout.sessions.create({
//       mode: "payment",
//       payment_method_types: ["card"],
//       line_items: [
//         {
//           price_data: {
//             currency: "usd",
//             product_data: { name: planName },
//             unit_amount: price * 100, // convert dollars to cents
//           },
//           quantity: 1,
//         },
//       ],
//       success_url: `${appUrl}/payment-success`,
//       cancel_url: `${appUrl}/pricing`,
//     });

//     console.log("✅ Stripe session created:", session.url);
//     return NextResponse.json({ url: session.url });
//   } catch (err: any) {
//     console.error("❌ Stripe Error:", err.message);
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }


  import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

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
      console.error("❌ Missing planName or price");
      return NextResponse.json(
        { error: "Missing plan data" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: planName,
              description: `Access to ${planName} features`,
              images: ["https://yourapp.com/logo.png"], // Replace with your logo URL
            },
            unit_amount: price * 100,
          },
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/payment-success`,
      cancel_url: `${appUrl}/pricing`,
      custom_text: {
        submit: {
          message: "We’re securing your payment... 💳",
        },
      },
      metadata: { plan: planName },
    });

    console.log("✅ Stripe session created successfully:", session.url);
    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("❌ Stripe Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// import { NextResponse } from "next/server";
// import Stripe from "stripe";
// import { prisma } from "@/lib/prisma";


// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
// apiVersion: "2025-09-30.clover",
// });


// export async function POST(req: Request) {
// const textBody = await req.text();
// const sig = req.headers.get("stripe-signature") || "";
// const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;


// if (!endpointSecret) {
// console.error("❌ Missing STRIPE_WEBHOOK_SECRET");
// return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
// }



// let event: Stripe.Event;


// try {
// event = stripe.webhooks.constructEvent(textBody, sig, endpointSecret);
// } catch (err: any) {
// console.error("Webhook signature verification failed:", err.message);
// return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
// }


// try {
// // Handle the checkout.session.completed event
// if (event.type === "checkout.session.completed") {
// const session = event.data.object as Stripe.Checkout.Session;


// const plan = session.metadata?.plan as string | undefined;
// const userId = session.metadata?.userId as string | undefined;


// if (!userId || !plan) {
// console.warn("Webhook missing metadata: plan or userId");
// } else {
// // Map plan name to a numeric form limit
// let limit = 15; // default for FREE
// const normalized = plan?.toLowerCase();


// if (normalized === "starter") limit = 500;
// if (normalized === "professional" || normalized === "pro") limit = 2000;
// if (normalized === "enterprise") limit = 9999999; // practically unlimited


// await prisma.user.update({
// where: { id: userId },
// data: {
// subscriptionPlan: plan,
// formLimit: limit,
// },
// });


// console.log(`✅ Updated user ${userId} to plan ${plan} with limit ${limit}`);
// }
// }


// // respond 200 to acknowledge receipt
// return NextResponse.json({ received: true });
// } catch (err: any) {
// console.error("Webhook handler error:", err);
// return NextResponse.json({ error: (err && err.message) || String(err) }, { status: 500 });
// }
// }

// app/api/stripe-webhook/route.ts
// import { NextResponse } from "next/server";
// import Stripe from "stripe";
// import { prisma } from "@/lib/prisma";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2025-09-30.clover",
// });

// export async function POST(req: Request) {
//   const rawBody = await req.text();
//   const sig = req.headers.get("stripe-signature") || "";
//   const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

//   if (!endpointSecret) {
//     console.error("❌ Missing STRIPE_WEBHOOK_SECRET");
//     return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
//   }

//   let event: Stripe.Event;
//   try {
//     event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
//   } catch (err: any) {
//     console.error("Webhook signature verification failed:", err?.message || err);
//     return NextResponse.json({ error: `Webhook Error: ${err?.message || err}` }, { status: 400 });
//   }

//   try {
//     console.log("✅ Webhook received:", event.type);

//     if (event.type === "checkout.session.completed") {
//       const session = event.data.object as Stripe.Checkout.Session;
//       console.log("Webhook metadata:", session.metadata);

//       const plan = session.metadata?.plan as string | undefined;
//       const userId = session.metadata?.userId as string | undefined;

//       if (!userId || !plan) {
//         console.warn("Webhook missing metadata: plan or userId", session.metadata);
//       } else {
//         // map plan -> limit
//         const normalized = plan.toLowerCase();
//         let limit = 15; // default FREE
//         if (normalized === "starter") limit = 500;
//         if (normalized === "professional" || normalized === "pro") limit = 2000;
//         if (normalized === "enterprise") limit = 9999999; // practically unlimited

//         // update DB
//         await prisma.user.update({
//           where: { id: userId },
//           data: {
//             subscriptionPlan: plan,
//             formLimit: limit,
//           },
//         });

//         console.log(`✅ Updated user ${userId} -> plan ${plan}, formLimit ${limit}`);
//       }
//     }

//     return NextResponse.json({ received: true });
//   } catch (err: any) {
//     console.error("Webhook handler error:", err);
//     return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
//   }
// }


// app/api/stripe-webhook/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover",
});

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

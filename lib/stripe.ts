import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("❌ Missing STRIPE_SECRET_KEY in .env.local");
}

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2025-09-30.clover",
});

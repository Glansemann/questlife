import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-02-25.clover",
    });
  }
  return _stripe;
}

export const PLANS = {
  pro: {
    name: "QuestLife Pro",
    price: 500, // $5.00 in cents
    currency: "usd",
    interval: "month" as const,
    features: [
      "Unlimited AI-generated quests",
      "Detailed analytics & insights",
      "Custom quest creation",
      "Guild challenges",
      "No ads",
      "Priority support",
    ],
  },
};

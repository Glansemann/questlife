import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      console.log("New subscriber:", session.customer_email);
      // TODO: update user's pro status in database
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      console.log("Subscription cancelled:", subscription.id);
      // TODO: revoke pro status
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}

import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    const session = await getStripe().checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: email || undefined,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "QuestLife Pro",
              description: "Unlimited quests, analytics, guild challenges, and more.",
            },
            unit_amount: 500,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://questlife.app"}/play?upgraded=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://questlife.app"}/play/profile`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}

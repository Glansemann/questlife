import { NextResponse } from "next/server";
import { generateDailyQuests } from "@/lib/quest-generator";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { goals, completedQuests, currentLevel } = body;

    const dayOfWeek = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(new Date());

    const quests = await generateDailyQuests(
      goals ?? [],
      completedQuests ?? [],
      currentLevel ?? 1,
      dayOfWeek,
    );

    return NextResponse.json({ quests });
  } catch (error) {
    console.error("Quest generation failed:", error);
    return NextResponse.json(
      { error: "Failed to generate quests" },
      { status: 500 },
    );
  }
}

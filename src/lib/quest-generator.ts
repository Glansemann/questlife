import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

interface Goal {
  title: string;
  category: string;
  description: string | null;
}

interface QuestSuggestion {
  title: string;
  description: string;
  category: string;
  difficulty: "easy" | "normal" | "hard" | "epic";
  statType: "strength" | "knowledge" | "creativity" | "social" | "endurance";
  baseXp: number;
}

export async function generateDailyQuests(
  goals: Goal[],
  completedQuests: string[],
  currentLevel: number,
  dayOfWeek: string,
): Promise<QuestSuggestion[]> {
  const goalsText = goals.map((g) => `- ${g.title} (${g.category}): ${g.description ?? "no details"}`).join("\n");

  const recentText =
    completedQuests.length > 0
      ? `Recently completed: ${completedQuests.slice(0, 10).join(", ")}`
      : "No quests completed yet — start easy.";

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `You are a quest generator for a life RPG app called QuestLife. Generate 5 daily quests for today (${dayOfWeek}).

User level: ${currentLevel}
User goals:
${goalsText}

${recentText}

Rules:
- Mix difficulties: 2 easy, 2 normal, 1 hard
- Each quest should be specific and completable today
- Vary stat types across quests
- Make quests fun and motivating, not generic
- Base XP: easy=30, normal=50, hard=100, epic=200

Respond ONLY with a JSON array of objects with these fields:
title, description, category, difficulty, statType, baseXp

No markdown, no explanation. Just the JSON array.`,
      },
    ],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";
  return JSON.parse(text) as QuestSuggestion[];
}

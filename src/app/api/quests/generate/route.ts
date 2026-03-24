import { NextResponse } from "next/server";

const QUEST_TEMPLATES: Record<string, Array<{ title: string; description: string; statType: string }>> = {
  fitness: [
    { title: "Morning stretch", description: "Do a 10-minute stretch routine", statType: "endurance" },
    { title: "30-min workout", description: "Complete any 30-minute workout", statType: "strength" },
    { title: "Walk 5000 steps", description: "Get moving — walk at least 5000 steps today", statType: "endurance" },
    { title: "Try a new exercise", description: "Do an exercise you've never tried before", statType: "strength" },
    { title: "Plank challenge", description: "Hold a plank for as long as you can, beat your record", statType: "strength" },
    { title: "Evening run", description: "Go for a 20+ minute run", statType: "endurance" },
  ],
  learning: [
    { title: "Read for 20 minutes", description: "Read a book or long article uninterrupted", statType: "knowledge" },
    { title: "Watch a tutorial", description: "Learn something new from a video tutorial", statType: "knowledge" },
    { title: "Practice a skill", description: "Spend 30 minutes practicing a skill you're developing", statType: "knowledge" },
    { title: "Take notes", description: "Summarize what you learned today in your own words", statType: "knowledge" },
    { title: "Teach someone", description: "Explain something you know to another person", statType: "social" },
  ],
  finance: [
    { title: "Track expenses", description: "Log all your spending for today", statType: "knowledge" },
    { title: "No-spend hour", description: "Go 4 hours without buying anything non-essential", statType: "endurance" },
    { title: "Review subscriptions", description: "Check your subscriptions — cancel one you don't use", statType: "knowledge" },
    { title: "Save something", description: "Move any amount to your savings", statType: "endurance" },
    { title: "Compare prices", description: "Before your next purchase, compare at least 3 alternatives", statType: "knowledge" },
  ],
  health: [
    { title: "Meditate 5 minutes", description: "Sit quietly and focus on your breathing for 5 minutes", statType: "endurance" },
    { title: "Screen-free hour", description: "Spend one hour without any screens", statType: "endurance" },
    { title: "Sleep by 23:00", description: "Be in bed with lights off by 11 PM", statType: "endurance" },
    { title: "Gratitude journal", description: "Write down 3 things you're grateful for today", statType: "creativity" },
    { title: "Deep breathing", description: "Do 10 rounds of box breathing (4-4-4-4)", statType: "endurance" },
    { title: "Drink 8 glasses of water", description: "Stay hydrated throughout the day", statType: "endurance" },
  ],
  creativity: [
    { title: "Sketch something", description: "Draw anything — doesn't have to be good", statType: "creativity" },
    { title: "Write 200 words", description: "Write anything: story, journal, poem, ideas", statType: "creativity" },
    { title: "Take 5 photos", description: "Photograph 5 interesting things around you", statType: "creativity" },
    { title: "Listen to new music", description: "Discover and listen to an album you've never heard", statType: "creativity" },
    { title: "Build something", description: "Create something with your hands — craft, cook, assemble", statType: "creativity" },
  ],
  social: [
    { title: "Message an old friend", description: "Reach out to someone you haven't spoken to recently", statType: "social" },
    { title: "Give a compliment", description: "Give a genuine compliment to someone today", statType: "social" },
    { title: "Have a real conversation", description: "Talk to someone face-to-face for 15+ minutes, no phones", statType: "social" },
    { title: "Help someone", description: "Do something helpful for another person", statType: "social" },
    { title: "Plan a meetup", description: "Organize a get-together with friends or colleagues", statType: "social" },
  ],
  career: [
    { title: "Update your portfolio", description: "Add or improve one item in your portfolio or CV", statType: "knowledge" },
    { title: "Network outreach", description: "Connect with one new person in your industry", statType: "social" },
    { title: "Deep work block", description: "Do 90 minutes of focused, uninterrupted work", statType: "knowledge" },
    { title: "Learn a tool", description: "Spend 20 minutes learning a tool that could improve your work", statType: "knowledge" },
    { title: "Inbox zero", description: "Process all unread emails — reply, archive, or delete", statType: "endurance" },
  ],
  reading: [
    { title: "Read 20 pages", description: "Read at least 20 pages of a book", statType: "knowledge" },
    { title: "Read before bed", description: "Replace screen time with reading before sleep", statType: "knowledge" },
    { title: "Summarize a chapter", description: "Write a brief summary of what you just read", statType: "knowledge" },
    { title: "Start a new book", description: "Pick up a book you've been meaning to read", statType: "knowledge" },
  ],
  nutrition: [
    { title: "Cook a meal from scratch", description: "Make a meal using whole ingredients, no pre-made", statType: "creativity" },
    { title: "Eat a vegetable", description: "Include at least one serving of vegetables in every meal", statType: "endurance" },
    { title: "Meal prep", description: "Prepare at least one meal in advance for tomorrow", statType: "endurance" },
    { title: "Try a new food", description: "Eat something you've never tried before", statType: "creativity" },
    { title: "No sugar today", description: "Avoid added sugar for the entire day", statType: "endurance" },
  ],
  language: [
    { title: "Learn 10 new words", description: "Study and memorize 10 new vocabulary words", statType: "knowledge" },
    { title: "Practice speaking", description: "Speak your target language for 10 minutes", statType: "social" },
    { title: "Watch without subtitles", description: "Watch a short video in your target language", statType: "knowledge" },
    { title: "Write a paragraph", description: "Write a short paragraph in your target language", statType: "creativity" },
  ],
};

const DIFFICULTIES: Array<{ level: string; weight: number }> = [
  { level: "easy", weight: 2 },
  { level: "easy", weight: 2 },
  { level: "normal", weight: 3 },
  { level: "normal", weight: 3 },
  { level: "hard", weight: 1 },
];

const BASE_XP: Record<string, number> = { easy: 30, normal: 50, hard: 100, epic: 200 };

function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function generateQuests(goals: string[]) {
  const pool: Array<{ title: string; description: string; statType: string; category: string }> = [];

  for (const goal of goals) {
    const templates = QUEST_TEMPLATES[goal];
    if (templates) {
      pool.push(...templates.map((t) => ({ ...t, category: goal })));
    }
  }

  // If no matching goals, use a mix of everything
  if (pool.length === 0) {
    for (const [cat, templates] of Object.entries(QUEST_TEMPLATES)) {
      pool.push(...templates.map((t) => ({ ...t, category: cat })));
    }
  }

  const selected = pickRandom(pool, 5);

  return selected.map((quest, i) => {
    const difficulty = DIFFICULTIES[i].level;
    return {
      id: `q-${Date.now()}-${i}`,
      title: quest.title,
      description: quest.description,
      category: quest.category,
      difficulty,
      statType: quest.statType,
      xpReward: BASE_XP[difficulty],
      status: "active",
    };
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { goals } = body;
    const quests = generateQuests(goals ?? []);
    return NextResponse.json({ quests });
  } catch {
    return NextResponse.json({ error: "Failed to generate quests" }, { status: 500 });
  }
}

// Also support GET for easy testing
export async function GET() {
  const quests = generateQuests(["fitness", "learning", "health"]);
  return NextResponse.json({ quests });
}

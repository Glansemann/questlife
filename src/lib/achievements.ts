export interface AchievementDef {
  key: string;
  title: string;
  description: string;
  icon: string;
  check: (ctx: AchievementContext) => boolean;
}

export interface AchievementContext {
  totalQuestsCompleted: number;
  currentStreak: number;
  longestStreak: number;
  level: number;
  totalXp: number;
  stats: {
    strength: number;
    knowledge: number;
    creativity: number;
    social: number;
    endurance: number;
  };
  questsCompletedToday: number;
  hardQuestsCompleted: number;
  epicQuestsCompleted: number;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    key: "first_quest",
    title: "First Steps",
    description: "Complete your first quest",
    icon: "\u{1F476}",
    check: (ctx) => ctx.totalQuestsCompleted >= 1,
  },
  {
    key: "ten_quests",
    title: "Adventurer",
    description: "Complete 10 quests",
    icon: "\u{1F5E1}\uFE0F",
    check: (ctx) => ctx.totalQuestsCompleted >= 10,
  },
  {
    key: "fifty_quests",
    title: "Veteran",
    description: "Complete 50 quests",
    icon: "\u{1F6E1}\uFE0F",
    check: (ctx) => ctx.totalQuestsCompleted >= 50,
  },
  {
    key: "hundred_quests",
    title: "Legend",
    description: "Complete 100 quests",
    icon: "\u{1F451}",
    check: (ctx) => ctx.totalQuestsCompleted >= 100,
  },
  {
    key: "streak_3",
    title: "Consistent",
    description: "Maintain a 3-day streak",
    icon: "\u{1F525}",
    check: (ctx) => ctx.currentStreak >= 3,
  },
  {
    key: "streak_7",
    title: "On Fire",
    description: "Maintain a 7-day streak",
    icon: "\u{1F525}\u{1F525}",
    check: (ctx) => ctx.currentStreak >= 7,
  },
  {
    key: "streak_30",
    title: "Unstoppable",
    description: "Maintain a 30-day streak",
    icon: "\u{2604}\uFE0F",
    check: (ctx) => ctx.currentStreak >= 30,
  },
  {
    key: "streak_100",
    title: "Immortal",
    description: "Maintain a 100-day streak",
    icon: "\u{1F300}",
    check: (ctx) => ctx.currentStreak >= 100,
  },
  {
    key: "level_5",
    title: "Getting Serious",
    description: "Reach level 5",
    icon: "\u{2B50}",
    check: (ctx) => ctx.level >= 5,
  },
  {
    key: "level_10",
    title: "Double Digits",
    description: "Reach level 10",
    icon: "\u{1F31F}",
    check: (ctx) => ctx.level >= 10,
  },
  {
    key: "level_25",
    title: "Elite",
    description: "Reach level 25",
    icon: "\u{1F4AB}",
    check: (ctx) => ctx.level >= 25,
  },
  {
    key: "level_50",
    title: "Grandmaster",
    description: "Reach level 50",
    icon: "\u{1F48E}",
    check: (ctx) => ctx.level >= 50,
  },
  {
    key: "perfect_day",
    title: "Perfect Day",
    description: "Complete all daily quests in one day",
    icon: "\u{1F3AF}",
    check: (ctx) => ctx.questsCompletedToday >= 5,
  },
  {
    key: "hard_5",
    title: "Challenge Seeker",
    description: "Complete 5 hard quests",
    icon: "\u{1F4AA}",
    check: (ctx) => ctx.hardQuestsCompleted >= 5,
  },
  {
    key: "epic_1",
    title: "Epic Victory",
    description: "Complete your first epic quest",
    icon: "\u{26A1}",
    check: (ctx) => ctx.epicQuestsCompleted >= 1,
  },
  {
    key: "balanced",
    title: "Well Rounded",
    description: "Get all stats to at least 10",
    icon: "\u{1F3AD}",
    check: (ctx) => {
      const { strength, knowledge, creativity, social, endurance } = ctx.stats;
      return [strength, knowledge, creativity, social, endurance].every((s) => s >= 10);
    },
  },
  {
    key: "specialist",
    title: "Specialist",
    description: "Get any single stat to 50",
    icon: "\u{1F52C}",
    check: (ctx) => {
      const { strength, knowledge, creativity, social, endurance } = ctx.stats;
      return [strength, knowledge, creativity, social, endurance].some((s) => s >= 50);
    },
  },
];

export function checkNewAchievements(
  ctx: AchievementContext,
  alreadyUnlocked: string[],
): AchievementDef[] {
  return ACHIEVEMENTS.filter(
    (a) => !alreadyUnlocked.includes(a.key) && a.check(ctx),
  );
}

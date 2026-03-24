// Client-side game state using localStorage (before we connect to DB)
// This lets users play immediately without auth

import { levelFromTotalXp, xpProgressInLevel, questXp } from "./xp";
import { calculateStreak, getToday } from "./streaks";
import { checkNewAchievements, type AchievementContext } from "./achievements";

export interface GameState {
  name: string;
  goals: string[];
  level: number;
  totalXp: number;
  stats: {
    strength: number;
    knowledge: number;
    creativity: number;
    social: number;
    endurance: number;
  };
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  totalQuestsCompleted: number;
  hardQuestsCompleted: number;
  epicQuestsCompleted: number;
  unlockedAchievements: string[];
  questsCompletedToday: number;
  lastQuestDate: string | null;
}

const STORAGE_KEY = "questlife_state";

const DEFAULT_STATE: GameState = {
  name: "Adventurer",
  goals: [],
  level: 1,
  totalXp: 0,
  stats: { strength: 0, knowledge: 0, creativity: 0, social: 0, endurance: 0 },
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: null,
  totalQuestsCompleted: 0,
  hardQuestsCompleted: 0,
  epicQuestsCompleted: 0,
  unlockedAchievements: [],
  questsCompletedToday: 0,
  lastQuestDate: null,
};

export function loadState(): GameState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveState(state: GameState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export interface QuestCompleteResult {
  xpGained: number;
  newLevel: number;
  leveledUp: boolean;
  newAchievements: { key: string; title: string; description: string; icon: string }[];
  streakUpdated: boolean;
}

export function completeQuest(
  state: GameState,
  quest: { difficulty: string; statType: string; xpReward: number },
): { newState: GameState; result: QuestCompleteResult } {
  const today = getToday();

  // Reset daily counter if new day
  const questsToday = state.lastQuestDate === today ? state.questsCompletedToday + 1 : 1;

  // Calculate XP
  const xpGained = questXp(quest.xpReward, quest.difficulty);
  const newTotalXp = state.totalXp + xpGained;
  const oldLevel = state.level;
  const newLevel = levelFromTotalXp(newTotalXp);

  // Update stats
  const statKey = quest.statType as keyof GameState["stats"];
  const statGain = quest.difficulty === "epic" ? 4 : quest.difficulty === "hard" ? 2 : 1;
  const newStats = {
    ...state.stats,
    [statKey]: (state.stats[statKey] ?? 0) + statGain,
  };

  // Streak
  const { newStreak } = calculateStreak(state.lastActiveDate, state.currentStreak);
  const longestStreak = Math.max(state.longestStreak, newStreak);

  // Difficulty counters
  const hardQuestsCompleted = state.hardQuestsCompleted + (quest.difficulty === "hard" ? 1 : 0);
  const epicQuestsCompleted = state.epicQuestsCompleted + (quest.difficulty === "epic" ? 1 : 0);
  const totalQuestsCompleted = state.totalQuestsCompleted + 1;

  // Check achievements
  const achievementCtx: AchievementContext = {
    totalQuestsCompleted,
    currentStreak: newStreak,
    longestStreak,
    level: newLevel,
    totalXp: newTotalXp,
    stats: newStats,
    questsCompletedToday: questsToday,
    hardQuestsCompleted,
    epicQuestsCompleted,
  };

  const newAchievements = checkNewAchievements(achievementCtx, state.unlockedAchievements);

  const newState: GameState = {
    ...state,
    totalXp: newTotalXp,
    level: newLevel,
    stats: newStats,
    currentStreak: newStreak,
    longestStreak,
    lastActiveDate: today,
    totalQuestsCompleted,
    hardQuestsCompleted,
    epicQuestsCompleted,
    unlockedAchievements: [
      ...state.unlockedAchievements,
      ...newAchievements.map((a) => a.key),
    ],
    questsCompletedToday: questsToday,
    lastQuestDate: today,
  };

  saveState(newState);

  return {
    newState,
    result: {
      xpGained,
      newLevel,
      leveledUp: newLevel > oldLevel,
      newAchievements,
      streakUpdated: newStreak !== state.currentStreak,
    },
  };
}

export function initFromOnboarding(): GameState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem("questlife_onboard");
    if (!raw) return DEFAULT_STATE;
    const { name, goals } = JSON.parse(raw);
    const state: GameState = { ...DEFAULT_STATE, name, goals };
    saveState(state);
    return state;
  } catch {
    return DEFAULT_STATE;
  }
}

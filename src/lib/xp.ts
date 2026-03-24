// XP curve: each level requires progressively more XP
// Level 1→2 = 100 XP, Level 2→3 = 150 XP, etc.
export function xpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.15, level - 1));
}

export function totalXpForLevel(level: number): number {
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += xpForLevel(i);
  }
  return total;
}

export function levelFromTotalXp(totalXp: number): number {
  let level = 1;
  let accumulated = 0;
  while (accumulated + xpForLevel(level) <= totalXp) {
    accumulated += xpForLevel(level);
    level++;
  }
  return level;
}

export function xpProgressInLevel(totalXp: number): { current: number; required: number; percentage: number } {
  const level = levelFromTotalXp(totalXp);
  const xpAtLevelStart = totalXpForLevel(level);
  const current = totalXp - xpAtLevelStart;
  const required = xpForLevel(level);
  return {
    current,
    required,
    percentage: Math.floor((current / required) * 100),
  };
}

export const DIFFICULTY_MULTIPLIER: Record<string, number> = {
  easy: 0.5,
  normal: 1,
  hard: 2,
  epic: 4,
};

export function questXp(baseXp: number, difficulty: string): number {
  return Math.floor(baseXp * (DIFFICULTY_MULTIPLIER[difficulty] ?? 1));
}

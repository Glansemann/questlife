function toDateStr(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function yesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return toDateStr(d);
}

function today(): string {
  return toDateStr(new Date());
}

export function calculateStreak(
  lastActiveDate: string | null,
  currentStreak: number,
): { newStreak: number; streakBroken: boolean } {
  const todayStr = today();

  // Already active today — no change
  if (lastActiveDate === todayStr) {
    return { newStreak: currentStreak, streakBroken: false };
  }

  // Active yesterday — extend streak
  if (lastActiveDate === yesterday()) {
    return { newStreak: currentStreak + 1, streakBroken: false };
  }

  // First time or streak broken — start fresh
  return { newStreak: 1, streakBroken: lastActiveDate !== null && currentStreak > 0 };
}

export function getToday(): string {
  return today();
}

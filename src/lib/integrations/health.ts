// Universal health data layer
// Apple Health (via HealthKit on iOS PWA) and Google Health Connect
// Both aggregate ALL wearable data: Garmin, Oura, Whoop, Fitbit, Apple Watch, Samsung, etc.

export interface HealthSnapshot {
  date: string;
  steps: number;
  activeMinutes: number;
  distanceKm: number;
  floorsClimbed: number;
  caloriesBurned: number;
  heartRateAvg: number;
  heartRateResting: number;
  heartRateMax: number;
  sleepHours: number;
  sleepScore: number | null;
  sleepDeepMinutes: number;
  sleepRemMinutes: number;
  bodyBattery: number | null;
  stressLevel: number | null;
  spo2: number | null;
  workouts: WorkoutEntry[];
  source: "apple_health" | "google_health" | "garmin" | "manual";
}

export interface WorkoutEntry {
  type: string;
  name: string;
  durationMinutes: number;
  distanceKm: number;
  calories: number;
  avgHeartRate: number;
  startTime: string;
}

// XP calculations from health data
export function calculateHealthXp(snapshot: HealthSnapshot): {
  totalXp: number;
  breakdown: Array<{ label: string; xp: number; value: string }>;
} {
  const breakdown: Array<{ label: string; xp: number; value: string }> = [];

  // Steps
  if (snapshot.steps > 0) {
    const xp = snapshot.steps >= 15000 ? 100 : snapshot.steps >= 10000 ? 70 : snapshot.steps >= 7500 ? 50 : snapshot.steps >= 5000 ? 30 : snapshot.steps >= 2000 ? 15 : 0;
    if (xp > 0) breakdown.push({ label: "Steps", xp, value: snapshot.steps.toLocaleString() });
  }

  // Active minutes
  if (snapshot.activeMinutes >= 15) {
    const xp = snapshot.activeMinutes >= 60 ? 60 : snapshot.activeMinutes >= 30 ? 40 : 20;
    breakdown.push({ label: "Active minutes", xp, value: `${snapshot.activeMinutes} min` });
  }

  // Sleep
  if (snapshot.sleepHours > 0) {
    const quality = snapshot.sleepScore ?? (snapshot.sleepHours >= 8 ? 85 : snapshot.sleepHours >= 7 ? 70 : 50);
    const xp = quality >= 85 ? 80 : quality >= 70 ? 50 : quality >= 50 ? 30 : 10;
    breakdown.push({ label: "Sleep", xp, value: `${snapshot.sleepHours.toFixed(1)}h` });
  }

  // Workouts
  for (const w of snapshot.workouts) {
    const xp = w.durationMinutes >= 60 ? 100 : w.durationMinutes >= 45 ? 80 : w.durationMinutes >= 30 ? 60 : w.durationMinutes >= 15 ? 30 : 15;
    breakdown.push({ label: w.name || w.type, xp, value: `${w.durationMinutes} min` });
  }

  // Resting heart rate (lower = fitter = bonus)
  if (snapshot.heartRateResting > 0 && snapshot.heartRateResting < 60) {
    breakdown.push({ label: "Resting HR", xp: 20, value: `${snapshot.heartRateResting} bpm` });
  }

  // Floors
  if (snapshot.floorsClimbed >= 10) {
    const xp = snapshot.floorsClimbed >= 25 ? 50 : snapshot.floorsClimbed >= 15 ? 30 : 20;
    breakdown.push({ label: "Floors", xp, value: `${snapshot.floorsClimbed}` });
  }

  const totalXp = breakdown.reduce((sum, b) => sum + b.xp, 0);
  return { totalXp, breakdown };
}

// Map health data to stat types
export function healthToStats(snapshot: HealthSnapshot): Record<string, number> {
  const stats: Record<string, number> = {
    strength: 0,
    endurance: 0,
    knowledge: 0,
    social: 0,
    creativity: 0,
  };

  if (snapshot.steps >= 5000) stats.endurance += 1;
  if (snapshot.steps >= 10000) stats.endurance += 1;
  if (snapshot.activeMinutes >= 30) stats.endurance += 1;
  if (snapshot.sleepHours >= 7) stats.endurance += 1;
  if (snapshot.floorsClimbed >= 10) stats.strength += 1;

  for (const w of snapshot.workouts) {
    const type = w.type.toUpperCase();
    if (["STRENGTH", "WEIGHT", "CROSSFIT", "HIIT"].some((t) => type.includes(t))) {
      stats.strength += 2;
    } else {
      stats.endurance += 1;
    }
  }

  return stats;
}

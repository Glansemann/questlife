// Life Card — auto-generated daily summary card
// Like Spotify Wrapped but for every day of your life

import type { HealthSnapshot } from "./integrations/health";
import { calculateHealthXp } from "./integrations/health";

export interface LifeCard {
  date: string;
  userName: string;
  level: number;
  streak: number;
  totalXpToday: number;
  headline: string;
  vibe: "fire" | "solid" | "chill" | "recovery";
  color: string;
  stats: LifeCardStat[];
  highlight: string | null;
  questsCompleted: number;
}

export interface LifeCardStat {
  icon: string;
  label: string;
  value: string;
  xp: number;
}

const VIBES = {
  fire: { label: "ON FIRE", color: "#f87171", emoji: "\u{1F525}" },
  solid: { label: "SOLID DAY", color: "#7c5cfc", emoji: "\u{1F4AA}" },
  chill: { label: "CHILL DAY", color: "#60a5fa", emoji: "\u{1F30A}" },
  recovery: { label: "RECOVERY", color: "#34d399", emoji: "\u{1F9D8}" },
};

function determineVibe(snapshot: HealthSnapshot, xp: number): "fire" | "solid" | "chill" | "recovery" {
  if (xp >= 250 || snapshot.workouts.length >= 2 || snapshot.steps >= 15000) return "fire";
  if (xp >= 150 || snapshot.workouts.length >= 1 || snapshot.steps >= 8000) return "solid";
  if (snapshot.sleepHours >= 8 && snapshot.activeMinutes < 30) return "recovery";
  return "chill";
}

function generateHeadline(snapshot: HealthSnapshot, vibe: string, streak: number): string {
  if (vibe === "fire" && streak >= 7) return `${streak}-day streak and still going hard`;
  if (vibe === "fire") return "Absolutely crushed it today";
  if (snapshot.workouts.length > 0) {
    const w = snapshot.workouts[0];
    return `${w.name || w.type} + ${snapshot.steps.toLocaleString()} steps`;
  }
  if (snapshot.steps >= 10000) return `${snapshot.steps.toLocaleString()} steps — walking machine`;
  if (vibe === "recovery" && snapshot.sleepHours >= 8) return "Rest day done right";
  if (snapshot.sleepHours >= 8) return "Great sleep, ready for tomorrow";
  return "Another day in the books";
}

function generateHighlight(snapshot: HealthSnapshot): string | null {
  if (snapshot.steps >= 20000) return `\u{1F3C6} 20K+ steps!`;
  if (snapshot.sleepScore && snapshot.sleepScore >= 90) return `\u{1F634} Perfect sleep score: ${snapshot.sleepScore}`;
  if (snapshot.workouts.some((w) => w.durationMinutes >= 60)) return `\u{1F4AA} 60+ minute workout`;
  if (snapshot.heartRateResting > 0 && snapshot.heartRateResting <= 50) return `\u2764\uFE0F Elite resting HR: ${snapshot.heartRateResting} bpm`;
  return null;
}

export function generateLifeCard(
  snapshot: HealthSnapshot,
  userName: string,
  level: number,
  streak: number,
  questsCompleted: number,
): LifeCard {
  const { totalXp, breakdown } = calculateHealthXp(snapshot);
  const vibe = determineVibe(snapshot, totalXp);
  const vibeInfo = VIBES[vibe];

  const stats: LifeCardStat[] = [];

  if (snapshot.steps > 0) stats.push({ icon: "\u{1F6B6}", label: "Steps", value: snapshot.steps.toLocaleString(), xp: breakdown.find((b) => b.label === "Steps")?.xp ?? 0 });
  if (snapshot.sleepHours > 0) stats.push({ icon: "\u{1F634}", label: "Sleep", value: `${snapshot.sleepHours.toFixed(1)}h${snapshot.sleepScore ? ` (${snapshot.sleepScore})` : ""}`, xp: breakdown.find((b) => b.label === "Sleep")?.xp ?? 0 });
  if (snapshot.activeMinutes > 0) stats.push({ icon: "\u{26A1}", label: "Active", value: `${snapshot.activeMinutes} min`, xp: breakdown.find((b) => b.label === "Active minutes")?.xp ?? 0 });
  if (snapshot.heartRateResting > 0) stats.push({ icon: "\u2764\uFE0F", label: "Resting HR", value: `${snapshot.heartRateResting} bpm`, xp: 0 });
  if (snapshot.bodyBattery) stats.push({ icon: "\u{1F50B}", label: "Body Battery", value: `${snapshot.bodyBattery}`, xp: 0 });

  for (const w of snapshot.workouts) {
    stats.push({
      icon: "\u{1F3CB}\uFE0F",
      label: w.name || w.type,
      value: `${w.durationMinutes} min${w.distanceKm > 0 ? ` \u00B7 ${w.distanceKm.toFixed(1)} km` : ""}`,
      xp: breakdown.find((b) => b.label === (w.name || w.type))?.xp ?? 0,
    });
  }

  return {
    date: snapshot.date,
    userName,
    level,
    streak,
    totalXpToday: totalXp,
    headline: generateHeadline(snapshot, vibe, streak),
    vibe,
    color: vibeInfo.color,
    stats,
    highlight: generateHighlight(snapshot),
    questsCompleted,
  };
}

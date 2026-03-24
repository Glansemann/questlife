// Garmin Health API integration
// Garmin pushes data to our webhook when user data updates
// Docs: https://developer.garmin.com/gc-developer-program/health-api/

export interface GarminTokens {
  oauthToken: string;
  oauthTokenSecret: string;
}

export interface GarminDailySummary {
  steps: number;
  activeSeconds: number;
  floorsClimbed: number;
  minHeartRate: number;
  maxHeartRate: number;
  averageHeartRate: number;
  bodyBatteryHigh: number;
  bodyBatteryLow: number;
  averageStressLevel: number;
  calendarDate: string;
}

export interface GarminSleepSummary {
  durationInSeconds: number;
  deepSleepSeconds: number;
  lightSleepSeconds: number;
  remSleepSeconds: number;
  awakeSleepSeconds: number;
  sleepScoreQualifier: string; // EXCELLENT, GOOD, FAIR, POOR
  overallSleepScore: number;
  calendarDate: string;
}

export interface GarminActivity {
  activityType: string;
  durationInSeconds: number;
  distanceInMeters: number;
  activeKilocalories: number;
  averageHeartRateInBeatsPerMinute: number;
  startTimeLocal: string;
  activityName: string;
}

export interface GarminEpoch {
  activeTimeInSeconds: number;
  steps: number;
  distanceInMeters: number;
  activeKilocalories: number;
}

// Map Garmin activity types to QuestLife stat types
const ACTIVITY_STAT_MAP: Record<string, string> = {
  RUNNING: "endurance",
  CYCLING: "endurance",
  SWIMMING: "endurance",
  WALKING: "endurance",
  HIKING: "endurance",
  STRENGTH_TRAINING: "strength",
  YOGA: "endurance",
  PILATES: "strength",
  CARDIO: "endurance",
  BREATHWORK: "endurance",
  MEDITATION: "endurance",
  OTHER: "strength",
};

export function getStatTypeForActivity(activityType: string): string {
  return ACTIVITY_STAT_MAP[activityType] ?? "endurance";
}

// Calculate XP from Garmin data
export function xpFromSteps(steps: number): number {
  if (steps >= 15000) return 100;
  if (steps >= 10000) return 70;
  if (steps >= 7500) return 50;
  if (steps >= 5000) return 30;
  if (steps >= 2500) return 15;
  return 0;
}

export function xpFromSleep(score: number): number {
  if (score >= 90) return 80;
  if (score >= 75) return 50;
  if (score >= 60) return 30;
  return 10;
}

export function xpFromActivity(durationSeconds: number): number {
  const minutes = durationSeconds / 60;
  if (minutes >= 60) return 100;
  if (minutes >= 45) return 80;
  if (minutes >= 30) return 60;
  if (minutes >= 15) return 30;
  return 10;
}

export function xpFromBodyBattery(high: number): number {
  if (high >= 90) return 40;
  if (high >= 70) return 25;
  if (high >= 50) return 15;
  return 5;
}

export interface AutoQuest {
  title: string;
  description: string;
  statType: string;
  xpReward: number;
  difficulty: string;
  source: "garmin";
  autoCompleted: true;
}

export function generateAutoQuests(data: {
  daily?: GarminDailySummary;
  sleep?: GarminSleepSummary;
  activities?: GarminActivity[];
}): AutoQuest[] {
  const quests: AutoQuest[] = [];

  if (data.daily) {
    const d = data.daily;
    if (d.steps >= 2500) {
      const xp = xpFromSteps(d.steps);
      quests.push({
        title: `Walked ${d.steps.toLocaleString()} steps`,
        description: d.steps >= 10000 ? "Incredible step count today!" : "Every step counts.",
        statType: "endurance",
        xpReward: xp,
        difficulty: d.steps >= 10000 ? "hard" : d.steps >= 5000 ? "normal" : "easy",
        source: "garmin",
        autoCompleted: true,
      });
    }

    if (d.floorsClimbed >= 5) {
      quests.push({
        title: `Climbed ${d.floorsClimbed} floors`,
        description: "Taking the stairs pays off.",
        statType: "strength",
        xpReward: d.floorsClimbed >= 20 ? 60 : d.floorsClimbed >= 10 ? 40 : 20,
        difficulty: d.floorsClimbed >= 20 ? "hard" : "normal",
        source: "garmin",
        autoCompleted: true,
      });
    }

    if (d.bodyBatteryHigh > 0) {
      quests.push({
        title: `Body Battery peaked at ${d.bodyBatteryHigh}`,
        description: d.bodyBatteryHigh >= 80 ? "Your energy is great today!" : "Listen to your body.",
        statType: "endurance",
        xpReward: xpFromBodyBattery(d.bodyBatteryHigh),
        difficulty: "easy",
        source: "garmin",
        autoCompleted: true,
      });
    }
  }

  if (data.sleep) {
    const s = data.sleep;
    const hours = Math.round(s.durationInSeconds / 3600 * 10) / 10;
    const xp = xpFromSleep(s.overallSleepScore);
    quests.push({
      title: `Slept ${hours}h — Score: ${s.overallSleepScore}`,
      description: `${s.sleepScoreQualifier} sleep. Deep: ${Math.round(s.deepSleepSeconds / 60)}min, REM: ${Math.round(s.remSleepSeconds / 60)}min`,
      statType: "endurance",
      xpReward: xp,
      difficulty: s.overallSleepScore >= 80 ? "hard" : "normal",
      source: "garmin",
      autoCompleted: true,
    });
  }

  if (data.activities) {
    for (const activity of data.activities) {
      const minutes = Math.round(activity.durationInSeconds / 60);
      const km = Math.round(activity.distanceInMeters / 100) / 10;
      const xp = xpFromActivity(activity.durationInSeconds);
      const statType = getStatTypeForActivity(activity.activityType);

      let desc = `${minutes} min`;
      if (km > 0) desc += ` \u00B7 ${km} km`;
      if (activity.averageHeartRateInBeatsPerMinute > 0) desc += ` \u00B7 ${activity.averageHeartRateInBeatsPerMinute} avg HR`;
      if (activity.activeKilocalories > 0) desc += ` \u00B7 ${activity.activeKilocalories} kcal`;

      quests.push({
        title: activity.activityName || activity.activityType.replace(/_/g, " "),
        description: desc,
        statType,
        xpReward: xp,
        difficulty: minutes >= 60 ? "epic" : minutes >= 30 ? "hard" : "normal",
        source: "garmin",
        autoCompleted: true,
      });
    }
  }

  return quests;
}

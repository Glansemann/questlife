import { NextResponse } from "next/server";
import { generateAutoQuests, type GarminDailySummary, type GarminSleepSummary, type GarminActivity } from "@/lib/integrations/garmin";

// Garmin pushes data to this endpoint when user data updates
// Types: dailies, sleeps, activities, bodyComps, epochs, etc.

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Garmin sends different payload types
    const results: Record<string, unknown> = {};

    if (body.dailies) {
      for (const daily of body.dailies) {
        const summary: GarminDailySummary = {
          steps: daily.steps ?? 0,
          activeSeconds: daily.activeTimeInSeconds ?? 0,
          floorsClimbed: daily.floorsClimbed ?? 0,
          minHeartRate: daily.minHeartRateInBeatsPerMinute ?? 0,
          maxHeartRate: daily.maxHeartRateInBeatsPerMinute ?? 0,
          averageHeartRate: daily.averageHeartRateInBeatsPerMinute ?? 0,
          bodyBatteryHigh: daily.bodyBatteryChargedValue ?? 0,
          bodyBatteryLow: daily.bodyBatteryDrainedValue ?? 0,
          averageStressLevel: daily.averageStressLevel ?? 0,
          calendarDate: daily.calendarDate ?? "",
        };

        const quests = generateAutoQuests({ daily: summary });
        results[`daily_${daily.userAccessToken}`] = quests;

        // TODO: save quests to DB and update user stats
        console.log(`[Garmin] Daily for user ${daily.userAccessToken}:`, {
          steps: summary.steps,
          bodyBattery: summary.bodyBatteryHigh,
          quests: quests.length,
        });
      }
    }

    if (body.sleeps) {
      for (const sleep of body.sleeps) {
        const summary: GarminSleepSummary = {
          durationInSeconds: sleep.durationInSeconds ?? 0,
          deepSleepSeconds: sleep.deepSleepDurationInSeconds ?? 0,
          lightSleepSeconds: sleep.lightSleepDurationInSeconds ?? 0,
          remSleepSeconds: sleep.remSleepInSeconds ?? 0,
          awakeSleepSeconds: sleep.awakeDurationInSeconds ?? 0,
          sleepScoreQualifier: sleep.sleepScoreQualifier ?? "FAIR",
          overallSleepScore: sleep.overallSleepScore?.value ?? 0,
          calendarDate: sleep.calendarDate ?? "",
        };

        const quests = generateAutoQuests({ sleep: summary });
        results[`sleep_${sleep.userAccessToken}`] = quests;

        console.log(`[Garmin] Sleep for user ${sleep.userAccessToken}:`, {
          score: summary.overallSleepScore,
          hours: Math.round(summary.durationInSeconds / 3600 * 10) / 10,
          quests: quests.length,
        });
      }
    }

    if (body.activities) {
      for (const act of body.activities) {
        const activity: GarminActivity = {
          activityType: act.activityType ?? "OTHER",
          durationInSeconds: act.durationInSeconds ?? 0,
          distanceInMeters: act.distanceInMeters ?? 0,
          activeKilocalories: act.activeKilocalories ?? 0,
          averageHeartRateInBeatsPerMinute: act.averageHeartRateInBeatsPerMinute ?? 0,
          startTimeLocal: act.startTimeLocal ?? "",
          activityName: act.activityName ?? "",
        };

        const quests = generateAutoQuests({ activities: [activity] });
        results[`activity_${act.userAccessToken}`] = quests;

        console.log(`[Garmin] Activity for user ${act.userAccessToken}:`, {
          type: activity.activityType,
          minutes: Math.round(activity.durationInSeconds / 60),
          quests: quests.length,
        });
      }
    }

    return NextResponse.json({ ok: true, processed: Object.keys(results).length });
  } catch (error) {
    console.error("[Garmin] Webhook error:", error);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}

// Garmin sends a GET to verify the endpoint
export async function GET() {
  return NextResponse.json({ status: "ok" });
}

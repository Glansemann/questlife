"use client";

import { useState, useEffect } from "react";
import { loadState, type GameState } from "@/lib/game-state";
import { generateLifeCard, type LifeCard } from "@/lib/life-card";
import { LifeCardView } from "@/components/life-card-view";
import type { HealthSnapshot } from "@/lib/integrations/health";

type HealthSource = "apple_health" | "google_health" | "garmin" | "none";

// Simulated today's data (will come from real health APIs)
function getDemoSnapshot(name: string): HealthSnapshot {
  return {
    date: new Date().toISOString().slice(0, 10),
    steps: 8432,
    activeMinutes: 47,
    distanceKm: 4.2,
    floorsClimbed: 12,
    caloriesBurned: 420,
    heartRateAvg: 72,
    heartRateResting: 58,
    heartRateMax: 156,
    sleepHours: 7.5,
    sleepScore: 82,
    sleepDeepMinutes: 80,
    sleepRemMinutes: 105,
    bodyBattery: 78,
    stressLevel: 32,
    spo2: 98,
    workouts: [
      {
        type: "RUNNING",
        name: "Morning Run",
        durationMinutes: 32,
        distanceKm: 4.8,
        calories: 340,
        avgHeartRate: 148,
        startTime: "07:15",
      },
    ],
    source: "apple_health",
  };
}

const HEALTH_SOURCES = [
  { id: "apple_health" as const, name: "Apple Health", icon: "\u{1F34F}", desc: "iPhone + Apple Watch, Garmin, Oura, Whoop, Fitbit" },
  { id: "google_health" as const, name: "Google Health Connect", icon: "\u{1F916}", desc: "Android + Wear OS, Garmin, Fitbit, Samsung, Oura" },
  { id: "garmin" as const, name: "Garmin Connect", icon: "\u{231A}", desc: "Direct Garmin integration" },
];

export default function FeedPage() {
  const [state, setState] = useState<GameState | null>(null);
  const [lifeCard, setLifeCard] = useState<LifeCard | null>(null);
  const [connected, setConnected] = useState<HealthSource>("none");
  const [showConnect, setShowConnect] = useState(false);
  const [challengeTarget, setChallengeTarget] = useState("");
  const [showChallenge, setShowChallenge] = useState(false);

  useEffect(() => {
    const s = loadState();
    setState(s);

    const source = localStorage.getItem("questlife_health_source") as HealthSource | null;
    if (source && source !== "none") {
      setConnected(source);
      const snapshot = getDemoSnapshot(s.name);
      const card = generateLifeCard(snapshot, s.name, s.level, s.currentStreak, s.questsCompletedToday);
      setLifeCard(card);
    }
  }, []);

  function connectSource(source: HealthSource) {
    localStorage.setItem("questlife_health_source", source);
    setConnected(source);
    setShowConnect(false);

    if (state) {
      const snapshot = getDemoSnapshot(state.name);
      const card = generateLifeCard(snapshot, state.name, state.level, state.currentStreak, state.questsCompletedToday);
      setLifeCard(card);
    }
  }

  async function shareCard() {
    if (!lifeCard) return;

    const shareText = `${lifeCard.headline}\n\n` +
      lifeCard.stats.map((s) => `${s.icon} ${s.label}: ${s.value}`).join("\n") +
      `\n\n+${lifeCard.totalXpToday} XP | Level ${lifeCard.level}` +
      (lifeCard.streak > 0 ? ` | ${lifeCard.streak} day streak` : "") +
      `\n\nTrack your life KPIs: questlife.app`;

    if (navigator.share) {
      await navigator.share({ title: "My QuestLife Card", text: shareText, url: "https://questlife.app" });
    } else {
      await navigator.clipboard.writeText(shareText);
      alert("Copied to clipboard!");
    }
  }

  function sendChallenge() {
    if (!challengeTarget.trim()) return;
    // TODO: send real challenge via backend
    alert(`Challenge sent to ${challengeTarget}! They'll see it when they open QuestLife.`);
    setChallengeTarget("");
    setShowChallenge(false);
  }

  if (!state) return null;

  return (
    <div className="container page-content">
      <div style={{ paddingTop: 24 }}>

        {/* Connect health source */}
        {connected === "none" ? (
          <div className="card slide-up" style={{
            textAlign: "center", padding: 28,
            background: "linear-gradient(135deg, #7c5cfc08, #34d39908)",
          }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>{"\u{1F4F1}"}</div>
            <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>Connect your health data</div>
            <div style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 20, lineHeight: 1.5 }}>
              Works with ANY device — Apple Watch, Garmin, Oura, Whoop, Fitbit, Samsung, and more. We read from your phone&apos;s health app.
            </div>

            {HEALTH_SOURCES.map((source) => (
              <button
                key={source.id}
                className="card"
                style={{
                  width: "100%", textAlign: "left", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "14px 16px", marginBottom: 8, border: "1px solid var(--border)",
                }}
                onClick={() => connectSource(source.id)}
              >
                <span style={{ fontSize: 28 }}>{source.icon}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{source.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text-dim)" }}>{source.desc}</div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <>
            {/* Today's Life Card */}
            {lifeCard && (
              <div className="slide-up">
                <div className="section-header" style={{ marginTop: 0 }}>
                  <span className="section-title">Today&apos;s Life Card</span>
                  <button
                    style={{ background: "none", border: "none", color: "var(--accent)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                    onClick={shareCard}
                  >
                    Share
                  </button>
                </div>
                <LifeCardView card={lifeCard} onShare={shareCard} />
              </div>
            )}

            {/* Challenge a friend */}
            <div className="section-header">
              <span className="section-title">Challenges</span>
            </div>

            {!showChallenge ? (
              <button
                className="card"
                style={{ width: "100%", textAlign: "center", cursor: "pointer", padding: 20 }}
                onClick={() => setShowChallenge(true)}
              >
                <div style={{ fontSize: 28, marginBottom: 4 }}>{"\u2694\uFE0F"}</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>Challenge a friend</div>
                <div style={{ fontSize: 12, color: "var(--text-dim)" }}>
                  Head-to-head: most steps, best sleep, longest workout
                </div>
              </button>
            ) : (
              <div className="card slide-up">
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>New Challenge</div>

                <input
                  type="text"
                  value={challengeTarget}
                  onChange={(e) => setChallengeTarget(e.target.value)}
                  placeholder="Friend's name or invite code..."
                  style={{
                    width: "100%", padding: "12px 14px", fontSize: 14,
                    background: "var(--bg)", border: "1px solid var(--border)",
                    borderRadius: 10, color: "var(--text)", outline: "none", marginBottom: 12,
                  }}
                />

                <div style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 12 }}>Choose challenge type:</div>

                {[
                  { icon: "\u{1F6B6}", label: "Most steps today", type: "steps" },
                  { icon: "\u{1F634}", label: "Best sleep score tonight", type: "sleep" },
                  { icon: "\u{1F3CB}\uFE0F", label: "Longest workout this week", type: "workout" },
                  { icon: "\u{1F525}", label: "Highest XP this week", type: "xp" },
                ].map((challenge) => (
                  <button
                    key={challenge.type}
                    className="card"
                    style={{
                      width: "100%", textAlign: "left", cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "12px 14px", marginBottom: 6,
                    }}
                    onClick={sendChallenge}
                  >
                    <span style={{ fontSize: 20 }}>{challenge.icon}</span>
                    <span style={{ fontSize: 14 }}>{challenge.label}</span>
                  </button>
                ))}

                <button
                  style={{ background: "none", border: "none", color: "var(--text-dim)", fontSize: 13, cursor: "pointer", marginTop: 8 }}
                  onClick={() => setShowChallenge(false)}
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Friends' cards placeholder */}
            <div className="section-header">
              <span className="section-title">Friends</span>
            </div>
            <div className="card" style={{ textAlign: "center", padding: 24, color: "var(--text-dim)" }}>
              <div style={{ fontSize: 13, lineHeight: 1.5 }}>
                Invite friends to see their daily Life Cards here.<br />
                Share your invite code from the Guild tab.
              </div>
            </div>

            {/* Source info */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "12px 0", fontSize: 12, color: "var(--text-dim)",
            }}>
              <span>
                Connected: {HEALTH_SOURCES.find((s) => s.id === connected)?.name}
              </span>
              <button
                style={{ background: "none", border: "none", color: "var(--text-dim)", fontSize: 12, cursor: "pointer", textDecoration: "underline" }}
                onClick={() => {
                  localStorage.removeItem("questlife_health_source");
                  setConnected("none");
                  setLifeCard(null);
                }}
              >
                Disconnect
              </button>
            </div>
          </>
        )}
      </div>

      {/* Bottom nav */}
      <nav className="nav">
        <a className="nav-item" href="/play">
          <span className="nav-icon">{"\u2694\uFE0F"}</span>
          Quests
        </a>
        <a className="nav-item active" href="/play/feed">
          <span className="nav-icon">{"\u{1F4E1}"}</span>
          Feed
        </a>
        <a className="nav-item" href="/play/guild">
          <span className="nav-icon">{"\u{1F6E1}\uFE0F"}</span>
          Guild
        </a>
        <a className="nav-item" href="/play/profile">
          <span className="nav-icon">{"\u{1F464}"}</span>
          Profile
        </a>
      </nav>
    </div>
  );
}

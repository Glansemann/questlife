"use client";

import { useState, useEffect } from "react";
import { loadState, type GameState } from "@/lib/game-state";

export default function ProfilePage() {
  const [state, setState] = useState<GameState | null>(null);

  useEffect(() => {
    setState(loadState());
  }, []);

  if (!state) return null;

  function resetProgress() {
    if (confirm("Are you sure? This will delete all your progress.")) {
      localStorage.removeItem("questlife_state");
      localStorage.removeItem("questlife_onboard");
      localStorage.removeItem("questlife_guild");
      window.location.href = "/";
    }
  }

  return (
    <div className="container page-content">
      <div style={{ paddingTop: 24 }}>
        <div className="section-header" style={{ marginTop: 0 }}>
          <span className="section-title">Profile</span>
        </div>

        {/* Character card */}
        <div className="card" style={{ textAlign: "center", padding: 32 }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            background: "linear-gradient(135deg, var(--accent), #a78bfa)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 32, fontWeight: 800, margin: "0 auto 12px",
          }}>
            {(state.name || "A").charAt(0).toUpperCase()}
          </div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{state.name}</div>
          <div style={{ fontSize: 14, color: "var(--text-dim)", marginTop: 4 }}>
            Level {state.level} &middot; {state.totalXp} XP
          </div>
        </div>

        {/* Stats summary */}
        <div className="section-header">
          <span className="section-title">Summary</span>
        </div>
        <div className="card">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div>
              <div style={{ fontSize: 11, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: 0.5 }}>Quests Completed</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{state.totalQuestsCompleted}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: 0.5 }}>Best Streak</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{state.longestStreak} days</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: 0.5 }}>Achievements</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{state.unlockedAchievements.length}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: 0.5 }}>Goals Set</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{state.goals.length}</div>
            </div>
          </div>
        </div>

        {/* Goals */}
        {state.goals.length > 0 && (
          <>
            <div className="section-header">
              <span className="section-title">Active Goals</span>
            </div>
            <div className="card" style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {state.goals.map((goal) => (
                <span key={goal} className="goal-chip selected">{goal}</span>
              ))}
            </div>
          </>
        )}

        {/* Settings */}
        <div className="section-header">
          <span className="section-title">Settings</span>
        </div>

        <div className="card" style={{ padding: 0 }}>
          <button
            style={{
              width: "100%", padding: "16px 20px", background: "none", border: "none",
              borderBottom: "1px solid var(--border)", color: "var(--text)",
              fontSize: 15, textAlign: "left", cursor: "pointer",
            }}
            onClick={() => { window.location.href = "/onboard"; }}
          >
            Change goals
          </button>
          <button
            style={{
              width: "100%", padding: "16px 20px", background: "none", border: "none",
              color: "var(--red)", fontSize: 15, textAlign: "left", cursor: "pointer",
            }}
            onClick={resetProgress}
          >
            Reset all progress
          </button>
        </div>

        {/* Upgrade CTA */}
        <div className="card" style={{
          textAlign: "center", padding: 24, marginTop: 24,
          background: "linear-gradient(135deg, #7c5cfc10, #a78bfa10)",
          border: "1px solid var(--accent)",
        }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>QuestLife Pro</div>
          <div style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 16, lineHeight: 1.5 }}>
            Unlimited AI-generated quests, guild challenges, detailed analytics, and no ads.
          </div>
          <button className="btn btn-primary" style={{ padding: "12px 32px" }}>
            Upgrade — $5/mo
          </button>
        </div>

        <div style={{ textAlign: "center", padding: "24px 0 8px", fontSize: 12, color: "var(--text-dim)" }}>
          QuestLife v0.1.0
        </div>
      </div>

      {/* Bottom nav */}
      <nav className="nav">
        <a className="nav-item" href="/play">
          <span className="nav-icon">{"\u2694\uFE0F"}</span>
          Quests
        </a>
        <a className="nav-item" href="/play/stats">
          <span className="nav-icon">{"\u{1F4CA}"}</span>
          Stats
        </a>
        <a className="nav-item" href="/play/guild">
          <span className="nav-icon">{"\u{1F6E1}\uFE0F"}</span>
          Guild
        </a>
        <a className="nav-item active" href="/play/profile">
          <span className="nav-icon">{"\u{1F464}"}</span>
          Profile
        </a>
      </nav>
    </div>
  );
}

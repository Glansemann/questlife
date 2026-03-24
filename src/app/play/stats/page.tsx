"use client";

import { useState, useEffect } from "react";
import { loadState, type GameState } from "@/lib/game-state";
import { xpProgressInLevel } from "@/lib/xp";
import { ACHIEVEMENTS } from "@/lib/achievements";

const STAT_COLORS: Record<string, string> = {
  strength: "#f87171",
  knowledge: "#60a5fa",
  creativity: "#c084fc",
  social: "#34d399",
  endurance: "#fbbf24",
};

export default function StatsPage() {
  const [state, setState] = useState<GameState | null>(null);

  useEffect(() => {
    setState(loadState());
  }, []);

  if (!state) return null;

  const progress = xpProgressInLevel(state.totalXp);
  const statEntries = [
    { key: "strength", label: "Strength", value: state.stats.strength },
    { key: "knowledge", label: "Knowledge", value: state.stats.knowledge },
    { key: "creativity", label: "Creativity", value: state.stats.creativity },
    { key: "social", label: "Social", value: state.stats.social },
    { key: "endurance", label: "Endurance", value: state.stats.endurance },
  ];
  const maxStat = Math.max(...statEntries.map((s) => s.value), 1);

  return (
    <div className="container page-content">
      <div style={{ paddingTop: 24 }}>
        <div className="section-header" style={{ marginTop: 0 }}>
          <span className="section-title">Character Sheet</span>
        </div>

        {/* Overview card */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 13, color: "var(--text-dim)" }}>Name</div>
              <div style={{ fontSize: 17, fontWeight: 700 }}>{state.name}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 13, color: "var(--text-dim)" }}>Level</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "var(--accent)" }}>{state.level}</div>
            </div>
          </div>

          <div style={{ marginBottom: 8, display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-dim)" }}>
            <span>XP: {progress.current}/{progress.required}</span>
            <span>{progress.percentage}%</span>
          </div>
          <div className="xp-bar-track">
            <div className="xp-bar-fill" style={{ width: `${progress.percentage}%` }} />
          </div>
        </div>

        {/* Detailed stats */}
        <div className="section-header">
          <span className="section-title">Stats</span>
        </div>
        <div className="card">
          {statEntries.map((stat) => (
            <div key={stat.key} className="stat-row">
              <span className="stat-label">{stat.label}</span>
              <div className="stat-bar-track">
                <div
                  className="stat-bar-fill"
                  style={{
                    width: `${maxStat > 0 ? (stat.value / maxStat) * 100 : 0}%`,
                    background: STAT_COLORS[stat.key],
                  }}
                />
              </div>
              <span className="stat-value">{stat.value}</span>
            </div>
          ))}
        </div>

        {/* Records */}
        <div className="section-header">
          <span className="section-title">Records</span>
        </div>
        <div className="card">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "var(--accent)" }}>{state.totalXp}</div>
              <div style={{ fontSize: 12, color: "var(--text-dim)" }}>Total XP</div>
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "var(--green)" }}>{state.totalQuestsCompleted}</div>
              <div style={{ fontSize: 12, color: "var(--text-dim)" }}>Quests Done</div>
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "var(--orange)" }}>{state.currentStreak}</div>
              <div style={{ fontSize: 12, color: "var(--text-dim)" }}>Current Streak</div>
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "var(--yellow)" }}>{state.longestStreak}</div>
              <div style={{ fontSize: 12, color: "var(--text-dim)" }}>Best Streak</div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="section-header">
          <span className="section-title">Achievements</span>
          <span style={{ fontSize: 13, color: "var(--text-dim)" }}>
            {state.unlockedAchievements.length}/{ACHIEVEMENTS.length}
          </span>
        </div>
        {ACHIEVEMENTS.map((a) => {
          const unlocked = state.unlockedAchievements.includes(a.key);
          return (
            <div
              key={a.key}
              className="card"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                opacity: unlocked ? 1 : 0.3,
                padding: "14px 16px",
              }}
            >
              <span style={{ fontSize: 28 }}>{unlocked ? a.icon : "\u{1F512}"}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{a.title}</div>
                <div style={{ fontSize: 12, color: "var(--text-dim)" }}>{a.description}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom nav */}
      <nav className="nav">
        <a className="nav-item" href="/play">
          <span className="nav-icon">{"\u2694\uFE0F"}</span>
          Quests
        </a>
        <a className="nav-item" href="/play/feed">
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

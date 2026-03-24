"use client";

import { useState, useEffect, useCallback } from "react";
import { loadState, initFromOnboarding, completeQuest as completeQuestAction, type GameState } from "@/lib/game-state";
import { xpProgressInLevel } from "@/lib/xp";

const STAT_COLORS: Record<string, string> = {
  strength: "#f87171",
  knowledge: "#60a5fa",
  creativity: "#c084fc",
  social: "#34d399",
  endurance: "#fbbf24",
};

interface Quest {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  statType: string;
  xpReward: number;
  status: "active" | "completed";
}

const FALLBACK_QUESTS: Quest[] = [
  { id: "1", title: "Morning stretch routine", description: "Do a 10-minute stretch when you wake up", difficulty: "easy", statType: "endurance", xpReward: 30, status: "active" },
  { id: "2", title: "Read for 20 minutes", description: "Pick up a book or article and read uninterrupted", difficulty: "normal", statType: "knowledge", xpReward: 50, status: "active" },
  { id: "3", title: "Cook a new recipe", description: "Try making something you've never cooked before", difficulty: "normal", statType: "creativity", xpReward: 50, status: "active" },
  { id: "4", title: "Message an old friend", description: "Reach out to someone you haven't talked to in a while", difficulty: "easy", statType: "social", xpReward: 30, status: "active" },
  { id: "5", title: "30-min workout", description: "Complete a 30-minute workout of your choice", difficulty: "hard", statType: "strength", xpReward: 100, status: "active" },
];

export default function PlayPage() {
  const [state, setState] = useState<GameState | null>(null);
  const [quests, setQuests] = useState<Quest[]>(FALLBACK_QUESTS);
  const [popup, setPopup] = useState<{ xp: number; achievements: { title: string; icon: string }[]; leveledUp: boolean } | null>(null);

  useEffect(() => {
    let s = loadState();
    if (s.totalXp === 0 && s.name === "Adventurer") {
      s = initFromOnboarding();
    }
    setState(s);
  }, []);

  const handleComplete = useCallback((questId: string) => {
    if (!state) return;
    const quest = quests.find((q) => q.id === questId);
    if (!quest || quest.status === "completed") return;

    const { newState, result } = completeQuestAction(state, quest);
    setState(newState);

    setQuests((prev) =>
      prev.map((q) => (q.id === questId ? { ...q, status: "completed" as const } : q)),
    );

    setPopup({
      xp: result.xpGained,
      achievements: result.newAchievements,
      leveledUp: result.leveledUp,
    });

    setTimeout(() => setPopup(null), 3000);
  }, [state, quests]);

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
      {/* XP Popup */}
      {popup && (
        <div style={{
          position: "fixed", top: 60, left: "50%", transform: "translateX(-50%)",
          background: "var(--bg-card)", border: "1px solid var(--accent)", borderRadius: 16,
          padding: "16px 24px", zIndex: 200, textAlign: "center", minWidth: 200,
          boxShadow: "0 0 30px var(--accent-glow)",
        }} className="slide-up">
          <div style={{ fontSize: 24, fontWeight: 800, color: "var(--accent)" }}>+{popup.xp} XP</div>
          {popup.leveledUp && (
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--yellow)", marginTop: 4 }}>
              LEVEL UP!
            </div>
          )}
          {popup.achievements.map((a) => (
            <div key={a.title} style={{ fontSize: 14, marginTop: 6, color: "var(--green)" }}>
              {a.icon} {a.title} unlocked!
            </div>
          ))}
        </div>
      )}

      {/* Level + XP */}
      <div style={{ paddingTop: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <span style={{ fontSize: 13, color: "var(--text-dim)" }}>{state.name}</span>
          {state.currentStreak > 0 && (
            <span style={{ fontSize: 13, color: "var(--orange)", fontWeight: 700 }}>
              {state.currentStreak} day streak
            </span>
          )}
        </div>

        <div className="level-display">
          <div className="level-number">{state.level}</div>
          <div className="level-label">Level</div>
        </div>

        <div style={{ marginBottom: 8, display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-dim)" }}>
          <span>{progress.current} XP</span>
          <span>{progress.required} XP</span>
        </div>
        <div className="xp-bar-track">
          <div className="xp-bar-fill" style={{ width: `${progress.percentage}%` }} />
        </div>
        <div style={{ fontSize: 12, color: "var(--text-dim)", textAlign: "center", marginTop: 6 }}>
          {state.totalXp} total XP
        </div>
      </div>

      {/* Stats */}
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

      {/* Today's Quests */}
      <div className="section-header">
        <span className="section-title">Today&apos;s Quests</span>
        <span style={{ fontSize: 13, color: "var(--accent)" }}>
          {quests.filter((q) => q.status === "completed").length}/{quests.length}
        </span>
      </div>

      {quests.map((quest) => (
        <div
          key={quest.id}
          className={`card quest ${quest.status === "completed" ? "quest-done" : ""} slide-up`}
        >
          <div className="quest-header">
            <span className="quest-title">
              {quest.status === "completed" ? "\u2713 " : ""}{quest.title}
            </span>
            <span className="quest-xp">+{quest.xpReward} XP</span>
          </div>
          <div className="quest-desc">{quest.description}</div>
          <div className="quest-meta">
            <span className={`badge badge-${quest.difficulty}`}>{quest.difficulty}</span>
            <span className="badge badge-stat">{quest.statType}</span>
          </div>
          {quest.status === "active" && (
            <button className="btn-complete" onClick={() => handleComplete(quest.id)}>
              Complete Quest
            </button>
          )}
        </div>
      ))}

      {/* Achievements */}
      {state.unlockedAchievements.length > 0 && (
        <>
          <div className="section-header">
            <span className="section-title">Achievements</span>
            <span style={{ fontSize: 13, color: "var(--text-dim)" }}>
              {state.unlockedAchievements.length}
            </span>
          </div>
          <div className="card" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {state.unlockedAchievements.map((key) => (
              <span key={key} style={{ fontSize: 28 }} title={key}>
                {"\u{1F3C6}"}
              </span>
            ))}
          </div>
        </>
      )}

      {/* Bottom nav */}
      <nav className="nav">
        <a className="nav-item active" href="/play">
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
        <a className="nav-item" href="/play/profile">
          <span className="nav-icon">{"\u{1F464}"}</span>
          Profile
        </a>
      </nav>
    </div>
  );
}

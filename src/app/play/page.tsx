"use client";

import { useState } from "react";

const STAT_COLORS: Record<string, string> = {
  strength: "#f87171",
  knowledge: "#60a5fa",
  creativity: "#c084fc",
  social: "#34d399",
  endurance: "#fbbf24",
};

// Demo data — will be replaced with real API calls
const DEMO_STATS = {
  level: 7,
  totalXp: 1240,
  xpProgress: { current: 140, required: 200, percentage: 70 },
  currentStreak: 5,
  strength: 12,
  knowledge: 18,
  creativity: 8,
  social: 14,
  endurance: 10,
};

const DEMO_QUESTS = [
  { id: "1", title: "Morning stretch routine", description: "Do a 10-minute stretch when you wake up", difficulty: "easy", statType: "endurance", xpReward: 30, status: "active" },
  { id: "2", title: "Read for 20 minutes", description: "Pick up a book or article and read for 20 minutes", difficulty: "normal", statType: "knowledge", xpReward: 50, status: "active" },
  { id: "3", title: "Cook a new recipe", description: "Try making something you've never cooked before", difficulty: "normal", statType: "creativity", xpReward: 50, status: "active" },
  { id: "4", title: "Message an old friend", description: "Reach out to someone you haven't talked to in a while", difficulty: "easy", statType: "social", xpReward: 30, status: "active" },
  { id: "5", title: "30-min workout", description: "Complete a 30-minute workout of your choice", difficulty: "hard", statType: "strength", xpReward: 100, status: "active" },
];

export default function PlayPage() {
  const [stats] = useState(DEMO_STATS);
  const [quests, setQuests] = useState(DEMO_QUESTS);
  const [completedAnimation, setCompletedAnimation] = useState<string | null>(null);

  function completeQuest(questId: string) {
    setQuests((prev) =>
      prev.map((q) => (q.id === questId ? { ...q, status: "completed" } : q)),
    );
    setCompletedAnimation(questId);
    setTimeout(() => setCompletedAnimation(null), 500);
  }

  const statEntries = [
    { key: "strength", label: "Strength", value: stats.strength },
    { key: "knowledge", label: "Knowledge", value: stats.knowledge },
    { key: "creativity", label: "Creativity", value: stats.creativity },
    { key: "social", label: "Social", value: stats.social },
    { key: "endurance", label: "Endurance", value: stats.endurance },
  ];

  const maxStat = Math.max(...statEntries.map((s) => s.value), 1);

  return (
    <div className="container page-content">
      {/* Level + XP */}
      <div style={{ paddingTop: 24 }}>
        <div className="level-display">
          <div className="level-number">{stats.level}</div>
          <div className="level-label">Level</div>
        </div>

        {stats.currentStreak > 0 && (
          <div className="streak">
            <span>{stats.currentStreak} day streak</span>
          </div>
        )}

        <div style={{ marginBottom: 8, display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-dim)" }}>
          <span>{stats.xpProgress.current} XP</span>
          <span>{stats.xpProgress.required} XP</span>
        </div>
        <div className="xp-bar-track">
          <div className="xp-bar-fill" style={{ width: `${stats.xpProgress.percentage}%` }} />
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
                  width: `${(stat.value / maxStat) * 100}%`,
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
          className={`card quest ${quest.status === "completed" ? "quest-done" : ""} ${completedAnimation === quest.id ? "xp-pop" : "slide-up"}`}
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
            <button className="btn-complete" onClick={() => completeQuest(quest.id)}>
              Complete Quest
            </button>
          )}
        </div>
      ))}

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

"use client";

import { useState, useEffect } from "react";
import { loadState, type GameState } from "@/lib/game-state";

interface FeedItem {
  id: string;
  userName: string;
  type: "steps" | "sleep" | "activity" | "body_battery" | "quest" | "achievement" | "level_up";
  title: string;
  detail: string;
  xp: number;
  timestamp: string;
  icon: string;
}

// Demo feed — will be replaced with real data from Garmin webhook + friends
function generateDemoFeed(state: GameState): FeedItem[] {
  const now = new Date();
  const items: FeedItem[] = [];
  const name = state.name || "You";

  // Your recent activity
  if (state.totalQuestsCompleted > 0) {
    items.push({
      id: "you-quests",
      userName: name,
      type: "quest",
      title: `Completed ${state.questsCompletedToday} quest${state.questsCompletedToday !== 1 ? "s" : ""} today`,
      detail: `Level ${state.level} \u00B7 ${state.totalXp} XP`,
      xp: 0,
      timestamp: now.toISOString(),
      icon: "\u2694\uFE0F",
    });
  }

  if (state.currentStreak > 1) {
    items.push({
      id: "you-streak",
      userName: name,
      type: "achievement",
      title: `${state.currentStreak} day streak!`,
      detail: "Keeping the momentum going",
      xp: 0,
      timestamp: now.toISOString(),
      icon: "\u{1F525}",
    });
  }

  // Simulated Garmin data (shows what it will look like with real data)
  items.push(
    {
      id: "demo-steps",
      userName: name,
      type: "steps",
      title: "8,432 steps",
      detail: "4.2 km walked today",
      xp: 50,
      timestamp: new Date(now.getTime() - 2 * 3600000).toISOString(),
      icon: "\u{1F6B6}",
    },
    {
      id: "demo-sleep",
      userName: name,
      type: "sleep",
      title: "Sleep Score: 82",
      detail: "7.5h \u00B7 Deep: 1h 20m \u00B7 REM: 1h 45m",
      xp: 50,
      timestamp: new Date(now.getTime() - 8 * 3600000).toISOString(),
      icon: "\u{1F634}",
    },
    {
      id: "demo-battery",
      userName: name,
      type: "body_battery",
      title: "Body Battery: 78",
      detail: "Good energy levels today",
      xp: 25,
      timestamp: new Date(now.getTime() - 1 * 3600000).toISOString(),
      icon: "\u{1F50B}",
    },
  );

  // Sort by timestamp, newest first
  return items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

function timeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

const TYPE_COLORS: Record<string, string> = {
  steps: "var(--green)",
  sleep: "var(--accent)",
  activity: "var(--orange)",
  body_battery: "var(--yellow)",
  quest: "var(--accent)",
  achievement: "var(--yellow)",
  level_up: "var(--green)",
};

export default function FeedPage() {
  const [state, setState] = useState<GameState | null>(null);
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const s = loadState();
    setState(s);
    setFeed(generateDemoFeed(s));
    setConnected(localStorage.getItem("questlife_garmin_connected") === "true");
  }, []);

  if (!state) return null;

  return (
    <div className="container page-content">
      <div style={{ paddingTop: 24 }}>
        {/* Connection status */}
        {!connected && (
          <div className="card" style={{
            textAlign: "center",
            padding: 24,
            background: "linear-gradient(135deg, #7c5cfc08, #34d39908)",
            border: "1px solid var(--border)",
          }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>{"\u231A"}</div>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>Connect your Garmin</div>
            <div style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 16, lineHeight: 1.5 }}>
              Auto-track steps, sleep, workouts, body battery, and more. Earn XP automatically!
            </div>
            <button
              className="btn btn-primary"
              style={{ padding: "12px 24px" }}
              onClick={() => {
                localStorage.setItem("questlife_garmin_connected", "true");
                setConnected(true);
              }}
            >
              Connect Garmin
            </button>
            <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 8 }}>
              Apple Watch, Fitbit, Oura, and Whoop coming soon
            </div>
          </div>
        )}

        {connected && (
          <div className="card" style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px" }}>
            <span style={{ fontSize: 20 }}>{"\u231A"}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--green)" }}>Garmin Connected</div>
              <div style={{ fontSize: 12, color: "var(--text-dim)" }}>Auto-tracking steps, sleep, activities</div>
            </div>
            <span style={{ fontSize: 12, color: "var(--green)" }}>{"\u2713"}</span>
          </div>
        )}

        {/* Today's auto stats */}
        <div className="section-header">
          <span className="section-title">Today&apos;s Auto-tracked</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
          <div className="card" style={{ textAlign: "center", padding: 16 }}>
            <div style={{ fontSize: 11, color: "var(--text-dim)", textTransform: "uppercase" }}>Steps</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "var(--green)" }}>8,432</div>
            <div style={{ fontSize: 11, color: "var(--text-dim)" }}>+50 XP</div>
          </div>
          <div className="card" style={{ textAlign: "center", padding: 16 }}>
            <div style={{ fontSize: 11, color: "var(--text-dim)", textTransform: "uppercase" }}>Sleep</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "var(--accent)" }}>82</div>
            <div style={{ fontSize: 11, color: "var(--text-dim)" }}>+50 XP</div>
          </div>
          <div className="card" style={{ textAlign: "center", padding: 16 }}>
            <div style={{ fontSize: 11, color: "var(--text-dim)", textTransform: "uppercase" }}>Body Battery</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "var(--yellow)" }}>78</div>
            <div style={{ fontSize: 11, color: "var(--text-dim)" }}>+25 XP</div>
          </div>
          <div className="card" style={{ textAlign: "center", padding: 16 }}>
            <div style={{ fontSize: 11, color: "var(--text-dim)", textTransform: "uppercase" }}>Active Min</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "var(--orange)" }}>47</div>
            <div style={{ fontSize: 11, color: "var(--text-dim)" }}>+30 XP</div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="section-header">
          <span className="section-title">Activity Feed</span>
        </div>

        {feed.map((item) => (
          <div key={item.id} className="card" style={{ display: "flex", gap: 12, padding: "14px 16px" }}>
            <span style={{ fontSize: 24, flexShrink: 0 }}>{item.icon}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{item.title}</span>
                {item.xp > 0 && (
                  <span style={{ fontSize: 12, color: "var(--accent)", fontWeight: 700, flexShrink: 0 }}>+{item.xp} XP</span>
                )}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 2 }}>{item.detail}</div>
              <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 4 }}>
                {item.userName} \u00B7 {timeAgo(item.timestamp)}
              </div>
            </div>
          </div>
        ))}

        <div style={{ textAlign: "center", padding: 24, color: "var(--text-dim)", fontSize: 13 }}>
          Add friends to see their activity here
        </div>
      </div>

      {/* Bottom nav — updated with feed */}
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

"use client";

import { useState, useEffect } from "react";
import { loadState, type GameState } from "@/lib/game-state";

interface GuildMember {
  name: string;
  level: number;
  totalXp: number;
  streak: number;
  questsToday: number;
}

// Demo guild data — will connect to real backend later
const DEMO_MEMBERS: GuildMember[] = [
  { name: "You", level: 1, totalXp: 0, streak: 0, questsToday: 0 },
];

export default function GuildPage() {
  const [state, setState] = useState<GameState | null>(null);
  const [guildName, setGuildName] = useState("");
  const [hasGuild, setHasGuild] = useState(false);
  const [inviteCode, setInviteCode] = useState("");

  useEffect(() => {
    const s = loadState();
    setState(s);

    // Check if user has a guild in localStorage
    const guild = localStorage.getItem("questlife_guild");
    if (guild) {
      const parsed = JSON.parse(guild);
      setGuildName(parsed.name);
      setHasGuild(true);
      setInviteCode(parsed.inviteCode);
    }
  }, []);

  function createGuild() {
    if (!guildName.trim()) return;
    const code = Math.random().toString(36).slice(2, 8).toUpperCase();
    const guild = { name: guildName, inviteCode: code };
    localStorage.setItem("questlife_guild", JSON.stringify(guild));
    setHasGuild(true);
    setInviteCode(code);
  }

  function copyInvite() {
    navigator.clipboard.writeText(`Join my guild on QuestLife! Code: ${inviteCode}`);
  }

  if (!state) return null;

  const members: GuildMember[] = [
    {
      name: state.name || "You",
      level: state.level,
      totalXp: state.totalXp,
      streak: state.currentStreak,
      questsToday: state.questsCompletedToday,
    },
  ];

  return (
    <div className="container page-content">
      <div style={{ paddingTop: 24 }}>
        {!hasGuild ? (
          // Create or join guild
          <div className="slide-up">
            <div className="section-header" style={{ marginTop: 0 }}>
              <span className="section-title">Guild</span>
            </div>

            <div className="card" style={{ textAlign: "center", padding: 32 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>{"\u{1F6E1}\uFE0F"}</div>
              <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>
                Create a Guild
              </div>
              <div style={{ fontSize: 14, color: "var(--text-dim)", marginBottom: 24, lineHeight: 1.5 }}>
                Guilds let you compete with friends. Complete quests together, compare stats, and climb the leaderboard.
              </div>

              <input
                type="text"
                value={guildName}
                onChange={(e) => setGuildName(e.target.value)}
                placeholder="Guild name..."
                maxLength={30}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  fontSize: 15,
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  color: "var(--text)",
                  outline: "none",
                  marginBottom: 12,
                }}
              />

              <button
                className="btn btn-primary"
                style={{ width: "100%", padding: 14 }}
                disabled={!guildName.trim()}
                onClick={createGuild}
              >
                Create Guild
              </button>
            </div>

            <div className="card" style={{ textAlign: "center", padding: 24 }}>
              <div style={{ fontSize: 14, color: "var(--text-dim)", marginBottom: 12 }}>
                Have an invite code?
              </div>
              <input
                type="text"
                placeholder="Enter code..."
                maxLength={6}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  fontSize: 15,
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  color: "var(--text)",
                  outline: "none",
                  marginBottom: 12,
                  textAlign: "center",
                  letterSpacing: 4,
                  textTransform: "uppercase",
                }}
              />
              <button className="btn btn-secondary" style={{ width: "100%", padding: 14 }}>
                Join Guild
              </button>
            </div>
          </div>
        ) : (
          // Guild dashboard
          <div className="slide-up">
            <div className="section-header" style={{ marginTop: 0 }}>
              <span className="section-title">{guildName}</span>
            </div>

            {/* Invite */}
            <div className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 12, color: "var(--text-dim)" }}>Invite Code</div>
                <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: 3 }}>{inviteCode}</div>
              </div>
              <button className="btn btn-secondary" style={{ padding: "8px 16px", fontSize: 13 }} onClick={copyInvite}>
                Copy
              </button>
            </div>

            {/* Leaderboard */}
            <div className="section-header">
              <span className="section-title">Leaderboard</span>
            </div>

            {members
              .sort((a, b) => b.totalXp - a.totalXp)
              .map((member, i) => (
                <div key={member.name} className="card" style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: i === 0 ? "var(--accent)" : "var(--border)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, fontWeight: 800,
                  }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>{member.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-dim)" }}>
                      Level {member.level} &middot; {member.totalXp} XP
                      {member.streak > 0 && ` \u00B7 ${member.streak} day streak`}
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: "var(--green)", fontWeight: 700 }}>
                    {member.questsToday} today
                  </div>
                </div>
              ))}

            {members.length === 1 && (
              <div style={{ textAlign: "center", padding: 24, color: "var(--text-dim)", fontSize: 14 }}>
                Share your invite code to add friends!
              </div>
            )}

            {/* Weekly challenge placeholder */}
            <div className="section-header">
              <span className="section-title">Guild Challenge</span>
            </div>
            <div className="card" style={{ textAlign: "center", padding: 24 }}>
              <div style={{ fontSize: 14, color: "var(--text-dim)" }}>
                Complete 25 quests as a guild this week
              </div>
              <div className="xp-bar-track" style={{ marginTop: 12 }}>
                <div className="xp-bar-fill" style={{ width: `${(state.questsCompletedToday / 25) * 100}%` }} />
              </div>
              <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 6 }}>
                {state.questsCompletedToday}/25 quests
              </div>
            </div>
          </div>
        )}
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
        <a className="nav-item active" href="/play/guild">
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

import Link from "next/link";

const GOAL_PRESETS = [
  { icon: "\u{1F3CB}", label: "Get fit", category: "fitness" },
  { icon: "\u{1F4DA}", label: "Learn something new", category: "learning" },
  { icon: "\u{1F4B0}", label: "Save money", category: "finance" },
  { icon: "\u{1F9D8}", label: "Better mental health", category: "health" },
  { icon: "\u{1F3A8}", label: "Be more creative", category: "creativity" },
  { icon: "\u{1F465}", label: "Socialize more", category: "social" },
  { icon: "\u{1F4BC}", label: "Career growth", category: "career" },
  { icon: "\u{1F4D6}", label: "Read more", category: "learning" },
];

export default function LandingPage() {
  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      {/* Hero */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "32px 24px", maxWidth: 480, margin: "0 auto" }}>
        <div style={{ fontSize: 48, fontWeight: 800, lineHeight: 1.1, marginBottom: 12 }}>
          <span style={{ background: "linear-gradient(135deg, #7c5cfc, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Your life
          </span>
          <br />
          is an RPG.
        </div>

        <p style={{ fontSize: 17, color: "var(--text-dim)", lineHeight: 1.6, marginBottom: 32, maxWidth: 360 }}>
          Set goals. Get daily quests. Earn XP. Level up.
          Turn your everyday actions into a game.
        </p>

        {/* Goal preview */}
        <div style={{ marginBottom: 32, display: "flex", flexWrap: "wrap", gap: 4 }}>
          {GOAL_PRESETS.map((g) => (
            <div key={g.label} className="goal-chip">
              {g.icon} {g.label}
            </div>
          ))}
        </div>

        <Link href="/play" style={{ textDecoration: "none" }}>
          <button className="btn btn-primary" style={{ width: "100%", padding: "16px 32px", fontSize: 17 }}>
            Start playing — it&apos;s free
          </button>
        </Link>

        <p style={{ fontSize: 13, color: "var(--text-dim)", textAlign: "center", marginTop: 12 }}>
          No app to install. Works in your browser.
        </p>
      </div>

      {/* Social proof placeholder */}
      <div style={{ padding: "24px", textAlign: "center", borderTop: "1px solid var(--border)" }}>
        <p style={{ fontSize: 13, color: "var(--text-dim)" }}>
          Join the quest. Your future self will thank you.
        </p>
      </div>
    </div>
  );
}

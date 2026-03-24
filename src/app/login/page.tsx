"use client";

export default function LoginPage() {
  return (
    <div className="onboard-page container" style={{ textAlign: "center" }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>{"\u2694\uFE0F"}</div>
      <div className="onboard-title" style={{ textAlign: "center" }}>QuestLife</div>
      <div className="onboard-sub" style={{ textAlign: "center" }}>
        Sign in to save your progress, compete with friends, and keep your streak alive.
      </div>

      <button
        className="btn btn-primary"
        style={{ width: "100%", padding: 16, marginBottom: 12 }}
        onClick={() => {
          // For now, skip auth and go to onboarding
          window.location.href = "/onboard";
        }}
      >
        Continue with Google
      </button>

      <button
        className="btn btn-secondary"
        style={{ width: "100%", padding: 16 }}
        onClick={() => {
          window.location.href = "/onboard";
        }}
      >
        Try without account
      </button>

      <p style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 24 }}>
        Free forever. No credit card required.
      </p>
    </div>
  );
}

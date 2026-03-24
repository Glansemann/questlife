"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const GOAL_OPTIONS = [
  { icon: "\u{1F3CB}\uFE0F", label: "Get fit", category: "fitness", description: "Exercise, strength, cardio" },
  { icon: "\u{1F4DA}", label: "Learn something new", category: "learning", description: "Courses, books, skills" },
  { icon: "\u{1F4B0}", label: "Save money", category: "finance", description: "Budget, reduce spending" },
  { icon: "\u{1F9D8}", label: "Better mental health", category: "health", description: "Meditation, sleep, stress" },
  { icon: "\u{1F3A8}", label: "Be more creative", category: "creativity", description: "Art, music, writing" },
  { icon: "\u{1F465}", label: "Socialize more", category: "social", description: "Friends, networking, events" },
  { icon: "\u{1F4BC}", label: "Career growth", category: "career", description: "Skills, projects, promotion" },
  { icon: "\u{1F4D6}", label: "Read more", category: "reading", description: "Books, articles, papers" },
  { icon: "\u{1F373}", label: "Eat healthier", category: "nutrition", description: "Cooking, diet, meal prep" },
  { icon: "\u{1F30D}", label: "Learn a language", category: "language", description: "Practice, vocabulary, speaking" },
];

type Step = "name" | "goals" | "generating";

export default function OnboardPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("name");
  const [name, setName] = useState("");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  function toggleGoal(category: string) {
    setSelectedGoals((prev) =>
      prev.includes(category)
        ? prev.filter((g) => g !== category)
        : prev.length < 5
          ? [...prev, category]
          : prev,
    );
  }

  async function startAdventure() {
    setStep("generating");

    // Store onboarding data (will connect to real API later)
    const data = { name, goals: selectedGoals };
    localStorage.setItem("questlife_onboard", JSON.stringify(data));

    // Simulate quest generation delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    router.push("/play");
  }

  return (
    <div className="onboard-page container">
      {step === "name" && (
        <div className="slide-up">
          <div className="onboard-title">What should we call you?</div>
          <div className="onboard-sub">This is your character name in QuestLife.</div>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name..."
            maxLength={30}
            autoFocus
            style={{
              width: "100%",
              padding: "16px",
              fontSize: 17,
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              color: "var(--text)",
              outline: "none",
              marginBottom: 24,
            }}
          />

          <button
            className="btn btn-primary"
            style={{ width: "100%", padding: 16 }}
            disabled={name.trim().length === 0}
            onClick={() => setStep("goals")}
          >
            Continue
          </button>
        </div>
      )}

      {step === "goals" && (
        <div className="slide-up">
          <div className="onboard-title">Choose your quests</div>
          <div className="onboard-sub">
            Pick 2-5 areas you want to level up in. We&apos;ll generate daily quests based on these.
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 32 }}>
            {GOAL_OPTIONS.map((goal) => (
              <button
                key={goal.category}
                className={`goal-chip ${selectedGoals.includes(goal.category) ? "selected" : ""}`}
                onClick={() => toggleGoal(goal.category)}
              >
                {goal.icon} {goal.label}
              </button>
            ))}
          </div>

          <div style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 16, textAlign: "center" }}>
            {selectedGoals.length}/5 selected
          </div>

          <button
            className="btn btn-primary"
            style={{ width: "100%", padding: 16 }}
            disabled={selectedGoals.length < 2}
            onClick={startAdventure}
          >
            Start my adventure
          </button>
        </div>
      )}

      {step === "generating" && (
        <div className="slide-up" style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>{"\u2694\uFE0F"}</div>
          <div className="onboard-title" style={{ textAlign: "center" }}>Generating your quests...</div>
          <div className="onboard-sub" style={{ textAlign: "center" }}>
            Our AI is crafting personalized quests based on your goals.
          </div>
          <div className="xp-bar-track" style={{ maxWidth: 240, margin: "0 auto" }}>
            <div
              className="xp-bar-fill"
              style={{
                width: "60%",
                animation: "pulse 1.5s ease infinite",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

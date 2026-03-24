"use client";

import { useRef } from "react";
import type { LifeCard } from "@/lib/life-card";

const VIBE_GRADIENTS: Record<string, string> = {
  fire: "linear-gradient(135deg, #1a0505 0%, #2d0a0a 50%, #1a0a15 100%)",
  solid: "linear-gradient(135deg, #0a0a1a 0%, #0f0a2d 50%, #0a0f1a 100%)",
  chill: "linear-gradient(135deg, #0a0f1a 0%, #0a1a2d 50%, #0a1a1a 100%)",
  recovery: "linear-gradient(135deg, #0a1a0f 0%, #0a2d15 50%, #0a1a15 100%)",
};

const VIBE_EMOJI: Record<string, string> = {
  fire: "\u{1F525}",
  solid: "\u{1F4AA}",
  chill: "\u{1F30A}",
  recovery: "\u{1F9D8}",
};

const VIBE_LABEL: Record<string, string> = {
  fire: "ON FIRE",
  solid: "SOLID DAY",
  chill: "CHILL DAY",
  recovery: "RECOVERY",
};

export function LifeCardView({ card, onShare }: { card: LifeCard; onShare?: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <div
        ref={cardRef}
        style={{
          background: VIBE_GRADIENTS[card.vibe],
          borderRadius: 20,
          padding: 24,
          border: `1px solid ${card.color}30`,
          boxShadow: `0 0 40px ${card.color}15`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative glow */}
        <div style={{
          position: "absolute", top: -50, right: -50,
          width: 150, height: 150, borderRadius: "50%",
          background: `${card.color}08`, filter: "blur(40px)",
        }} />

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, color: "#ffffff50", textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 }}>
              {new Date(card.date).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>
              {card.userName}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: card.color }}>{card.level}</div>
            <div style={{ fontSize: 10, color: "#ffffff50", textTransform: "uppercase", letterSpacing: 1 }}>Level</div>
          </div>
        </div>

        {/* Vibe */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "6px 12px", borderRadius: 8,
          background: `${card.color}20`, marginBottom: 12,
        }}>
          <span>{VIBE_EMOJI[card.vibe]}</span>
          <span style={{ fontSize: 11, fontWeight: 800, color: card.color, letterSpacing: 1.5 }}>
            {VIBE_LABEL[card.vibe]}
          </span>
        </div>

        {/* Headline */}
        <div style={{ fontSize: 16, fontWeight: 600, color: "#ffffffcc", marginBottom: 20, lineHeight: 1.4 }}>
          {card.headline}
        </div>

        {/* Stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
          {card.stats.slice(0, 6).map((stat, i) => (
            <div key={i} style={{
              background: "#ffffff08",
              borderRadius: 12,
              padding: "10px 12px",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}>
              <span style={{ fontSize: 18 }}>{stat.icon}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{stat.value}</div>
                <div style={{ fontSize: 10, color: "#ffffff50" }}>{stat.label}{stat.xp > 0 ? ` \u00B7 +${stat.xp}` : ""}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Highlight */}
        {card.highlight && (
          <div style={{
            background: `${card.color}15`,
            border: `1px solid ${card.color}30`,
            borderRadius: 10,
            padding: "10px 14px",
            fontSize: 13,
            color: card.color,
            fontWeight: 600,
            marginBottom: 16,
          }}>
            {card.highlight}
          </div>
        )}

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 16 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: card.color }}>+{card.totalXpToday}</div>
              <div style={{ fontSize: 10, color: "#ffffff40" }}>XP TODAY</div>
            </div>
            {card.streak > 0 && (
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#fb923c" }}>{card.streak}</div>
                <div style={{ fontSize: 10, color: "#ffffff40" }}>STREAK</div>
              </div>
            )}
            {card.questsCompleted > 0 && (
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#34d399" }}>{card.questsCompleted}</div>
                <div style={{ fontSize: 10, color: "#ffffff40" }}>QUESTS</div>
              </div>
            )}
          </div>
          <div style={{ fontSize: 10, color: "#ffffff30", fontWeight: 600 }}>questlife.app</div>
        </div>
      </div>

      {/* Share button */}
      {onShare && (
        <button
          onClick={onShare}
          className="btn btn-primary"
          style={{ width: "100%", marginTop: 12, padding: 14 }}
        >
          Share Life Card
        </button>
      )}
    </div>
  );
}

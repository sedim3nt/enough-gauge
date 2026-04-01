"use client";

import { useEffect, useState } from "react";
import { EnoughConfig } from "@/app/page";
import EnoughGauge from "./EnoughGauge";

interface Props {
  config: EnoughConfig;
  onReset: () => void;
  onUpdate: (c: EnoughConfig) => void;
}

const QUOTES = [
  { text: "Enough is the most radical word.", author: null },
  { text: "The best things in life aren't things.", author: null },
  { text: "He who knows that enough is enough will always have enough.", author: "Lao Tzu" },
  { text: "There is no way to happiness. Happiness is the way.", author: "Thich Nhat Hanh" },
  { text: "Contentment is natural wealth, luxury is artificial poverty.", author: "Socrates" },
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
  { text: "We make a living by what we get, but we make a life by what we give.", author: "Winston Churchill" },
  { text: "The secret of happiness, you see, is not found in seeking more, but in developing the capacity to enjoy less.", author: "Socrates" },
  { text: "It is not the man who has too little, but the man who craves more, that is poor.", author: "Seneca" },
  { text: "Wealth consists not in having great possessions, but in having few wants.", author: "Epictetus" },
  { text: "To be content with what one has is the greatest and truest of riches.", author: "Cicero" },
  { text: "The less you need, the freer you are.", author: null },
  { text: "Enough is a feast.", author: "Buddhist proverb" },
  { text: "The roots below the earth claim no rewards for making the branches fruitful.", author: "Rabindranath Tagore" },
];

function formatDollar(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function getDailyQuote() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return QUOTES[dayOfYear % QUOTES.length];
}

function calculateEnough(config: EnoughConfig) {
  // "Enough" = have savings target covered + 3 months expenses buffer
  const monthlyNeed = config.monthlyExpenses + config.givingGoal;
  const enoughThreshold = config.savingsTarget + monthlyNeed * 3;
  const currentBalance = config.currentBalance;
  const hasEnough = currentBalance >= enoughThreshold;
  const gap = hasEnough ? 0 : enoughThreshold - currentBalance;
  const surplus = hasEnough ? currentBalance - enoughThreshold : 0;
  // Monthly surplus = surplus / 12 as rough "flow" estimate
  const monthlyFlow = surplus / 12;
  // Ratio: 0=nothing, 1.0=exactly enough, 1.5=cap
  const ratio = enoughThreshold > 0 ? currentBalance / enoughThreshold : 0;
  // Gap timeline: months to close gap at saving 20% of expenses
  const monthlySavings = config.monthlyExpenses * 0.2;
  const gapMonths = monthlySavings > 0 ? Math.ceil(gap / monthlySavings) : null;

  return {
    monthlyNeed,
    enoughThreshold,
    hasEnough,
    gap,
    surplus,
    monthlyFlow,
    ratio,
    gapMonths,
  };
}

export default function GaugeDashboard({ config, onReset, onUpdate }: Props) {
  const [editingBalance, setEditingBalance] = useState(false);
  const [balanceInput, setBalanceInput] = useState(String(config.currentBalance));
  const [showSettings, setShowSettings] = useState(false);
  const quote = getDailyQuote();

  const calc = calculateEnough(config);

  const handleBalanceSave = () => {
    const val = parseFloat(balanceInput);
    if (!isNaN(val)) {
      onUpdate({ ...config, currentBalance: val });
    }
    setEditingBalance(false);
  };

  const allocationCards = [
    {
      label: "Essentials",
      emoji: "🏠",
      amount: config.monthlyExpenses,
      sub: "/mo",
      color: "#F47D31",
      bgColor: "#FFF5ED",
    },
    {
      label: "Savings",
      emoji: "🌱",
      amount: config.savingsTarget,
      sub: "target",
      color: "#06D6A0",
      bgColor: "#E8FBF6",
    },
    {
      label: "Giving",
      emoji: "🤲",
      amount: config.givingGoal,
      sub: "/mo",
      color: "#FFD166",
      bgColor: "#FFFBE8",
    },
  ];

  return (
    <div
      className="min-h-screen flex flex-col items-center px-4 py-10"
      style={{ backgroundColor: "var(--cream)", maxWidth: "520px", margin: "0 auto" }}
    >
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <span style={{ fontSize: "20px" }}>⚖️</span>
          <span
            style={{
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
            }}
          >
            Enough Gauge
          </span>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "20px",
            opacity: 0.5,
            padding: "4px",
          }}
          title="Settings"
        >
          ⚙️
        </button>
      </div>

      {showSettings && (
        <div
          className="w-full mb-6 p-5"
          style={{
            backgroundColor: "var(--bg-card)",
            borderRadius: "20px",
            boxShadow: "0 2px 16px rgba(43,45,66,0.06)",
          }}
        >
          <p className="text-sm font-semibold mb-3" style={{ color: "var(--text-secondary)" }}>
            Settings
          </p>
          <button
            onClick={onReset}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "12px",
              border: "2px solid #FFE0CC",
              backgroundColor: "transparent",
              color: "var(--orange-primary)",
              fontWeight: 600,
              fontSize: "14px",
              cursor: "pointer",
              fontFamily: "var(--font-nunito)",
            }}
          >
            Reconfigure my Enough →
          </button>
        </div>
      )}

      {/* Current balance display */}
      <div className="w-full mb-6 text-center">
        {editingBalance ? (
          <div className="flex items-center justify-center gap-3">
            <div className="relative">
              <span
                className="absolute left-3 top-1/2 -translate-y-1/2 font-bold"
                style={{ color: "var(--text-secondary)", fontSize: "18px" }}
              >
                $
              </span>
              <input
                type="number"
                value={balanceInput}
                onChange={(e) => setBalanceInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleBalanceSave();
                  if (e.key === "Escape") setEditingBalance(false);
                }}
                autoFocus
                style={{
                  padding: "10px 12px 10px 28px",
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "var(--orange-primary)",
                  backgroundColor: "var(--orange-ultralight)",
                  border: "2px solid var(--orange-primary)",
                  borderRadius: "12px",
                  outline: "none",
                  fontFamily: "var(--font-nunito)",
                  width: "180px",
                }}
              />
            </div>
            <button
              onClick={handleBalanceSave}
              style={{
                padding: "10px 16px",
                backgroundColor: "var(--orange-primary)",
                color: "#FFF",
                borderRadius: "12px",
                border: "none",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Save
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              setBalanceInput(String(config.currentBalance));
              setEditingBalance(true);
            }}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "inline-flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "2px",
            }}
          >
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
              }}
            >
              Current Balance
            </span>
            <span
              style={{
                fontSize: "32px",
                fontWeight: 700,
                color: "var(--text-primary)",
                fontFamily: "var(--font-nunito)",
              }}
            >
              {formatDollar(config.currentBalance)}
            </span>
            <span
              style={{ fontSize: "11px", color: "var(--text-muted)", opacity: 0.7 }}
            >
              tap to update
            </span>
          </button>
        )}
      </div>

      {/* THE GAUGE */}
      <EnoughGauge
        ratio={calc.ratio}
        hasEnough={calc.hasEnough}
        gap={calc.hasEnough ? undefined : calc.gap}
      />

      {/* Status section */}
      <div className="w-full mt-8">
        {calc.hasEnough ? (
          /* Above enough */
          <div
            style={{
              backgroundColor: "#E8FBF6",
              borderRadius: "20px",
              padding: "24px",
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            <div style={{ fontSize: "28px", marginBottom: "8px" }}>🌊</div>
            <p
              style={{
                fontSize: "13px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#06D6A0",
                marginBottom: "6px",
              }}
            >
              Surplus Flow
            </p>
            <p
              className="font-display"
              style={{ fontSize: "28px", color: "var(--text-primary)", marginBottom: "6px" }}
            >
              {formatDollar(calc.monthlyFlow)}<span style={{ fontSize: "16px", color: "var(--text-muted)" }}>/mo</span>
            </p>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              available for living freely —<br />
              experiences, rest, generosity, play
            </p>
          </div>
        ) : (
          /* Below enough */
          <div
            style={{
              backgroundColor: "var(--orange-ultralight)",
              borderRadius: "20px",
              padding: "24px",
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            <div style={{ fontSize: "28px", marginBottom: "8px" }}>🌱</div>
            <p
              style={{
                fontSize: "13px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--orange-primary)",
                marginBottom: "6px",
              }}
            >
              Still Growing
            </p>
            <p
              className="font-display"
              style={{ fontSize: "22px", color: "var(--text-primary)", marginBottom: "8px", lineHeight: 1.3 }}
            >
              {formatDollar(calc.gap)} to enough
            </p>
            {calc.gapMonths !== null && (
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.55 }}>
                At your current pace, you could reach enough in about{" "}
                <strong style={{ color: "var(--text-primary)" }}>
                  {calc.gapMonths <= 12
                    ? `${calc.gapMonths} month${calc.gapMonths !== 1 ? "s" : ""}`
                    : `${Math.ceil(calc.gapMonths / 12)} year${Math.ceil(calc.gapMonths / 12) !== 1 ? "s" : ""}`}
                </strong>.
                <br />
                <span style={{ opacity: 0.7 }}>No rush — you're building, not behind.</span>
              </p>
            )}
          </div>
        )}
      </div>

      {/* Allocation cards */}
      <div className="w-full">
        <p
          style={{
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            marginBottom: "12px",
          }}
        >
          Your Enough Defined As
        </p>
        <div className="grid grid-cols-3 gap-3">
          {allocationCards.map((card) => (
            <div
              key={card.label}
              className="allocation-card"
              style={{
                backgroundColor: card.bgColor,
                borderRadius: "16px",
                padding: "16px 12px",
                textAlign: "center",
                boxShadow: "0 2px 8px rgba(43,45,66,0.04)",
              }}
            >
              <div style={{ fontSize: "22px", marginBottom: "6px" }}>{card.emoji}</div>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: card.color,
                  marginBottom: "2px",
                  fontFamily: "var(--font-nunito)",
                }}
              >
                {formatDollar(card.amount)}
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 600,
                    color: "var(--text-muted)",
                    marginLeft: "2px",
                  }}
                >
                  {card.sub}
                </span>
              </div>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "var(--text-muted)",
                  letterSpacing: "0.04em",
                }}
              >
                {card.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily quote */}
      <div
        style={{
          marginTop: "40px",
          paddingTop: "32px",
          borderTop: "1px solid var(--warm-gray)",
          width: "100%",
          textAlign: "center",
          paddingBottom: "24px",
        }}
      >
        <p
          className="quote-text font-display"
          style={{
            fontSize: "18px",
            color: "var(--text-secondary)",
            lineHeight: 1.6,
            marginBottom: "8px",
          }}
        >
          &ldquo;{quote.text}&rdquo;
        </p>
        {quote.author && (
          <p
            style={{
              fontSize: "13px",
              color: "var(--text-muted)",
              fontWeight: 600,
              letterSpacing: "0.04em",
            }}
          >
            — {quote.author}
          </p>
        )}
      </div>
    </div>
  );
}

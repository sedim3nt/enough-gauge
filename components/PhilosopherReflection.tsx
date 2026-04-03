"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { EnoughConfig } from "@/app/page";

interface Props {
  config: EnoughConfig;
}

export default function PhilosopherReflection({ config }: Props) {
  const [started, setStarted] = useState(false);

  const { messages, status, error, sendMessage } = useChat();

  const isStreaming = status === "streaming" || status === "submitted";

  const handleReflect = () => {
    setStarted(true);

    const monthlyNeed = config.monthlyExpenses + config.givingGoal;
    const enoughThreshold = config.savingsTarget + monthlyNeed * 3;
    const ratio = enoughThreshold > 0 ? config.currentBalance / enoughThreshold : 0;

    const userMessage = `Here are my financial inputs:
- Monthly expenses: $${config.monthlyExpenses.toLocaleString()}
- Savings target: $${config.savingsTarget.toLocaleString()}
- Monthly giving goal: $${config.givingGoal.toLocaleString()}
- Current balance: $${config.currentBalance.toLocaleString()}
- My "enough" threshold: $${enoughThreshold.toLocaleString()}
- I'm currently at ${Math.round(ratio * 100)}% of my enough number.

Please reflect on what "enough" means for me.`;

    sendMessage({ text: userMessage });
  };

  const assistantMessage = messages.find((m) => m.role === "assistant");
  const assistantText = assistantMessage?.parts
    ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("") || "";

  return (
    <div className="w-full" style={{ marginTop: "32px" }}>
      {!started ? (
        <div className="text-center">
          <button
            onClick={handleReflect}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "14px 28px",
              borderRadius: "28px",
              backgroundColor: "transparent",
              color: "var(--text-secondary)",
              fontSize: "15px",
              fontWeight: 600,
              border: "2px solid var(--warm-gray)",
              cursor: "pointer",
              fontFamily: "var(--font-nunito)",
              transition: "all 200ms var(--ease-gentle)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--orange-primary)";
              e.currentTarget.style.color = "var(--orange-primary)";
              e.currentTarget.style.backgroundColor = "var(--orange-ultralight)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--warm-gray)";
              e.currentTarget.style.color = "var(--text-secondary)";
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <span style={{ fontSize: "18px" }}>🪷</span>
            Reflect on My Enough
          </button>
        </div>
      ) : (
        <div
          className="step-enter"
          style={{
            backgroundColor: "var(--bg-card)",
            borderRadius: "20px",
            padding: "28px 24px",
            boxShadow: "0 2px 16px rgba(43,45,66,0.06)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-2 mb-4"
            style={{ paddingBottom: "16px", borderBottom: "1px solid var(--warm-gray)" }}
          >
            <span style={{ fontSize: "18px" }}>🪷</span>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
              }}
            >
              The Philosopher
            </span>
          </div>

          {/* Content */}
          {error ? (
            <p style={{ color: "#E74C3C", fontSize: "14px", lineHeight: 1.6 }}>
              {error.message.includes("429")
                ? "You've reflected enough for now. Try again in an hour. 🙏"
                : "Something went wrong. Try again later."}
            </p>
          ) : assistantText ? (
            <div
              className="font-display"
              style={{
                fontSize: "16px",
                lineHeight: 1.75,
                color: "var(--text-secondary)",
                whiteSpace: "pre-wrap",
              }}
            >
              {assistantText}
              {isStreaming && (
                <span
                  style={{
                    display: "inline-block",
                    width: "6px",
                    height: "18px",
                    backgroundColor: "var(--orange-primary)",
                    marginLeft: "2px",
                    animation: "blink 1s infinite",
                    verticalAlign: "text-bottom",
                    borderRadius: "1px",
                  }}
                />
              )}
            </div>
          ) : isStreaming ? (
            <div className="text-center" style={{ padding: "20px 0" }}>
              <div
                style={{
                  display: "inline-block",
                  fontSize: "14px",
                  color: "var(--text-muted)",
                  fontStyle: "italic",
                }}
              >
                contemplating your numbers…
              </div>
            </div>
          ) : null}

          {/* Disclaimer */}
          <p
            style={{
              marginTop: "16px",
              paddingTop: "12px",
              borderTop: "1px solid var(--warm-gray)",
              fontSize: "11px",
              color: "var(--text-muted)",
              textAlign: "center",
              opacity: 0.7,
            }}
          >
            AI-generated reflection. Not financial advice.
          </p>

          {/* Reflect again */}
          {!isStreaming && assistantText && (
            <div className="text-center" style={{ marginTop: "12px" }}>
              <button
                onClick={() => {
                  setStarted(false);
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "13px",
                  color: "var(--text-muted)",
                  fontFamily: "var(--font-nunito)",
                  fontWeight: 600,
                }}
              >
                ↻ Reflect again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

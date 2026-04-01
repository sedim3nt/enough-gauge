"use client";

import { useState, useRef, useEffect } from "react";
import { EnoughConfig } from "@/app/page";

interface Props {
  onComplete: (data: EnoughConfig) => void;
}

const steps = [
  {
    id: "expenses",
    emoji: "🏠",
    title: "Monthly Essentials",
    subtitle: "What does it cost to live your life each month?",
    hint: "Rent, food, utilities, transport — the basics",
  },
  {
    id: "savings",
    emoji: "🌱",
    title: "Savings Target",
    subtitle: "What does your safety net look like?",
    hint: "Emergency fund, future goals — what would feel secure",
  },
  {
    id: "giving",
    emoji: "🤲",
    title: "Giving Goal",
    subtitle: "How much do you want to give each month?",
    hint: "Donations, mutual aid, supporting community",
  },
  {
    id: "balance",
    emoji: "💰",
    title: "Current Balance",
    subtitle: "What's in your accounts right now?",
    hint: "Checking + savings — an honest number",
  },
];

function formatDollar(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function SetupFlow({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [values, setValues] = useState({
    monthlyExpenses: 3000,
    savingsTarget: 10000,
    givingGoal: 200,
    currentBalance: "",
  });
  const inputRef = useRef<HTMLInputElement>(null);

  const currentStep = steps[step];

  useEffect(() => {
    if (step === 3 && inputRef.current) {
      inputRef.current.focus();
    }
  }, [step]);

  const advance = () => {
    if (step === 3) {
      const balance = parseFloat(String(values.currentBalance)) || 0;
      onComplete({
        monthlyExpenses: values.monthlyExpenses,
        savingsTarget: values.savingsTarget,
        givingGoal: values.givingGoal,
        currentBalance: balance,
      });
      return;
    }
    setExiting(true);
    setTimeout(() => {
      setStep((s) => s + 1);
      setExiting(false);
    }, 280);
  };

  const getValue = () => {
    if (step === 0) return values.monthlyExpenses;
    if (step === 1) return values.savingsTarget;
    if (step === 2) return values.givingGoal;
    return 0;
  };

  const getMax = () => {
    if (step === 0) return 15000;
    if (step === 1) return 100000;
    if (step === 2) return 5000;
    return 0;
  };

  const getMin = () => {
    if (step === 0) return 500;
    if (step === 1) return 0;
    if (step === 2) return 0;
    return 0;
  };

  const handleSliderChange = (val: number) => {
    if (step === 0) setValues((v) => ({ ...v, monthlyExpenses: val }));
    if (step === 1) setValues((v) => ({ ...v, savingsTarget: val }));
    if (step === 2) setValues((v) => ({ ...v, givingGoal: val }));
  };

  const isValid = () => {
    if (step === 3) {
      const n = parseFloat(String(values.currentBalance));
      return !isNaN(n) && String(values.currentBalance).trim() !== "";
    }
    return true;
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12"
      style={{ backgroundColor: "var(--cream)" }}
    >
      {/* Logo mark */}
      <div className="mb-8 text-center">
        <div
          className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-3"
          style={{ backgroundColor: "var(--orange-ultralight)" }}
        >
          <span className="text-2xl">⚖️</span>
        </div>
        <p
          className="text-sm font-semibold tracking-widest uppercase"
          style={{ color: "var(--text-muted)", letterSpacing: "0.12em" }}
        >
          The Enough Gauge
        </p>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2 mb-10">
        {steps.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === step ? "24px" : "8px",
              height: "8px",
              borderRadius: "100px",
              backgroundColor:
                i < step
                  ? "var(--teal)"
                  : i === step
                  ? "var(--orange-primary)"
                  : "var(--warm-gray)",
              transition: "all 400ms var(--ease-spring)",
            }}
          />
        ))}
      </div>

      {/* Step card */}
      <div
        key={step}
        className={exiting ? "step-exit" : "step-enter"}
        style={{
          width: "100%",
          maxWidth: "440px",
          backgroundColor: "var(--bg-card)",
          borderRadius: "28px",
          padding: "40px 32px",
          boxShadow: "0 4px 32px rgba(43, 45, 66, 0.08)",
        }}
      >
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">{currentStep.emoji}</div>
          <h1
            className="font-display text-3xl mb-2"
            style={{ color: "var(--text-primary)", lineHeight: 1.2 }}
          >
            {currentStep.title}
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "16px", lineHeight: 1.55 }}>
            {currentStep.subtitle}
          </p>
        </div>

        {step < 3 ? (
          <div className="mb-8">
            {/* Value display */}
            <div
              className="text-center mb-6"
              style={{
                fontSize: "48px",
                fontWeight: 700,
                color: "var(--orange-primary)",
                fontFamily: "var(--font-nunito)",
                lineHeight: 1,
              }}
            >
              {formatDollar(getValue())}
              {step === 1 && <span className="text-base font-normal" style={{ color: "var(--text-muted)" }}></span>}
              {step === 2 && (
                <span className="text-base font-normal ml-1" style={{ color: "var(--text-muted)" }}>
                  /mo
                </span>
              )}
            </div>

            <input
              type="range"
              min={getMin()}
              max={getMax()}
              step={step === 1 ? 500 : 50}
              value={getValue()}
              onChange={(e) => handleSliderChange(Number(e.target.value))}
              className="w-full"
              style={{
                accentColor: "var(--orange-primary)",
              }}
            />

            <div
              className="flex justify-between mt-2 text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              <span>{formatDollar(getMin())}</span>
              <span>{formatDollar(getMax())}</span>
            </div>
          </div>
        ) : (
          <div className="mb-8">
            <div className="relative">
              <span
                className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-xl"
                style={{ color: "var(--text-secondary)" }}
              >
                $
              </span>
              <input
                ref={inputRef}
                type="number"
                placeholder="0"
                value={values.currentBalance}
                onChange={(e) =>
                  setValues((v) => ({ ...v, currentBalance: e.target.value }))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" && isValid()) advance();
                }}
                style={{
                  width: "100%",
                  padding: "16px 16px 16px 36px",
                  fontSize: "32px",
                  fontWeight: 700,
                  color: "var(--orange-primary)",
                  backgroundColor: "var(--orange-ultralight)",
                  border: "2px solid transparent",
                  borderRadius: "16px",
                  outline: "none",
                  fontFamily: "var(--font-nunito)",
                  transition: "border-color 200ms",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "var(--orange-primary)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = "transparent")
                }
              />
            </div>
          </div>
        )}

        <p
          className="text-center text-sm mb-8"
          style={{ color: "var(--text-muted)", fontStyle: "italic" }}
        >
          {currentStep.hint}
        </p>

        <button
          onClick={advance}
          disabled={!isValid()}
          style={{
            width: "100%",
            height: "52px",
            borderRadius: "28px",
            backgroundColor: isValid() ? "var(--orange-primary)" : "var(--warm-gray)",
            color: isValid() ? "#FFF" : "var(--text-muted)",
            fontSize: "16px",
            fontWeight: 600,
            border: "none",
            cursor: isValid() ? "pointer" : "not-allowed",
            boxShadow: isValid() ? "0 4px 12px rgba(244, 125, 49, 0.3)" : "none",
            transition: "all 200ms var(--ease-gentle)",
            fontFamily: "var(--font-nunito)",
          }}
        >
          {step === 3 ? "See My Gauge →" : "Continue →"}
        </button>
      </div>

      {step > 0 && (
        <button
          onClick={() => {
            setExiting(true);
            setTimeout(() => {
              setStep((s) => s - 1);
              setExiting(false);
            }, 280);
          }}
          className="mt-4 text-sm"
          style={{ color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer" }}
        >
          ← Back
        </button>
      )}
    </div>
  );
}

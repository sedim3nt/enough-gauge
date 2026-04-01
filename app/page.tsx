"use client";

import { useState, useEffect } from "react";
import SetupFlow from "@/components/SetupFlow";
import GaugeDashboard from "@/components/GaugeDashboard";

export interface EnoughConfig {
  monthlyExpenses: number;
  savingsTarget: number;
  givingGoal: number;
  currentBalance: number;
}

export default function Home() {
  const [config, setConfig] = useState<EnoughConfig | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("enough-config");
    if (stored) {
      try {
        setConfig(JSON.parse(stored));
      } catch {
        // ignore
      }
    }
    setLoaded(true);
  }, []);

  const handleSetupComplete = (data: EnoughConfig) => {
    localStorage.setItem("enough-config", JSON.stringify(data));
    setConfig(data);
  };

  const handleReset = () => {
    localStorage.removeItem("enough-config");
    setConfig(null);
  };

  if (!loaded) return null;

  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--cream)" }}>
      {!config ? (
        <SetupFlow onComplete={handleSetupComplete} />
      ) : (
        <GaugeDashboard config={config} onReset={handleReset} onUpdate={(c) => {
          localStorage.setItem("enough-config", JSON.stringify(c));
          setConfig(c);
        }} />
      )}
    </main>
  );
}

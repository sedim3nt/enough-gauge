"use client";

import { useEffect, useState } from "react";

interface Props {
  ratio: number; // 0 = nothing, 1 = exactly at enough, 2+ = double enough
  hasEnough: boolean;
  gap?: number;
}

export default function EnoughGauge({ ratio, hasEnough, gap }: Props) {
  const [animatedRatio, setAnimatedRatio] = useState(0);

  useEffect(() => {
    // Start animation after mount
    const timer = setTimeout(() => {
      setAnimatedRatio(Math.min(ratio, 1.5)); // cap display at 150%
    }, 150);
    return () => clearTimeout(timer);
  }, [ratio]);

  const size = 280;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 110;
  const strokeWidth = 14;

  // Arc goes from 210° to 330° (300° sweep, starting bottom-left)
  const startAngle = 210;
  const totalSweep = 300;

  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const arcPath = (startDeg: number, sweepDeg: number) => {
    const start = toRad(startDeg);
    const end = toRad(startDeg + sweepDeg);
    const x1 = cx + radius * Math.cos(start);
    const y1 = cy + radius * Math.sin(start);
    const x2 = cx + radius * Math.cos(end);
    const y2 = cy + radius * Math.sin(end);
    const largeArc = sweepDeg > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`;
  };

  const circumference = 2 * Math.PI * radius;
  const arcLength = (totalSweep / 360) * circumference;

  // Calculate fill
  const fillRatio = Math.max(0, Math.min(animatedRatio, 1.5));
  const fillLength = (fillRatio / 1.5) * arcLength;
  const dashOffset = arcLength - fillLength;

  // Color based on ratio
  const getColor = () => {
    if (animatedRatio < 0.7) return "#F47D31"; // orange - below
    if (animatedRatio < 1.0) return "#FFB347"; // amber - getting close
    if (animatedRatio < 1.2) return "#06D6A0"; // teal green - enough
    return "#FFD166"; // gold - above
  };

  // Track path (full arc)
  const trackPath = arcPath(startAngle, totalSweep);

  // "Enough" tick mark at 66.7% (1.0 ratio = 2/3 of max display)
  const enoughAngle = startAngle + (1.0 / 1.5) * totalSweep;
  const enoughRad = toRad(enoughAngle);
  const tickInner = 0.88;
  const tickOuter = 1.12;
  const tickX1 = cx + radius * tickInner * Math.cos(enoughRad);
  const tickY1 = cy + radius * tickInner * Math.sin(enoughRad);
  const tickX2 = cx + radius * tickOuter * Math.cos(enoughRad);
  const tickY2 = cy + radius * tickOuter * Math.sin(enoughRad);

  // Needle position
  const needleAngle = startAngle + fillRatio / 1.5 * totalSweep;
  const needleRad = toRad(needleAngle);
  const dotR = 8;
  const dotX = cx + radius * Math.cos(needleRad);
  const dotY = cy + radius * Math.sin(needleRad);

  const formatDollar = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div className="flex flex-col items-center">
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ overflow: "visible" }}>
          {/* Gradient definition */}
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F47D31" />
              <stop offset="50%" stopColor="#06D6A0" />
              <stop offset="100%" stopColor="#FFD166" />
            </linearGradient>
          </defs>

          {/* Track (background arc) */}
          <path
            d={trackPath}
            fill="none"
            stroke="#F0EDE8"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Filled arc - animated via stroke-dashoffset */}
          <path
            d={trackPath}
            fill="none"
            stroke={`url(#gaugeGradient)`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={dashOffset}
            className="gauge-arc"
            style={{
              transformOrigin: `${cx}px ${cy}px`,
            }}
          />

          {/* "Enough" tick mark */}
          <line
            x1={tickX1}
            y1={tickY1}
            x2={tickX2}
            y2={tickY2}
            stroke="#2B2D42"
            strokeWidth={2.5}
            strokeLinecap="round"
            opacity={0.4}
          />

          {/* Needle dot */}
          {fillRatio > 0.02 && (
            <circle
              cx={dotX}
              cy={dotY}
              r={dotR}
              fill={getColor()}
              stroke="white"
              strokeWidth={2.5}
              style={{
                filter: `drop-shadow(0 2px 4px ${getColor()}88)`,
                transition: "cx 1.2s cubic-bezier(0.34, 1.10, 0.64, 1), cy 1.2s cubic-bezier(0.34, 1.10, 0.64, 1)",
              }}
            />
          )}
        </svg>

        {/* Center content */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            paddingTop: "20px",
          }}
        >
          {hasEnough ? (
            <>
              <div style={{ fontSize: "32px", marginBottom: "4px" }}>✦</div>
              <div
                className="font-display"
                style={{
                  fontSize: "20px",
                  color: "var(--teal)",
                  lineHeight: 1.25,
                  fontWeight: 400,
                }}
              >
                You have
                <br />
                enough
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: "28px", marginBottom: "4px" }}>◌</div>
              <div
                style={{
                  fontSize: "13px",
                  color: "var(--text-muted)",
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  marginBottom: "2px",
                }}
              >
                Gap
              </div>
              <div
                className="font-display"
                style={{
                  fontSize: "22px",
                  color: "var(--orange-primary)",
                  lineHeight: 1.2,
                }}
              >
                {gap !== undefined ? formatDollar(gap) : "—"}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Enough label */}
      <div
        style={{
          fontSize: "12px",
          color: "var(--text-muted)",
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          marginTop: "-8px",
        }}
      >
        ↑ Enough threshold
      </div>
    </div>
  );
}

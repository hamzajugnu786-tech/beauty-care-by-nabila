"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  measureLCP,
  measureFID,
  measureCLS,
  measureINP,
  measureTTFB,
} from "@/lib/performance";

// ─── Types ───

interface VitalMetric {
  name: string;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  delta: number;
}

interface LayoutShiftEntry {
  value: number;
  time: number;
  source?: string;
}

// ─── Rating Colors ───

function getRatingColor(rating: VitalMetric["rating"]): string {
  switch (rating) {
    case "good":
      return "#22c55e";
    case "needs-improvement":
      return "#f59e0b";
    case "poor":
      return "#ef4444";
    default:
      return "#9ca3af";
  }
}

function getRatingLabel(rating: VitalMetric["rating"]): string {
  switch (rating) {
    case "good":
      return "Good";
    case "needs-improvement":
      return "Needs Work";
    case "poor":
      return "Poor";
    default:
      return "N/A";
  }
}

function formatValue(name: string, value: number): string {
  switch (name) {
    case "CLS":
      return value.toFixed(3);
    case "LCP":
    case "FID":
    case "INP":
    case "TTFB":
      return `${Math.round(value)}ms`;
    default:
      return `${Math.round(value)}ms`;
  }
}

// ─── Component ───

export function PerformanceMonitor() {
  const [vitals, setVitals] = useState<Map<string, VitalMetric>>(new Map());
  const [layoutShifts, setLayoutShifts] = useState<LayoutShiftEntry[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoaded] = useState(() => {
    if (process.env.NODE_ENV === "production") return false;
    if (typeof window === "undefined") return false;
    const params = new URLSearchParams(window.location.search);
    return params.has("perf");
  });
  const shiftsWarnedRef = useRef(false);

  // Measure all Core Web Vitals
  useEffect(() => {
    if (!isLoaded) return;

    const handleMetric = (metric: VitalMetric) => {
      setVitals((prev) => {
        const next = new Map(prev);
        next.set(metric.name, metric);
        return next;
      });
    };

    const cleanups = [
      measureLCP(handleMetric),
      measureFID(handleMetric),
      measureCLS((metric) => {
        handleMetric(metric);

        // Track layout shift details
        if (metric.name === "CLS" && metric.delta > 0) {
          setLayoutShifts((prev) => [
            ...prev.slice(-19), // Keep last 20 entries
            {
              value: metric.delta,
              time: Date.now(),
            },
          ]);

          // Warn about significant layout shifts
          if (metric.value > 0.1 && !shiftsWarnedRef.current) {
            shiftsWarnedRef.current = true;
            console.warn(
              `[Performance] CLS exceeded 0.1 threshold. Current: ${metric.value.toFixed(3)}`,
              layoutShifts
            );
          }
        }
      }),
      measureINP(handleMetric),
      measureTTFB(handleMetric),
    ];

    return () => cleanups.forEach((fn) => fn());
  }, [isLoaded]);

  // Log warnings for poor metrics
  useEffect(() => {
    vitals.forEach((metric) => {
      if (metric.rating === "poor") {
        console.warn(
          `[Performance] ${metric.name} is poor: ${formatValue(metric.name, metric.value)}`
        );
      }
    });
  }, [vitals]);

  // Calculate overall performance score
  const performanceScore = useCallback(() => {
    const scores: number[] = [];
    const weights: Record<string, number> = {
      LCP: 0.25,
      FID: 0.25,
      CLS: 0.25,
      INP: 0.25,
    };

    vitals.forEach((metric) => {
      const weight = weights[metric.name] || 0.1;
      let score = 0;
      switch (metric.rating) {
        case "good":
          score = 100;
          break;
        case "needs-improvement":
          score = 50;
          break;
        case "poor":
          score = 0;
          break;
      }
      scores.push(score * weight);
    });

    return scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / Object.keys(weights).length * 100 / Math.min(scores.length, Object.keys(weights).length))
      : 0;
  }, [vitals]);

  // Don't render in production or without ?perf=true
  if (process.env.NODE_ENV === "production" || !isLoaded) {
    return null;
  }

  const score = performanceScore();
  const scoreColor =
    score >= 75 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <>
      {/* Toggle Button - Fixed position */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        style={{
          position: "fixed",
          bottom: "16px",
          right: "16px",
          zIndex: 9999,
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          background: "#1C1C22",
          border: `2px solid ${scoreColor}`,
          color: scoreColor,
          fontSize: "12px",
          fontWeight: "bold",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          transition: "transform 0.2s ease",
        }}
        aria-label="Toggle performance monitor"
        title={`Performance Score: ${score}`}
        onMouseEnter={(e) => {
          (e.target as HTMLElement).style.transform = "scale(1.1)";
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLElement).style.transform = "scale(1)";
        }}
      >
        {score || "?"}
      </button>

      {/* Monitor Panel */}
      {isVisible && (
        <div
          style={{
            position: "fixed",
            bottom: "68px",
            right: "16px",
            zIndex: 9998,
            width: "320px",
            maxHeight: isExpanded ? "480px" : "200px",
            background: "#0C0C10",
            border: "1px solid #3D3520",
            borderRadius: "12px",
            overflow: "hidden",
            transition: "max-height 0.3s ease",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            fontFamily: "ui-monospace, monospace",
            fontSize: "12px",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 14px",
              borderBottom: "1px solid #3D3520",
              background: "#141418",
            }}
          >
            <span style={{ color: "#D4AF37", fontWeight: 600 }}>
              Performance Monitor
            </span>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              style={{
                background: "none",
                border: "none",
                color: "#9A9498",
                cursor: "pointer",
                fontSize: "10px",
              }}
            >
              {isExpanded ? "Collapse" : "Expand"}
            </button>
          </div>

          {/* Vitals Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "8px",
              padding: "10px 14px",
            }}
          >
            {["LCP", "FID", "CLS", "INP", "TTFB"].map((name) => {
              const metric = vitals.get(name);
              return (
                <div
                  key={name}
                  style={{
                    padding: "8px",
                    background: "#141418",
                    borderRadius: "6px",
                    border: "1px solid #24242C",
                  }}
                >
                  <div
                    style={{
                      color: "#9A9498",
                      fontSize: "10px",
                      marginBottom: "4px",
                    }}
                  >
                    {name}
                  </div>
                  <div
                    style={{
                      color: metric ? getRatingColor(metric.rating) : "#9A9498",
                      fontSize: "14px",
                      fontWeight: 700,
                    }}
                  >
                    {metric
                      ? formatValue(metric.name, metric.value)
                      : "--"}
                  </div>
                  <div
                    style={{
                      color: metric ? getRatingColor(metric.rating) : "#9A9498",
                      fontSize: "9px",
                      marginTop: "2px",
                    }}
                  >
                    {metric ? getRatingLabel(metric.rating) : "Waiting..."}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Expanded Content - Layout Shifts */}
          {isExpanded && (
            <div
              style={{
                padding: "10px 14px",
                borderTop: "1px solid #3D3520",
              }}
            >
              <div
                style={{
                  color: "#D4AF37",
                  fontSize: "10px",
                  fontWeight: 600,
                  marginBottom: "6px",
                }}
              >
                Layout Shifts ({layoutShifts.length})
              </div>
              <div
                style={{
                  maxHeight: "120px",
                  overflowY: "auto",
                  paddingRight: "4px",
                }}
              >
                {layoutShifts.length === 0 ? (
                  <div style={{ color: "#22c55e", fontSize: "10px" }}>
                    No layout shifts detected
                  </div>
                ) : (
                  layoutShifts.map((shift, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "3px 0",
                        borderBottom: "1px solid #24242C",
                        fontSize: "10px",
                      }}
                    >
                      <span style={{ color: shift.value > 0.01 ? "#f59e0b" : "#9A9498" }}>
                        {shift.value.toFixed(4)}
                      </span>
                      <span style={{ color: "#9A9498" }}>
                        {new Date(shift.time).toLocaleTimeString()}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Performance Tips */}
              <div
                style={{
                  marginTop: "10px",
                  padding: "8px",
                  background: "#141418",
                  borderRadius: "6px",
                  border: "1px solid #24242C",
                }}
              >
                <div
                  style={{
                    color: "#D4AF37",
                    fontSize: "10px",
                    fontWeight: 600,
                    marginBottom: "4px",
                  }}
                >
                  Tips
                </div>
                <ul
                  style={{
                    color: "#9A9498",
                    fontSize: "9px",
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                  }}
                >
                  <li>- Use gpu-accelerate class for animated elements</li>
                  <li>- Set min-height on sections to prevent CLS</li>
                  <li>- Remove will-change after animations complete</li>
                  <li>- Use content-visibility for off-screen sections</li>
                  <li>- Only animate transform and opacity</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

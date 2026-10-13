"use client";
import type { CSSProperties } from "react";
import {
  CaretRightIcon,
  DropIcon,
  LightningIcon,
  MoonStarsIcon,
  TargetIcon,
  WaveSineIcon,
} from "@phosphor-icons/react";
import type { WellnessObservation } from "@nila/validation";
import { observedGoals, observedNumber } from "@/lib/wellness-display";
import { HyperframesVisual } from "./hyperframes-visual";
import { Reveal } from "./dashboard-motion";

export function OrbMetrics({
  observations,
  onSelect,
}: {
  observations: WellnessObservation[];
  onSelect: (topic: string) => void;
}) {
  const goals = observedGoals(observations);
  const metrics = [
    {
      topic: "water",
      label: "Water",
      unit: "L",
      scale: 4,
      icon: DropIcon,
      tone: "water",
    },
    {
      topic: "sleep",
      label: "Sleep",
      unit: "h",
      scale: 12,
      icon: MoonStarsIcon,
      tone: "sleep",
    },
    {
      topic: "energy",
      label: "Energy",
      unit: "/ 10",
      scale: 10,
      icon: LightningIcon,
      tone: "energy",
    },
    {
      topic: "stress",
      label: "Stress level",
      unit: "/ 10",
      scale: 10,
      icon: WaveSineIcon,
      tone: "stress",
    },
    {
      topic: "goals",
      label: "Goal achievement",
      unit: goals ? `/ ${goals.total}` : "",
      scale: goals?.total ?? 1,
      icon: TargetIcon,
      tone: "goals",
    },
  ];
  return (
    <div className="orb-metrics">
      {metrics.map((metric, index) => {
        const value =
          metric.topic === "goals"
            ? goals?.done
            : observedNumber(observations, metric.topic);
        const fill = Math.min(1, (value ?? 0) / metric.scale);
        const Icon = metric.icon;
        return (
          <Reveal
            key={metric.topic}
            delay={index * 45}
            className={`metric-panel ${metric.tone}`}
          >
            <section
              className={`orb-card tone-${metric.tone}`}
              aria-label={`${metric.label}: ${value == null ? "not reported" : `${value} ${metric.unit}`}`}
            >
              <div className="orb-card-top">
                <Icon size={27} weight="duotone" />
                <h2>{metric.label}</h2>
                <button
                  className="round-arrow"
                  aria-label={`View ${metric.label.toLowerCase()}`}
                  onClick={() => onSelect(metric.topic)}
                >
                  <CaretRightIcon size={18} />
                </button>
              </div>
              <div className="metric-content">
                <div>
                  <div className="metric-number">
                    <strong>{value ?? "—"}</strong>
                    <span>{metric.unit}</span>
                  </div>
                  <p>
                    {value == null
                      ? "Not reported"
                      : metric.topic === "goals"
                        ? "goals you reported"
                        : "From your nightly call"}
                  </p>
                </div>
                {metric.topic === "sleep" && (
                  <HyperframesVisual name="sleep" enabled={value != null} />
                )}
                {metric.topic === "water" && (
                  <div
                    className={`live-water ${value == null ? "unreported" : ""}`}
                    aria-hidden="true"
                    data-level={value ?? "unknown"}
                  >
                    <div style={{ transform: `scaleY(${fill})` }}>
                      <i />
                      <HyperframesVisual
                        name="water-wave"
                        enabled={value != null}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="metric-track" aria-hidden="true">
                <span
                  style={
                    {
                      "--fill": fill,
                      transform: `scaleX(${fill})`,
                    } as CSSProperties
                  }
                />
              </div>
              <span className="scale-note">
                {metric.topic === "goals"
                  ? goals
                    ? `${Math.round(fill * 100)}% reported complete`
                    : "Awaiting your answer"
                  : `Visual scale: 0–${metric.scale} ${metric.unit}`}
              </span>
            </section>
          </Reveal>
        );
      })}
    </div>
  );
}

"use client";
import { useId } from "react";
import type { Journal, Mood } from "@nila/shared-types";
import { observedNumber } from "@/lib/wellness-display";
import { HyperframesVisual, weekdayArtwork } from "./hyperframes-visual";

export function dayLabel(date: string, full = false) {
  return new Intl.DateTimeFormat("en", {
    weekday: full ? "long" : "short",
    timeZone: "UTC",
  }).format(new Date(`${date}T12:00:00Z`));
}
export function dayMood(date: string, journals: Journal[], moods: Mood[]) {
  return (
    observedNumber(
      journals.find((j) => j.entry_date === date)?.wellness ?? [],
      "mood",
    ) ?? moods.find((m) => m.source === "voice" && m.entry_date === date)?.score
  );
}
export function OrbDays({
  dates,
  journals,
  moods,
  selected,
  onSelect,
}: {
  dates: string[];
  journals: Journal[];
  moods: Mood[];
  selected: string;
  onSelect: (date: string) => void;
}) {
  return (
    <div className={`orb-days ${dates.length > 7 ? "expanded" : ""}`}>
      {dates.map((date) => {
        const score = dayMood(date, journals, moods);
        const day = new Date(`${date}T12:00:00Z`).getUTCDay();
        return (
          <button
            className="mood-day"
            key={date}
            onClick={() => onSelect(date)}
            aria-pressed={selected === date}
            aria-label={`${date}, ${dayLabel(date, true)}, ${score == null ? "mood not reported" : `mood ${score} out of ten`}`}
          >
            <span>{dates.length > 7 ? date.slice(8) : dayLabel(date)}</span>
            {dates.length <= 7 ? (
              <HyperframesVisual
                name={weekdayArtwork[day]!}
                enabled={score != null}
              />
            ) : (
              <span
                aria-hidden="true"
                className={`mini-orb day-${day} ${score == null ? "unreported" : ""}`}
              />
            )}
            <strong>{score == null ? "—" : `${score}/10`}</strong>
          </button>
        );
      })}
    </div>
  );
}

export function MoodStressChart({
  dates,
  journals,
  moods,
}: {
  dates: string[];
  journals: Journal[];
  moods: Mood[];
}) {
  const chartId = useId().replaceAll(":", "");
  const rows = dates.map((date) => ({
    mood: dayMood(date, journals, moods),
    stress: observedNumber(
      journals.find((j) => j.entry_date === date)?.wellness ?? [],
      "stress",
    ),
  }));
  const average = (key: "mood" | "stress") => {
    const numbers = rows.flatMap((row) =>
      row[key] == null ? [] : [row[key]!],
    );
    return numbers.length
      ? (numbers.reduce((a, b) => a + b, 0) / numbers.length).toFixed(1)
      : "—";
  };
  const x = (i: number) => 35 + (i * 710) / Math.max(1, dates.length - 1);
  const y = (value: number) => 100 - value * 8;
  function paths(key: "mood" | "stress") {
    const segments: { x: number; y: number }[][] = [];
    let segment: { x: number; y: number }[] = [];
    rows.forEach((row, i) => {
      const value = row[key];
      if (value == null) {
        if (segment.length) segments.push(segment);
        segment = [];
      } else segment.push({ x: x(i), y: y(value) });
    });
    if (segment.length) segments.push(segment);
    return segments.map((points) => {
      const first = points[0]!,
        last = points.at(-1)!;
      let line = `M${first.x},${first.y}`;
      for (let i = 1; i < points.length; i++) {
        const previous = points[i - 1]!,
          next = points[i]!;
        const step = (next.x - previous.x) / 3;
        line += ` C${previous.x + step},${previous.y} ${next.x - step},${next.y} ${next.x},${next.y}`;
      }
      return { line, area: `${line} L${last.x},100 L${first.x},100 Z` };
    });
  }
  return (
    <div className="orb-chart">
      <div className="chart-legend">
        <span>
          <i className="mood-dot" />
          Mood level
        </span>
        <span>
          <i className="stress-dot" />
          Stress level
        </span>
        <strong>
          {average("mood")} <small>avg mood</small>
        </strong>
        <strong className="stress-average">
          {average("stress")} <small>avg stress</small>
        </strong>
      </div>
      <svg
        viewBox="0 0 780 135"
        role="img"
        aria-label="Mood and stress trends from reported answers. Missing values are gaps; scores range from zero to ten."
      >
        <defs>
          {(["mood", "stress"] as const).map((key) => (
            <linearGradient
              key={key}
              id={`${chartId}-${key}`}
              x1="0"
              x2="0"
              y1="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor={
                  key === "mood" ? "var(--orb-purple)" : "var(--orb-orange)"
                }
                stopOpacity=".22"
              />
              <stop
                offset="100%"
                stopColor={
                  key === "mood" ? "var(--orb-purple)" : "var(--orb-orange)"
                }
                stopOpacity=".025"
              />
            </linearGradient>
          ))}
        </defs>
        {[0, 5, 10].map((tick) => (
          <g key={tick}>
            <line
              x1="35"
              x2="760"
              y1={y(tick)}
              y2={y(tick)}
              className="chart-grid"
            />
            <text x="2" y={y(tick) + 4}>
              {tick}
            </text>
          </g>
        ))}
        {(["mood", "stress"] as const).map((key) => (
          <g key={key} className={`series-${key}`}>
            {paths(key).map((path, i) => (
              <g key={i}>
                <path
                  d={path.area}
                  fill={`url(#${chartId}-${key})`}
                  stroke="none"
                />
                <path
                  d={path.line}
                  pathLength="1"
                  fill="none"
                  strokeWidth="2.5"
                  className="trend-path"
                />
              </g>
            ))}
            {rows.map((row, i) =>
              row[key] == null ? null : (
                <circle key={i} cx={x(i)} cy={y(row[key]!)} r="4.5">
                  <title>
                    {dates[i]}: {key} {row[key]}/10
                  </title>
                </circle>
              ),
            )}
          </g>
        ))}
        {dates.map((date, i) =>
          dates.length <= 7 || i % 5 === 0 ? (
            <text key={date} x={x(i)} y="126" textAnchor="middle">
              {dates.length > 7 ? date.slice(5) : dayLabel(date)}
            </text>
          ) : null,
        )}
      </svg>
      <details className="chart-data">
        <summary>Chart values</summary>
        <table>
          <caption>Reported mood and stress</caption>
          <thead>
            <tr>
              <th>Date</th>
              <th>Mood / 10</th>
              <th>Stress / 10</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={dates[i]}>
                <th>{dates[i]}</th>
                <td>{row.mood ?? "Not reported"}</td>
                <td>{row.stress ?? "Not reported"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}

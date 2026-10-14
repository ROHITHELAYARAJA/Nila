"use client";
import type { CSSProperties } from "react";
import type { Journal, Mood } from "@nila/shared-types";
import {
  ForkKnifeIcon,
  NotebookIcon,
  PersonSimpleRunIcon,
  StarIcon,
  WaveformIcon,
} from "@phosphor-icons/react";
import { observedNumber } from "@/lib/wellness-display";
import { dayLabel, dayMood } from "./orb-trends";
import { Reveal } from "./dashboard-motion";

export function DailyCards({
  journal,
  dates,
  journals,
}: {
  journal?: Journal;
  dates: string[];
  journals: Journal[];
}) {
  const observations = journal?.wellness ?? [];
  const reflection =
    journal?.user_edit ??
    journal?.statements?.find((s) => s.kind === "reflection")?.quote ??
    journal?.reflection;
  const win =
    observations.find((o) => o.topic === "achievement")?.value ??
    journal?.statements?.find((s) => s.kind === "positive")?.quote;
  const cards = [
    {
      topic: "activity",
      title: "Movement",
      icon: PersonSimpleRunIcon,
      tone: "water",
      unit: "min",
      scale: 60,
    },
    {
      topic: "nutrition",
      title: "Meals",
      icon: ForkKnifeIcon,
      tone: "meals",
      unit: "meals",
      scale: 5,
    },
    {
      topic: "journal",
      title: "Reflection",
      icon: NotebookIcon,
      tone: "sleep",
      text: reflection,
    },
    {
      topic: "achievement",
      title: "Daily win",
      icon: StarIcon,
      tone: "win",
      text: typeof win === "string" ? win : undefined,
    },
  ];
  return (
    <div className="daily-cards">
      {cards.map((card, index) => {
        const value = observedNumber(observations, card.topic);
        const Icon = card.icon;
        const text =
          card.text ??
          (value == null
            ? observations.find((o) => o.topic === card.topic)?.value
            : undefined);
        return (
          <Reveal key={card.topic} delay={index * 55}>
            <section className={`orb-card tone-${card.tone}`}>
              <div className="orb-card-top">
                <Icon size={26} weight="duotone" />
                <h2>{card.title}</h2>
              </div>
              {card.scale ? (
                <>
                  <div className="metric-number">
                    <strong>{value ?? "—"}</strong>
                    <span>{card.unit}</span>
                  </div>
                  <p>
                    {value == null
                      ? typeof text === "string"
                        ? text
                        : "Not reported"
                      : "Recorded from your call"}
                  </p>
                  <div
                    className="mini-bars"
                    aria-label={`${card.title} over the latest seven days. Missing days have no bar.`}
                  >
                    {dates.slice(-7).map((date) => {
                      const n = observedNumber(
                        journals.find((j) => j.entry_date === date)?.wellness ??
                          [],
                        card.topic,
                      );
                      return (
                        <div key={date}>
                          <i
                            className={n == null ? "missing" : ""}
                            style={
                              {
                                "--bar-fill": Math.min(
                                  1,
                                  (n ?? 0) / card.scale!,
                                ),
                                transform: `scaleY(${Math.min(1, (n ?? 0) / card.scale!)})`,
                              } as CSSProperties
                            }
                            title={`${date}: ${n ?? "not reported"} ${n == null ? "" : card.unit}`}
                          />
                          <span>{dayLabel(date).slice(0, 1)}</span>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <>
                  <p className="daily-quote">
                    {typeof text === "string"
                      ? text
                      : "A little space for your next check-in."}
                  </p>
                  <span className="scale-note">
                    {journal
                      ? "Your words, from an approved call"
                      : "No approved summary yet"}
                  </span>
                </>
              )}
            </section>
          </Reveal>
        );
      })}
    </div>
  );
}

export function VoiceReport({
  journal,
  date,
}: {
  journal?: Journal;
  date: string;
}) {
  const topics = [
    ["activity", "🏃", "Movement"],
    ["nutrition", "🍴", "Meals"],
    ["journal", "📔", "Reflection"],
    ["achievement", "⭐", "Daily win"],
  ];
  return (
    <section className="orb-card voice-report">
      <div className="report-title">
        <WaveformIcon size={27} weight="duotone" />
        <div>
          <h2>Today's voice report</h2>
          <p>Only what you approved in your conversation.</p>
        </div>
        <span className="small-chip">{date}</span>
      </div>
      <div className="voice-report-rows">
        {topics.map(([topic, emoji, label]) => {
          const observation = journal?.wellness?.find((o) => o.topic === topic);
          const value =
            topic === "journal"
              ? (journal?.user_edit ??
                journal?.statements?.find((s) => s.kind === "reflection")
                  ?.quote ??
                journal?.reflection)
              : observation?.value;
          return (
            <div key={topic} aria-label={`Report: ${label}`}>
              <span aria-hidden="true">{emoji}</span>
              <strong>{label}</strong>
              <span>{value == null ? "Not reported" : String(value)}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function WeeklyConsistency({
  dates,
  journals,
  moods,
}: {
  dates: string[];
  journals: Journal[];
  moods: Mood[];
}) {
  const week = dates.slice(-7);
  const rows = [
    ["mood", "Mood"],
    ["water", "Water"],
    ["sleep", "Sleep"],
    ["energy", "Energy"],
    ["stress", "Stress"],
    ["goals", "Goals"],
  ];
  const count = week.filter((date) =>
    journals.some((j) => j.entry_date === date),
  ).length;
  return (
    <section className="orb-card consistency-card">
      <div className="report-title">
        <div>
          <h2>Weekly consistency</h2>
          <p>Reported answers, with room for quiet days.</p>
        </div>
        <span className="small-chip">
          {count} of {week.length} days
        </span>
      </div>
      <div
        className="consistency-grid"
        style={{ "--days": week.length } as CSSProperties}
      >
        <span />
        {week.map((date) => (
          <span key={date}>{dayLabel(date)}</span>
        ))}
        {rows.map(([topic, label]) => (
          <div className={`consistency-row consistency-${topic}`} key={topic}>
            <span>{label}</span>
            {week.map((date) => {
              const observation = journals
                .find((j) => j.entry_date === date)
                ?.wellness?.find((o) => o.topic === topic);
              const score = dayMood(date, journals, moods);
              const reported =
                topic === "mood" ? score != null : observation != null;
              return (
                <span
                  className={`consistency-cell ${reported ? "reported" : ""}`}
                  key={date}
                  role="img"
                  aria-label={`${date}, ${label}: ${reported ? "reported" : "not reported"}`}
                >
                  <i />
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}

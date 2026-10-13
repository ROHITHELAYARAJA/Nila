"use client";
import { useState } from "react";
import {
  CalendarBlankIcon,
  PhoneCallIcon,
  QuotesIcon,
  ArrowClockwiseIcon,
} from "@phosphor-icons/react";
import { dateWindow, voiceHistory } from "@nila/wellness";
import { useProduct } from "./product-context";
import { Modal, Notice, Skeleton } from "./ui";
import { ScheduleForm } from "./setup";
import { WellnessCollection, WellnessDetails } from "./wellness-cards";
import { HyperframesVisual } from "./hyperframes-visual";
import { Reveal } from "./dashboard-motion";
import { OrbDays, MoodStressChart, dayMood } from "./orb-trends";
import { OrbMetrics } from "./orb-metrics";
import { DailyCards, VoiceReport, WeeklyConsistency } from "./orb-reports";

export function localDate(timezone = "Asia/Kolkata", date = new Date()) {
  return dateWindow(timezone, 1, 0, date)[0]!;
}
export function viewLink(section: string, preview: boolean) {
  return preview ? `/preview?view=${section}` : `/${section}`;
}

export function DashboardView() {
  const { data, loading, error, preview, refresh } = useProduct();
  const [range, setRange] = useState<"7" | "previous" | "30" | "all">("7");
  const [selected, setSelected] = useState<string | null>(null);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [detail, setDetail] = useState<string | null>(null);
  if (!data)
    return loading ? (
      <Skeleton />
    ) : (
      <Notice error>
        {error || "Your snapshot could not load."}
        <button className="text-button" onClick={() => void refresh()}>
          Retry
        </button>
      </Notice>
    );
  const history = voiceHistory(data.journals);
  const dates =
    range === "all" && history.length
      ? [...new Set(history.map((j) => j.entry_date))].sort()
      : dateWindow(
          data.profile.timezone,
          range === "30" ? 30 : 7,
          range === "previous" ? 7 : 0,
        );
  const available = history.filter((j) => dates.includes(j.entry_date));
  const currentDate =
    selected && dates.includes(selected)
      ? selected
      : (available[0]?.entry_date ?? dates.at(-1)!);
  const journal = history.find((j) => j.entry_date === currentDate);
  const observations = journal?.wellness ?? [];
  const schedule = data.schedules.find((s) => s.enabled) ?? data.schedules[0];
  const active = data.calls.some((c) =>
    ["ringing", "in-progress", "initiated"].includes(c.status),
  );
  const dateLabel = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${currentDate}T12:00:00Z`));
  const values = dates.flatMap((date) => {
    const value = dayMood(date, history, data.moods);
    return value == null ? [] : [value];
  });
  const score = values.length
    ? Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10)
    : undefined;
  return (
    <div className="orb-home">
      <div className="orb-heading">
        <div>
          <span className="eyebrow">A LITTLE WINDOW INTO YOUR DAYS</span>
          <h1>Your days, in a softer light.</h1>
          <p>
            Nila listens with care. Your approved words become a little picture
            of your day.
          </p>
        </div>
        <section className="orb-nightly" aria-label="Nightly phone check-in">
          <div className="phone-medallion">
            <PhoneCallIcon size={28} weight="duotone" />
          </div>
          <div>
            <strong>
              {active
                ? "Nila is calling"
                : schedule?.enabled
                  ? `Your nightly call · ${schedule.local_time.slice(0, 5)}`
                  : "Your nightly call"}
            </strong>
            <p>
              {active
                ? "Your snapshot follows after you approve it."
                : schedule?.enabled
                  ? `An evening moment for you · ${schedule.timezone.replaceAll("_", " ")}`
                  : "Choose an evening time that feels right."}
            </p>
          </div>
          <span className="banner-leaves" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <button
            className="nightly-settings"
            aria-label="Nightly call settings"
            onClick={() => setScheduleOpen(true)}
          >
            <CalendarBlankIcon size={20} />
            <span>{schedule?.enabled ? "Change time" : "Set time"}</span>
          </button>
        </section>
      </div>
      <div className="orb-top-grid">
        <Reveal>
          <section className="orb-score orb-card">
            <div className="panel-top">
              <h2>Mood score</h2>
              <span className="small-chip">{dateLabel}</span>
            </div>
            <div className="score-body">
              <div
                className="score-ring"
                role="img"
                aria-label={
                  score == null
                    ? "Mood score not reported"
                    : `Average reported mood ${score} out of 100`
                }
              >
                <svg viewBox="0 0 120 120" aria-hidden="true">
                  <circle cx="60" cy="60" r="49" className="ring-track" />
                  <circle
                    cx="60"
                    cy="60"
                    r="49"
                    className="ring-fill"
                    pathLength="100"
                    strokeDasharray={`${score ?? 0} 100`}
                  />
                </svg>
                <div>
                  <strong>{score ?? "—"}</strong>
                  <span>/ 100</span>
                </div>
              </div>
              <div className="score-art">
                <HyperframesVisual name="aurora" enabled={score != null} />
                <h3>
                  {score == null
                    ? "Your story starts here"
                    : "A moment to reflect"}
                </h3>
                <p>
                  {values.length} reported{" "}
                  {values.length === 1 ? "day" : "days"} in this view.
                </p>
              </div>
            </div>
            <p className="score-footnote">
              Your average mood × 10. A reflection, not a health assessment.
            </p>
          </section>
        </Reveal>
        <Reveal delay={80}>
          <section className="orb-card orb-timeline">
            <div className="trend-heading">
              <div>
                <h2>Little moments, over time.</h2>
                <p>Your mood and stress from nightly conversations.</p>
              </div>
              <div
                className="range-switch"
                role="group"
                aria-label="History period"
              >
                {(
                  [
                    ["7", "7 days"],
                    ["previous", "Last week"],
                    ["30", "30 days"],
                    ["all", "All time"],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    aria-pressed={range === value}
                    onClick={() => {
                      setRange(value);
                      setSelected(null);
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <OrbDays
              dates={dates}
              journals={history}
              moods={data.moods}
              selected={currentDate}
              onSelect={setSelected}
            />
            <MoodStressChart
              dates={dates}
              journals={history}
              moods={data.moods}
            />
          </section>
        </Reveal>
      </div>
      <OrbMetrics observations={observations} onSelect={setDetail} />
      <DailyCards
        journal={journal}
        dates={dates}
        journals={history}
        onSelect={setDetail}
      />
      <div className="orb-report-grid">
        <Reveal>
          <VoiceReport
            journal={journal}
            date={dateLabel}
            onSelect={setDetail}
          />
        </Reveal>
        <Reveal delay={90}>
          <WeeklyConsistency
            dates={dates}
            journals={history}
            moods={data.moods}
          />
        </Reveal>
      </div>
      <footer className="orb-quote">
        <QuotesIcon size={28} weight="fill" />
        <p>Small steps every day create meaningful change.</p>
        <span>
          {preview
            ? "Sample check-ins"
            : loading
              ? "Updating…"
              : "Your private space"}
        </span>
        <button
          className="round-arrow"
          aria-label="Refresh saved check-ins"
          disabled={loading}
          onClick={() => void refresh()}
        >
          <ArrowClockwiseIcon size={20} />
        </button>
      </footer>
      <Reveal>
        <details className="wellness-drawer">
          <summary>Explore your 32 wellness connections</summary>
          <WellnessCollection
            observations={observations}
            data={data}
            dates={dates}
            onSelect={setDetail}
          />
        </details>
      </Reveal>
      <Modal
        open={scheduleOpen}
        onOpenChange={setScheduleOpen}
        title="Your nightly call"
        description="An evening phone conversation. Updates appear here after your approval."
      >
        <ScheduleForm />
      </Modal>
      <Modal
        open={!!detail}
        onOpenChange={(open) => {
          if (!open) setDetail(null);
        }}
        title="A closer look"
        description="Information from approved phone check-ins. Empty means not reported."
      >
        <WellnessDetails
          topic={detail ?? "journal"}
          data={data}
          journals={available}
          dates={dates}
        />
      </Modal>
    </div>
  );
}

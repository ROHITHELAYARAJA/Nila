"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { PauseIcon, PlayIcon } from "@phosphor-icons/react";

export function MotionToggle() {
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem("nila-motion") === "paused";
    setPaused(saved);
    document.documentElement.dataset.motion = saved ? "paused" : "playing";
    window.dispatchEvent(new Event("nila-motion-change"));
  }, []);
  return (
    <button
      className="icon-button"
      aria-label={paused ? "Play animations" : "Pause animations"}
      aria-pressed={paused}
      onClick={() => {
        const next = !paused;
        setPaused(next);
        document.documentElement.dataset.motion = next ? "paused" : "playing";
        localStorage.setItem("nila-motion", next ? "paused" : "playing");
        window.dispatchEvent(new Event("nila-motion-change"));
      }}
    >
      {paused ? <PlayIcon size={18} /> : <PauseIcon size={18} />}
    </button>
  );
}

export function Reveal({
  children,
  className = "",
  delay = 0,
  "aria-label": label,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  "aria-label"?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          element.dataset.revealed = "true";
          observer.disconnect();
        }
      },
      { threshold: 0.08 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      aria-label={label}
      className={`dive-reveal ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

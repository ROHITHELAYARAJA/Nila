"use client";
import { useEffect, useRef, useState } from "react";

export const weekdayArtwork = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export function HyperframesVisual({
  name,
  className = "",
  enabled = true,
}: {
  name: string;
  className?: string;
  enabled?: boolean;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const [posterReady, setPosterReady] = useState(false);
  useEffect(() => {
    const element = video.current;
    if (!element || !enabled) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    function sync() {
      if (!element) return;
      const paused =
        reduced.matches ||
        document.documentElement.dataset.motion === "paused" ||
        document.hidden ||
        !visible;
      element.dataset.paused = String(paused);
      if (paused) element.pause();
      else
        void element.play().catch(() => {
          element.dataset.paused = "true";
        });
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = !!entry?.isIntersecting;
      sync();
    });
    observer.observe(element);
    reduced.addEventListener("change", sync);
    window.addEventListener("nila-motion-change", sync);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      observer.disconnect();
      element.pause();
      reduced.removeEventListener("change", sync);
      window.removeEventListener("nila-motion-change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [enabled, name]);
  const base = `/animations/hyperframes/${name}`;
  return (
    <span
      className={`hf-art hf-${name} ${className} ${enabled ? "" : "unreported"}`}
      aria-hidden="true"
      data-poster-ready={posterReady}
    >
      <span className="orb-static" />
      {enabled && (
        <img
          className="hf-poster"
          src={`${base}.png`}
          alt=""
          width={128}
          height={128}
          loading="lazy"
          onLoad={() => setPosterReady(true)}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      )}
      {enabled && !failed && (
        <video
          key={name}
          ref={video}
          muted
          loop
          playsInline
          preload="none"
          poster={`${base}.png`}
          onError={() => setFailed(true)}
        >
          <source src={`${base}.webm`} type="video/webm" />
        </video>
      )}
    </span>
  );
}

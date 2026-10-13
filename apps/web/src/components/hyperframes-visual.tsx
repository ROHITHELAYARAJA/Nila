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
  const art = useRef<HTMLSpanElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const [posterReady, setPosterReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const wrapper = art.current;
    const element = video.current;
    if (!wrapper) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    function sync() {
      const paused =
        reduced.matches ||
        document.documentElement.dataset.motion === "paused" ||
        document.hidden ||
        !visible;
      if (wrapper) wrapper.dataset.paused = String(paused);
      if (!element) return;
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
    observer.observe(wrapper);
    reduced.addEventListener("change", sync);
    window.addEventListener("nila-motion-change", sync);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      observer.disconnect();
      element?.pause();
      reduced.removeEventListener("change", sync);
      window.removeEventListener("nila-motion-change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [enabled, name, failed]);
  const base = `/animations/hyperframes/${name}`;
  return (
    <span
      ref={art}
      className={`hf-art hf-${name} ${className} ${enabled ? "" : "unreported"}`}
      aria-hidden="true"
      data-poster-ready={posterReady}
      data-playing={playing}
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
          autoPlay
          loop
          playsInline
          preload="metadata"
          poster={`${base}.png`}
          onError={() => setFailed(true)}
          onPlaying={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        >
          <source src={`${base}.webm`} type="video/webm" />
        </video>
      )}
    </span>
  );
}

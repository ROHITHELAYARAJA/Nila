"use client";

import { useEffect, useRef, useState } from "react";
import { PauseIcon, PlayIcon, ArrowsOutIcon } from "@phosphor-icons/react";

export function LaunchDemo() {
  const video = useRef<HTMLVideoElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(preference.matches);
    sync();
    preference.addEventListener("change", sync);
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(Boolean(entry?.isIntersecting)),
      { threshold: 0.25 },
    );
    if (stage.current) observer.observe(stage.current);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    const player = video.current;
    if (!player) return;
    const sync = () => {
      if (paused || reduced || !visible || document.hidden) player.pause();
      else void player.play().catch(() => setPlaying(false));
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, [paused, reduced, visible]);

  return (
    <div ref={stage} className="launch-demo">
      <div className="launch-demo-frame">
        <video
          ref={video}
          aria-label="Illustrative Nila demonstration: an incoming call becomes approved answers and an updated wellness dashboard."
          src={reduced ? undefined : "/videos/nila-homepage-demo.mp4"}
          poster="/videos/nila-homepage-poster.png"
          width={1920}
          height={1080}
          muted
          loop
          playsInline
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onError={() => setPlaying(false)}
        />
        {!reduced && (
          <div className="launch-demo-controls">
            <button
              type="button"
              className="icon-button"
              aria-label={playing ? "Pause product demo" : "Play product demo"}
              aria-pressed={paused}
              onClick={() => {
                if (playing) {
                  setPaused(true);
                  video.current?.pause();
                } else {
                  setPaused(false);
                  void video.current?.play().catch(() => setPlaying(false));
                }
              }}
            >
              {playing ? <PauseIcon size={18} /> : <PlayIcon size={18} />}
            </button>
            <button
              type="button"
              className="icon-button"
              aria-label="View product demo fullscreen"
              onClick={() =>
                void video.current?.requestFullscreen?.().catch(() => {})
              }
            >
              <ArrowsOutIcon size={18} />
            </button>
          </div>
        )}
      </div>
      <p className="launch-demo-caption">One call. A clearer day.</p>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";

export function LaunchDemo() {
  const video = useRef<HTMLVideoElement>(null);
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(preference.matches);
    sync();
    preference.addEventListener("change", sync);
    return () => preference.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const player = video.current;
    if (!player) return;
    if (reduced) player.pause();
    else {
      player.muted = false;
      void player.play().catch(() => {
        player.muted = true;
        void player.play().catch(() => {});
      });
    }
  }, [reduced]);

  return (
    <div className="launch-demo">
      <div
      className="launch-demo-frame"
      role="button"
      tabIndex={0}
      aria-label="Enable sound for the Nila video"
      onClick={() => {
        const player = video.current;
        if (!player) return;
        player.muted = false;
        void player.play().catch(() => {});
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          const player = video.current;
          if (player) {
            player.muted = false;
            void player.play().catch(() => {});
          }
        }
      }}
    >
        <video
          ref={video}
          aria-label="Illustrative Nila demonstration: an incoming call becomes approved answers and an updated wellness dashboard."
          src={reduced ? undefined : "/videos/nila-launch-reel.mp4"}
          poster="/videos/nila-video-poster.png"
          width={1080}
          height={1920}
          autoPlay={!reduced}
          muted={false}
          loop
          disablePictureInPicture
          disableRemotePlayback
          controlsList="nodownload nofullscreen noremoteplayback"
          tabIndex={-1}
          playsInline
          preload="metadata"
        />
      </div>
      <p className="launch-demo-caption">One call. A clearer day.</p>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";

export function LaunchDemo() {
  const video = useRef<HTMLVideoElement>(null);
  const [reduced, setReduced] = useState(true);
  const [sound, setSound] = useState(false);

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
    else void player.play().catch(() => {});
  }, [reduced]);

  return (
    <div className="launch-demo">
      <div className="launch-demo-frame">
        <video
          ref={video}
          aria-label="Illustrative Nila demonstration: an incoming call becomes approved answers and an updated wellness dashboard."
          src={reduced ? undefined : "/videos/nila-launch-reel.mp4"}
          poster="/videos/nila-video-poster.png"
          width={1080}
          height={1920}
          autoPlay={!reduced}
          muted={!sound}
          loop
          disablePictureInPicture
          disableRemotePlayback
          controlsList="nodownload nofullscreen noremoteplayback"
          tabIndex={-1}
          playsInline
          preload="metadata"
        />
      </div>
      {!reduced && (
        <button
          type="button"
          className="launch-demo-sound"
          aria-pressed={sound}
          onClick={() => {
            const player = video.current;
            if (!player) return;
            player.muted = sound;
            setSound(!sound);
            void player.play().catch(() => {});
          }}
        >
          {sound ? "Mute sound" : "Turn sound on"}
        </button>
      )}
      <p className="launch-demo-caption">One call. A clearer day.</p>
    </div>
  );
}

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
    else void player.play().catch(() => {});
  }, [reduced]);

  return (
    <div className="launch-demo">
      <div className="launch-demo-frame">
        <video
          ref={video}
          aria-label="Illustrative Nila demonstration: an incoming call becomes approved answers and an updated wellness dashboard."
          src={reduced ? undefined : "/videos/nila-homepage-demo.mp4"}
          poster="/videos/nila-homepage-poster.png"
          width={1920}
          height={1080}
          autoPlay={!reduced}
          muted
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

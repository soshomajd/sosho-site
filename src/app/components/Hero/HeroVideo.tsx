"use client";

import { useEffect, useRef } from "react";

import { HERO_POSTER, HERO_VIDEO } from "./hero-assets";

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // React does not emit the `muted` attribute into server HTML, and browsers
    // only allow autoplay for muted media, so set it before the first play().
    video.muted = true;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");

    // CSS cannot stop a video: under reduced motion hold the first frame (the
    // same still the loop was cut from) instead of playing it.
    const sync = () => {
      if (query.matches) {
        video.pause();
      } else {
        void video.play().catch(() => undefined);
      }
    };
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return (
    <video
      ref={videoRef}
      className="sh-art"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
      poster={HERO_POSTER}
      src={HERO_VIDEO}
    />
  );
}

"use client";

import { useEffect, useRef } from "react";

import { HERO_VIDEO } from "./hero-assets";

type NetworkInformationLike = { saveData?: boolean; effectiveType?: string };

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // React does not emit the `muted` attribute into server HTML, and browsers
    // only allow autoplay for muted media, so set it before the first play().
    video.muted = true;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
    // The footage is large: data-saver and slow connections keep the poster only.
    const constrained =
      Boolean(connection?.saveData) || ["slow-2g", "2g", "3g"].includes(connection?.effectiveType ?? "");
    if (constrained) return;

    let started = false;
    let visible = true;

    const sync = () => {
      if (!started) return;
      if (motion.matches || !visible) {
        video.pause();
      } else {
        void video.play().catch(() => undefined);
      }
    };

    const start = () => {
      // Reduced motion keeps the still poster; the clip is never downloaded.
      if (started || motion.matches) return;
      started = true;
      video.src = HERO_VIDEO;
      video.load();
      sync();
    };

    const markReady = () => video.setAttribute("data-ready", "");
    video.addEventListener("playing", markReady, { once: true });

    // Load the clip only after the page has finished loading, so it never competes
    // with the poster, fonts and scripts that the first paint depends on.
    let idleHandle: number | undefined;
    let timeoutHandle: number | undefined;
    const schedule = () => {
      if (typeof window.requestIdleCallback === "function") {
        idleHandle = window.requestIdleCallback(start, { timeout: 2500 });
      } else {
        timeoutHandle = window.setTimeout(start, 1200);
      }
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    // Pause while the hero is scrolled out of view to spare CPU and battery.
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
      },
      { threshold: 0.05 }
    );
    observer.observe(video);

    const onMotionChange = () => (motion.matches ? video.pause() : started ? sync() : schedule());
    motion.addEventListener("change", onMotionChange);

    return () => {
      window.removeEventListener("load", schedule);
      if (idleHandle !== undefined) window.cancelIdleCallback(idleHandle);
      if (timeoutHandle !== undefined) window.clearTimeout(timeoutHandle);
      video.removeEventListener("playing", markReady);
      observer.disconnect();
      motion.removeEventListener("change", onMotionChange);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      className="sh-art sh-video"
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}

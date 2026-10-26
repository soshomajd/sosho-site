"use client";

import { useEffect } from "react";

/** Progressive motion only. Every word, image and link is rendered by Server Components. */
export default function HomeMotion() {
  useEffect(() => {
    const root = document.getElementById("home-motion");
    if (!root) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let stop = () => {};

    const start = () => {
      stop();
      if (preference.matches) return;
      const animations = new Set<Animation>();
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          if (!isIntersecting) return;
          observer.unobserve(target);
          const element = target as HTMLElement;
          // Content starts visible in HTML. A failed script never leaves it hidden.
          const cinematic = element.dataset.reveal === "cinematic";
          const frames = cinematic
            ? [{ opacity: 0.35, clipPath: "inset(12% 8% 12% 8% round 36px)", transform: "translateY(36px)" }, { opacity: 1, clipPath: "inset(0% 0% 0% 0% round 0px)", transform: "translateY(0)" }]
            : [{ opacity: 0.4, transform: "translateY(24px)" }, { opacity: 1, transform: "translateY(0)" }];
          const track = (animation: Animation) => {
            animations.add(animation);
            animation.onfinish = () => animations.delete(animation);
          };
          track(element.animate(frames, { duration: cinematic ? 1100 : 650, delay: Number(element.dataset.motionDelay || 0), easing: "cubic-bezier(.16,1,.3,1)" }));
          if (cinematic) {
            const image = element.querySelector("img");
            const light = element.querySelector(".about-reveal-light");
            if (image) track(image.animate([{ transform: "scale(1.12)" }, { transform: "scale(1)" }], { duration: 1500, easing: "cubic-bezier(.16,1,.3,1)" }));
            if (light) track(light.animate([{ opacity: 0, transform: "translateX(-140%) skewX(-18deg)" }, { opacity: 0.6, offset: 0.35 }, { opacity: 0, transform: "translateX(360%) skewX(-18deg)" }], { duration: 1300, delay: 160, easing: "ease-out" }));
          }
        });
      }, { threshold: 0.08 });
      root.querySelectorAll("[data-reveal]").forEach((element) => observer.observe(element));

      const hero = root.querySelector<HTMLElement>(".sh-stage");
      const portrait = root.querySelector<HTMLElement>(".sh-portrait");
      const button = root.querySelector<HTMLElement>(".sh-cta");
      const pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
      const eyes = [...root.querySelectorAll<SVGGElement>("[data-eye-pupil]")];
      let eyeFrame = 0;
      let heroVisible = true;
      let cursorX = 0;
      let cursorY = 0;
      const updateEyes = () => {
        eyeFrame = 0;
        if (!portrait || !heroVisible) return;
        const rect = portrait.getBoundingClientRect();
        eyes.forEach((eye) => {
          const centerX = rect.left + Number(eye.dataset.eyeX) / 1000 * rect.width;
          const centerY = rect.top + Number(eye.dataset.eyeY) / 1000 * rect.height;
          const dx = cursorX - centerX;
          const dy = cursorY - centerY;
          const angle = Math.atan2(dy, dx);
          const distance = Math.min(1, Math.hypot(dx, dy) / Math.max(240, rect.width));
          eye.setAttribute("transform", `translate(${(Math.cos(angle) * distance * 12).toFixed(2)}, ${(Math.sin(angle) * distance * 7).toFixed(2)})`);
        });
      };
      const move = (event: PointerEvent) => {
        if (!heroVisible || !pointer.matches || event.pointerType === "touch") return;
        cursorX = event.clientX;
        cursorY = event.clientY;
        if (!eyeFrame) eyeFrame = requestAnimationFrame(updateEyes);
      };
      const reset = () => {
        cancelAnimationFrame(eyeFrame);
        eyeFrame = 0;
        eyes.forEach((eye) => eye.removeAttribute("transform"));
      };
      const heroObserver = new IntersectionObserver(([entry]) => {
        heroVisible = entry.isIntersecting;
        if (!heroVisible) reset();
      });
      if (hero) heroObserver.observe(hero);
      const magnet = (event: PointerEvent) => {
        if (!button || !pointer.matches) return;
        const rect = button.getBoundingClientRect();
        button.style.transform = `translate(${(event.clientX - rect.left - rect.width / 2) / 10}px, ${(event.clientY - rect.top - rect.height / 2) / 8}px)`;
      };
      const resetButton = () => button?.style.removeProperty("transform");
      window.addEventListener("pointermove", move, { passive: true });
      document.documentElement.addEventListener("pointerleave", reset);
      window.addEventListener("blur", reset);
      pointer.addEventListener("change", reset);
      button?.addEventListener("pointermove", magnet);
      button?.addEventListener("pointerleave", resetButton);

      // Gallery animation and its pause checkbox are native CSS. This observer
      // only pauses the compositor animation while the gallery is off-screen.
      const gallery = root.querySelector<HTMLElement>(".work-ribbon");
      const galleryObserver = new IntersectionObserver(([entry]) => {
        gallery?.toggleAttribute("data-offscreen", !entry.isIntersecting);
      });
      if (gallery) galleryObserver.observe(gallery);

      stop = () => {
        observer.disconnect();
        galleryObserver.disconnect();
        heroObserver.disconnect();
        animations.forEach((animation) => animation.cancel());
        window.removeEventListener("pointermove", move);
        document.documentElement.removeEventListener("pointerleave", reset);
        window.removeEventListener("blur", reset);
        pointer.removeEventListener("change", reset);
        button?.removeEventListener("pointermove", magnet);
        button?.removeEventListener("pointerleave", resetButton);
        reset();
        resetButton();
        gallery?.removeAttribute("data-offscreen");
      };
    };

    start();
    preference.addEventListener("change", start);
    return () => {
      preference.removeEventListener("change", start);
      stop();
    };
  }, []);

  return null;
}

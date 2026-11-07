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
      const portraits = [...root.querySelectorAll<HTMLElement>(".sh-team-slide")].map((slide) => ({
        slide,
        choice: root.querySelector<HTMLInputElement>(`#team-${slide.dataset.teamMember}`),
        portrait: slide.querySelector<HTMLElement>(".sh-portrait"),
        eyes: [...slide.querySelectorAll<SVGGElement>("[data-eye-pupil]")],
      }));
      const button = root.querySelector<HTMLElement>(".sh-cta");
      const pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
      const eyes = [...root.querySelectorAll<SVGGElement>("[data-eye-pupil]")];
      // Touch screens have no hover position, so the active pupils glance around
      // on their own and look at the last touch for a moment.
      const gaze = new Map<SVGGElement, { x: number; y: number; goalX: number; goalY: number }>();
      let eyeFrame = 0;
      let touchFrame = 0;
      let touchTimer = 0;
      let focusUntil = 0;
      let nextGlance = 0;
      let centered = true;
      let heroVisible = true;
      let cursorX = 0;
      let cursorY = 0;
      const activePortrait = () => portraits.find(({ choice }) => choice?.checked);
      const lookAt = (eye: SVGGElement, rect: DOMRect, x: number, y: number, reach = Math.max(240, rect.width)) => {
        const dx = x - (rect.left + Number(eye.dataset.eyeX) / 1000 * rect.width);
        const dy = y - (rect.top + Number(eye.dataset.eyeY) / 1000 * rect.height);
        const angle = Math.atan2(dy, dx);
        const distance = Math.min(1, Math.hypot(dx, dy) / reach);
        return [Math.cos(angle) * distance * Number(eye.dataset.eyeRangeX || 12), Math.sin(angle) * distance * Number(eye.dataset.eyeRangeY || 7)];
      };
      const place = (eye: SVGGElement, x: number, y: number) => eye.setAttribute("transform", `translate(${x.toFixed(2)}, ${y.toFixed(2)})`);
      const updateEyes = () => {
        eyeFrame = 0;
        if (!heroVisible) return;
        const active = activePortrait();
        if (!active?.portrait) return;
        const rect = active.portrait.getBoundingClientRect();
        active.eyes.forEach((eye) => {
          const [x, y] = lookAt(eye, rect, cursorX, cursorY);
          place(eye, x, y);
        });
      };
      const wakeTouch = () => {
        clearTimeout(touchTimer);
        touchTimer = 0;
        if (!touchFrame && heroVisible && !pointer.matches) touchFrame = requestAnimationFrame(stepTouch);
      };
      const stepTouch = (now: number) => {
        touchFrame = 0;
        if (!heroVisible || pointer.matches) return;
        const active = activePortrait();
        if (!active) return;
        if (now >= focusUntil && now >= nextGlance) {
          // A new idle glance; now and then (never twice in a row, never first)
          // the eyes look straight ahead again.
          const angle = Math.random() * Math.PI * 2;
          const distance = !centered && Math.random() < 0.2 ? 0 : 0.55 + Math.random() * 0.45;
          centered = distance === 0;
          active.eyes.forEach((eye) => {
            const state = gaze.get(eye) ?? { x: 0, y: 0, goalX: 0, goalY: 0 };
            state.goalX = Math.cos(angle) * distance * Number(eye.dataset.eyeRangeX || 12);
            state.goalY = Math.sin(angle) * distance * Number(eye.dataset.eyeRangeY || 7);
            gaze.set(eye, state);
          });
          nextGlance = now + 1400 + Math.random() * 1800;
        }
        let moving = false;
        active.eyes.forEach((eye) => {
          const state = gaze.get(eye);
          if (!state) return;
          state.x += (state.goalX - state.x) * 0.18;
          state.y += (state.goalY - state.y) * 0.18;
          if (Math.abs(state.goalX - state.x) + Math.abs(state.goalY - state.y) > 0.05) moving = true;
          else {
            state.x = state.goalX;
            state.y = state.goalY;
          }
          place(eye, state.x, state.y);
        });
        // Sleep between glances instead of running a frame loop while the eyes rest.
        if (moving) touchFrame = requestAnimationFrame(stepTouch);
        else touchTimer = window.setTimeout(wakeTouch, Math.max(focusUntil, nextGlance) - now);
      };
      const focusTouch = (x: number, y: number) => {
        const active = activePortrait();
        if (!active?.portrait) return;
        const rect = active.portrait.getBoundingClientRect();
        active.eyes.forEach((eye) => {
          // A touch is a deliberate target, so the pupils turn fully at half the cursor distance.
          const [goalX, goalY] = lookAt(eye, rect, x, y, Math.max(120, rect.width / 2));
          const state = gaze.get(eye) ?? { x: 0, y: 0, goalX, goalY };
          state.goalX = goalX;
          state.goalY = goalY;
          gaze.set(eye, state);
        });
        focusUntil = performance.now() + 2600;
        nextGlance = focusUntil;
        wakeTouch();
      };
      const move = (event: PointerEvent) => {
        if (!heroVisible) return;
        if (!pointer.matches) {
          // A finger only reports moves while it touches the screen; follow that drag.
          if (event.pointerType !== "mouse") focusTouch(event.clientX, event.clientY);
          return;
        }
        if (event.pointerType === "touch") return;
        cursorX = event.clientX;
        cursorY = event.clientY;
        if (!eyeFrame) eyeFrame = requestAnimationFrame(updateEyes);
      };
      const touch = (event: PointerEvent) => {
        if (heroVisible && !pointer.matches) focusTouch(event.clientX, event.clientY);
      };
      const reset = () => {
        cancelAnimationFrame(eyeFrame);
        eyeFrame = 0;
        cancelAnimationFrame(touchFrame);
        touchFrame = 0;
        clearTimeout(touchTimer);
        touchTimer = 0;
        gaze.clear();
        focusUntil = 0;
        centered = true;
        eyes.forEach((eye) => eye.removeAttribute("transform"));
      };
      // Back to centered pupils; on touch screens the first glance follows shortly.
      const restart = () => {
        reset();
        nextGlance = performance.now() + 600;
        wakeTouch();
      };
      // Touch pointers "leave" the page after every lift, which must not cancel the glance.
      const leave = (event: PointerEvent) => {
        if (event.pointerType !== "touch") reset();
      };
      const heroObserver = new IntersectionObserver(([entry]) => {
        heroVisible = entry.isIntersecting;
        if (heroVisible) restart();
        else reset();
      });
      if (hero) heroObserver.observe(hero);
      const magnet = (event: PointerEvent) => {
        if (!button || !pointer.matches) return;
        const rect = button.getBoundingClientRect();
        button.style.transform = `translate(${(event.clientX - rect.left - rect.width / 2) / 10}px, ${(event.clientY - rect.top - rect.height / 2) / 8}px)`;
      };
      const resetButton = () => button?.style.removeProperty("transform");
      root.addEventListener("teamchange", restart);
      window.addEventListener("pointermove", move, { passive: true });
      window.addEventListener("pointerdown", touch, { passive: true });
      document.documentElement.addEventListener("pointerleave", leave);
      window.addEventListener("blur", reset);
      window.addEventListener("focus", restart);
      pointer.addEventListener("change", restart);
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
        root.removeEventListener("teamchange", restart);
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerdown", touch);
        document.documentElement.removeEventListener("pointerleave", leave);
        window.removeEventListener("blur", reset);
        window.removeEventListener("focus", restart);
        pointer.removeEventListener("change", restart);
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

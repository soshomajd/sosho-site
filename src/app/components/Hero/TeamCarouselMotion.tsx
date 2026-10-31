"use client";

import { useEffect } from "react";
import type { Locale } from "@/app/i18n";

/** Native radios own selection; this island adds buttons, swipes and finite motion. */
export default function TeamCarouselMotion({ locale }: { locale: Locale }) {
  useEffect(() => {
    const root = document.getElementById("studio-team");
    if (!root) return;
    const radios = [...root.querySelectorAll<HTMLInputElement>(".sh-team-radio")];
    const slides = [...root.querySelectorAll<HTMLElement>(".sh-team-slide")];
    const status = root.querySelector<HTMLElement>(".sh-team-status");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let active = Math.max(0, radios.findIndex((radio) => radio.checked));
    let gesture: { id: number; x: number; y: number } | null = null;
    const animations = new Set<Animation>();

    const stopMotion = () => {
      animations.forEach((animation) => animation.cancel());
      animations.clear();
      slides.forEach((slide) => {
        slide.removeAttribute("data-leaving");
        slide.removeAttribute("aria-hidden");
        slide.removeAttribute("inert");
      });
    };
    const changed = () => {
      const next = radios.findIndex((radio) => radio.checked);
      if (next < 0 || next === active) return;
      stopMotion();
      const previous = active;
      active = next;
      root.querySelectorAll("[data-eye-pupil]").forEach((eye) => eye.removeAttribute("transform"));
      root.dispatchEvent(new Event("teamchange", { bubbles: true }));
      if (status) status.textContent = radios[next].dataset.teamAnnouncement || "";
      if (reduced.matches) return;
      const forward = (next - previous + radios.length) % radios.length === 1;
      const direction = (forward ? 1 : -1) * (locale === "fa" ? -1 : 1);
      const outgoing = slides[previous];
      outgoing.setAttribute("data-leaving", "");
      outgoing.setAttribute("aria-hidden", "true");
      outgoing.setAttribute("inert", "");
      const animate = (element: HTMLElement, frames: Keyframe[], finish?: () => void) => {
        const animation = element.animate(frames, { duration: 320, easing: "cubic-bezier(.22,1,.36,1)" });
        animations.add(animation);
        animation.onfinish = () => { animations.delete(animation); finish?.(); };
      };
      animate(outgoing, [{ opacity: 1, transform: "translateX(0)" }, { opacity: 0, transform: `translateX(${-direction * 42}px)` }], () => {
        outgoing.removeAttribute("data-leaving");
        outgoing.removeAttribute("aria-hidden");
        outgoing.removeAttribute("inert");
      });
      animate(slides[next], [{ opacity: 0, transform: `translateX(${direction * 42}px)` }, { opacity: 1, transform: "translateX(0)" }]);
    };
    const select = (index: number, focusRadio = false) => {
      const selected = (index + radios.length) % radios.length;
      radios[selected].checked = true;
      radios[selected].dispatchEvent(new Event("change", { bubbles: true }));
      if (focusRadio) radios[selected].focus({ preventScroll: true });
    };
    const click = (event: MouseEvent) => {
      const button = (event.target as Element).closest<HTMLButtonElement>("button[data-team-step]");
      if (button) select(active + Number(button.dataset.teamStep));
    };
    const key = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (!target.matches(".sh-team-radio, button[data-team-step]")) return;
      const arrow = event.key === "ArrowLeft" ? -1 : event.key === "ArrowRight" ? 1 : 0;
      if (!arrow && event.key !== "Home" && event.key !== "End") return;
      event.preventDefault();
      const next = event.key === "Home" ? 0 : event.key === "End" ? radios.length - 1 : active + arrow * (locale === "fa" ? -1 : 1);
      select(next, target.matches(".sh-team-radio"));
    };
    const down = (event: PointerEvent) => {
      if (event.pointerType === "mouse" || !event.isPrimary) return;
      const target = event.target as Element;
      if (!target.closest(".sh-team-visual") || target.closest("button, a, input, label")) return;
      gesture = { id: event.pointerId, x: event.clientX, y: event.clientY };
    };
    const up = (event: PointerEvent) => {
      if (!gesture || event.pointerId !== gesture.id) return;
      const dx = event.clientX - gesture.x;
      const dy = event.clientY - gesture.y;
      gesture = null;
      if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy) * 1.25) return;
      select(active + (dx < 0 ? 1 : -1) * (locale === "fa" ? -1 : 1));
    };
    const cancelGesture = () => { gesture = null; };
    root.setAttribute("data-enhanced", "");
    root.addEventListener("change", changed);
    root.addEventListener("click", click);
    root.addEventListener("keydown", key);
    root.addEventListener("pointerdown", down, { passive: true });
    root.addEventListener("pointerup", up, { passive: true });
    root.addEventListener("pointercancel", cancelGesture);
    reduced.addEventListener("change", stopMotion);
    return () => {
      stopMotion();
      root.removeAttribute("data-enhanced");
      root.removeEventListener("change", changed);
      root.removeEventListener("click", click);
      root.removeEventListener("keydown", key);
      root.removeEventListener("pointerdown", down);
      root.removeEventListener("pointerup", up);
      root.removeEventListener("pointercancel", cancelGesture);
      reduced.removeEventListener("change", stopMotion);
    };
  }, [locale]);

  return null;
}

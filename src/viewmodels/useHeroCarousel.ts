"use client";

import { useEffect } from "react";
import {
  HERO_DWELL_MS,
  counterLabel,
  slideAnnouncement,
  wrapIndex,
} from "@/models/heroCarousel";

// ViewModel for the captured hero carousel. The slide DOM is fixed markup
// from the replica blob, so this hooks the design system's own controls
// (chevrons, pause, counter, progress ring) instead of rendering any UI:
// crossfades move the captured .A73U5 active class between .KPEM6 slides.

const HERO_SELECTOR =
  'section[aria-roledescription="carousel"][aria-label="Hero carousel"]';

const ACTIVE_CLASS = "A73U5";
const FOCUS_RING_CLASS = "button-focus-ring";

// Play glyph (DLS-style outlined video play) used while autoplay is paused.
const PLAY_ICON_HTML =
  '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 24"><path fill="#191A1B" d="M8.625 5.146v13.708c0 .683.753 1.1 1.338.756l10.777-6.854a.895.895 0 0 0 0-1.512L9.963 4.39a.895.895 0 0 0-1.338.756z"/></svg>';

type Teardown = () => void;

function enhanceHeroCarousel(section: HTMLElement): Teardown | undefined {
  if (section.dataset.heroCarouselReady === "true") return undefined;
  section.dataset.heroCarouselReady = "true";

  const slides = Array.from(
    section.querySelectorAll<HTMLElement>(".KPEM6"),
  );
  if (slides.length === 0) {
    delete section.dataset.heroCarouselReady;
    return undefined;
  }
  const total = slides.length;

  const counterPill = section.querySelector<HTMLElement>(".TmOVG");
  const counter = section.querySelector<HTMLElement>(".TmOVG .PZmz6");
  const ring = section.querySelector<HTMLElement>(".T6xRz");
  const pauseBtn = section.querySelector<HTMLButtonElement>(
    'button[aria-label="Pause"], button[aria-label="Play"]',
  );
  const prevBtn = section.querySelector<HTMLButtonElement>(
    'button[aria-label="Swipe Left"]',
  );
  const nextBtn = section.querySelector<HTMLButtonElement>(
    'button[aria-label="Swipe Right"]',
  );
  const live = section.querySelector<HTMLElement>("div.Q_p2q");

  const pauseIconHtml = pauseBtn ? pauseBtn.innerHTML : "";

  let index = slides.findIndex((s) => s.classList.contains(ACTIVE_CLASS));
  if (index < 0) index = 0;
  let paused = false;
  let elapsed = 0;
  let lastTs: number | null = null;
  let rafId = 0;

  const titleOf = (i: number) =>
    slides[i]
      .querySelector("section")
      ?.getAttribute("data-title")
      ?.trim() ?? "";

  const setAngle = (deg: number) => {
    ring?.style.setProperty("--ppt-progress-angle", `${deg}deg`);
  };

  const render = () => {
    slides.forEach((slide, i) =>
      slide.classList.toggle(ACTIVE_CLASS, i === index),
    );
    if (counter) counter.textContent = String(index + 1);
    counterPill?.setAttribute("aria-label", counterLabel(index, total));
    if (live) live.textContent = slideAnnouncement(index, total, titleOf(index));
  };

  const goTo = (nextIndex: number) => {
    index = wrapIndex(nextIndex, total);
    elapsed = 0;
    setAngle(0);
    render();
  };

  const setPaused = (next: boolean) => {
    paused = next;
    pauseBtn?.setAttribute("aria-pressed", String(next));
    pauseBtn?.setAttribute("aria-label", next ? "Play" : "Pause");
    if (pauseBtn) pauseBtn.innerHTML = next ? PLAY_ICON_HTML : pauseIconHtml;
  };

  const tick = (ts: number) => {
    rafId = requestAnimationFrame(tick);
    if (lastTs === null) lastTs = ts;
    if (paused || document.visibilityState !== "visible") {
      lastTs = ts;
      return;
    }
    elapsed += ts - lastTs;
    lastTs = ts;
    if (elapsed >= HERO_DWELL_MS) {
      goTo(index + 1);
    } else {
      setAngle((elapsed / HERO_DWELL_MS) * 360);
    }
  };

  // --- events --------------------------------------------------------------
  const onPrevClick = () => goTo(index - 1);
  const onNextClick = () => goTo(index + 1);
  const onPauseClick = () => setPaused(!paused);

  const onKeydown = (e: KeyboardEvent) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(index - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(index + 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      goTo(0);
    } else if (e.key === "End") {
      e.preventDefault();
      goTo(total - 1);
    }
  };

  let touchX: number | null = null;
  let touchY: number | null = null;
  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType !== "touch") return;
    touchX = e.clientX;
    touchY = e.clientY;
  };
  const onPointerUp = (e: PointerEvent) => {
    if (touchX === null || touchY === null) return;
    const dx = e.clientX - touchX;
    const dy = e.clientY - touchY;
    touchX = touchY = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) goTo(index + 1);
      else goTo(index - 1);
    }
  };

  const onFocusButton = (e: FocusEvent) => {
    const btn = e.target as HTMLElement;
    if (btn.matches(":focus-visible")) btn.classList.add(FOCUS_RING_CLASS);
  };
  const onBlurButton = (e: FocusEvent) => {
    (e.target as HTMLElement).classList.remove(FOCUS_RING_CLASS);
  };

  const onVisibility = () => {
    lastTs = null;
  };

  prevBtn?.addEventListener("click", onPrevClick);
  nextBtn?.addEventListener("click", onNextClick);
  pauseBtn?.addEventListener("click", onPauseClick);
  for (const btn of [prevBtn, nextBtn, pauseBtn]) {
    btn?.addEventListener("focus", onFocusButton);
    btn?.addEventListener("blur", onBlurButton);
  }
  section.addEventListener("keydown", onKeydown);
  section.addEventListener("pointerdown", onPointerDown);
  section.addEventListener("pointerup", onPointerUp);
  document.addEventListener("visibilitychange", onVisibility);

  // --- start ---------------------------------------------------------------
  render();
  setAngle(0);
  rafId = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(rafId);
    prevBtn?.removeEventListener("click", onPrevClick);
    nextBtn?.removeEventListener("click", onNextClick);
    pauseBtn?.removeEventListener("click", onPauseClick);
    for (const btn of [prevBtn, nextBtn, pauseBtn]) {
      btn?.removeEventListener("focus", onFocusButton);
      btn?.removeEventListener("blur", onBlurButton);
    }
    section.removeEventListener("keydown", onKeydown);
    section.removeEventListener("pointerdown", onPointerDown);
    section.removeEventListener("pointerup", onPointerUp);
    document.removeEventListener("visibilitychange", onVisibility);
    delete section.dataset.heroCarouselReady;
  };
}

/** Mounts autoplay + controls over the captured hero carousel on the page. */
export function useHeroCarousel(): void {
  useEffect(() => {
    const section = document.querySelector<HTMLElement>(HERO_SELECTOR);
    const teardown = section ? enhanceHeroCarousel(section) : undefined;
    return () => teardown?.();
  }, []);
}

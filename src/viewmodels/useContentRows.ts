"use client";

import { useEffect } from "react";
import {
  CONTENT_ROW_KINDS,
  ROW_SCROLL_PAGE,
  rowArrowState,
} from "@/models/contentRows";

/**
 * Wires every captured filmStrip and navigationRow shelf: the design-system
 * arrows drive the track's native horizontal scroll, and each arrow's
 * enabled/disabled state stays in sync with scroll position. When a row
 * fits its viewport with nothing to scroll, both arrows end up disabled and
 * the capture's own `:has` CSS hides them.
 */
export function useContentRows() {
  useEffect(() => {
    const cleanups: Array<() => void> = [];

    for (const kind of CONTENT_ROW_KINDS) {
      const sections = document.querySelectorAll<HTMLElement>(
        kind.sectionSelector,
      );
      for (const section of sections) {
        const track = section.querySelector<HTMLElement>(kind.trackSelector);
        const left = arrowFor(section, kind.leftLabel);
        const right = arrowFor(section, kind.rightLabel);
        if (!track || !left || !right) continue;

        const sync = () => {
          const { atStart, atEnd } = rowArrowState(
            track.scrollLeft,
            track.scrollWidth,
            track.clientWidth,
          );
          setArrowEnabled(left, !atStart, kind.disabledClass);
          setArrowEnabled(right, !atEnd, kind.disabledClass);
        };
        const scrollBy = (dir: number) => {
          track.scrollBy({
            left: dir * track.clientWidth * ROW_SCROLL_PAGE,
            behavior: "smooth",
          });
        };
        const onLeft = () => scrollBy(-1);
        const onRight = () => scrollBy(1);

        left.addEventListener("click", onLeft);
        right.addEventListener("click", onRight);
        track.addEventListener("scroll", sync, { passive: true });
        window.addEventListener("resize", sync);
        const observer = new ResizeObserver(sync);
        observer.observe(track);

        sync();
        cleanups.push(() => {
          left.removeEventListener("click", onLeft);
          right.removeEventListener("click", onRight);
          track.removeEventListener("scroll", sync);
          window.removeEventListener("resize", sync);
          observer.disconnect();
        });
      }
    }

    return () => {
      for (const off of cleanups) off();
    };
  }, []);
}

function arrowFor(section: HTMLElement, label: string) {
  return section.querySelector<HTMLButtonElement>(
    `button[aria-label="${label}"]`,
  );
}

/**
 * Sync one arrow across the three channels the snapshot uses for its
 * disabled state: the native `disabled` attribute, the design-system state
 * class (`fm0qa` / `VT4gF` — which also drives the `:has` rule that hides
 * both arrows when a row fits), and an inline pointer-events override,
 * because the design-system button bakes `pointer-events:none` into its
 * base rule and toggling `disabled` alone would leave a re-enabled arrow
 * unclickable.
 */
function setArrowEnabled(
  btn: HTMLButtonElement,
  enabled: boolean,
  stateClass: string,
) {
  btn.disabled = !enabled;
  btn.classList.toggle(stateClass, !enabled);
  btn.style.pointerEvents = enabled ? "auto" : "none";
}

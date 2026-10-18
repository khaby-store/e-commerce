"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MegaNavMenu } from "@/models/megaNav";
import { findMenuByLabel } from "@/models/megaNav";

/** Grace period so a diagonal path from trigger into the panel keeps it open. */
const CLOSE_DELAY_MS = 180;

/**
 * Wires the captured global nav (`nav.kRlHr` trigger buttons + the empty
 * `#GlobalDesktopNavFlyout` container) to the mega-menu data: hover (or
 * focus) a trigger to open its panel, hovering another switches instantly,
 * leaving the header region closes after a short delay, and the close
 * button / Escape dismiss immediately.
 */
export function useMegaNav(menus: readonly MegaNavMenu[]) {
  const [openLabel, setOpenLabel] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = useCallback(() => {
    if (closeTimer.current !== null) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const closeMenu = useCallback(() => {
    cancelClose();
    setOpenLabel(null);
  }, [cancelClose]);

  const openMenuForLabel = useCallback(
    (label: string) => {
      if (!findMenuByLabel(menus, label)) return;
      cancelClose();
      setOpenLabel(label);
    },
    [cancelClose, menus]
  );

  // Wire trigger buttons + region hover intent.
  useEffect(() => {
    const nav = document.querySelector<HTMLElement>("nav.kRlHr");
    const flyout = document.getElementById("GlobalDesktopNavFlyout");
    if (!nav || !flyout) return;
    const region = flyout.parentElement;
    const buttons = Array.from(
      nav.querySelectorAll<HTMLButtonElement>("li > button")
    );

    const onRegionEnter = () => cancelClose();
    const onRegionLeave = () => {
      cancelClose();
      closeTimer.current = setTimeout(() => setOpenLabel(null), CLOSE_DELAY_MS);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenLabel(null);
    };

    const cleanups: Array<() => void> = [];
    for (const btn of buttons) {
      const label = labelOfButton(btn);
      const onEnter = () => openMenuForLabel(label);
      // Open-only on click: on touch, focus fires first and a toggle would
      // immediately re-close the menu the tap just opened. (On the live site
      // a click navigates away; here there is nowhere to navigate.)
      const onClick = () => openMenuForLabel(label);
      btn.addEventListener("mouseenter", onEnter);
      btn.addEventListener("focus", onEnter);
      btn.addEventListener("click", onClick);
      cleanups.push(() => {
        btn.removeEventListener("mouseenter", onEnter);
        btn.removeEventListener("focus", onEnter);
        btn.removeEventListener("click", onClick);
      });
    }

    region?.addEventListener("mouseenter", onRegionEnter);
    region?.addEventListener("mouseleave", onRegionLeave);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      cancelClose();
      for (const off of cleanups) off();
      region?.removeEventListener("mouseenter", onRegionEnter);
      region?.removeEventListener("mouseleave", onRegionLeave);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [cancelClose, menus, openMenuForLabel]);

  // Reflect open state on the captured triggers (underline + aria).
  useEffect(() => {
    const nav = document.querySelector<HTMLElement>("nav.kRlHr");
    if (!nav) return;
    for (const btn of nav.querySelectorAll<HTMLButtonElement>("li > button")) {
      const isOpen = openLabel !== null && labelOfButton(btn) === openLabel;
      btn.classList.toggle("tp-mega-open", isOpen);
      btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    }
  }, [openLabel]);

  const activeMenu =
    openLabel === null ? null : findMenuByLabel(menus, openLabel);

  return { activeMenu, closeMenu, openMenuForLabel };
}

function labelOfButton(btn: HTMLButtonElement) {
  return btn.textContent?.trim() ?? "";
}

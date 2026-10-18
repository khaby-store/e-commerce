"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { COLORWAY_IMAGES } from "@/lib/nordstrom/colorways";
import {
  galleryFor,
  galleryIndexForColor,
  mediaFileFromUrl,
  type TopPickColor,
  type TopPickProduct,
} from "@/models/topPicks";

// ViewModel for the captured recommendations shelves: "Top Picks for You"
// (first section.cw0aK[data-container-type="recommendations"]), "Great Deals
// on What You Love" (second one), and "Trending Near You"
// (#product-recommendations-shelf-hp-ftr in the footer). The product cards
// are fixed replica markup; this hooks the design system's own shelf:
//   - desktop: transform-based paging via the captured ul.TOmeT track
//     (only the two cw0aK shelves ship Swipe Left/Right arrows; Trending
//     Near You is a static row and skips this wiring)
//   - ≤736px: native horizontal scroll (captured CSS switches overflow-x)
//   - per-card color tray scrolls via its captured .LO_i4 overflow-x
//   - swatch hover previews the vendored full-size colorway image
//   - swatch click selects (moves the captured .e66ra ring)
//   - injected "Quick View" button opens the React modal (TopPicksEnhancer)
//   - the Top Picks tab bar (nav.r7COG) moves the captured selected styles
//     and rewinds the shelf's carousel; per-tab product content will come
//     from the recommendations API later (the capture ships one shared list)

const SHELF_SELECTORS =
  'section.cw0aK[data-container-type="recommendations"],#product-recommendations-shelf-hp-ftr';
const STYLE_ID = "tp-shelf-css";

/** Quick View modal view state: the product plus modal-local selection. */
export type TopPicksQuickView = {
  product: TopPickProduct;
  /** Index into product.colors (the card's selected chip on open). */
  colorIndex: number;
  /** Index into the modal gallery (main image + colorway images). */
  imageIndex: number;
  /** Chosen size; empty until the user picks one. */
  size: string;
};

const QUICK_VIEW_CSS = `
.tp-quickview{position:absolute;left:50%;bottom:16px;transform:translateX(-50%);z-index:3;opacity:0;transition:opacity 200ms ease;background:#fff;color:#191a1b;border:2px solid #191a1b;border-radius:8px;padding:12px 24px;font:700 16px/1 "Brandon Text",Arial,sans-serif;cursor:pointer;pointer-events:none;white-space:nowrap}
li.fOGa1:hover .tp-quickview,.tp-quickview:focus-visible{opacity:1;pointer-events:auto}
@media (hover:none){.tp-quickview{opacity:1;pointer-events:auto}}
@media (max-width:850px){.tp-quickview{padding:8px 14px;font-size:14px;bottom:30px}}
@media (max-width:736px){.tp-quickview{padding:6px 10px;font-size:12px;bottom:28px}}
`;

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/**
 * Sync a captured carousel arrow's enabled state. The snapshot's design-system
 * class for a disabled arrow bakes `pointer-events:none` into the base rule,
 * so toggling `.disabled` alone leaves the button unclickable once re-enabled.
 */
function setArrowEnabled(btn: HTMLButtonElement, enabled: boolean) {
  btn.disabled = !enabled;
  btn.style.pointerEvents = enabled ? "auto" : "none";
}

function parseColors(card: HTMLElement): TopPickColor[] {
  const colors: TopPickColor[] = [];
  for (const btn of card.querySelectorAll<HTMLElement>(".Bnw4Z .L6OEP")) {
    const chipUrl = mediaFileFromUrl(btn.style.backgroundImage || "");
    if (!chipUrl) continue;
    colors.push({
      name: btn.getAttribute("aria-label") ?? "",
      chipUrl: `/assets/media/${chipUrl}`,
      chipFile: chipUrl,
      imageUrl: COLORWAY_IMAGES[chipUrl],
    });
  }
  return colors;
}

function extractProducts(shelf: HTMLElement): TopPickProduct[] {
  const products: TopPickProduct[] = [];
  for (const card of shelf.querySelectorAll<HTMLElement>("li.fOGa1")) {
    const img = card.querySelector<HTMLImageElement>("img.Qbb89");
    const nameLink = card.querySelector<HTMLAnchorElement>(
      "a.yQhJC[aria-label]",
    );
    if (!img || !nameLink) continue;
    const prices = card.querySelectorAll<HTMLElement>(".UOItI .qJWwm");
    const rating = card.querySelector<HTMLElement>("span.WVbEJ");
    const ratingImg = card.querySelector<HTMLElement>("span.R696g");
    products.push({
      name: nameLink.getAttribute("aria-label") ?? "",
      brand:
        card.querySelector<HTMLElement>(".AH7z0")?.getAttribute("title") ??
        "",
      image: img.getAttribute("src") ?? "",
      priceHtml: prices[0]?.innerHTML ?? "",
      prevPriceHtml: prices[1]?.innerHTML,
      ratingHtml: rating?.innerHTML ?? "",
      ratingLabel: ratingImg?.getAttribute("aria-label") ?? "",
      colors: parseColors(card),
    });
  }
  return products;
}

export function useTopPicks() {
  const [quickView, setQuickViewState] = useState<TopPicksQuickView | null>(
    null,
  );
  const openerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const shelves = Array.from(
      document.querySelectorAll<HTMLElement>(SHELF_SELECTORS),
    ).filter((el) => el.dataset.tpReady !== "true");
    if (!shelves.length) return;

    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = QUICK_VIEW_CSS;
      document.head.appendChild(style);
    }

    const cleanups: Array<() => void> = [];
    /** Rewinds the tabbed shelf's carousel; set while processing that shelf. */
    let resetForTabs: (() => void) | null = null;

    for (const shelf of shelves) {
      shelf.dataset.tpReady = "true";
      const products = extractProducts(shelf);

      // --- Quick View buttons ------------------------------------------------
      const openQuickView = (index: number, card: HTMLElement) => {
        const product = products[index];
        if (!product) return;
        openerRef.current =
          (document.activeElement as HTMLElement | null) ?? null;
        const chips = Array.from(
          card.querySelectorAll<HTMLElement>(".Bnw4Z .L6OEP"),
        );
        const selected = chips.findIndex((c) => c.classList.contains("e66ra"));
        const colorIndex = selected >= 0 ? selected : 0;
        const images = galleryFor(product);
        setQuickViewState({
          product,
          colorIndex,
          imageIndex: galleryIndexForColor(images, product.colors[colorIndex]),
          size: "",
        });
      };

      shelf.querySelectorAll<HTMLElement>("li.fOGa1").forEach((card, index) => {
        const host = card.querySelector<HTMLElement>("div.r5rUT");
        if (!host) return;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "tp-quickview";
        btn.textContent = "Quick View";
        const onClick = (e: Event) => {
          e.preventDefault();
          e.stopPropagation();
          openQuickView(index, card);
        };
        btn.addEventListener("click", onClick);
        host.appendChild(btn);
        cleanups.push(() => {
          btn.removeEventListener("click", onClick);
          btn.remove();
        });
      });

      // --- swatch hover preview + click select -------------------------------
      let activeCard: HTMLElement | null = null;
      const restore = (card: HTMLElement) => {
        const img = card.querySelector<HTMLImageElement>("img.Qbb89");
        if (img?.dataset.tpDefault) img.setAttribute("src", img.dataset.tpDefault);
        activeCard = null;
      };
      const colorFor = (chip: HTMLElement) => {
        const file = mediaFileFromUrl(chip.style.backgroundImage || "");
        return file ? COLORWAY_IMAGES[file] : undefined;
      };
      const onPointerOver = (e: Event) => {
        const target = e.target as Element | null;
        const chip = target?.closest?.(".L6OEP") as HTMLElement | null;
        if (!chip) return;
        const card = chip.closest<HTMLElement>("li.fOGa1");
        const img = card?.querySelector<HTMLImageElement>("img.Qbb89");
        if (!card || !img) return;
        const full = colorFor(chip);
        if (!full) return;
        if (!img.dataset.tpDefault) {
          img.dataset.tpDefault = img.getAttribute("src") ?? "";
        }
        img.setAttribute("src", full);
        activeCard = card;
      };
      const onPointerOut = (e: PointerEvent) => {
        const to = e.relatedTarget as Node | null;
        if (activeCard && (!to || !activeCard.contains(to))) restore(activeCard);
      };
      const onClickChip = (e: Event) => {
        const target = e.target as Element | null;
        const chip = target?.closest?.(".L6OEP") as HTMLElement | null;
        if (!chip) return;
        const card = chip.closest<HTMLElement>("li.fOGa1");
        const img = card?.querySelector<HTMLImageElement>("img.Qbb89");
        if (!card || !img) return;
        for (const b of card.querySelectorAll(".Bnw4Z .e66ra")) {
          b.classList.remove("e66ra");
        }
        chip.classList.add("e66ra");
        const full = colorFor(chip);
        if (full) {
          img.dataset.tpDefault = full;
          img.setAttribute("src", full);
        }
      };
      shelf.addEventListener("pointerover", onPointerOver);
      shelf.addEventListener("pointerout", onPointerOut);
      shelf.addEventListener("click", onClickChip);
      cleanups.push(() => {
        shelf.removeEventListener("pointerover", onPointerOver);
        shelf.removeEventListener("pointerout", onPointerOut);
        shelf.removeEventListener("click", onClickChip);
      });

      // --- per-card color tray scrolling --------------------------------------
      for (const card of shelf.querySelectorAll<HTMLElement>("li.fOGa1")) {
        const row = card.querySelector<HTMLElement>(".Bnw4Z.LO_i4");
        const prev = card.querySelector<HTMLButtonElement>(".BoPEB.CMB2V");
        const next = card.querySelector<HTMLButtonElement>(".BoPEB.N1ySy");
        if (!row || !prev || !next) continue;
        const sync = () => {
          setArrowEnabled(prev, row.scrollLeft > 1);
          setArrowEnabled(
            next,
            row.scrollLeft < row.scrollWidth - row.clientWidth - 1,
          );
        };
        const scrollBy = (dir: number) => {
          row.scrollBy({ left: dir * (row.clientWidth * 0.8), behavior: "smooth" });
        };
        const onPrev = () => scrollBy(-1);
        const onNext = () => scrollBy(1);
        prev.addEventListener("click", onPrev);
        next.addEventListener("click", onNext);
        row.addEventListener("scroll", sync, { passive: true });
        sync();
        cleanups.push(() => {
          prev.removeEventListener("click", onPrev);
          next.removeEventListener("click", onNext);
          row.removeEventListener("scroll", sync);
        });
      }

      // --- shelf paging (transform on desktop, native scroll on mobile) -------
      const viewport = shelf.querySelector<HTMLElement>("div.Gk0sK");
      const track = shelf.querySelector<HTMLElement>("ul.TOmeT");
      const shelfPrev = shelf.querySelector<HTMLButtonElement>(
        'button[aria-label="Swipe Left"]',
      );
      const shelfNext = shelf.querySelector<HTMLButtonElement>(
        'button[aria-label="Swipe Right"]',
      );
      if (viewport && track && shelfPrev && shelfNext) {
        let offset = 0;
        let step = 0;
        const cards = () =>
          Array.from(track.children) as unknown as HTMLElement[];

        const nativeMode = () =>
          getComputedStyle(viewport).overflowX !== "hidden";

        const layout = () => {
          const items = cards();
          if (!items.length) return;
          const first = items[0];
          const pitch = items[1]
            ? items[1].offsetLeft - first.offsetLeft
            : first.offsetWidth;
          const viewW = viewport.clientWidth;
          const totalW =
            items[items.length - 1].offsetLeft +
            items[items.length - 1].offsetWidth -
            first.offsetLeft;
          const max = Math.max(0, totalW - viewW);
          const perView = Math.max(1, Math.round(viewW / pitch));
          step = perView * pitch;
          if (nativeMode()) {
            track.style.transform = "";
            setArrowEnabled(shelfPrev, viewport.scrollLeft > 1);
            setArrowEnabled(
              shelfNext,
              viewport.scrollLeft < viewport.scrollWidth - viewW - 1,
            );
          } else {
            offset = clamp(offset, 0, max);
            track.style.transform = `translate3d(${-offset}px, 0, 0)`;
            setArrowEnabled(shelfPrev, offset > 0);
            setArrowEnabled(shelfNext, offset < max - 1);
          }
        };

        const go = (dir: number) => {
          if (nativeMode()) {
            viewport.scrollBy({ left: dir * step, behavior: "smooth" });
          } else {
            offset += dir * step;
            layout();
          }
        };
        const onPrev = () => go(-1);
        const onNext = () => go(1);
        shelfPrev.addEventListener("click", onPrev);
        shelfNext.addEventListener("click", onNext);
        const observer = new ResizeObserver(layout);
        observer.observe(viewport);
        layout();
        cleanups.push(() => {
          shelfPrev.removeEventListener("click", onPrev);
          shelfNext.removeEventListener("click", onNext);
          observer.disconnect();
        });

        if (shelf.querySelector("nav.r7COG")) {
          resetForTabs = () => {
            offset = 0;
            if (nativeMode()) viewport.scrollTo({ left: 0 });
            layout();
          };
        }
      }
    }

    // --- Top Picks tab bar ----------------------------------------------------
    // The capture ships one shared card list; selecting a tab moves the
    // captured selected styles (.CtGs9 + data-selected-recs-tab) and rewinds
    // the carousel. Per-tab content will be fetched once the recommendations
    // API lands.
    const tabNav = document.querySelector<HTMLElement>("nav.r7COG ul.Z1Zy4");
    if (tabNav) {
      const shelfId =
        tabNav
          .closest("section")
          ?.querySelector("[id^=product-recommendations-shelf]")
          ?.id ?? "";
      tabNav.setAttribute("role", "tablist");
      const tabs = Array.from(tabNav.querySelectorAll<HTMLLIElement>("li.ZgHf6"));
      tabs.forEach((tab, i) => {
        tab.setAttribute("role", "tab");
        tab.setAttribute("aria-selected", i === 0 ? "true" : "false");
        if (shelfId) tab.setAttribute("aria-controls", shelfId);
      });
      const select = (index: number) => {
        const tab = tabs[index];
        if (!tab || tab.classList.contains("CtGs9")) return;
        tabs.forEach((t, i) => {
          const selected = i === index;
          t.classList.toggle("CtGs9", selected);
          t.setAttribute("aria-selected", selected ? "true" : "false");
          if (selected) t.setAttribute("data-selected-recs-tab", "true");
          else t.removeAttribute("data-selected-recs-tab");
        });
        resetForTabs?.();
      };
      tabs.forEach((tab, i) => {
        const onClick = () => select(i);
        const onKeydown = (e: KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            select(i);
          }
        };
        tab.addEventListener("click", onClick);
        tab.addEventListener("keydown", onKeydown);
        cleanups.push(() => {
          tab.removeEventListener("click", onClick);
          tab.removeEventListener("keydown", onKeydown);
        });
      });
    }

    return () => {
      for (const fn of cleanups) fn();
      for (const shelf of shelves) delete shelf.dataset.tpReady;
    };
  }, []);

  const closeQuickView = useCallback(() => {
    setQuickViewState(null);
    openerRef.current?.focus();
    openerRef.current = null;
  }, []);

  const selectQvColor = useCallback((colorIndex: number) => {
    setQuickViewState((s) => {
      if (!s || colorIndex < 0 || colorIndex >= s.product.colors.length) {
        return s;
      }
      const images = galleryFor(s.product);
      return {
        ...s,
        colorIndex,
        imageIndex: galleryIndexForColor(images, s.product.colors[colorIndex]),
      };
    });
  }, []);

  const selectQvImage = useCallback((imageIndex: number) => {
    setQuickViewState((s) =>
      s && imageIndex >= 0 && imageIndex < galleryFor(s.product).length
        ? { ...s, imageIndex }
        : s,
    );
  }, []);

  const selectQvSize = useCallback((size: string) => {
    setQuickViewState((s) => (s ? { ...s, size } : s));
  }, []);

  // Modal chrome owned by the ViewModel: lock page scroll, Esc to dismiss.
  useEffect(() => {
    if (!quickView) return;
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeQuickView();
    };
    document.addEventListener("keydown", onKeydown);
    return () => {
      root.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKeydown);
    };
  }, [quickView, closeQuickView]);

  return { quickView, closeQuickView, selectQvColor, selectQvImage, selectQvSize };
}

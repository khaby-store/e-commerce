// Pure hero-carousel domain logic. No DOM, no React.
//
// The captured hero (section[aria-label="Hero carousel"]) has 6 slides and a
// pause-controlled autoplay dwell whose progress is painted by the design
// system through the --ppt-progress-angle custom property.

/** Autoplay dwell per slide, matching the original hero's cadence. */
export const HERO_DWELL_MS = 6000;

/** Wrap a slide index into [0, total); safe for total <= 0. */
export function wrapIndex(index: number, total: number): number {
  if (total <= 0) return 0;
  return ((index % total) + total) % total;
}

/** Accessible announcement for the visually-hidden live region. */
export function slideAnnouncement(index: number, total: number, title: string): string {
  const label = `Slide ${index + 1} of ${total}`;
  return title ? `${label}: ${title}` : label;
}

/** Accessible label for the "4/6" counter pill. */
export function counterLabel(index: number, total: number): string {
  return ` Showing slide ${index + 1} of ${total}`;
}

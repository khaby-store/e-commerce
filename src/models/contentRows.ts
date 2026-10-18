/**
 * Pure descriptors and math for the captured native-scroll content rows:
 * four filmStrip shelves (Cheers to Gifting & Gathering, Your Next Style
 * Obsession, Celebrating 125 One Brand at a Time, Brands We Love) and two
 * navigationRow shelves (Style at Every Price, Cozy Is in Season). The
 * snapshot ships each row's design-system swipe/scroll arrows in their
 * initial disabled/enabled state, but nothing wires them to the track.
 */

export type ContentRowKind = {
  /** Section container that holds exactly one row of this kind. */
  sectionSelector: string;
  /** Horizontal scroller inside the section. */
  trackSelector: string;
  leftLabel: string;
  rightLabel: string;
  /** Design-system class marking a disabled arrow; removing it re-enables. */
  disabledClass: string;
};

export const CONTENT_ROW_KINDS: readonly ContentRowKind[] = [
  {
    sectionSelector: 'section[data-container-type="filmStrip"]',
    trackSelector: ".rLGMA",
    leftLabel: "Swipe Left",
    rightLabel: "Swipe Right",
    disabledClass: "fm0qa",
  },
  {
    sectionSelector: 'section[data-container-type="navigationRow"]',
    trackSelector: ".F3HmH",
    leftLabel: "Scroll Left",
    rightLabel: "Scroll Right",
    disabledClass: "VT4gF",
  },
];

/** Fraction of the viewport one arrow click advances the track. */
export const ROW_SCROLL_PAGE = 0.8;

/** Tolerance in px for sub-pixel scroll offsets at either end. */
export const ROW_EPSILON_PX = 2;

/** Which end a horizontal scroller's arrows should be enabled at. */
export function rowArrowState(
  scrollLeft: number,
  scrollWidth: number,
  clientWidth: number,
): { atStart: boolean; atEnd: boolean } {
  return {
    atStart: scrollLeft <= ROW_EPSILON_PX,
    atEnd: scrollLeft >= scrollWidth - clientWidth - ROW_EPSILON_PX,
  };
}

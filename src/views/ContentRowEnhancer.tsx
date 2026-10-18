"use client";

import { useContentRows } from "@/viewmodels/useContentRows";

// View for the captured filmStrip and navigationRow shelves. Their markup is
// captured DOM owned by the replica page, so this renders nothing — the
// ViewModel wires the design system's own swipe/scroll arrows over each
// track.
export default function ContentRowEnhancer() {
  useContentRows();
  return null;
}

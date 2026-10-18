"use client";

import { useHeroCarousel } from "@/viewmodels/useHeroCarousel";

// View for the interactive hero. The slide markup is captured DOM owned by
// the replica page, so this renders nothing — it only mounts the ViewModel,
// which wires the design system's own controls over that markup.
export default function HeroCarouselEnhancer() {
  useHeroCarousel();
  return null;
}

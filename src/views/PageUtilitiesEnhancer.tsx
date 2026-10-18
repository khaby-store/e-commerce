"use client";

import { usePageUtilities } from "@/viewmodels/usePageUtilities";

// View for the captured page-chrome controls (search guard, back-to-top,
// email sign-up). The markup is captured DOM owned by the replica page, so
// this renders nothing — the ViewModel wires the behavior.
export default function PageUtilitiesEnhancer() {
  usePageUtilities();
  return null;
}

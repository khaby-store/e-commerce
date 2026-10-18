import { NORDSTROM_BODY_HTML } from "@/lib/nordstrom/body";
import { fetchMegaNavMenus } from "@/services/megaNavService";
import ContentRowEnhancer from "@/views/ContentRowEnhancer";
import HeroCarouselEnhancer from "@/views/HeroCarouselEnhancer";
import MegaNavEnhancer from "@/views/MegaNavEnhancer";
import PageUtilitiesEnhancer from "@/views/PageUtilitiesEnhancer";
import TopPicksEnhancer from "@/views/TopPicksEnhancer";

// The captured <body> carries its own root element (#root). We render its
// contents verbatim so the DOM is identical to the saved page. The captured
// markup is a foreign string React compares against the parsed DOM — any
// normalization difference trips a hydration warning that is not actionable,
// so it is suppressed on this element only.
//
// HeroCarouselEnhancer mounts after the blob and makes the captured hero
// carousel interactive (autoplay, chevrons, pause, swipe, keyboard).
// TopPicksEnhancer does the same for every recommendations shelf — Top
// Picks for You (including its tab bar), Great Deals on What You Love, and
// Trending Near You: swatch hover previews, Quick View hover buttons,
// responsive paging where the capture ships arrows, and the Quick View
// dialog. MegaNavEnhancer populates the capture's empty global nav flyout
// with hover-open mega menus (data fetched here so it can become an API
// call without touching the client layers). ContentRowEnhancer wires the
// filmStrip/navigationRow shelves' native-scroll arrows, and
// PageUtilitiesEnhancer wires the search guard, back-to-top button, and
// email sign-up.
export default async function NordstromPage() {
  const megaNavMenus = await fetchMegaNavMenus();
  return (
    <>
      <div
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: NORDSTROM_BODY_HTML }}
      />
      <HeroCarouselEnhancer />
      <TopPicksEnhancer />
      <MegaNavEnhancer menus={megaNavMenus} />
      <ContentRowEnhancer />
      <PageUtilitiesEnhancer />
    </>
  );
}

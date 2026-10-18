import type { MegaNavMenu } from "@/models/megaNav";
import { MOCK_MEGA_NAV_MENUS } from "@/services/megaNavData";

/**
 * Data access for the global navigation. Currently resolves a local mock;
 * swap the body for a real `fetch` against the nav-config API without
 * touching the viewmodel or view.
 */
export async function fetchMegaNavMenus(): Promise<MegaNavMenu[]> {
  return MOCK_MEGA_NAV_MENUS;
}

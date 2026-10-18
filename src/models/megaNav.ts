/**
 * Global navigation mega-menu model. Pure types + helpers, no React, no I/O.
 * Shapes mirror what a nav-config API would return.
 */

export type MegaNavLink = {
  label: string;
  href: string;
};

/**
 * A bold column heading with optional links beneath it. A group with no
 * links renders as a standalone bold item (e.g. "Adaptive", "Maternity").
 */
export type MegaNavGroup = {
  heading: string;
  links: MegaNavLink[];
};

export type MegaNavColumn = {
  groups: MegaNavGroup[];
};

export type MegaNavPromo = {
  imageSrc: string;
  caption: string;
  href: string;
};

export type MegaNavMenu = {
  /** Stable id matching the nav button order (holiday-gifts, new-now, …). */
  id: string;
  /** Trigger label; must match the captured button text. */
  label: string;
  /** Left-most column; rendered with a rule under its heading. */
  featured: MegaNavGroup;
  columns: MegaNavColumn[];
  promo: MegaNavPromo;
};

export function findMenuByLabel(
  menus: readonly MegaNavMenu[],
  label: string
): MegaNavMenu | null {
  return menus.find((menu) => menu.label === label) ?? null;
}

export function link(label: string): MegaNavLink {
  return { label, href: "#" };
}

export function links(...labels: string[]): MegaNavLink[] {
  return labels.map(link);
}

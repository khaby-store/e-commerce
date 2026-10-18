"use client";

import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import type { MegaNavGroup, MegaNavMenu } from "@/models/megaNav";
import { useMegaNav } from "@/viewmodels/useMegaNav";

const MEGA_CSS = `
#GlobalDesktopNavFlyout .tp-mega{
  font-family:"Brandon Text",Arial,sans-serif;color:#191a1b;background:#fff;
  padding:4px 32px 48px;position:relative;
}
.tp-mega-cols{display:flex;flex-wrap:nowrap;gap:24px;align-items:flex-start;padding-right:328px}
.tp-mega-col{min-width:0;flex:1 1 auto}
.tp-mega-featured{min-width:190px;flex:0 0 auto;padding-right:16px}
.tp-mega-group{margin:0 0 8px}
.tp-mega-head{font-weight:700;font-size:16px;line-height:1.3;margin:16px 0 8px}
.tp-mega-featured .tp-mega-head{margin-top:10px}
.tp-mega-head-rule{border-bottom:1px solid #c2cbcd;padding-bottom:12px}
.tp-mega ul{list-style:none;margin:0;padding:0}
.tp-mega a{color:#191a1b;text-decoration:none;font-size:16px;line-height:1.25;display:block;padding:7px 0}
.tp-mega a:hover{text-decoration:underline}
.tp-mega-promo{position:absolute;top:56px;right:24px;width:280px}
.tp-mega-promo img{display:block;width:100%;height:400px;object-fit:cover;background:#f2f2f2}
.tp-mega-promo-cap{display:inline-block;margin-top:14px;font-size:16px;text-decoration:underline!important}
.tp-mega-close{
  position:absolute;top:8px;right:24px;width:40px;height:40px;
  border:2px solid transparent;background:transparent;cursor:pointer;
  display:flex;align-items:center;justify-content:center;padding:0;
}
.tp-mega-close svg{width:20px;height:20px;display:block}
.tp-mega-close:hover,.tp-mega-close:focus-visible{border-color:#191a1b}
nav.kRlHr .CaTY6.tp-mega-open{border-bottom-color:currentColor}
@media (max-width:768px){
  #GlobalDesktopNavFlyout .tp-mega{padding:4px 16px 32px;max-height:70vh;overflow-y:auto;position:relative}
  .tp-mega-cols{flex-direction:column;gap:0;padding-right:0}
  .tp-mega-col,.tp-mega-featured{width:100%;min-width:0;flex:none;padding-right:0}
  .tp-mega-promo{position:static;width:100%;margin-top:24px}
  .tp-mega-promo img{height:280px}
}
`;

/**
 * Client mount that renders the mega-menu panel into the capture's empty
 * `#GlobalDesktopNavFlyout` container. Trigger wiring and open/close state
 * live in the viewmodel; this component is presentational.
 */
export default function MegaNavEnhancer({
  menus,
}: {
  menus: MegaNavMenu[];
}) {
  const { activeMenu, closeMenu } = useMegaNav(menus);
  // The capture ships an empty flyout container that never changes identity,
  // so the element lookup is a stable external snapshot (null on the server).
  const host = useSyncExternalStore(
    subscribeNoop,
    () => document.getElementById("GlobalDesktopNavFlyout"),
    () => null
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: MEGA_CSS }} suppressHydrationWarning />
      {host && activeMenu
        ? createPortal(<MegaMenuPanel menu={activeMenu} onClose={closeMenu} />, host)
        : null}
    </>
  );
}

function subscribeNoop() {
  return () => {};
}

function MegaMenuPanel({
  menu,
  onClose,
}: {
  menu: MegaNavMenu;
  onClose: () => void;
}) {
  return (
    <div className="tp-mega" role="region" aria-label={`${menu.label} menu`}>
      <div className="tp-mega-cols">
        <div className="tp-mega-col tp-mega-featured">
          <div className="tp-mega-head tp-mega-head-rule">
            {menu.featured.heading}
          </div>
          <ul>
            {menu.featured.links.map((item) => (
              <li key={item.label}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </div>
        {menu.columns.map((column, columnIndex) => (
          <div className="tp-mega-col" key={columnIndex}>
            {column.groups.map((group, groupIndex) => (
              <MegaNavGroupSection group={group} key={groupIndex} />
            ))}
          </div>
        ))}
        <div className="tp-mega-promo">
          {/* eslint-disable-next-line @next/next/no-img-element -- captured third-party promo art */}
          <img src={menu.promo.imageSrc} alt="" />
          <a href={menu.promo.href} className="tp-mega-promo-cap">
            {menu.promo.caption}
          </a>
        </div>
      </div>
      <button
        type="button"
        className="tp-mega-close"
        aria-label="Close menu"
        onClick={onClose}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M5.293 5.293a1 1 0 0 1 1.414 0L12 10.586l5.293-5.293a1 1 0 1 1 1.414 1.414L13.414 12l5.293 5.293a1 1 0 0 1-1.414 1.414L12 13.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L10.586 12 5.293 6.707a1 1 0 0 1 0-1.414Z"
            fill="#191A1B"
          />
        </svg>
      </button>
    </div>
  );
}

function MegaNavGroupSection({ group }: { group: MegaNavGroup }) {
  return (
    <div className="tp-mega-group">
      <div className="tp-mega-head">{group.heading}</div>
      {group.links.length > 0 && (
        <ul>
          {group.links.map((item) => (
            <li key={item.label}>
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

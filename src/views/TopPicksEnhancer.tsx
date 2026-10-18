"use client";

/* eslint-disable @next/next/no-img-element -- replica assets are static captured urls; next/image would rewrite them. */

import { QUICK_VIEW_SIZES, colorDisplayName, discountNote, galleryFor } from "@/models/topPicks";
import { useTopPicks } from "@/viewmodels/useTopPicks";

// View for the interactive "Top Picks for You" shelf. The shelf markup is
// captured DOM owned by the replica page, so this only mounts the ViewModel
// (swatch previews, Quick View hover buttons, responsive paging) and renders
// the Quick View dialog from its view state. Modal chrome is scoped under
// .tp-qv-* and uses the captured design tokens (Brandon Text, #191a1b,
// #d82508 sale) so it sits natively on the replica.

const TP_QV_CSS = `
.tp-qv-overlay{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(25,26,27,.55);font-family:"Brandon Text",Arial,sans-serif;color:#191a1b;box-sizing:border-box}
.tp-qv-panel{position:relative;background:#fff;border-radius:16px;width:100%;max-width:1080px;max-height:calc(100dvh - 48px);overflow:auto;padding:40px 48px 48px;box-shadow:0 8px 40px rgba(25,26,27,.25);box-sizing:border-box}
.tp-qv-close{position:absolute;top:16px;right:16px;width:40px;height:40px;display:inline-flex;align-items:center;justify-content:center;border:0;border-radius:50%;background:transparent;color:#191a1b;cursor:pointer;padding:0}
.tp-qv-close:hover{background:#f0f3f5}
.tp-qv-close:focus-visible{outline:2px solid #191a1b;outline-offset:2px}
.tp-qv-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:48px;align-items:start}
.tp-qv-stage{background:#f7f7f8;border-radius:8px;aspect-ratio:4/5;display:flex;align-items:center;justify-content:center;overflow:hidden}
.tp-qv-stage img{width:100%;height:100%;object-fit:contain;display:block}
.tp-qv-pager{display:flex;align-items:center;justify-content:center;gap:16px;margin-top:12px;font-size:1rem;line-height:1.5}
.tp-qv-pager button{width:32px;height:32px;display:inline-flex;align-items:center;justify-content:center;border:0;border-radius:50%;background:transparent;color:#191a1b;cursor:pointer;padding:0}
.tp-qv-pager button:hover:not(:disabled){background:#f0f3f5}
.tp-qv-pager button:disabled{color:#c2cbcd;cursor:default}
.tp-qv-pager button:focus-visible{outline:2px solid #191a1b;outline-offset:2px}
.tp-qv-details>*+*{margin-top:12px}
.tp-qv-rating{margin:0}
.tp-qv-title{margin:0;font-size:1.5rem;line-height:1.25;font-weight:700}
.tp-qv-brand{display:inline-block;color:#191a1b;font-size:1rem;line-height:1.5;text-decoration:underline;text-underline-offset:3px}
.tp-qv-price-row{margin-top:4px!important}
.tp-qv-note{color:#d82508;font-size:1rem;line-height:1.5}
.tp-qv-prev{margin-top:4px}
.tp-qv-colors{margin-top:20px}
.tp-qv-color-label{margin:0 0 10px;font-size:1rem;line-height:1.5}
.tp-qv-swatches{display:flex;flex-wrap:wrap;gap:8px;margin:0;padding:0;list-style:none}
.tp-qv-swatch{position:relative;width:48px;height:48px;padding:0;border:1px solid rgba(25,26,27,.27);border-radius:2px;background:#fff;cursor:pointer;box-sizing:border-box}
.tp-qv-swatch img{width:100%;height:100%;object-fit:cover;border-radius:1px;display:block}
.tp-qv-swatch:hover{outline:2px solid #c2cbcd;outline-offset:2px}
.tp-qv-swatch.is-selected{outline:2px solid #191a1b;outline-offset:2px}
.tp-qv-swatch:focus-visible{outline:2px solid #191a1b;outline-offset:2px}
.tp-qv-check{position:absolute;top:-6px;right:-6px;width:18px;height:18px;border-radius:50%;background:#007a53;display:inline-flex;align-items:center;justify-content:center;color:#fff}
.tp-qv-sizeguides{display:inline-flex;align-items:center;gap:8px;margin-top:20px;color:#191a1b;font-size:1rem;line-height:1.5;text-decoration:underline;text-underline-offset:3px}
.tp-qv-sizeguides:focus-visible{outline:2px solid #191a1b;outline-offset:2px}
.tp-qv-size{display:block;margin-top:16px;position:relative}
.tp-qv-size select{width:100%;height:48px;padding:0 40px 0 14px;border:1px solid #191a1b;border-radius:4px;background:#fff url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' viewBox='0 0 24 24'%3E%3Cpath stroke='%23191a1b' stroke-width='2' d='m6 9 6 6 6-6'/%3E%3C/svg%3E") no-repeat right 14px center;font:400 1rem/1.5 "Brandon Text",Arial,sans-serif;color:#191a1b;appearance:none;box-sizing:border-box;cursor:pointer}
.tp-qv-size select:focus-visible{outline:2px solid #191a1b;outline-offset:2px}
.tp-qv-atb{width:100%;height:48px;margin-top:16px;display:inline-flex;align-items:center;justify-content:center;gap:8px;border:0;border-radius:8px;background:#191a1b;color:#fff;font:700 1rem/1.5 "Brandon Text",Arial,sans-serif;cursor:pointer}
.tp-qv-atb:hover:not(:disabled){background:#2d2e30}
.tp-qv-atb:disabled{background:#e3e7ea;color:#647175;cursor:not-allowed}
.tp-qv-atb:focus-visible{outline:2px solid #191a1b;outline-offset:2px}
.tp-qv-secondary{width:100%;height:48px;margin-top:12px;display:inline-flex;align-items:center;justify-content:center;gap:8px;border:1px solid #191a1b;border-radius:8px;background:#fff;color:#191a1b;font:700 1rem/1.5 "Brandon Text",Arial,sans-serif;cursor:pointer}
.tp-qv-secondary:hover{background:#f0f3f5}
.tp-qv-secondary:focus-visible{outline:2px solid #191a1b;outline-offset:2px}
.tp-qv-sr{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}
@media (max-width:900px){
  .tp-qv-overlay{padding:16px}
  .tp-qv-panel{padding:32px 24px 32px;max-height:calc(100dvh - 32px)}
  .tp-qv-grid{grid-template-columns:minmax(0,1fr);gap:24px}
  .tp-qv-stage{aspect-ratio:1/1}
}
@media (max-width:600px){
  .tp-qv-overlay{padding:0;align-items:stretch}
  .tp-qv-panel{max-width:none;max-height:100dvh;height:100dvh;border-radius:0;padding:24px 16px 32px}
}
`;

const CHEVRON_LEFT =
  "M14.207 17.707a1 1 0 0 0 0-1.414L9.914 12l4.293-4.293a1 1 0 0 0-1.414-1.414l-5 5a1 1 0 0 0 0 1.414l5 5a1 1 0 0 0 1.414 0";
const CHEVRON_RIGHT =
  "M9.793 6.293a1 1 0 0 0 0 1.414L14.086 12l-4.293 4.293a1 1 0 1 0 1.414 1.414l5-5a1 1 0 0 0 0-1.414l-5-5a1 1 0 0 0-1.414 0";

function Chevron({ left }: { left?: boolean }) {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d={left ? CHEVRON_LEFT : CHEVRON_RIGHT} />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        d="M5 5l14 14M19 5 5 19"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M7 10V8a5 5 0 0 1 10 0v2h1a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1h1zm2 0h6V8a3 3 0 1 0-6 0v2z"
      />
    </svg>
  );
}

function RulerIcon() {
  return (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <rect
        x="2.75"
        y="7.75"
        width="18.5"
        height="8.5"
        rx="1.25"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path stroke="currentColor" strokeWidth="1.5" d="M7 8v3M11 8v4M15 8v3M19 8v4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M9.5 16.2 5.3 12l-1.4 1.4 5.6 5.6L20.9 7 19.5 5.6z"
      />
    </svg>
  );
}

export default function TopPicksEnhancer() {
  const { quickView, closeQuickView, selectQvColor, selectQvImage, selectQvSize } =
    useTopPicks();

  if (!quickView) return null;

  const { product, colorIndex, imageIndex, size } = quickView;
  const images = galleryFor(product);
  const color = product.colors[colorIndex];
  const note = discountNote(product.priceHtml, product.prevPriceHtml);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: TP_QV_CSS }} />
      <div className="tp-qv-overlay" onClick={closeQuickView}>
        <div
          className="tp-qv-panel"
          role="dialog"
          aria-modal="true"
          aria-label={product.name}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="tp-qv-close"
            aria-label="Close"
            onClick={closeQuickView}
            autoFocus
          >
            <CloseIcon />
          </button>

          <div className="tp-qv-grid">
            <div className="tp-qv-gallery">
              <div className="tp-qv-stage">
                <img src={images[imageIndex]} alt={product.name} />
              </div>
              {images.length > 1 && (
                <div className="tp-qv-pager">
                  <button
                    type="button"
                    aria-label="Previous image"
                    disabled={imageIndex === 0}
                    onClick={() => selectQvImage(imageIndex - 1)}
                  >
                    <Chevron left />
                  </button>
                  <span aria-live="polite">
                    {imageIndex + 1} / {images.length}
                  </span>
                  <button
                    type="button"
                    aria-label="Next image"
                    disabled={imageIndex >= images.length - 1}
                    onClick={() => selectQvImage(imageIndex + 1)}
                  >
                    <Chevron />
                  </button>
                </div>
              )}
            </div>

            <div className="tp-qv-details">
              <div
                className="tp-qv-rating"
                dangerouslySetInnerHTML={{ __html: product.ratingHtml }}
              />
              <h2 className="tp-qv-title">{product.name}</h2>
              <a className="tp-qv-brand" href="#">
                {product.brand}
              </a>

              <div className="JqcnR tp-qv-price-row">
                <div
                  className="qJWwm PeXzr"
                  dangerouslySetInnerHTML={{ __html: product.priceHtml }}
                />
                {note && <span className="tp-qv-note">({note})</span>}
              </div>
              {product.prevPriceHtml && (
                <div
                  className="qJWwm PeXzr tp-qv-prev"
                  dangerouslySetInnerHTML={{ __html: product.prevPriceHtml }}
                />
              )}

              {product.colors.length > 0 && color && (
                <div className="tp-qv-colors">
                  <p className="tp-qv-color-label">
                    Color: <strong>{colorDisplayName(color.name)}</strong>
                  </p>
                  <ul className="tp-qv-swatches">
                    {product.colors.map((c, i) => (
                      <li key={`${c.chipFile}-${i}`}>
                        <button
                          type="button"
                          className={`tp-qv-swatch${i === colorIndex ? " is-selected" : ""}`}
                          aria-label={c.name}
                          aria-pressed={i === colorIndex}
                          onClick={() => selectQvColor(i)}
                        >
                          <img src={c.chipUrl} alt="" />
                          {i === colorIndex && (
                            <span className="tp-qv-check">
                              <CheckIcon />
                            </span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <a className="tp-qv-sizeguides" href="#">
                <RulerIcon />
                Size guides
              </a>

              <label className="tp-qv-size">
                <span className="tp-qv-sr">Size</span>
                <select
                  value={size}
                  onChange={(e) => selectQvSize(e.target.value)}
                >
                  <option value="">Size</option>
                  {QUICK_VIEW_SIZES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>

              <button
                type="button"
                className="tp-qv-atb"
                disabled={!size}
                title={size ? "Add to Bag" : "Select a size"}
              >
                <LockIcon />
                Add to Bag
              </button>
              <button type="button" className="tp-qv-secondary">
                Add to Registry
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

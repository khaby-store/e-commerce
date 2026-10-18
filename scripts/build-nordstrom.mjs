// Regenerates the replica source-of-truth files from the vendored capture:
//   scripts/nordstrom-capture.html -> src/lib/nordstrom/body.ts
//     - <script> tags stripped
//     - everything after the footer's structural closes cut (tracker
//       noscripts, sierra/chat widget, beacon iframes — the post-footer junk)
//     - saved-page asset refs -> /assets/
//     - nordstrommedia CDN urls -> local /assets/media/<sha1>.<ext>
//       (non-image media such as the 127MB catalog pdf -> "#")
//     - every remaining nordstrom-domain url -> "#"  (no nordstrom urls ship)
//   src/lib/nordstrom/styles/*.css -> src/lib/nordstrom/css.ts
//     - media urls localised the same way, font urls made absolute,
//       sheet comments de-branded
// Run: node scripts/build-nordstrom.mjs   (after node scripts/fetch-media.mjs)
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const CAPTURE = "scripts/nordstrom-capture.html";
const ASSET_DIR = "/assets/";
const MEDIA_DIR = "/assets/media/";
const MEDIA_PUBLIC = "public/assets/media";
const OUT_DIR = "src/lib/nordstrom";
const STYLES_DIR = path.join(OUT_DIR, "styles");

const MEDIA_URL_RE = /https:\/\/n\.nordstrommedia\.com\/[^\s"'<>)\}]+/g;
const NORDSTROM_URL_RE = /(?:https?:\\?\/\\?\/|\\?\/\\?\/)[^\s"'<>]*nordstrom[^\s"'<>]*/gi;

function mediaFileName(raw) {
  const cleanPath = raw.split("?")[0];
  const ext = (cleanPath.match(/\.[a-z0-9]+$/) || [".bin"])[0];
  const hash = crypto.createHash("sha1").update(raw).digest("hex").slice(0, 20);
  return `${hash}${ext}`;
}

function localiseMedia(text) {
  return text.replace(MEDIA_URL_RE, (match) => {
    const raw = match.split("&quot;")[0].split("&#34;")[0];
    const ext = (raw.split("?")[0].match(/\.[a-z0-9]+$/) || [""])[0];
    if (!/\.(png|jpe?g|webp|avif|gif|svg|ico)$/i.test(ext)) return "#";
    const file = mediaFileName(raw);
    if (!fs.existsSync(path.join(MEDIA_PUBLIC, file))) {
      throw new Error(`missing media asset ${file} for ${raw} (run scripts/fetch-media.mjs)`);
    }
    return MEDIA_DIR + file;
  });
}

function scrubNordstromUrls(text) {
  return text.replace(NORDSTROM_URL_RE, "#");
}

// root-relative /static/nordstrom/res/v4/<file> (used by captured css) -> local
function localiseStaticPaths(text) {
  return text.replace(/\/static\/nordstrom\/res\/v4\/([^)"'<\s]+)/g, (m, file) => {
    if (!fs.existsSync(path.join("public/assets", file))) {
      throw new Error(`missing static asset ${file} in public/assets`);
    }
    return ASSET_DIR + file;
  });
}

function assertNoNordstromUrls(text, label) {
  const leftover = text.match(NORDSTROM_URL_RE);
  if (leftover) throw new Error(`${label}: nordstrom urls left: ${leftover.slice(0, 5).join(" ")}`);
  if (text.includes("/nordstrom/")) throw new Error(`${label}: /nordstrom/ asset path left`);
}

// --- 1. body.ts -------------------------------------------------------------
const html = fs.readFileSync(CAPTURE, "utf8");
const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/);
if (!bodyMatch) throw new Error("no <body> in capture");
let body = bodyMatch[1];
body = body.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "");
body = body.replace(/<script\b[^>]*\/>/g, "");

// Cut post-footer junk: keep the footer plus its structural closes
// (</div></main>, layer-2, dls-end-portal, #root) and drop everything from
// the first tracker <noscript> onward (facebook/beacons/sierra chat widget).
const footerEnd = body.lastIndexOf("</footer>");
if (footerEnd < 0) throw new Error("no <footer> in capture");
const cutAt = body.indexOf("<noscript", footerEnd);
if (cutAt < 0) throw new Error("no post-footer cut point");
const tail = body.slice(cutAt);
if (tail.length < 1000) throw new Error("post-footer cut looks wrong");
body = body.slice(0, cutAt);
for (const marker of ["</main>", 'id="layer-2"', 'id="dls-end-portal"']) {
  if (!body.includes(marker)) throw new Error(`structural marker lost by cut: ${marker}`);
}
if (/<chat-messenger|sierra|batBeacon|Shop with AI/i.test(body)) throw new Error("post-footer junk left in body");

// saved-page relative refs -> public/assets/
const savedFolder = /\.\/Nordstrom Online &amp; in Store_ Shoes, Jewelry, Clothing, Makeup, Dresses_files\//g;
const savedFolderPlain = /\.\/Nordstrom Online & in Store_ Shoes, Jewelry, Clothing, Makeup, Dresses_files\//g;
body = body.replace(savedFolder, ASSET_DIR).replace(savedFolderPlain, ASSET_DIR);
body = localiseStaticPaths(body);
if (body.includes("Dresses_files")) throw new Error("unrewritten asset path left in body");
if (body.includes("<script")) throw new Error("script tag left in body");

body = localiseMedia(body);
body = scrubNordstromUrls(body);
assertNoNordstromUrls(body, "body.ts");

const bodyOut =
  "// Generated from scripts/nordstrom-capture.html. Do not edit by hand.\n" +
  "// Regenerate with: node scripts/build-nordstrom.mjs\n" +
  `export const NORDSTROM_BODY_HTML = ${JSON.stringify(body)};\n`;
fs.writeFileSync(path.join(OUT_DIR, "body.ts"), bodyOut);

// --- 2. css.ts --------------------------------------------------------------
const order = [
  "nordstrom-global-03.css",
  "nordstrom-bec627c7c18307c0.css",
  "nordstrom-a0ede290d073e2ab.css",
  "nordstrom-f75e7cff09f5abe8.css",
  "nordstrom-7705e5263fbfb865.css",
  "nordstrom-6a40a95c42a15177.css",
  "nordstrom-940e76bf343c2dc9.css",
  "nordstrom-eb09d3c00ab35669.css",
  "nordstrom-bdebf8a10a345d54.css",
  "nordstrom-1e6dd01f92b05af8.css",
  "nordstrom-0c7c1bdc5029c5d1.css",
  "nordstrom-6679420fc36dee35.css",
  "nordstrom-6977560302fd356c.css",
  "nordstrom-94115359cb6d3e99.css",
  "nordstrom-page-inline.css",
];
let css = "";
for (const f of order) {
  let raw = fs.readFileSync(path.join(STYLES_DIR, f), "utf8");
  // url("Font.woff2") -> url("/Font.woff2") so the page URL never affects resolution
  raw = raw.replace(/url\("(?!\/|data:|https?:)([^"]+)"\)/g, 'url("/$1")');
  raw = localiseStaticPaths(raw);
  raw = localiseMedia(raw);
  raw = scrubNordstromUrls(raw);
  assertNoNordstromUrls(raw, `styles/${f}`);
  css += `/* sheet: ${f.replace(/^nordstrom-/, "").replace(/\.css$/, "")} */\n${raw}\n`;
}
const cssOut =
  "// Generated from the captured stylesheets. Do not edit by hand.\n" +
  "// Regenerate with: node scripts/build-nordstrom.mjs\n" +
  `export const NORDSTROM_CSS = ${JSON.stringify(css)};\n`;
fs.writeFileSync(path.join(OUT_DIR, "css.ts"), cssOut);

console.log("body.ts:", fs.statSync(path.join(OUT_DIR, "body.ts")).size, "bytes");
console.log("css.ts :", fs.statSync(path.join(OUT_DIR, "css.ts")).size, "bytes");

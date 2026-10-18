// Downloads every nordstrommedia CDN URL referenced by the capture (body or
// captured stylesheets) into public/assets/media/, named sha1(rawUrl)+ext so
// the build script can map the same raw URL string to the same local file.
// Run: node scripts/fetch-media.mjs
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const OUT_DIR = "public/assets/media";
const SOURCES = ["scripts/nordstrom-capture.html", ...fs.readdirSync("src/lib/nordstrom/styles").map((f) => path.join("src/lib/nordstrom/styles", f))];

function extractUrls(text) {
  const out = [];
  for (const m of text.matchAll(/https:\/\/n\.nordstrommedia\.com\/[^\s"'<>)\}]+/g)) {
    const raw = m[0].split("&quot;")[0].split("&#34;")[0];
    if (/&quot|&#34/.test(raw)) continue;
    out.push(raw);
  }
  return out;
}

function fileName(raw) {
  const cleanPath = raw.split("?")[0];
  const ext = (cleanPath.match(/\.[a-z0-9]+$/) || [".bin"])[0];
  const hash = crypto.createHash("sha1").update(raw).digest("hex").slice(0, 20);
  return `${hash}${ext}`;
}

const urls = new Set();
for (const src of SOURCES) for (const u of extractUrls(fs.readFileSync(src, "utf8"))) urls.add(u);
// The "View the Catalog" PDF is 127MB — far too big to vendor; the build
// script neutralises non-image media urls that have no local file to "#".
for (const u of [...urls]) if (u.split("?")[0].endsWith(".pdf")) urls.delete(u);
console.log("unique media urls:", urls.size);

fs.mkdirSync(OUT_DIR, { recursive: true });
const todo = [...urls].filter((u) => !fs.existsSync(path.join(OUT_DIR, fileName(u))));
console.log("to download:", todo.length);

async function grab(raw) {
  const url = raw.replaceAll("&amp;", "&");
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(30000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(path.join(OUT_DIR, fileName(raw)), buf);
      return null;
    } catch (err) {
      if (attempt === 3) return `${raw} -> ${err.message}`;
      await new Promise((r) => setTimeout(r, attempt * 1000));
    }
  }
}

const queue = [...todo];
const failures = [];
await Promise.all(
  Array.from({ length: 6 }, async () => {
    for (let u = queue.shift(); u; u = queue.shift()) {
      const err = await grab(u);
      if (err) failures.push(err);
    }
  })
);

console.log("downloaded:", todo.length - failures.length, "failed:", failures.length);
for (const f of failures) console.log("  FAIL", f);
process.exit(failures.length ? 1 : 0);

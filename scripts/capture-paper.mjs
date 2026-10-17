#!/usr/bin/env node
// Capture phone screens from a Paper (paper.design) file, read-only.
//
// Usage (from the repo root):  node scripts/capture-paper.mjs <project>
//
// Reads <project>/capture-paper.json: { url, frame: {w, h}, scale, screens:
// [{ name, match, taps: [text, ...] }] }. Each screen is the frame element
// whose text contains `match`. It is copied out of the zoomed canvas onto a
// clean layer, screenshotted at `scale`, and the boxes (CSS px, frame space)
// of the elements whose own text equals each tap text are saved, so taps in
// the animation land on them. Output: <project>/public/screens/<name>.png and
// <project>/public/screens/taps.json. Needs puppeteer-core in the project.
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const [project] = process.argv.slice(2);
if (!project) {
  console.error("usage: node scripts/capture-paper.mjs <project>");
  process.exit(1);
}
const require = createRequire(path.resolve(project, "package.json"));
const puppeteer = require("puppeteer-core");
const cfg = JSON.parse(fs.readFileSync(path.join(project, "capture-paper.json"), "utf8"));

const findChrome = (dir) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      const hit = findChrome(p);
      if (hit) return hit;
    } else if (e.name === "chrome-headless-shell") return p;
  }
  return null;
};
const chrome = findChrome(path.join(project, "node_modules", ".remotion", "chrome-headless-shell"));
const out = path.join(project, "public", "screens");
fs.mkdirSync(out, { recursive: true });

const browser = await puppeteer.launch({ executablePath: chrome, headless: true });
const page = await browser.newPage();
await page.setViewport({ width: cfg.frame.w + 40, height: cfg.frame.h + 40, deviceScaleFactor: cfg.scale });
await page.goto(cfg.url, { waitUntil: "networkidle2", timeout: 90000 });
await page.waitForFunction(
  (w, h, n) => [...document.querySelectorAll("div")].filter((e) => e.offsetWidth === w && e.offsetHeight === h).length >= n,
  { timeout: 60000 },
  cfg.frame.w,
  cfg.frame.h,
  cfg.screens.length,
);
await page.evaluate(() => document.fonts.ready);

const taps = {};
for (const s of cfg.screens) {
  const found = await page.evaluate(
    (w, h, match) => {
      document.getElementById("__capture")?.remove();
      const frame = [...document.querySelectorAll("div")].find(
        (e) => e.offsetWidth === w && e.offsetHeight === h && e.textContent.includes(match), // textContent: unaffected by the hidden editor
      );
      if (!frame) return false;
      const host = document.createElement("div");
      host.id = "__capture";
      host.style.cssText = `position:fixed;left:0;top:0;width:${w}px;height:${h}px;z-index:2147483647;background:#fff;visibility:visible`;
      const clone = frame.cloneNode(true);
      clone.style.position = "absolute";
      clone.style.left = "0";
      clone.style.top = "0";
      clone.style.margin = "0";
      host.appendChild(clone);
      document.body.appendChild(host);
      let style = document.getElementById("__capture_style");
      if (!style) {
        style = document.createElement("style");
        style.id = "__capture_style";
        style.textContent = "body > *:not(#__capture){visibility:hidden !important}";
        document.head.appendChild(style);
      }
      return true;
    },
    cfg.frame.w,
    cfg.frame.h,
    s.match,
  );
  if (!found) {
    console.error(`  no frame matching "${s.match}"`);
    continue;
  }
  await new Promise((r) => setTimeout(r, 300));
  const el = await page.$("#__capture");
  await el.screenshot({ path: path.join(out, `${s.name}.png`) });
  taps[s.name] = await page.evaluate((texts) => {
    const host = document.getElementById("__capture");
    const res = {};
    for (const t of texts) {
      const hits = [...host.querySelectorAll("*")].filter((e) => e.innerText && e.innerText.trim() === t);
      const el = hits.sort((a, b) => a.offsetWidth * a.offsetHeight - b.offsetWidth * b.offsetHeight)[0];
      if (!el) continue;
      // Grow to the nearest box-like ancestor (a chip or button with padding).
      let n = el;
      while (n.parentElement && n.parentElement !== host && n.parentElement.innerText.trim() === t) n = n.parentElement;
      const r = n.getBoundingClientRect();
      res[t] = { x: r.x, y: r.y, w: r.width, h: r.height };
    }
    return res;
  }, s.taps ?? []);
  console.log(`  ${s.name}: ${Object.keys(taps[s.name]).length}/${(s.taps ?? []).length} taps`);
}
fs.writeFileSync(path.join(out, "taps.json"), JSON.stringify({ frame: cfg.frame, scale: cfg.scale, taps }, null, 2));
await browser.close();

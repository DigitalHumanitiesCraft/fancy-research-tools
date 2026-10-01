// Browser checks for every variant, the overview page and the 404 page: axe (WCAG 2.2 AA plus
// best practice), horizontal overflow and broken images, at desktop and narrow width, light and dark.
// With LINKS=1 it also checks every external link of index.html for HTTP 200.
// Needs Playwright and axe-core from an existing installation and the repository served locally:
//   PLAYWRIGHT=/path/to/node_modules/playwright AXE=/path/to/axe-core/axe.min.js BASE=http://127.0.0.1:4321 CHANNEL=msedge node tools/check.cjs
const fs = require("fs");
const path = require("path");
const { chromium } = require(process.env.PLAYWRIGHT || "playwright");

const base = process.env.BASE || "http://127.0.0.1:4321";
const axePath = process.env.AXE || require.resolve("axe-core/axe.min.js");
const pages = ["/", "/dhcraft/", "/edition/", "/labor/", "/raster/", "/varianten/", "/datenschutz/", "/en/privacy/", "/404.html"].concat(require("fs").existsSync(require("path").join(__dirname, "..", "en", "index.html")) ? ["/en/"] : []);
const widths = [1440, 320];
const schemes = ["light", "dark"];

(async () => {
  let failures = 0;
  const browser = await chromium.launch({ channel: process.env.CHANNEL || undefined });

  for (const url of pages) {
    for (const width of widths) {
      for (const colorScheme of schemes) {
        const page = await browser.newPage({ viewport: { width, height: 900 }, colorScheme, reducedMotion: "reduce" });
        await page.goto(base + url, { waitUntil: "networkidle" });
        // Lazy images load only near the viewport, so the page is scrolled through once.
        await page.evaluate(async () => {
          for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); }
        });
        await page.addScriptTag({ path: axePath });
        const result = await page.evaluate(() => axe.run(document, { runOnly: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa", "best-practice"] }));
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
        const broken = await page.evaluate(() => [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src));
        const problems = [
          ...result.violations.map((v) => `${v.id} (${v.nodes.map((n) => n.target.join(" ")).slice(0, 3).join(" | ")})`),
          ...(overflow ? ["horizontal overflow"] : []),
          ...broken.map((s) => `broken image ${s}`),
        ];
        if (problems.length) { failures += problems.length; console.log(`FAIL ${url} ${width} ${colorScheme}\n  ${problems.join("\n  ")}`); }
        else console.log(`ok   ${url} ${width} ${colorScheme}`);
        await page.close();
      }
    }
  }
  // Keyboard pass: every tab stop shows a focus outline and is neither off screen nor hidden
  // under the sticky header (WCAG 2.4.7 and 2.4.11).
  for (const url of ["/", "/en/", "/datenschutz/"]) {
    for (const width of widths) {
      const page = await browser.newPage({ viewport: { width, height: 800 }, reducedMotion: "reduce" });
      const res = await page.goto(base + url, { waitUntil: "networkidle" });
      if (!res || res.status() !== 200) { await page.close(); continue; }
      const problems = [];
      let first = null;
      for (let i = 0; i < 250; i++) {
        await page.keyboard.press("Tab");
        const stop = await page.evaluate(() => {
          const el = document.activeElement;
          if (!el || el === document.body) return null;
          const cs = getComputedStyle(el);
          const r = el.getBoundingClientRect();
          // Obscured means the topmost element at the centre of the focused one belongs to the header.
          const header = document.querySelector(".site-header");
          const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
          return {
            key: `${el.tagName} ${el.getAttribute("href") || el.textContent.trim().slice(0, 30)}`,
            outline: cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0,
            onScreen: r.bottom > 0 && r.top < innerHeight,
            obscured: Boolean(header && hit && !header.contains(el) && header.contains(hit)),
          };
        });
        if (!stop) break;
        if (stop.key === first) break;
        first = first || stop.key;
        if (!stop.outline) problems.push(`no focus outline on ${stop.key}`);
        if (!stop.onScreen) problems.push(`focus off screen on ${stop.key}`);
        if (stop.obscured) problems.push(`focus hidden under header on ${stop.key}`);
      }
      if (problems.length) { failures += problems.length; console.log(`FAIL keyboard ${url} ${width}\n  ${problems.slice(0, 8).join("\n  ")}`); }
      else console.log(`ok   keyboard ${url} ${width}`);
      await page.close();
    }
  }

  await browser.close();

  if (process.env.LINKS) {
    const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
    const links = [...new Set([...html.matchAll(/href="(https?:\/\/[^"]+)"/g)].map((m) => m[1].replace(/&amp;/g, "&")))]
      // Own pages are checked locally above and may not be published yet.
      .filter((link) => !link.startsWith("https://dhcraft.org/fancy-research-tools/"));
    for (const link of links) {
      const res = await fetch(link, { method: "GET", redirect: "follow" }).catch((e) => ({ status: e.message }));
      if (res.status !== 200) { failures++; console.log(`FAIL link ${res.status} ${link}`); }
      else console.log(`ok   link ${link}`);
    }
  }

  console.log(failures ? `${failures} problem(s)` : "all checks passed");
  process.exit(failures ? 1 : 0);
})();

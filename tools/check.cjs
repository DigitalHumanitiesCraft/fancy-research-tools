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
const pages = ["/", "/dhcraft/", "/edition/", "/labor/", "/raster/", "/varianten/", "/404.html"];
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
  await browser.close();

  if (process.env.LINKS) {
    const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
    const links = [...new Set([...html.matchAll(/href="(https?:\/\/[^"]+)"/g)].map((m) => m[1].replace(/&amp;/g, "&")))];
    for (const link of links) {
      const res = await fetch(link, { method: "GET", redirect: "follow" }).catch((e) => ({ status: e.message }));
      if (res.status !== 200) { failures++; console.log(`FAIL link ${res.status} ${link}`); }
      else console.log(`ok   link ${link}`);
    }
  }

  console.log(failures ? `${failures} problem(s)` : "all checks passed");
  process.exit(failures ? 1 : 0);
})();

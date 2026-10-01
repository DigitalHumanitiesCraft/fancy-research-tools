// Renders the preview image of every variant for the overview page.
// Needs Playwright, which this repository deliberately does not install. Point PLAYWRIGHT at an
// existing installation and serve the repository locally, for example on port 4321:
//   PLAYWRIGHT=/path/to/node_modules/playwright BASE=http://127.0.0.1:4321 node tools/shoot-variants.cjs
const path = require("path");
const { chromium } = require(process.env.PLAYWRIGHT || "playwright");

const base = process.env.BASE || "http://127.0.0.1:4321";
const out = path.join(__dirname, "..", "assets", "img");
const variants = [["prisma", "/"], ["dhcraft", "/dhcraft/"], ["edition", "/edition/"], ["labor", "/labor/"], ["raster", "/raster/"]];

(async () => {
  const browser = await chromium.launch({ channel: process.env.CHANNEL || undefined });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce", colorScheme: "light" });
  for (const [slug, url] of variants) {
    await page.goto(base + url, { waitUntil: "networkidle" });
    await page.screenshot({ path: path.join(out, `variant-${slug}.jpg`), type: "jpeg", quality: 78 });
    console.log(`variant-${slug}.jpg`);
  }
  await browser.close();
})();

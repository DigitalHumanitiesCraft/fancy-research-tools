// Renders the link preview image for sharing (JPEG, 1200 by 630) from the hero of the main page.
// Needs Playwright, which this repository deliberately does not install. Point PLAYWRIGHT at an
// existing installation and serve the repository locally, for example on port 4321:
//   PLAYWRIGHT=/path/to/node_modules/playwright BASE=http://127.0.0.1:4321 CHANNEL=msedge node tools/shoot-og.cjs
const path = require("path");
const { chromium } = require(process.env.PLAYWRIGHT || "playwright");

const base = process.env.BASE || "http://127.0.0.1:4321";

(async () => {
  const browser = await chromium.launch({ channel: process.env.CHANNEL || undefined });
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, reducedMotion: "reduce" });
  await page.goto(base + "/", { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(__dirname, "..", "assets", "img", "og.jpg"), type: "jpeg", quality: 80 });
  await browser.close();
})();

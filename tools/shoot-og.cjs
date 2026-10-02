// Renders the link preview image for sharing (JPEG, 1200 by 630) from the hero of the German subpage
// and writes it into public/fancy-research-tools/img/ of the site repository. Needs Playwright from an
// existing installation and the site served, by default the site's `npx astro preview --port 4399`:
//   PLAYWRIGHT=/path/to/node_modules/playwright CHANNEL=msedge node tools/shoot-og.cjs
const path = require("path");
const { chromium } = require(process.env.PLAYWRIGHT || "playwright");

// The site repository root, by default the sibling clone `dhcraft-site`, see CLAUDE.md.
const site = process.env.SITE || path.join(__dirname, "..", "..", "dhcraft-site");

const base = process.env.BASE || "http://127.0.0.1:4399";

(async () => {
  const browser = await chromium.launch({ channel: process.env.CHANNEL || undefined });
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, reducedMotion: "reduce" });
  await page.goto(base + "/fancy-research-tools/", { waitUntil: "networkidle" });
  // The floating back-to-top button of the site does not belong in a preview image.
  await page.addStyleTag({ content: ".to-top { display: none !important; }" });
  await page.screenshot({ path: path.join(site, "public", "fancy-research-tools", "img", "og.jpg"), type: "jpeg", quality: 85 });
  await browser.close();
})();

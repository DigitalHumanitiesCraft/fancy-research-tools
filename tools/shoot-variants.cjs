// Renders the preview image of every variant for the overview page (WebP, 720 wide) and the
// link preview for sharing (JPEG, 1200 by 630).
// Needs Playwright, which this repository deliberately does not install. Point PLAYWRIGHT at an
// existing installation and serve the repository locally, for example on port 4321:
//   PLAYWRIGHT=/path/to/node_modules/playwright BASE=http://127.0.0.1:4321 CHANNEL=msedge node tools/shoot-variants.cjs
const fs = require("fs");
const path = require("path");
const { chromium } = require(process.env.PLAYWRIGHT || "playwright");

const base = process.env.BASE || "http://127.0.0.1:4321";
const out = path.join(__dirname, "..", "assets", "img");
const variants = [["prisma", "/"], ["dhcraft", "/dhcraft/"], ["edition", "/edition/"], ["labor", "/labor/"], ["raster", "/raster/"]];

(async () => {
  const browser = await chromium.launch({ channel: process.env.CHANNEL || undefined });
  const page = await browser.newPage({ reducedMotion: "reduce", colorScheme: "light" });

  for (const [slug, url] of variants) {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(base + url, { waitUntil: "networkidle" });
    const shot = (await page.screenshot({ type: "png" })).toString("base64");
    // The browser encodes WebP through a canvas, so no image library is needed.
    const webp = await page.evaluate(async (data) => {
      const img = new Image();
      img.src = `data:image/png;base64,${data}`;
      await img.decode();
      const canvas = document.createElement("canvas");
      canvas.width = 720;
      canvas.height = 450;
      canvas.getContext("2d").drawImage(img, 0, 0, 720, 450);
      return canvas.toDataURL("image/webp", 0.8).split(",")[1];
    }, shot);
    fs.writeFileSync(path.join(out, `variant-${slug}-720.webp`), Buffer.from(webp, "base64"));

    await page.setViewportSize({ width: 1200, height: 630 });
    await page.goto(base + url, { waitUntil: "networkidle" });
    await page.screenshot({ path: path.join(out, `og-${slug}.jpg`), type: "jpeg", quality: 80 });
    console.log(slug);
  }
  await browser.close();
})();

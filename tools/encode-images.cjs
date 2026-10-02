// Encodes a chosen source image as WebP in 1440 and 720 width for the page, through the browser's
// canvas, so no image library is needed. Source PNGs stay local under assets/img/source/.
//   PLAYWRIGHT=/path/to/node_modules/playwright CHANNEL=msedge node tools/encode-images.cjs <source.png> <target-slug>
// writes assets/img/<target-slug>-1440.webp and assets/img/<target-slug>-720.webp.
const fs = require("fs");
const path = require("path");
const { chromium } = require(process.env.PLAYWRIGHT || "playwright");

const [source, slug] = process.argv.slice(2);
if (!source || !slug) throw new Error("usage: node tools/encode-images.cjs <source.png> <target-slug>");

(async () => {
  const browser = await chromium.launch({ channel: process.env.CHANNEL || undefined });
  const page = await browser.newPage();
  const png = fs.readFileSync(source).toString("base64");
  for (const width of [1440, 720]) {
    const webp = await page.evaluate(async ([b64, width]) => {
      const img = new Image();
      img.src = `data:image/png;base64,${b64}`;
      await img.decode();
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = Math.round((img.height / img.width) * width);
      const ctx = canvas.getContext("2d");
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL("image/webp", 0.85).split(",")[1];
    }, [png, width]);
    const file = path.join(__dirname, "..", "assets", "img", `${slug}-${width}.webp`);
    fs.writeFileSync(file, Buffer.from(webp, "base64"));
    console.log(path.basename(file));
  }
  await browser.close();
})();

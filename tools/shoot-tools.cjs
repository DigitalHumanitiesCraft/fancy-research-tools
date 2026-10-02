// Takes the tool screenshots of the page from the live demos, each in its most telling state,
// at 1440 by 900 CSS pixels and double pixel density, and writes WebP files in 1440 and 720 width
// into public/fancy-research-tools/img/ of the site repository.
// Needs Playwright from an existing installation and network access to the demos:
//   PLAYWRIGHT=/path/to/node_modules/playwright CHANNEL=msedge node tools/shoot-tools.cjs [id ...]
// The teiCrafter recipe loads a synthetic sample from a local teiCrafter clone, set TEICRAFTER_SAMPLE.
const fs = require("fs");
const path = require("path");
const { chromium } = require(process.env.PLAYWRIGHT || "playwright");

// The site repository root, by default the sibling clone named in the vault's Repo-Verzeichnis.
const site = process.env.SITE || path.join(__dirname, "..", "..", "dhcraft-site");
const out = path.join(site, "public", "fancy-research-tools", "img");
const wait = (page, ms) => page.waitForTimeout(ms);

// Each recipe only chooses a state of the real tool. It never alters the tool's interface.
const recipes = {
  "coocr-htr": async (page) => {
    await page.goto("https://dhcraft.org/co-ocr-htr/", { waitUntil: "networkidle" });
    await page.getByText("Überspringen").click().catch(() => {});
    await page.locator("#btnSamples").evaluate((el) => el.click());
    await wait(page, 800);
    // A printed page of 1617. Other samples are left out of the page on purpose, see knowledge/data.md.
    await page.locator("#samplesMenu").getByText("Antidotarium (1617), p. 15").first()
      .evaluate((el) => (el.closest("button,li,a") || el).click());
    await wait(page, 6000);
    await page.mouse.click(5, 450);
  },
  teicrafter: async (page) => {
    await page.goto("https://dhcraft.org/teiCrafter/editor.html", { waitUntil: "networkidle" });
    const sample = process.env.TEICRAFTER_SAMPLE;
    if (!sample) throw new Error("set TEICRAFTER_SAMPLE to docs/data/editor/zbz-hersch-synthetic.xml of a teiCrafter clone");
    const xml = fs.readFileSync(sample, "utf8");
    await page.evaluate((xml) => {
      const dt = new DataTransfer();
      dt.items.add(new File([xml], "zbz-hersch-synthetic.xml", { type: "application/xml" }));
      for (const t of ["dragenter", "dragover", "drop"]) document.body.dispatchEvent(new DragEvent(t, { bubbles: true, cancelable: true, dataTransfer: dt }));
    }, xml);
    await wait(page, 5000);
  },
  correspexplorer: async (page) => {
    await page.goto("https://dhcraft.org/CorrespExplorer/", { waitUntil: "networkidle" });
    await page.locator(".dataset-card-featured").click();
    await wait(page, 1500);
    await page.locator("#config-start-btn").click();
    await page.waitForURL(/explore/, { timeout: 60000 });
    await wait(page, 3000);
    await page.getByText("Timeline", { exact: true }).first().click();
    await wait(page, 4000);
  },
  // The statistics view shows the checking tiers and no facsimile, whose image rights lie with the archive.
  "szd-htr": async (page) => {
    await page.goto("https://chpollin.github.io/szd-htr-ocr-pipeline/#stats", { waitUntil: "networkidle" });
    await wait(page, 3000);
  },
  klawiter: async (page) => {
    await page.goto("https://chpollin.github.io/klawiter-rescue/", { waitUntil: "networkidle" });
    await wait(page, 2000);
  },
};

async function encode(page, png, width, file) {
  const data = await page.evaluate(async ([b64, width]) => {
    const img = new Image();
    img.src = `data:image/png;base64,${b64}`;
    await img.decode();
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = Math.round(img.naturalHeight * width / img.naturalWidth);
    canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/webp", 0.82).split(",")[1];
  }, [png, width]);
  fs.writeFileSync(path.join(out, file), Buffer.from(data, "base64"));
}

(async () => {
  const ids = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(recipes);
  const browser = await chromium.launch({ channel: process.env.CHANNEL || undefined });
  for (const id of ids) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, colorScheme: "light", reducedMotion: "reduce" });
    try {
      await recipes[id](page);
      const png = (await page.screenshot({ type: "png" })).toString("base64");
      const blank = await browser.newPage();
      await encode(blank, png, 1440, `${id}-1440.webp`);
      await encode(blank, png, 720, `${id}-720.webp`);
      await blank.close();
      console.log(`ok   ${id}`);
    } catch (e) {
      console.log(`FAIL ${id} ${e.message}`);
    }
    await page.close();
  }
  await browser.close();
})();

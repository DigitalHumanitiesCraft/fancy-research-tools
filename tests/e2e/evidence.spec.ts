import { readFile } from "node:fs/promises";
import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, type TestInfo, test } from "@playwright/test";
import sources from "../../data/nhc-milton/sources.json" with { type: "json" };

const first = sources[0];
const second = sources[1];
if (!first || !second) throw new Error("Missing evidence sources.");
const firstId = first.id;
const firstQuote = first.text.slice(168, 309);

async function retain(page: Page) {
  const text = page.getByLabel("Original bulletin text", { exact: true });
  await text.focus();
  await text.evaluate((node) => (node as HTMLTextAreaElement).setSelectionRange(168, 168));
  await page.keyboard.down("Shift");
  for (let index = 168; index < 309; index++) await page.keyboard.press("ArrowRight");
  await page.keyboard.up("Shift");
  await page.getByRole("button", { name: "Retain selected quotation", exact: true }).click();
}
async function download(page: Page, info: TestInfo, filename: string) {
  const pending = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export evidence packet", exact: true }).click();
  const path = info.outputPath(filename);
  await (await pending).saveAs(path);
  return { path, value: JSON.parse(await readFile(path, "utf8")) };
}
function packet() {
  return {
    schemaVersion: 1,
    kind: "source-evidence-packet",
    sources,
    researchQuestion: " Question\r\nwith exact text ",
    claim: " Source wording\r\nclaim ",
    reasoning: " Reason\r\nkept ",
    creator: { kind: "unknown", name: "" },
    review: null,
    evidence: [{ sourceId: firstId, start: 168, end: 309, quote: firstQuote }],
  };
}
test("a sourced claim records explicit review and reopens its actual exported file", async ({
  page,
  browser,
}, info) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/evidence/");
  await expect(page.getByLabel("Original bulletin text", { exact: true })).toHaveValue(first.text);
  await page
    .getByLabel("Research question", { exact: true })
    .fill("How is this estimate attributed?");
  await page
    .getByLabel("Your claim", { exact: true })
    .fill("The text names scatterometer data for peak winds.");
  await retain(page);
  await page
    .getByLabel("Your reasoning", { exact: true })
    .fill("The quotation links the estimate to that instrument; accuracy was not assessed.");
  await page.getByLabel("Creator kind", { exact: true }).selectOption("agent");
  await page.getByLabel("Creator name", { exact: true }).fill("Browser test");
  await page.getByLabel("Reviewer kind", { exact: true }).selectOption("agent");
  await page.getByLabel("Reviewer name", { exact: true }).fill("Test reviewer");
  await page
    .getByLabel("Review criterion", { exact: true })
    .fill("The quotation explicitly names the instrument.");
  await page
    .getByLabel("Does the retained evidence support this claim?", { exact: true })
    .selectOption("supports");
  await page.getByRole("button", { name: "Record review", exact: true }).click();
  await expect(page.locator("#review-status")).toContainText("AI agent, Test reviewer");
  expect(await page.evaluate(() => innerWidth)).toBe(1280);
  await page.screenshot({ path: info.outputPath("evidence-wide.png"), fullPage: true });
  const saved = await download(page, info, "evidence-original.json");
  expect(saved.value.sources).toEqual(sources);
  expect(saved.value.evidence).toEqual([
    { sourceId: first.id, start: 168, end: 309, quote: first.text.slice(168, 309) },
  ]);
  const context = await browser.newContext();
  const reopened = await context.newPage();
  await reopened.goto("/evidence/");
  await reopened.getByLabel("Open evidence packet", { exact: true }).setInputFiles(saved.path);
  await expect(reopened.locator("#file-status")).toContainText("Evidence packet opened");
  expect((await download(reopened, info, "evidence-reopened.json")).value).toEqual(saved.value);
  await reopened
    .getByLabel("Your claim", { exact: true })
    .fill("Revised claim requires another review.");
  await expect(reopened.locator("#review-status")).toContainText("previous review");
  expect((await download(reopened, info, "evidence-revised.json")).value.review).toBeNull();
  await context.close();
});
test("import preserves unchanged author bytes and rejects changed sources before replacement", async ({
  page,
}, info) => {
  await page.goto("/evidence/");
  const original = packet();
  await page.getByLabel("Open evidence packet", { exact: true }).setInputFiles({
    name: "original.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(original)),
  });
  await expect(page.locator("#file-status")).toContainText("Evidence packet opened");
  await page.getByLabel("Creator kind", { exact: true }).selectOption("agent");
  const changed = { ...original, creator: { kind: "agent", name: "" } };
  expect((await download(page, info, "exact-author-text.json")).value).toEqual(changed);
  const bad = structuredClone(original);
  bad.sources = bad.sources.map((source, index) =>
    index === 0 ? { ...source, text: `${source.text}altered` } : source,
  );
  await page.getByLabel("Open evidence packet", { exact: true }).setInputFiles({
    name: "changed-source.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(bad)),
  });
  await expect(page.locator("#file-status")).toContainText("changed source snapshot");
  expect((await download(page, info, "after-rejected.json")).value).toEqual(changed);
  await page.getByLabel("Your claim", { exact: true }).fill("Keep this unfinished claim.");
  page.once("dialog", (dialog) => dialog.dismiss());
  await page.getByLabel("Open evidence packet", { exact: true }).setInputFiles({
    name: "cancelled.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(original)),
  });
  await expect(page.locator("#file-status")).toContainText("cancelled");
  await expect(page.getByLabel("Your claim", { exact: true })).toHaveValue(
    "Keep this unfinished claim.",
  );
});
test("a delayed file cannot overwrite work changed during reading", async ({ page }) => {
  await page.addInitScript(() => {
    const originalRead = File.prototype.text;
    File.prototype.text = async function () {
      const text = await originalRead.call(this);
      await new Promise((resolve) => setTimeout(resolve, 500));
      return text;
    };
  });
  await page.goto("/evidence/");
  await page.getByLabel("Open evidence packet", { exact: true }).setInputFiles({
    name: "delayed.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(packet())),
  });
  await page.getByLabel("Your claim", { exact: true }).fill("Later work survives.");
  await expect(page.locator("#file-status")).toContainText("Work changed while");
  await expect(page.getByLabel("Your claim", { exact: true })).toHaveValue("Later work survives.");
});
test("source selection, return and narrow controls retain native keyboard access", async ({
  page,
}, info) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/evidence/");
  await page.getByRole("button", { name: "Retain selected quotation", exact: true }).click();
  await expect(page.locator("#selection-status")).toContainText("nonempty passage");
  await expect(page.getByLabel("Original bulletin text", { exact: true })).toBeFocused();
  await retain(page);
  await page.getByLabel("Bulletin", { exact: true }).selectOption(second.id);
  await page.getByRole("button", { name: "Return to quotation", exact: true }).click();
  await expect(page.getByLabel("Bulletin", { exact: true })).toHaveValue(first.id);
  expect(
    await page
      .locator("#source-text")
      .evaluate((node) => [
        (node as HTMLTextAreaElement).selectionStart,
        (node as HTMLTextAreaElement).selectionEnd,
      ]),
  ).toEqual([168, 309]);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(await page.evaluate(() => innerWidth)).toBe(320);
  await page.screenshot({ path: info.outputPath("evidence-narrow.png"), fullPage: true });
});

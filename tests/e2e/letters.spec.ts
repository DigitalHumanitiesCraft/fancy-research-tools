import { readFile } from "node:fs/promises";
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import letterSources from "../../data/hsa-letter/sources.json" with { type: "json" };
import forecastSources from "../../data/nhc-milton/sources.json" with { type: "json" };

const letter = letterSources[0];
if (!letter) throw new Error("Missing HSA letter.");
const key = "frt.notebook./letters/.hsa-benndorf-1879.v1";

test("a real letter annotation exports, restores and rejects a forecast notebook", async ({
  page,
  browser,
}, info) => {
  await page.goto("/letters/");
  await expect(page.getByRole("heading", { name: "Annotate a letter", exact: true })).toBeVisible();
  await expect(page.getByLabel("Letter transcription", { exact: true })).toHaveValue(letter.text);
  await expect(page.locator("#forecaster")).toHaveText(letter.author);
  const quote = "Ich kenne E. Hübner fast gar nicht";
  await page.locator("#bulletin-text").evaluate((node, text) => {
    const control = node as HTMLTextAreaElement;
    const start = control.value.indexOf(text);
    control.setSelectionRange(start, start + text.length);
  }, quote);
  await page.getByRole("button", { name: "Annotate selection", exact: true }).click();
  await expect(page.locator("#quotation")).toHaveText(quote);
  await expect(page.locator("#category option")).toHaveText([
    "Person",
    "Place",
    "Research topic",
    "Editorial question",
  ]);
  await page
    .getByLabel("Interpretation", { exact: true })
    .fill("Benndorf qualifies his personal knowledge of Hübner.");
  await page.getByRole("button", { name: "Save annotation", exact: true }).click();
  await expect(page.locator("#annotations li")).toHaveCount(1);
  await expect(page.locator("#annotations li")).toContainText("Unknown, name not recorded");
  const pending = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export notebook", exact: true }).click();
  const download = await pending;
  expect(download.suggestedFilename()).toBe("benndorf-letter-notebook.json");
  const path = info.outputPath("letter-notebook.json");
  await download.saveAs(path);
  const bytes = await readFile(path, "utf8");
  const notebook = JSON.parse(bytes);
  expect(notebook.caseId).toBe("hsa-benndorf-1879");
  expect(notebook.sources).toEqual(letterSources);
  expect(notebook.annotations[0].quote).toBe(quote);
  expect(notebook.annotations[0].review).toBeNull();
  await page.reload();
  await expect(page.locator("#annotations li")).toHaveCount(1);
  const before = await page.evaluate((name) => localStorage.getItem(name), key);
  await page.getByLabel("Open notebook").setInputFiles({
    name: "forecast-notebook.json",
    mimeType: "application/json",
    buffer: Buffer.from(
      JSON.stringify({
        schemaVersion: 1,
        caseId: "nhc-milton-2024",
        sources: forecastSources,
        researchQuestion: "",
        annotations: [],
      }),
    ),
  });
  await expect(page.locator("#notebook-status")).toContainText("original research case");
  expect(await page.evaluate((name) => localStorage.getItem(name), key)).toBe(before);
  await expect(page.locator("#annotations li")).toHaveCount(1);
  const context = await browser.newContext();
  const fresh = await context.newPage();
  await fresh.goto("/letters/");
  fresh.once("dialog", (dialog) => dialog.accept());
  await fresh.getByLabel("Open notebook").setInputFiles(path);
  await expect(fresh.locator("#notebook-status")).toHaveText("Saved locally");
  expect(await fresh.evaluate((name) => localStorage.getItem(name), key)).toBe(bytes);
  await fresh.getByRole("button", { name: "Return to quotation" }).click();
  expect(
    await fresh.locator("#bulletin-text").evaluate((node) => {
      const control = node as HTMLTextAreaElement;
      return control.value.slice(control.selectionStart, control.selectionEnd);
    }),
  ).toBe(quote);
  await context.close();
});

test("letter selection works by keyboard at narrow width with visible source attribution", async ({
  page,
}, info) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/letters/");
  const source = page.getByLabel("Letter transcription", { exact: true });
  await source.focus();
  await page.keyboard.press("Control+Home");
  await page.keyboard.press("Shift+End");
  await page.getByRole("button", { name: "Annotate selection", exact: true }).click();
  await expect(page.locator("#quotation")).toHaveText("Wien 14/2 79");
  await page.getByLabel("Category", { exact: true }).selectOption("place");
  await page.getByLabel("Interpretation", { exact: true }).fill("The dateline identifies Vienna.");
  await page.getByRole("button", { name: "Save annotation", exact: true }).click();
  await expect(page.locator("#annotations li")).toHaveCount(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  const violations = (await new AxeBuilder({ page }).analyze()).violations;
  expect(violations).toEqual([]);
  await page.screenshot({ path: info.outputPath("letter-narrow.png"), fullPage: true });
});

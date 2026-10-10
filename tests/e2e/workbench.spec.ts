import { readFile } from "node:fs/promises";
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import fieldEvidence from "../../data/met-instruments/field-evidence.json" with { type: "json" };
import manifest from "../../data/met-instruments/manifest.json" with { type: "json" };
import source from "../../data/met-instruments/records.json" with { type: "json" };

test("imported authored text keeps exact line endings until its own field is edited", async ({
  page,
}, testInfo) => {
  const payload = {
    schemaVersion: 2,
    query: " wood\r\nmetal ",
    researchQuestion: " First\r\nSecond\rThird ",
    selectedIds: ["500526", "500531"],
    records: source.records.filter((record) => ["500526", "500531"].includes(record.id)),
    interpretation: {
      observation: " Observation\r\nsecond line ",
      unresolvedQuestion: " Question\rnext line ",
      author: "user",
    },
    provenance: manifest,
    fieldEvidence: {
      ...fieldEvidence,
      records: fieldEvidence.records.filter((record) => ["500526", "500531"].includes(record.id)),
    },
  };
  await page.goto("/pilot/");
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByLabel("Open investigation").setInputFiles({
    name: "line-endings.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(payload)),
  });
  await expect(page.locator("#draft-status")).toHaveText("Saved locally");
  await page
    .getByRole("combobox", { name: "Classification", exact: true })
    .selectOption("Aerophone-Organ");
  await page.locator("#comparison-link").click();
  const exported = async (name: string) => {
    const pending = page.waitForEvent("download");
    await page.getByRole("button", { name: "Export investigation" }).click();
    const download = await pending;
    const path = testInfo.outputPath(name);
    await download.saveAs(path);
    return JSON.parse(await readFile(path, "utf8"));
  };
  expect(await exported("unmodified-line-endings.json")).toEqual(payload);
  await page.getByLabel("Observation", { exact: true }).fill("Only this observation changed.");
  const expected = {
    ...payload,
    interpretation: { ...payload.interpretation, observation: "Only this observation changed." },
  };
  expect(await exported("one-field-edited.json")).toEqual(expected);
  await page.reload();
  expect(await exported("recovered-line-endings.json")).toEqual(expected);
});

test("investigation retains source evidence and notes across reload and file reopening", async ({
  page,
  browser,
}, testInfo) => {
  await page.goto("/pilot/");
  await page.getByLabel("Search catalogue", { exact: true }).fill("wood");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.locator("#result-status")).toHaveText("41 matching instruments");
  for (const id of ["500526", "500527"]) await page.locator(`[data-select="${id}"]`).click();
  await page.locator("#comparison-link").focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { name: "Comparison", exact: true })).toBeFocused();
  await page
    .getByLabel("Research question", { exact: true })
    .fill("How do the catalogue material descriptions differ?");
  await page
    .getByLabel("Observation", { exact: true })
    .fill("Both catalogue descriptions mention wood; the organ also lists metal.");
  await page
    .getByLabel("Unresolved question", { exact: true })
    .fill("Which construction details need other sources?");
  await page.reload();
  await expect(page.getByLabel("Observation", { exact: true })).toHaveValue(
    "Both catalogue descriptions mention wood; the organ also lists metal.",
  );
  await expect(page.locator("#matrix thead th")).toHaveCount(3);
  const downloaded = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export investigation" }).click();
  const download = await downloaded;
  const path = await download.path();
  if (!path) throw Error("Missing export");
  const payload = JSON.parse(await readFile(path, "utf8"));
  expect(payload.records).toEqual(
    source.records.filter((r) => ["500526", "500527"].includes(r.id)),
  );
  expect(payload.interpretation.author).toBe("user");
  expect(payload.schemaVersion).toBe(2);
  expect(payload.fieldEvidence.records).toEqual(
    payload.selectedIds.map((id: string) =>
      fieldEvidence.records.find((record) => record.id === id),
    ),
  );
  await download.saveAs(testInfo.outputPath("investigation.json"));
  await page.screenshot({ path: testInfo.outputPath("comparison-desktop.png"), fullPage: true });
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  const context = await browser.newContext();
  const reopened = await context.newPage();
  await reopened.goto("/pilot/");
  reopened.on("dialog", (d) => d.accept());
  await reopened.getByLabel("Open investigation").setInputFiles(path);
  await reopened.locator("#comparison-link").click();
  await expect(reopened.getByLabel("Observation", { exact: true })).toHaveValue(
    payload.interpretation.observation,
  );
  const again = reopened.waitForEvent("download");
  await reopened.getByRole("button", { name: "Export investigation" }).click();
  const againPath = await (await again).path();
  if (!againPath) throw Error("Missing reopened export");
  expect(JSON.parse(await readFile(againPath, "utf8"))).toEqual(payload);
  await context.close();
});

test("compared values expose an addressable source view without changing the investigation", async ({
  page,
}) => {
  await page.goto("/pilot/");
  for (const id of ["500526", "500531"]) await page.locator(`[data-select="${id}"]`).click();
  await page.locator("#comparison-link").click();
  await page.getByLabel("Research question", { exact: true }).fill("Who attributed these records?");
  await page
    .getByLabel("Observation", { exact: true })
    .fill("Keep the question mark in Lepuye (?).");
  const trigger = page.getByRole("link", {
    name: "Source for Attribution, Book Harmonium, Met 500531",
    exact: true,
  });
  await trigger.focus();
  await page.keyboard.press("Enter");
  const dialog = page.locator("#source");
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAccessibleName("Source: Attribution");
  await expect(page).toHaveURL(/#source\/500531\/attribution$/);
  await expect(dialog.getByRole("link", { name: "Return to comparison" })).toBeInViewport();
  const field = (name: string) =>
    dialog
      .locator("dl > div")
      .filter({ has: page.getByText(name, { exact: true }) })
      .locator("dd");
  await expect(field("Displayed value")).toHaveText("Lepuye (?)");
  await expect(field("Original API field: artistDisplayName")).toHaveText('"Lepuye"');
  await expect(field("Original API field: artistSuffix")).toHaveText('"(?)"');
  await expect(field("Original API field: artistPrefix")).toHaveText('""');
  await expect(field("Original author and creation process")).toContainText("Unknown");
  await expect(field("Human or AI review")).toContainText("No human or AI review is recorded");
  await expect(field("Research validation")).toContainText("No research validation is recorded");
  await expect(field("Snapshot SHA-256")).toHaveText(/^[a-f0-9]{64}$/);
  await expect(field("Projection producer")).toHaveText("scripts/import-dh-data.mjs");
  await expect(
    dialog.getByRole("link", { name: /Book Harmonium, Met source 500531/ }),
  ).toHaveAttribute("href", "https://www.metmuseum.org/art/collection/search/500531");
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await dialog.getByRole("link", { name: "Return to comparison" }).click();
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await expect(page.locator("#selection-count")).toHaveText("2");
  await expect(page.getByLabel("Research question", { exact: true })).toHaveValue(
    "Who attributed these records?",
  );
  await expect(page.getByLabel("Observation", { exact: true })).toHaveValue(
    "Keep the question mark in Lepuye (?).",
  );
  await page
    .getByRole("link", { name: "Source for Attribution, Ūd, Met 500526", exact: true })
    .click();
  await expect(field("Displayed value")).toHaveText("Not supplied");
  await expect(field("Original API field: artistDisplayName")).toHaveText('""');
  await expect(dialog.locator("dd").filter({ hasText: /^null$/ })).toHaveCount(3);
  await dialog.getByRole("link", { name: "Return to comparison" }).click();
  await page
    .getByRole("link", { name: "Source for Catalogue date bounds, Book Harmonium, Met 500531" })
    .click();
  await expect(field("Original API field: objectBeginDate")).toHaveText("1851");
  await expect(field("Original API field: objectEndDate")).toHaveText("1900");
  await expect(field("Displayed value")).toHaveText("1851–1900");
  await page.setViewportSize({ width: 320, height: 800 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const sourceView = page.locator("#source");
  expect(await sourceView.evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(true);
  const displayed = field("Displayed value");
  await displayed.scrollIntoViewIfNeeded();
  const bounds = await displayed.boundingBox();
  if (!bounds) throw Error("Missing displayed value");
  await page.mouse.move(bounds.x + 2, bounds.y + bounds.height / 2);
  await page.mouse.down();
  await page.mouse.move(bounds.x + bounds.width - 2, bounds.y + bounds.height / 2, { steps: 10 });
  await page.mouse.up();
  expect(await page.evaluate(() => window.getSelection()?.toString())).toContain("1851");
  await expect(sourceView).toBeVisible();
  await sourceView.getByRole("link", { name: "Return to comparison" }).click();
  await expect(
    page.getByRole("link", {
      name: "Source for Catalogue date bounds, Book Harmonium, Met 500531",
    }),
  ).toBeFocused();
});

test("source addresses reopen without a selection and return to the filtered catalogue", async ({
  page,
}) => {
  await page.goto("/pilot/?q=wood#source/500531/attribution");
  await expect(
    page.getByRole("heading", { name: "Source: Attribution", exact: true }),
  ).toBeVisible();
  await expect(page.locator("#source-details")).toContainText("Lepuye (?)");
  await expect(page.locator("#selection-count")).toBeEmpty();
  await page.reload();
  await expect(page.locator("#source-details")).toContainText('"Lepuye"');
  await page.locator("#collection-link").click();
  await expect(page.locator("#query")).toHaveValue("wood");
  const table = page.getByRole("table", { name: /Musical instruments.*The Metropolitan Museum/ });
  await expect(table.getByRole("columnheader")).toHaveText([
    "Select",
    "Object",
    "Catalogue date",
    "Material",
    "Maker / attribution",
  ]);
  await expect(table.locator('[data-id="500531"]')).toContainText("Lepuye (?)");
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.goBack();
  await expect(page).toHaveURL(/#source\/500531\/attribution$/);
  await expect(page.locator("#source-details")).toContainText("Lepuye (?)");
});

test("search, selection limit, missing results and back navigation preserve the investigation", async ({
  page,
}) => {
  await page.goto("/pilot/");
  for (const id of ["500526", "500527", "500528", "500529"])
    await page.locator(`[data-select="${id}"]`).click();
  await page.locator('[data-select="500530"]').click();
  await expect(page.locator("#status")).toContainText("Four instruments selected");
  await expect(page.locator("#selection-count")).toHaveText("4");
  await page.locator("#query").fill("no-matching-object");
  await page.locator("#query").press("Enter");
  await expect(page.locator("#records")).toContainText("No matches");
  await page.getByRole("button", { name: "Reset", exact: true }).click();
  await expect(page.locator("#selection-count")).toHaveText("4");
  await page.goBack();
  await expect(page.locator("#query")).toHaveValue("no-matching-object");
  await page.locator("#comparison-link").click();
  await expect(page.locator("#matrix thead th")).toHaveCount(5);
});

test("corrupt import leaves current work intact and responsive comparison remains operable", async ({
  page,
}, testInfo) => {
  await page.goto("/pilot/");
  await page.locator('[data-select="500526"]').click();
  await page.locator('[data-select="500527"]').click();
  await page.locator("#comparison-link").click();
  await page.getByLabel("Observation", { exact: true }).fill("Keep this observation");
  await page.getByLabel("Open investigation").setInputFiles({
    name: "invalid.json",
    mimeType: "application/json",
    buffer: Buffer.from('{"schemaVersion":999}'),
  });
  await expect(page.locator("#draft-status")).toContainText("File not opened");
  await expect(page.getByLabel("Observation", { exact: true })).toHaveValue(
    "Keep this observation",
  );
  await page.setViewportSize({ width: 320, height: 800 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const region = page.getByRole("region", { name: "Source evidence comparison" });
  await region.focus();
  await page.keyboard.press("ArrowRight");
  await expect.poll(() => region.evaluate((n) => n.scrollLeft)).toBeGreaterThan(0);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.screenshot({ path: testInfo.outputPath("comparison-narrow.png"), fullPage: true });
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "200%";
  });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("bare-route draft restoration retains search on view changes and notes export without selection", async ({
  page,
}) => {
  await page.goto("/pilot/");
  await page.locator("#query").fill("wood");
  await page.locator("#query").press("Enter");
  await page.goto("/pilot/");
  await expect(page.locator("#query")).toHaveValue("wood");
  await page.locator("#comparison-link").click();
  await page.getByLabel("Observation", { exact: true }).fill("Question before selecting evidence");
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export investigation" }).click();
  const path = await (await download).path();
  if (!path) throw Error("No export");
  const payload = JSON.parse(await readFile(path, "utf8"));
  expect(payload.records).toEqual([]);
  expect(payload.interpretation.observation).toBe("Question before selecting evidence");
  await page.locator("#collection-link").click();
  await expect(page.locator("#query")).toHaveValue("wood");
});

test("legacy draft bytes survive inspection and export until an actual edit", async ({ page }) => {
  const key = "frt.investigation.frt-instrument-study-v1.v1";
  const legacy = {
    schemaVersion: 1,
    query: "wood",
    researchQuestion: "What is the catalogue attribution?",
    selectedIds: ["500531", "500533"],
    records: source.records.filter((record) => ["500531", "500533"].includes(record.id)),
    interpretation: {
      observation: "The attribution retains Lepuye (?).",
      unresolvedQuestion: "What supports the qualifier?",
      author: "user",
    },
    provenance: manifest,
  };
  const bytes = `${JSON.stringify(legacy, null, 2)}\n`;
  await page.addInitScript(({ key, bytes }) => localStorage.setItem(key, bytes), { key, bytes });
  await page.goto("/pilot/");
  const stored = () => page.evaluate((key) => localStorage.getItem(key), key);
  await expect.poll(stored).toBe(bytes);
  await page.locator("#comparison-link").click();
  await expect(page.getByRole("heading", { name: "Comparison", exact: true })).toBeFocused();
  await expect.poll(stored).toBe(bytes);
  await page
    .getByRole("link", { name: "Source for Attribution, Book Harmonium, Met 500531" })
    .click();
  await page.getByRole("link", { name: "Return to comparison" }).click();
  await expect.poll(stored).toBe(bytes);
  const downloaded = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export investigation" }).click();
  const downloadedPath = await (await downloaded).path();
  if (!downloadedPath) throw Error("Missing v2 export");
  const payload = JSON.parse(await readFile(downloadedPath, "utf8"));
  expect(payload.schemaVersion).toBe(2);
  expect(payload.fieldEvidence.records.map((record: { id: string }) => record.id)).toEqual(
    legacy.selectedIds,
  );
  await expect.poll(stored).toBe(bytes);
  await page.getByLabel("Observation", { exact: true }).fill("An actual edit");
  await expect.poll(async () => JSON.parse((await stored()) ?? "null")?.schemaVersion).toBe(2);
  page.on("dialog", (dialog) => dialog.accept());
  await page.getByLabel("Open investigation").setInputFiles({
    name: "original-v1.json",
    mimeType: "application/json",
    buffer: Buffer.from(bytes),
  });
  await expect(page.getByLabel("Observation", { exact: true })).toHaveValue(
    legacy.interpretation.observation,
  );
  await expect.poll(stored).toBe(bytes);
  await page.locator("#collection-link").click();
  await expect(page.getByRole("heading", { name: "Musical instruments" })).toBeFocused();
  await expect.poll(stored).toBe(bytes);
  await page.locator("#comparison-link").click();
  await page.getByLabel("Observation", { exact: true }).fill("Edit after deliberate v1 import");
  await expect.poll(async () => JSON.parse((await stored()) ?? "null")?.schemaVersion).toBe(2);
  expect(JSON.parse(bytes)).toEqual(legacy);
});

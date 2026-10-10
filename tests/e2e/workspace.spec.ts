import { readFile } from "node:fs/promises";
import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";
import correspondence from "../../data/schoenbach/collection.json" with { type: "json" };
import sample from "../../fixtures/demo.json" with { type: "json" };

test.beforeEach(async ({ context }, testInfo) => {
  if (testInfo.title.startsWith("Schönbach") || testInfo.title.startsWith("invalid stored")) return;
  // Existing drafts keep their synthetic material when the bundled example changes.
  await context.addInitScript((dataset) => {
    const key = "fancy-research-tools:/tool/:collection:v1";
    if (localStorage.getItem(key) === null) {
      localStorage.setItem(key, JSON.stringify({ revision: 0, dataset }));
    }
  }, sample);
});

test("Schönbach source values stay separate from working corrections and export", async ({
  page,
}) => {
  await page.goto("/tool/");
  await expect(page.locator("#detail-heading")).toHaveText(correspondence.records[0]?.title ?? "");
  await expect(page.locator("#source-evidence")).toContainText("Habrovany");
  const secondTitle = await page.locator(".record-title").nth(1).boundingBox();
  if (!secondTitle) throw new Error("Missing selectable record title");
  await page.mouse.move(secondTitle.x + 1, secondTitle.y + 10);
  await page.mouse.down();
  await page.mouse.move(secondTitle.x + 90, secondTitle.y + 10, { steps: 8 });
  await page.mouse.up();
  expect(await page.evaluate(() => window.getSelection()?.toString())).toContain("Saar");
  await expect(page).not.toHaveURL(/id=/);
  expect(await exported(page)).toEqual(correspondence);
  await page.getByRole("button", { name: "Edit record" }).click();
  await page.getByLabel("Place", { exact: true }).fill("Working correction");
  await page.getByRole("button", { name: "Save record" }).click();
  await expect(page.locator("#source-evidence")).toContainText("Habrovany");
  await expect(page.locator("#record-content")).toContainText("Working correction");
  const result = await exported(page);
  expect(result.records[0]?.place).toBe("Working correction");
  expect(result.records[0]?.source).toBe(correspondence.records[0]?.source);
  expect(result.records.slice(1)).toEqual(correspondence.records.slice(1));
  await page.reload();
  expect(await exported(page)).toEqual(result);
});

test("Schönbach-looking identifiers do not assign source evidence to unrelated imports", async ({
  page,
}) => {
  await page.goto("/tool/");
  const imported = structuredClone(correspondence);
  const first = imported.records[0];
  if (!first) throw new Error("Missing source record");
  first.source = "A different source";
  page.once("dialog", (dialog) => dialog.accept());
  await page.locator("#import-file").setInputFiles({
    name: "same-id-different-source.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(imported)),
  });
  await expect(page.locator("#source-evidence")).toBeHidden();
  await expect(page.locator("#record-content")).toContainText("A different source");
  expect(await exported(page)).toEqual(imported);
});

async function exported(page: Page): Promise<typeof sample> {
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export collection" }).click();
  const download = await downloadPromise;
  const path = await download.path();
  expect(path).not.toBeNull();
  return JSON.parse(await readFile(path as string, "utf8")) as typeof sample;
}

test("saving one imported field preserves other fields and their exact line endings", async ({
  page,
}) => {
  const payload = structuredClone(sample);
  Object.assign(payload.records[0] ?? {}, {
    title: "  First\r\nSecond  ",
    kind: " Text\r\nkind ",
    place: " Graz\rplace ",
    source: "  Source\r\nretained  ",
    notes: "  Notes\r\nretained\rtoo  ",
  });
  await page.goto("/tool/");
  page.once("dialog", (dialog) => dialog.accept());
  await page.locator("#import-file").setInputFiles({
    name: "line-endings.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(payload)),
  });
  await expect(page.locator("#provenance")).toContainText("line-endings.json");
  expect(await exported(page)).toEqual(payload);
  await page.locator("#records button").first().click();
  await page.getByRole("button", { name: "Edit record" }).click();
  await page.getByLabel("Date", { exact: true }).fill("Edited date only");
  await page.getByRole("button", { name: "Save record" }).click();
  const expected = structuredClone(payload);
  const first = expected.records[0];
  if (!first) throw new Error("Missing sample record");
  first.date = "Edited date only";
  expect(await exported(page)).toEqual(expected);
  await page.reload();
  expect(await exported(page)).toEqual(expected);
});

test("filtered editor keeps selection context and restores filters when discard is cancelled", async ({
  page,
}) => {
  await page.goto("/tool/?id=demo-001");
  await page.getByRole("searchbox").fill("zzzzz");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.locator("#results")).toHaveText("0 matching records");
  await expect(page.locator("#selection-context")).toContainText("outside the current results");
  await expect(page.locator("#export-scope")).toContainText("entire collection");
  expect((await exported(page)).records).toHaveLength(sample.records.length);
  await page.getByRole("button", { name: "Edit record" }).click();
  await page.getByLabel("Notes", { exact: true }).fill("Protected working note");
  await page.getByRole("searchbox").fill("Muenchen");
  page.once("dialog", (dialog) => dialog.dismiss());
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByRole("searchbox")).toHaveValue("zzzzz");
  await expect(page.getByLabel("Notes", { exact: true })).toHaveValue("Protected working note");
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Cancel editing" }).click();
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(page.locator("#records button")).toHaveCount(sample.records.length);
  await expect(page.locator("#selection-context")).toBeHidden();
  await expect(page).toHaveURL(/id=demo-001$/);
  await expect(page.getByRole("searchbox")).toBeFocused();
});

test("search, type and selection survive browser back navigation", async ({ page }) => {
  await page.goto("/tool/");
  await page.getByRole("searchbox", { name: "Search records" }).fill("Muenchen");
  await page.locator("#kind").selectOption("Bild");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page).toHaveURL(/q=Muenchen&kind=Bild/);
  await expect(page.locator("#records button")).toHaveCount(1);
  await page.locator("#records button").click();
  await expect(page).toHaveURL(/id=demo-002/);
  await expect(page.locator("#detail-heading")).toHaveText("Skizze einer Brücke");
  await page.goBack();
  await expect(page).not.toHaveURL(/id=/);
  await expect(page.getByRole("searchbox")).toHaveValue("Muenchen");
  await expect(page.locator("#kind")).toHaveValue("Bild");
  await page.goForward();
  await expect(page.locator("#detail-heading")).toHaveText("Skizze einer Brücke");
});

test("edit, reload and exported bytes preserve all untouched records", async ({ page }) => {
  await page.goto("/tool/?id=demo-001");
  await page.getByRole("button", { name: "Edit record" }).click();
  await page
    .getByLabel("Notes", { exact: true })
    .fill("A human correction <script>never executes</script>");
  await page.getByLabel("Working review", { exact: true }).selectOption("checked");
  await page.getByRole("button", { name: "Save record" }).click();
  await page.reload();
  await expect(page.locator("#record-content")).toContainText(
    "A human correction <script>never executes</script>",
  );
  const result = await exported(page);
  expect(result.records[0]?.notes).toBe("A human correction <script>never executes</script>");
  expect(result.records[0]?.review).toBe("checked");
  expect(result.records.slice(1)).toEqual(sample.records.slice(1));
  expect(result.records[0]?.date).toBeNull();
  page.once("dialog", (dialog) => dialog.accept());
  await page.locator("#import-file").setInputFiles({
    name: "roundtrip.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(result)),
  });
  await expect(page.locator("#provenance")).toContainText("roundtrip.json");
  expect(await exported(page)).toEqual(result);
});

test("invalid imports retain the current collection and unsaved form", async ({ page }) => {
  await page.goto("/tool/?id=demo-001");
  await page.getByRole("button", { name: "Edit record" }).click();
  await page.getByLabel("Notes", { exact: true }).fill("Unsaved work");
  await page.locator("#import-file").setInputFiles({
    name: "invalid.json",
    mimeType: "application/json",
    buffer: Buffer.from('{"schemaVersion":99}'),
  });
  await expect(page.locator("#error")).toContainText("Import rejected");
  await expect(page.getByLabel("Notes", { exact: true })).toHaveValue("Unsaved work");
  page.once("dialog", (dialog) => dialog.dismiss());
  await page.locator("#records button").nth(1).click();
  await expect(page.getByLabel("Notes", { exact: true })).toHaveValue("Unsaved work");
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Cancel editing" }).click();
  expect(await exported(page)).toEqual(sample);
});

test("discard clears resolved edit errors while retaining storage warnings", async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException("Storage blocked", "QuotaExceededError");
    };
  });
  await page.goto("/tool/?id=demo-001");
  await page.getByRole("button", { name: "Edit record" }).click();
  await page.getByLabel("Notes", { exact: true }).fill("Memory copy");
  await page.getByRole("button", { name: "Save record" }).click();
  await page.getByRole("button", { name: "Edit record" }).click();
  await page.getByLabel("Notes", { exact: true }).fill("Discard this edit");
  await page.getByRole("button", { name: "Export collection" }).click();
  await expect(page.locator("#error")).toContainText("Save or cancel");
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Cancel editing" }).click();
  await expect(page.locator("#error")).toBeHidden();
  await expect(page.locator("#storage-error")).toContainText("unavailable or full");
  await page.getByRole("button", { name: "Edit record" }).click();
  await page.getByLabel("Title", { exact: true }).fill("   ");
  await page.getByRole("button", { name: "Save record" }).click();
  await expect(page.locator("#error")).toContainText("Record not saved");
  page.once("dialog", (dialog) => dialog.accept());
  await page.locator("#records button").nth(1).click();
  await expect(page.locator("#error")).toBeHidden();
  await expect(page.locator("#storage-error")).toBeVisible();
});

test("storage failure still permits editing and actual file export", async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException("Storage blocked", "QuotaExceededError");
    };
  });
  await page.goto("/tool/?id=demo-001");
  await page.getByRole("button", { name: "Edit record" }).click();
  await page.getByLabel("Title", { exact: true }).fill("Saved in memory");
  await page.getByRole("button", { name: "Save record" }).click();
  await expect(page.locator("#storage-error")).toContainText("unavailable or full");
  expect((await exported(page)).records[0]?.title).toBe("Saved in memory");
});

test("invalid stored copy is protected until explicit overwrite consent", async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem("fancy-research-tools:/tool/:collection:v1", "corrupt original"),
  );
  await page.goto("/tool/?id=schoenbach-001");
  await page.getByRole("button", { name: "Edit record" }).click();
  await page.getByLabel("Title", { exact: true }).fill("New current title");
  page.once("dialog", (dialog) => dialog.dismiss());
  await page.getByRole("button", { name: "Save record" }).click();
  expect(
    await page.evaluate(() => localStorage.getItem("fancy-research-tools:/tool/:collection:v1")),
  ).toBe("corrupt original");
  expect((await exported(page)).records[0]?.title).toBe("New current title");
});

test("a second tab cannot silently overwrite the first tab's saved revision", async ({
  page,
  context,
}) => {
  await page.goto("/tool/?id=demo-001");
  const other = await context.newPage();
  await other.goto("/tool/?id=demo-001");
  for (const [tab, title] of [
    [page, "First tab version"],
    [other, "Second tab version"],
  ] as const) {
    await tab.getByRole("button", { name: "Edit record" }).click();
    await tab.getByLabel("Title", { exact: true }).fill(title);
    await tab.getByRole("button", { name: "Save record" }).click();
  }
  await expect(other.locator("#storage-error")).toContainText("Another tab changed");
  expect((await exported(other)).records[0]?.title).toBe("Second tab version");
  expect((await exported(page)).records[0]?.title).toBe("First tab version");
  const stored = await page.evaluate(() =>
    localStorage.getItem("fancy-research-tools:/tool/:collection:v1"),
  );
  expect(JSON.parse(stored as string).dataset.records[0].title).toBe("First tab version");
});

test("oversized edits are rejected without changing the exportable dataset", async ({ page }) => {
  await page.goto("/tool/?id=demo-001");
  await page.getByRole("button", { name: "Edit record" }).click();
  await page.getByLabel("Notes", { exact: true }).fill("x".repeat(1024 * 1024));
  await page.getByRole("button", { name: "Save record" }).click();
  await expect(page.locator("#error")).toContainText("exceed the 1 MiB limit");
  await expect(page.getByLabel("Notes", { exact: true })).toHaveValue("x".repeat(1024 * 1024));
  await page.getByRole("button", { name: "Export collection" }).click();
  await expect(page.locator("#error")).toContainText("Save or cancel");
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Cancel editing" }).click();
  expect(await exported(page)).toEqual(sample);
});

test("narrow workspace and editor have no document overflow or axe violations", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/tool/?id=demo-001");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.getByRole("button", { name: "Edit record" }).click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.getByLabel("Title", { exact: true }).focus();
  await page.keyboard.press("Tab");
  await expect(page.locator("#edit-date")).toBeFocused();
});

test("desktop editing keeps the record list and save action in the working viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto("/tool/?id=demo-001");
  await page.getByRole("button", { name: "Edit record" }).click();
  await expect(page.getByRole("button", { name: "Save record" })).toBeInViewport();
  await expect(page.locator("#records button").first()).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollHeight <= innerHeight)).toBe(
    true,
  );
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

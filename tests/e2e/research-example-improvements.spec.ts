import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";

for (const variant of ["atlas", "bench"]) {
  test(`${variant}: own research question survives export and reopening`, async ({
    page,
    browser,
  }, testInfo) => {
    await page.goto(`/concepts/${variant}/`);
    if (variant === "atlas") {
      await page.locator('[data-select="500531"]').click();
      await page.locator('[data-select="500526"]').click();
      await page.getByRole("link", { name: /Compare selection/ }).click();
    } else {
      await page
        .getByRole("checkbox", { name: "Compare Book Harmonium, 500531", exact: true })
        .check();
      await page.getByRole("checkbox", { name: "Compare Ūd, 500526", exact: true }).check();
      await page.getByRole("button", { name: /Compare selection/ }).click();
    }
    const question = page.getByLabel("Research question", { exact: true });
    await expect(question).toHaveCount(1);
    await question.focus();
    const expected = "How do these material descriptions differ?\nWhat supports Lepuye (?)?";
    await page.keyboard.insertText(expected);
    await expect(question).toHaveValue(expected);
    await page
      .getByLabel("Observation", { exact: true })
      .fill("The harmonium catalogue names Lepuye with a question mark.");
    const pending = page.waitForEvent("download");
    await page.getByRole("button", { name: /Download/ }).click();
    const download = await pending;
    const path = testInfo.outputPath(`${variant}-own-question.json`);
    await download.saveAs(path);
    const original = JSON.parse(await readFile(path, "utf8"));
    expect(original.researchQuestion).toBe(expected);
    expect(original.selectedIds).toEqual(["500531", "500526"]);
    const context = await browser.newContext();
    try {
      const reopened = await context.newPage();
      await reopened.goto(new URL(`/concepts/${variant}/`, page.url()).href);
      reopened.once("dialog", (dialog) => dialog.accept());
      await reopened.getByLabel("Open investigation", { exact: true }).setInputFiles(path);
      if (variant === "atlas")
        await reopened.getByRole("link", { name: /Compare selection/ }).click();
      else await reopened.getByRole("button", { name: /Compare selection/ }).click();
      await expect(reopened.getByLabel("Research question", { exact: true })).toHaveValue(expected);
      await reopened
        .getByLabel("Observation", { exact: true })
        .fill("Only the observation changes.");
      const again = reopened.waitForEvent("download");
      await reopened.getByRole("button", { name: /Download/ }).click();
      const againPath = await (await again).path();
      if (!againPath) throw new Error("Missing reopened export");
      const restored = JSON.parse(await readFile(againPath, "utf8"));
      expect(restored).toEqual({
        ...original,
        interpretation: {
          ...original.interpretation,
          observation: "Only the observation changes.",
        },
      });
      await reopened.screenshot({
        path: testInfo.outputPath(`${variant}-question-wide.png`),
        fullPage: true,
      });
      await reopened.setViewportSize({ width: 320, height: 800 });
      expect(
        await reopened.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      ).toBe(true);
      await reopened.screenshot({
        path: testInfo.outputPath(`${variant}-question-narrow.png`),
        fullPage: true,
      });
    } finally {
      await context.close();
    }
  });
}

test("Trail displays and exports the order in which evidence was selected", async ({
  page,
}, testInfo) => {
  await page.goto("/concepts/trail/");
  await page.getByRole("button", { name: "Add Book Harmonium", exact: true }).click();
  await page.getByRole("button", { name: "Add Ūd", exact: true }).click();
  await page.getByRole("link", { name: "Compare evidence", exact: true }).click();
  await expect(page.locator("#comparison thead th a")).toHaveText(["Book Harmonium", "Ūd"]);
  await page
    .getByRole("navigation", { name: "Investigation" })
    .getByRole("link", { name: "Record observation", exact: true })
    .click();
  await expect(page.locator("#evidence a")).toHaveText(["Book Harmonium", "Ūd"]);
  const pending = page.waitForEvent("download");
  await page.getByRole("button", { name: /Download/ }).click();
  const path = testInfo.outputPath("trail-ordered-selection.json");
  await (await pending).saveAs(path);
  expect(JSON.parse(await readFile(path, "utf8")).selectedIds).toEqual(["500531", "500526"]);
  await page.reload();
  await page.getByRole("link", { name: "Compare evidence", exact: true }).click();
  await expect(page.locator("#comparison thead th a")).toHaveText(["Book Harmonium", "Ūd"]);
});

test("workbench searches qualified attribution and preserves its evidence in export", async ({
  page,
}, testInfo) => {
  await page.goto("/pilot/");
  await page.getByLabel("Search catalogue", { exact: true }).fill("attributed to");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.locator("#records tbody tr")).toHaveCount(2);
  await expect(page.locator('#records [data-id="500553"]')).toContainText(
    "Attributed to Vincentius Vinaccia",
  );
  await expect(page.locator('#records [data-id="500564"]')).toContainText(
    "attributed to Jean Charles",
  );
  for (const id of ["500553", "500564"]) await page.locator(`[data-select="${id}"]`).click();
  await page.locator("#comparison-link").click();
  const pending = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export investigation" }).click();
  const path = testInfo.outputPath("qualified-attributions.json");
  await (await pending).saveAs(path);
  const output = JSON.parse(await readFile(path, "utf8"));
  expect(output.selectedIds).toEqual(["500553", "500564"]);
  expect(output.records.map((record: { artistPrefix: string }) => record.artistPrefix)).toEqual([
    "Attributed to",
    "attributed to",
  ]);
});

test("catalogue selection has a restorable address alongside filters and ordering", async ({
  page,
}) => {
  await page.goto("/baseline/");
  await page.locator('[data-id="500553"] button').click();
  await expect(page).toHaveURL(/[?&]id=500553(?:&|$)/);
  await page.reload();
  await expect(page.locator('[data-id="500553"] button')).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#object-detail")).toContainText("Attributed to Vincentius Vinaccia");
  await page.getByRole("button", { name: "Title", exact: true }).click();
  await page.reload();
  await expect(page.locator('[data-id="500553"] button')).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator('th[aria-sort="ascending"]')).toContainText("Title");
  await page.locator('[data-id="500531"] button').click();
  await page.goBack();
  await expect(page.locator('[data-id="500553"] button')).toHaveAttribute("aria-pressed", "true");
  await page.goto("/baseline/?q=wood&id=not-a-source-id");
  await expect(page.locator('[data-id="500526"] button')).toHaveAttribute("aria-pressed", "true");
  await expect(page).toHaveURL(/[?&]id=500526(?:&|$)/);
  await expect(page.getByLabel("Search metadata")).toHaveValue("wood");
  await expect(page.locator("#object-detail a")).toHaveAttribute(
    "href",
    "https://www.metmuseum.org/art/collection/search/500526",
  );
});

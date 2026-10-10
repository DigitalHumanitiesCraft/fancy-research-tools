import { readFile } from "node:fs/promises";
import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";
import fieldEvidence from "../../data/met-instruments/field-evidence.json" with { type: "json" };
import manifest from "../../data/met-instruments/manifest.json" with { type: "json" };
import source from "../../data/met-instruments/records.json" with { type: "json" };

async function openNotes(page: Page, variant: string) {
  if (variant === "atlas") {
    if (!(await page.getByLabel("Observation", { exact: true }).isVisible()))
      await page.getByRole("link", { name: /Compare selection/ }).click();
  } else if (variant === "bench") {
    await page.getByRole("button", { name: /Compare selection/ }).click();
  } else {
    await page
      .getByRole("navigation", { name: "Investigation" })
      .getByRole("link", { name: "Record observation", exact: true })
      .click();
  }
}

for (const variant of ["atlas", "bench", "trail"]) {
  test(`${variant}: imported authored text retains line endings across an unrelated edit`, async ({
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
    await page.goto(`/concepts/${variant}/`);
    page.once("dialog", (dialog) => dialog.accept());
    await page.getByLabel("Open investigation").setInputFiles({
      name: "line-endings.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify(payload)),
    });
    await expect(page.locator("#draft-status")).toHaveText("Saved locally");
    await page.locator('input[type="search"]').press("Enter");
    await openNotes(page, variant);
    const exported = async (name: string) => {
      const pending = page.waitForEvent("download");
      await page.getByRole("button", { name: /Download/ }).click();
      const download = await pending;
      const path = testInfo.outputPath(name);
      await download.saveAs(path);
      return JSON.parse(await readFile(path, "utf8"));
    };
    expect(await exported("unmodified-line-endings.json")).toEqual(payload);
    await page
      .getByLabel(variant === "trail" ? "Your observation" : "Observation", { exact: true })
      .fill("Only this observation changed.");
    const expected = {
      ...payload,
      interpretation: { ...payload.interpretation, observation: "Only this observation changed." },
    };
    expect(await exported("one-field-edited.json")).toEqual(expected);
    await page.reload();
    await openNotes(page, variant);
    expect(await exported("recovered-line-endings.json")).toEqual(expected);
  });

  test(`${variant}: research comparison, actual download, accessible layout`, async ({
    page,
    browser,
  }, testInfo) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`/concepts/${variant}/`);
    await page.screenshot({
      path: testInfo.outputPath(`${variant}-start.png`),
      fullPage: true,
    });
    const search = page.locator('input[type="search"]');
    await search.fill("wood");
    await search.press("Enter");
    if (variant === "atlas") {
      await page.locator('[data-select="500526"]').click();
      await page.locator('[data-select="500527"]').click();
      await page.getByRole("link", { name: /Compare selection/ }).click();
    } else if (variant === "bench") {
      await page.getByRole("checkbox", { name: "Compare Ūd, 500526", exact: true }).check();
      await page.getByRole("checkbox", { name: "Compare Pipe Organ, 500527", exact: true }).check();
      await page.getByRole("button", { name: /Compare selection/ }).click();
    } else {
      await page.getByRole("button", { name: "Add Ūd", exact: true }).click();
      await page.getByRole("button", { name: "Add Pipe Organ", exact: true }).click();
      await page.getByRole("link", { name: "Compare evidence", exact: true }).click();
    }
    await expect(page.locator("body")).toContainText("Wood, metal, various materials");
    await page.screenshot({
      path: testInfo.outputPath(`${variant}-compare.png`),
      fullPage: true,
    });
    if (variant === "trail")
      await page
        .getByRole("navigation", { name: "Investigation" })
        .getByRole("link", { name: "Record observation", exact: true })
        .click();
    await page
      .getByLabel(variant === "trail" ? "Your observation" : "Observation", { exact: true })
      .fill("Both selected catalogue entries mention wood.");
    await page
      .getByLabel("Unresolved question", { exact: true })
      .fill("Which construction details require inspection of the objects?");
    const downloaded = page.waitForEvent("download");
    await page.getByRole("button", { name: /Download/ }).click();
    const download = await downloaded;
    const file = await download.path();
    if (!file) throw Error("No download");
    const payload = JSON.parse(await readFile(file, "utf8"));
    expect(payload.records).toEqual(
      source.records.filter((r) => ["500526", "500527"].includes(r.id)),
    );
    expect(JSON.stringify(payload)).toContain("Both selected catalogue entries mention wood.");
    expect(JSON.stringify(payload)).toContain("CC0-1.0");
    await download.saveAs(testInfo.outputPath(`${variant}-export.json`));
    await page.reload();
    await openNotes(page, variant);
    await expect(
      page.getByLabel(variant === "trail" ? "Your observation" : "Observation", { exact: true }),
    ).toHaveValue("Both selected catalogue entries mention wood.");
    await expect(page.getByLabel("Unresolved question", { exact: true })).toHaveValue(
      "Which construction details require inspection of the objects?",
    );
    const reopenedContext = await browser.newContext();
    try {
      const reopened = await reopenedContext.newPage();
      await reopened.goto(new URL(`/concepts/${variant}/`, page.url()).href);
      reopened.on("dialog", (dialog) => dialog.accept());
      await reopened.getByLabel("Open investigation", { exact: true }).setInputFiles(file);
      await openNotes(reopened, variant);
      await expect(
        reopened.getByLabel(variant === "trail" ? "Your observation" : "Observation", {
          exact: true,
        }),
      ).toHaveValue("Both selected catalogue entries mention wood.");
      const exportedAgain = reopened.waitForEvent("download");
      await reopened.getByRole("button", { name: /Download/ }).click();
      const reopenedPath = await (await exportedAgain).path();
      if (!reopenedPath) throw Error("Missing reopened export");
      expect(JSON.parse(await readFile(reopenedPath, "utf8"))).toEqual(payload);
    } finally {
      await reopenedContext.close();
    }
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await page.setViewportSize({ width: 320, height: 800 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.screenshot({
      path: testInfo.outputPath(`${variant}-narrow.png`),
      fullPage: true,
    });
  });
}
for (const variant of ["atlas", "bench", "trail"]) {
  test(`${variant}: unreadable stored work survives subsequent interactions`, async ({ page }) => {
    const key = `frt.investigation.${variant}.v1`;
    await page.addInitScript((key) => localStorage.setItem(key, "broken JSON"), key);
    await page.goto(`/concepts/${variant}/`);
    await expect(page.locator("#draft-status")).toContainText("could not be restored");
    const search = page.locator('input[type="search"]');
    await search.fill("wood");
    await search.press("Enter");
    expect(await page.evaluate((key) => localStorage.getItem(key), key)).toBe("broken JSON");
    await expect(page.locator("#draft-status")).toContainText("not been overwritten");
  });
}

test("comparison feedback downloads explicit self-report", async ({ page }) => {
  await page.goto("/concepts/");
  await page.getByRole("combobox", { name: /^Concept/ }).selectOption({ label: "A / Atlas" });
  await page.getByLabel("Task outcome").selectOption({ label: "Completed unaided" });
  await page.getByLabel("Task difficulty").selectOption("6");
  const event = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download this assessment" }).click();
  const path = await (await event).path();
  if (!path) throw Error("missing");
  const record = JSON.parse(await readFile(path, "utf8"));
  expect(record.answers.ease).toBe("6");
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

test("Trail keyboard stage change focuses the destination", async ({ page }) => {
  await page.goto("/concepts/trail/");
  await page
    .getByRole("navigation", { name: "Investigation" })
    .getByRole("link", { name: "Compare evidence", exact: true })
    .focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { name: "Read the evidence together" })).toBeFocused();
});

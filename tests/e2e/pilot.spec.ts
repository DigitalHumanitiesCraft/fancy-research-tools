import { readFile } from "node:fs/promises";
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import expected from "../../benchmarks/cases/met-instruments/expected.json" with { type: "json" };

test("source subset filters, download and URL navigation agree", async ({ page }) => {
  await page.goto("/baseline/");
  await expect(page.locator("#objects > tr")).toHaveCount(60);
  await expect(page.locator('[data-id="500553"]')).toContainText(
    "Attributed to Vincentius Vinaccia",
  );
  await page.getByRole("combobox", { name: /^Missing metadata/ }).selectOption("culture");
  await page.getByRole("button", { name: "Apply filters" }).click();
  await expect(page.locator("#objects > tr")).toHaveCount(5);
  const ids = await page
    .locator("#objects > tr")
    .evaluateAll((nodes) => nodes.map((node) => (node as HTMLElement).dataset.id));
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export results and provenance" }).click();
  const download = await downloadPromise;
  const path = await download.path();
  if (!path) throw new Error("Expected downloaded file");
  const exported = JSON.parse(await readFile(path, "utf8"));
  expect(exported.records.map((record: { id: string }) => record.id)).toEqual(ids);
  expect(exported.analysis.denominator).toBe(5);
  expect(exported.analysis.missing.culture).toBe(5);
  expect(exported.provenance.license).toBe("CC0-1.0");
  expect(exported.filters.missing).toBe("culture");
  const oracle = expected.queries.find((query) => query.id === "missing-culture");
  if (!oracle) throw new Error("Missing independent oracle case");
  expect(exported.records.map((record: { id: string }) => record.id)).toEqual(oracle.ids);
  expect(exported.analysis.missing).toEqual(oracle.missing);
  expect(
    new Map(
      exported.analysis.distribution.map((group: { value: string | null; count: number }) => [
        group.value,
        group.count,
      ]),
    ),
  ).toEqual(new Map(oracle.groups.classification.map((group) => [group.value, group.count])));
  await page.reload();
  await expect(page.getByRole("combobox", { name: /^Missing metadata/ })).toHaveValue("culture");
  await expect(page.locator("#objects > tr")).toHaveCount(5);
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(page.locator("#objects > tr")).toHaveCount(60);
  await page.goBack();
  await expect(page.locator("#objects > tr")).toHaveCount(5);
  await page.getByLabel("Search metadata").fill("no-object-has-this-unique-phrase");
  await page.getByRole("button", { name: "Apply filters" }).click();
  await expect(page.locator("#objects > tr")).toHaveCount(0);
  await expect(page.locator("#distribution")).toContainText("No matching objects");
});

test("pilot loads and filters below a repository subpath", async ({ page }) => {
  await page.route("**/fancy-research-tools/**", (route) => {
    const url = new URL(route.request().url());
    url.pathname = url.pathname.replace("/fancy-research-tools", "");
    return route.continue({ url: url.href });
  });
  await page.goto("/fancy-research-tools/baseline/?missing=culture");
  await expect(page.locator("#objects > tr")).toHaveCount(5);
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(page).toHaveURL(/\/fancy-research-tools\/baseline\/$/);
  await expect(page.locator("#objects > tr")).toHaveCount(60);
});

test("visual filters preserve source semantics and keyboard focus", async ({ page }) => {
  await page.goto("/baseline/");
  const gap = page.getByRole("button", {
    name: "Culture not supplied: 5 of 60 objects. Filter results",
    exact: true,
  });
  await gap.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#objects > tr")).toHaveCount(5);
  await expect(page.getByRole("combobox", { name: /^Missing metadata/ })).toHaveValue("culture");
  const activeGap = page.getByRole("button", {
    name: "Culture not supplied: 5 of 5 objects. Remove filter",
    exact: true,
  });
  await expect(activeGap).toBeFocused();
  await expect(activeGap).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press("Space");
  await expect(page.locator("#objects > tr")).toHaveCount(60);
  await page.getByLabel("Group results by").selectOption("culture");
  await page
    .getByRole("button", { name: "American: 4 of 60 objects. Filter results", exact: true })
    .click();
  await expect(page.locator("#objects > tr")).toHaveCount(4);
  await expect(page.getByRole("combobox", { name: /^Culture \(source label\)/ })).toHaveValue(
    "American",
  );
  await page.getByLabel("Group results by").selectOption("objectName");
  await expect(page.locator("#distribution button")).toHaveCount(0);
  await page.getByRole("button", { name: "Clear filters" }).click();
  const attributed = page.locator('[data-id="500553"]');
  await attributed.getByRole("button").focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#object-detail")).toContainText("Attributed to Vincentius Vinaccia");
  await expect(attributed.getByRole("button")).toHaveAttribute("aria-pressed", "true");
  await expect(attributed.getByRole("button")).toBeFocused();
  await expect(page.locator("details")).toHaveCount(0);
});

test("keyboard operation, source links and narrow accessible layout", async ({ page }) => {
  await page.goto("/baseline/");
  await page.getByLabel("Search metadata").focus();
  await page.keyboard.type("ud");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/q=ud/);
  const links = await page
    .locator("#object-detail a")
    .evaluateAll((nodes) => nodes.map((node) => (node as HTMLAnchorElement).href));
  expect(links.length).toBeGreaterThan(0);
  expect(links.every((url) => url.startsWith("https://www.metmuseum.org/art/collection/"))).toBe(
    true,
  );
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.screenshot({ path: "test-results/pilot-desktop.png", fullPage: true });
  await page.setViewportSize({ width: 320, height: 800 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: "test-results/pilot-mobile.png", fullPage: true });
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "200%";
  });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("mixed controls retain pending values and expose the applied scope", async ({ page }) => {
  await page.goto("/baseline/");
  await page.getByLabel("Search metadata").fill("wood");
  await expect(page.locator("#pending-status")).toContainText("Unapplied changes");
  await page.getByLabel("Group results by").selectOption("culture");
  await expect(page.getByLabel("Search metadata")).toHaveValue("wood");
  await expect(page.locator("#objects > tr")).toHaveCount(41);
  await expect(page.locator("#active-scope")).toContainText("wood");
  await page.getByRole("button", { name: "Clear filters" }).click();
  await page.getByLabel("Search metadata").fill("wood");
  await page
    .getByRole("button", {
      name: "Culture not supplied: 5 of 60 objects. Filter results",
      exact: true,
    })
    .click();
  await expect(page.getByLabel("Search metadata")).toHaveValue("wood");
  await expect(page.locator("#objects > tr")).toHaveCount(3);
  await expect(page.locator("#active-scope")).toContainText("Culture not supplied");
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(page.locator("#distribution > *")).toHaveCount(27);
  await page.getByLabel("Search metadata").fill("wood");
  await page.locator('[data-id="500553"] button').click();
  await expect(page.getByLabel("Search metadata")).toHaveValue("wood");
  await expect(page.locator("#pending-status")).toContainText("Unapplied changes");
  await expect(page.locator("#objects > tr")).toHaveCount(60);
});

test("desktop workbench keeps controls, results and evidence together", async ({ page }) => {
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 1366, height: 768 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/baseline/");
    await expect(page.locator("#objects > tr")).toHaveCount(60);
    expect(
      await page.evaluate(() => document.documentElement.scrollHeight <= innerHeight + 1),
    ).toBe(true);
    for (const selector of ["#filters", ".objects", ".analysis", ".object-detail"]) {
      const bounds = await page.locator(selector).boundingBox();
      expect(bounds).not.toBeNull();
      if (bounds) expect(bounds.y + bounds.height).toBeLessThanOrEqual(viewport.height + 1);
    }
    await page.locator('[data-id="500553"] button').click();
    await expect(page.locator("#object-detail")).toContainText("Attributed to Vincentius Vinaccia");
    expect(await page.evaluate(() => scrollY)).toBe(0);
    await page.getByLabel("Search metadata").fill("zzzz-no-match");
    await page.getByRole("button", { name: "Apply filters" }).click();
    await expect(page.locator("#object-detail")).toHaveText("No object selected.");
  }
});

test("sorting preserves selection and About keeps provenance off the workspace", async ({
  page,
}) => {
  await page.goto("/baseline/");
  await expect(page.locator("#result-status")).toHaveText("60 results");
  await page.getByRole("button", { name: "Title", exact: true }).click();
  await expect(page.locator('th[aria-sort="ascending"]')).toContainText("Title");
  const ascending = await page.locator("#objects td:first-child").allTextContents();
  expect(ascending).toEqual(
    [...ascending].sort((a, b) => a.localeCompare(b, "en", { numeric: true })),
  );
  await page.getByRole("button", { name: "Title", exact: true }).click();
  await page.reload();
  await expect(page.locator('th[aria-sort="descending"]')).toContainText("Title");
  await page.getByRole("button", { name: "Culture", exact: true }).click();
  await expect(page.locator("#objects tr").last().locator("td").nth(2)).toHaveText("Not supplied");
  await page.getByRole("button", { name: "Culture", exact: true }).click();
  await expect(page.locator("#objects tr").last().locator("td").nth(2)).toHaveText("Not supplied");
  await page.getByRole("button", { name: "About this tool", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("60 lowest-ID");
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(page.getByRole("button", { name: "About this tool", exact: true })).toBeFocused();
});

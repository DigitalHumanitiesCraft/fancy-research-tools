import { readFile } from "node:fs/promises";
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("SZD example download preserves source bytes and manifest links", async ({
  page,
  request,
}) => {
  await page.goto("/guides/getting-started.html#capture-szd");
  const pendingDownload = page.waitForEvent("download");
  await page.getByRole("link", { name: "prepared TEI", exact: true }).click();
  const download = await pendingDownload;
  expect(download.suggestedFilename()).toBe("letter.tei.xml");
  const saved = await download.path();
  expect(saved).not.toBeNull();
  expect(await readFile(saved as string, "utf8")).toBe(
    await readFile("data/szd-example/letter.tei.xml", "utf8"),
  );
  for (const file of [
    "manifest.json",
    "verification.json",
    "raw/gams-mets.xml",
    "raw/pipeline.tei.xml",
    "raw/pipeline-page.json",
  ]) {
    const response = await request.get(`/examples/szd/${file}`);
    expect(response.status()).toBe(200);
    expect(await response.text()).toBe(await readFile(`data/szd-example/${file}`, "utf8"));
  }
});

test("published documentation routes, headings and local links resolve", async ({
  page,
  request,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Fancy Research Tools");
  await expect(page.getByRole("link", { name: "Open the tool gallery" })).toBeVisible();
  await page.goto("/guides/getting-started.html");
  const routes = await page
    .locator(".docs-nav a")
    .evaluateAll((links) =>
      links
        .map((link) => (link as HTMLAnchorElement).href)
        .filter((href) => href.startsWith(location.origin)),
    );
  for (const route of routes) {
    await page.goto(route);
    const ids = await page
      .locator("[id]")
      .evaluateAll((elements) => elements.map((element) => element.id));
    expect(new Set(ids).size, route).toBe(ids.length);
    const links = await page
      .locator("main a")
      .evaluateAll((elements) =>
        elements
          .map((element) => (element as HTMLAnchorElement).href)
          .filter((href) => href.startsWith(location.origin)),
      );
    for (const link of links) {
      const response = await request.get(link);
      expect(response.status(), link).toBe(200);
      if (new URL(link).pathname.endsWith(".html"))
        expect(await response.text(), link).toContain("<!doctype html>");
      const hash = new URL(link).hash;
      if (hash) {
        const html = await response.text();
        const exists = await page.evaluate(
          ({ html, id }) =>
            new DOMParser().parseFromString(html, "text/html").getElementById(id) !== null,
          { html, id: decodeURIComponent(hash.slice(1)) },
        );
        expect(exists, `Missing fragment: ${link}`).toBe(true);
      }
    }
  }
  await page.goto("/reference/specification.html");
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.screenshot({ path: "test-results/documentation-desktop.png", fullPage: true });
  await page.setViewportSize({ width: 320, height: 800 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: "test-results/documentation-mobile.png", fullPage: true });
  await page
    .getByRole("navigation", { name: "Documentation", exact: true })
    .getByRole("link", { name: "Design", exact: true })
    .click();
  await expect(page.getByRole("heading", { name: "Design", exact: true })).toBeVisible();
  await page
    .getByRole("navigation", { name: "On this page", exact: true })
    .getByRole("link", { name: "Information visualisation", exact: true })
    .click();
  await expect(page).toHaveURL(/#information-visualisation$/);
});

test("relative assets and navigation work below a repository subpath", async ({ page }) => {
  await page.route("**/fancy-research-tools/**", (route) => {
    const url = new URL(route.request().url());
    url.pathname = url.pathname.replace("/fancy-research-tools", "");
    return route.continue({ url: url.href });
  });
  await page.goto("/fancy-research-tools/");
  await page.getByRole("link", { name: "Open the tool gallery" }).click();
  await expect(page).toHaveURL(/\/fancy-research-tools\/tools\/$/);
  await page
    .getByRole("main")
    .getByRole("link", { name: "Open Collection Explorer", exact: true })
    .click();
  await expect(page).toHaveURL(/\/fancy-research-tools\/photographs\/$/);
  await expect(page.getByRole("main")).toBeVisible();
  await page.reload();
  await expect(page.getByRole("main")).toBeVisible();
  await page.goto("/fancy-research-tools/tool/");
  await expect(page.getByRole("main")).toBeVisible();
  await page.goto("/fancy-research-tools/photographs/#view=photograph&record=1984.24");
  await expect(page.locator(".viewer-canvas")).toHaveAttribute("data-ready", "true");
  await expect(page.getByRole("link", { name: "Open image", exact: true })).toHaveAttribute(
    "href",
    /\/fancy-research-tools\/assets\/[^/]+\.jpg$/,
  );
  await page.reload();
  await expect(page.locator(".viewer-canvas")).toHaveAttribute("data-ready", "true");
});

test("gallery previews, tool entry and return work at narrow width", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/tools/");
  const destinations = await page
    .locator(".open-tool")
    .evaluateAll((links) => links.map((link) => (link as HTMLAnchorElement).href));
  expect(destinations).toHaveLength(5);
  await expect(page.locator(".open-tool").first()).toHaveText("Open Collection Explorer");
  for (const id of [
    "explore-collections",
    "capture-and-encode",
    "analyse-correspondence",
    "review-and-correct",
    "build-an-edition",
  ])
    await expect(page.locator(`section[aria-labelledby="${id}"] .open-tool`)).toHaveCount(1);
  for (const id of [
    "reference-tool",
    "explore-and-compare",
    "transcribe-and-annotate",
    "edit-texts-and-metadata",
    "external-tools",
  ])
    await expect(page.locator(`[id="${id}"]`)).toHaveCount(1);
  await expect(page.getByRole("heading", { name: "Workflow studies" })).toHaveCount(0);
  await expect(page.getByRole("navigation", { name: "Research tasks" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Alternative instrument interfaces" }),
  ).toHaveCount(0);
  await expect(page.getByRole("link", { name: /Open repository template/ })).toHaveAttribute(
    "href",
    "https://github.com/DigitalHumanitiesCraft/agentic-edition-pipeline",
  );
  for (const preview of await page.locator(".tool-entry img").all()) {
    await preview.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        preview.evaluate(
          (image) =>
            (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0,
        ),
      )
      .toBe(true);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("gallery-narrow.png"), fullPage: true });
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.getByRole("link", { name: "Open Collection Explorer", exact: true }).click();
  await expect(page.getByRole("main")).toBeVisible();
  await page.getByRole("link", { name: "All tools", exact: true }).click();
  await expect(page).toHaveURL(/\/tools\/$/);
  for (const name of [
    "Work through the SZD example",
    "Set up the correction example",
    "Work through the SZD edition example",
  ]) {
    await page.goto("/tools/");
    await page.getByRole("link", { name, exact: true }).click();
    await expect(page.getByRole("main")).toBeVisible();
    const fragment = new URL(page.url()).hash;
    await expect(page.locator(fragment)).toBeVisible();
  }
});

test("narrow reference tables retain readable columns and keyboard scrolling", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/reference/design.html");
  const table = page.getByRole("region", {
    name: "Table: Surface, Primary content, Supporting content",
  });
  await expect(table).toBeVisible();
  expect(
    await table
      .locator("th")
      .first()
      .evaluate((node) => node.getBoundingClientRect().width),
  ).toBeGreaterThanOrEqual(160);
  expect(await table.evaluate((node) => node.scrollWidth > node.clientWidth)).toBe(true);
  await table.focus();
  await page.keyboard.press("ArrowRight");
  await expect.poll(() => table.evaluate((node) => node.scrollLeft)).toBeGreaterThan(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

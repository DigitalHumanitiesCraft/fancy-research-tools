import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

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
    .getByRole("link", { name: "Compare catalogue records", exact: true })
    .click();
  await expect(page).toHaveURL(/\/fancy-research-tools\/pilot\/$/);
  await expect(page.getByRole("main")).toBeVisible();
  await page.reload();
  await expect(page.getByRole("main")).toBeVisible();
  await page.goto("/fancy-research-tools/");
  await page.getByRole("link", { name: "Open the tool gallery" }).click();
  await page
    .getByRole("main")
    .getByRole("link", { name: "Edit letter metadata", exact: true })
    .click();
  await expect(page).toHaveURL(/\/fancy-research-tools\/tool\/$/);
  await expect(page.getByRole("main")).toBeVisible();
});

test("gallery previews, tool entry and return work at narrow width", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/tools/");
  const destinations = await page
    .locator(".open-tool")
    .evaluateAll((links) => links.map((link) => (link as HTMLAnchorElement).href));
  expect(destinations).toHaveLength(8);
  const localDestinations = destinations.filter(
    (href) => new URL(href).origin === "http://127.0.0.1:4173",
  );
  expect(localDestinations).toHaveLength(3);
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
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  for (const destination of localDestinations) {
    await page.goto(destination);
    await expect(page.getByRole("main")).toBeVisible();
    await page.getByRole("link", { name: "All tools", exact: true }).click();
    await expect(page).toHaveURL(/\/tools\/$/);
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

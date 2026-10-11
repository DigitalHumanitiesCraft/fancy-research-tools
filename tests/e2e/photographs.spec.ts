import { readFile } from "node:fs/promises";
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("photographs retain query, qualified evidence and comparison across views and export", async ({
  page,
}, testInfo) => {
  await page.goto("/photographs/");
  const guide = page.getByRole("link", { name: "Research guide", exact: true });
  const guideUrl = await guide.getAttribute("href");
  expect(guideUrl).toBe("../guides/research.html");
  const guideResponse = await page.request.get(new URL(guideUrl ?? "", page.url()).href);
  expect(guideResponse.status()).toBe(200);
  expect(await guideResponse.text()).toContain("Research basis");
  await expect(page.getByRole("heading", { name: "Collection", exact: true })).toBeAttached();
  await page.getByRole("searchbox", { name: "Search photographs" }).fill("Yosemite");
  await expect(page.getByRole("status")).toHaveText("2 matching photographs");
  await expect(page.locator("article")).toHaveCount(2);
  await expect(page.locator("article").filter({ hasText: "Yosemite Falls" })).toContainText(
    "attributed to Eadweard J. Muybridge",
  );
  await page
    .getByRole("button", { name: "Add Bridal Veil, Yosemite to comparison", exact: true })
    .click();
  await page.getByRole("link", { name: "Timeline", exact: true }).click();
  await expect(page.getByRole("searchbox", { name: "Search photographs" })).toHaveValue("Yosemite");
  await expect(page.locator(".timeline-entry")).toHaveCount(2);
  expect(
    await page
      .locator(".timeline-entry .photo-picture img")
      .first()
      .evaluate((image) => image.getBoundingClientRect().height),
  ).toBeLessThanOrEqual(128);
  await page
    .getByRole("link", { name: "Inspect Bridal Veil, Yosemite, 1865–66", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Bridal Veil, Yosemite", exact: true }),
  ).toBeVisible();
  await expect(page.locator("dl")).toContainText("1865–66");
  await expect(page.locator(".viewer-canvas")).toHaveAttribute("data-ready", "true");
  await page.getByRole("link", { name: "← Timeline", exact: true }).click();
  await expect(page.locator(".timeline-entry")).toHaveCount(2);
  await page.getByRole("button", { name: "Add Yosemite Falls to comparison", exact: true }).click();
  await page.getByRole("searchbox", { name: "Search photographs" }).fill("no such photograph");
  await expect(
    page.getByRole("heading", { name: "No photographs match these filters" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Comparison", exact: true }).click();
  await expect(page.locator(".comparison thead th")).toHaveCount(3);
  await page.reload();
  await expect(page.locator(".comparison")).toContainText("attributed to Eadweard J. Muybridge");
  const pending = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export selection", exact: true }).click();
  const download = await pending;
  const target = testInfo.outputPath("photograph-selection.json");
  await download.saveAs(target);
  const exported = JSON.parse(await readFile(target, "utf8"));
  expect(exported.selected.map((r: { title: string }) => r.title)).toEqual([
    "Bridal Veil, Yosemite",
    "Yosemite Falls",
  ]);
  expect(exported.selected[0].date.label).toBe("1865–66");
  expect(exported.selected[1].source.fields.creators[0].qualifier).toBe("attributed to");
  expect(exported.derivation.script).toBe("scripts/import-photographs.mjs");
  await page.screenshot({ path: testInfo.outputPath("comparison.png"), fullPage: true });
});

test("skip navigation and comparison changes preserve route and keyboard context", async ({
  page,
}) => {
  await page.goto("/photographs/#view=timeline&q=Yosemite&selected=1992.12");
  const route = page.url();
  await page.getByRole("link", { name: "Skip to photographs" }).focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(route);
  await expect(page.getByRole("main")).toBeFocused();
  await page.getByRole("button", { name: "Clear filters", exact: true }).click();
  await expect(page.getByRole("searchbox", { name: "Search photographs" })).toBeFocused();
  await expect(page.locator(".timeline-entry")).toHaveCount(40);
  await page.getByRole("searchbox", { name: "Search photographs" }).fill("Yosemite");
  const row = page.locator("article").filter({ hasText: "Yosemite Falls" });
  await row.getByRole("button", { name: "Add Yosemite Falls to comparison" }).focus();
  await page.keyboard.press("Enter");
  await expect(
    row.getByRole("button", { name: "Remove Yosemite Falls from comparison" }),
  ).toBeFocused();
  await page.getByRole("link", { name: "Comparison", exact: true }).click();
  await page.getByRole("button", { name: "Remove Bridal Veil, Yosemite from comparison" }).focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("button", { name: "Remove Yosemite Falls from comparison" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { name: "Comparison", exact: true })).toBeFocused();
  await page.goto(
    "/photographs/#view=photograph&from=comparison&record=1992.12&selected=1992.12,1974.47",
  );
  await expect(
    page.getByRole("link", { name: /^Next in comparison: Yosemite Falls/ }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Remove Yosemite Falls from comparison" }).click();
  await expect(page.getByRole("link", { name: /^Next in comparison:/ })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Bridal Veil, Yosemite" })).toBeVisible();
});

test("image supports keyboard zoom, pointer pan and native image fallback without external requests", async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const external: string[] = [];
  page.on("request", (request) => {
    if (!request.url().startsWith("http://127.0.0.1:") && !request.url().startsWith("data:"))
      external.push(request.url());
  });
  await page.goto("/photographs/#view=photograph&record=1984.24");
  const viewer = page.locator(".viewer-canvas");
  await expect(viewer).toHaveAttribute("data-ready", "true");
  await expect(page.locator("dl")).toContainText("c. 1865");
  await expect(page.locator("dl")).not.toContainText("1860–1870");
  await viewer.focus();
  const initialZoom = await viewer.getAttribute("data-zoom");
  await page.keyboard.press("+");
  await expect(viewer).not.toHaveAttribute("data-zoom", initialZoom ?? "");
  await page.getByRole("button", { name: "Zoom in", exact: true }).click();
  const bounds = await viewer.boundingBox();
  if (!bounds) throw new Error("Missing image surface");
  const center = await viewer.getAttribute("data-center");
  await page.mouse.move(bounds.x + bounds.width * 0.6, bounds.y + bounds.height * 0.5);
  await page.mouse.down();
  await page.mouse.move(bounds.x + bounds.width * 0.35, bounds.y + bounds.height * 0.6, {
    steps: 12,
  });
  await page.mouse.up();
  await expect(viewer).not.toHaveAttribute("data-center", center ?? "");
  // Retaining evidence for comparison must not discard the area currently being inspected.
  const inspectedZoom = await viewer.getAttribute("data-zoom");
  const inspectedCenter = await viewer.getAttribute("data-center");
  await page.getByRole("button", { name: "Add Rue de la Ferronnerie to comparison" }).click();
  await expect(
    page.getByRole("button", { name: "Remove Rue de la Ferronnerie from comparison" }),
  ).toHaveCount(1);
  await expect(viewer).toHaveAttribute("data-ready", "true");
  await expect(viewer).toHaveAttribute("data-zoom", inspectedZoom ?? "");
  await expect(viewer).toHaveAttribute("data-center", inspectedCenter ?? "");
  await expect(page.getByRole("link", { name: "Open image", exact: true })).toHaveAttribute(
    "href",
    /\.jpg$/,
  );
  expect(external).toEqual([]);
  await page.screenshot({ path: testInfo.outputPath("image-pan.png"), fullPage: true });
});

test("narrow chronological and image views reflow and expose direct evidence access", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 320, height: 780 });
  await page.goto("/photographs/#view=timeline&q=1865");
  await expect(page.locator(".timeline-entry")).not.toHaveCount(0);
  const firstEntry = page.locator(".timeline-entry").first();
  const date = await firstEntry.locator(".photo-date").boundingBox();
  const mark = await firstEntry.locator(".timeline-mark").boundingBox();
  if (!date || !mark) throw new Error("Missing visible date or timeline mark");
  expect(date.x + date.width).toBeLessThanOrEqual(mark.x + 1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.screenshot({ path: testInfo.outputPath("timeline-narrow.png"), fullPage: true });
  await page
    .getByRole("link", { name: "Inspect Rue de la Ferronnerie, c. 1865", exact: true })
    .focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("heading", { name: "Rue de la Ferronnerie", exact: true }),
  ).toBeFocused();
  await expect(page.locator("dl")).toContainText("c. 1865");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.screenshot({ path: testInfo.outputPath("photograph-narrow.png"), fullPage: true });
});

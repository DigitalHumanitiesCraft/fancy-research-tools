import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";

test("a downloaded photograph selection reopens and rejects changed or cancelled replacements", async ({
  page,
}) => {
  await page.goto("/photographs/#view=comparison&q=Yosemite&sort=title&selected=1974.47,1992.12");
  const downloaded = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export selection" }).click();
  const file = await (await downloaded).path();
  if (!file) throw new Error("No actual selection download");
  const bytes = await readFile(file, "utf8");
  await page.goto("/photographs/");
  await page.getByLabel("Open photograph selection").setInputFiles(file);
  await expect(page.getByRole("heading", { name: "Comparison", exact: true })).toBeVisible();
  expect(await page.locator("table thead th").allTextContents()).toEqual([
    "Photograph",
    "Yosemite Falls",
    "Bridal Veil, Yosemite",
  ]);
  await expect(page.locator("table")).toContainText("attributed to Eadweard");
  await page.getByRole("link", { name: "Collection", exact: true }).click();
  await expect(page.getByRole("searchbox")).toHaveValue("Yosemite");
  await expect(page.getByLabel("Order by")).toHaveValue("title");
  const modified = JSON.parse(bytes);
  modified.selected[0].date.label = "invented";
  await page.getByLabel("Open photograph selection").setInputFiles({
    name: "changed.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(modified)),
  });
  await expect(page.locator("#selection-status")).toContainText("differs");
  await expect(page.getByRole("searchbox")).toHaveValue("Yosemite");
  page.once("dialog", (dialog) => dialog.dismiss());
  await page.getByLabel("Open photograph selection").setInputFiles(file);
  await expect(page.locator("#selection-status")).toContainText("cancelled");
  await expect(page.getByRole("searchbox")).toHaveValue("Yosemite");
});

test("a delayed photograph read cannot overwrite a later search", async ({ page }) => {
  await page.goto("/photographs/#view=comparison&selected=1992.12");
  const downloaded = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export selection" }).click();
  const file = await (await downloaded).path();
  if (!file) throw new Error("Missing download");
  await page.goto("/photographs/");
  await page.evaluate(() => {
    const read = File.prototype.text;
    File.prototype.text = async function () {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return read.call(this);
    };
  });
  await page.getByLabel("Open photograph selection").setInputFiles(file);
  await page.getByRole("searchbox").fill("Ferronnerie");
  await expect(page.locator("#selection-status")).toContainText("work changed");
  await expect(page.getByRole("searchbox")).toHaveValue("Ferronnerie");
  await expect(page.locator("article")).toHaveCount(1);
});

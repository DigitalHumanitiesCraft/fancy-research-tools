import { readFile } from "node:fs/promises";
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const question =
  "How do date, process and attribution differ between the two Yosemite photographs?";
const statement =
  "Bridal Veil is catalogued as 1865–66 and Yosemite Falls as 1868; the latter attribution is qualified.";
const reasoning =
  "The retained catalogue fields name albumen print from wet collodion negative for Bridal Veil and albumen print for Yosemite Falls, whose creator is explicitly attributed to Muybridge. This does not verify authorship or infer exposure dates.";

test("a photograph question reaches a sourced statement, actual download and fresh reopening", async ({
  page,
  browser,
}, info) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/photographs/#view=comparison&q=Yosemite&selected=1992.12,1974.47");
  await page.screenshot({ path: info.outputPath("comparison-entry.png"), fullPage: true });
  await expect(page.getByLabel("Research question", { exact: true })).toBeVisible({
    timeout: 3000,
  });
  await page.getByLabel("Research question", { exact: true }).fill(question);
  await page.getByRole("link", { name: "Bridal Veil, Yosemite", exact: true }).click();
  await expect(page.locator("dl")).toContainText("1865–66");
  await page.getByRole("link", { name: "← Comparison", exact: true }).click();
  await expect(page.getByLabel("Research question", { exact: true })).toHaveValue(question);
  await page.getByLabel("Your statement", { exact: true }).fill(statement);
  await page.getByLabel("Your reasoning", { exact: true }).fill(reasoning);
  await page
    .getByLabel("Unresolved question", { exact: true })
    .fill("Which independent evidence could test the attribution?");
  await page.getByLabel("Author kind", { exact: true }).selectOption("agent");
  await page.getByLabel("Author name", { exact: true }).fill("Agent walkthrough");
  const pending = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export research", exact: true }).click();
  const path = info.outputPath("photograph-investigation.json");
  await (await pending).saveAs(path);
  const packet = JSON.parse(await readFile(path, "utf8"));
  expect(packet.research).toMatchObject({
    question,
    statement,
    reasoning,
    author: { kind: "agent", name: "Agent walkthrough" },
  });
  expect(packet.selection.selected.map((item: { accession: string }) => item.accession)).toEqual([
    "1992.12",
    "1974.47",
  ]);
  expect(packet.selection.selected[1].creators[0].qualifier).toBe("attributed to");
  const fresh = await browser.newContext();
  const reopened = await fresh.newPage();
  await reopened.goto("/photographs/");
  await reopened.getByLabel("Open photograph selection").setInputFiles(path);
  await expect(reopened.getByLabel("Research question", { exact: true })).toHaveValue(question);
  await expect(reopened.getByLabel("Your statement", { exact: true })).toHaveValue(statement);
  await expect(reopened.getByLabel("Your reasoning", { exact: true })).toHaveValue(reasoning);
  await expect(reopened.locator("table")).toContainText("attributed to");
  const again = reopened.waitForEvent("download");
  await reopened.getByRole("button", { name: "Export research", exact: true }).click();
  const secondPath = info.outputPath("photograph-investigation-reopened.json");
  await (await again).saveAs(secondPath);
  expect(JSON.parse(await readFile(secondPath, "utf8"))).toEqual(packet);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: info.outputPath("research-wide.png"), fullPage: true });
  await page.setViewportSize({ width: 320, height: 800 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: info.outputPath("research-narrow.png"), fullPage: true });
  await fresh.close();
});

test("research notes survive rejected, cancelled and stale imports, including exact imported line endings", async ({
  page,
}, info) => {
  await page.goto("/photographs/#view=comparison&selected=1992.12,1974.47");
  const question = page.getByLabel("Research question", { exact: true });
  await question.fill("Keep this unfinished question");
  const pending = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export research", exact: true }).click();
  const file = info.outputPath("recovery.json");
  await (await pending).saveAs(file);
  const packet = JSON.parse(await readFile(file, "utf8"));
  const changed = structuredClone(packet);
  changed.selection.selected[0].date.label = "invented";
  const input = page.getByLabel("Open photograph selection");
  await input.setInputFiles({
    name: "changed.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(changed)),
  });
  await expect(page.locator("#selection-status")).toContainText("differs");
  await expect(question).toHaveValue("Keep this unfinished question");
  page.once("dialog", (dialog) => dialog.dismiss());
  await input.setInputFiles(file);
  await expect(page.locator("#selection-status")).toContainText("cancelled");
  await expect(question).toHaveValue("Keep this unfinished question");
  await page.evaluate(() => {
    const read = File.prototype.text;
    File.prototype.text = async function () {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return read.call(this);
    };
  });
  await input.setInputFiles(file);
  await question.fill("Later work wins");
  await expect(page.locator("#selection-status")).toContainText("work changed");
  await expect(question).toHaveValue("Later work wins");
  packet.research.statement = "Imported\r\nline endings";
  page.once("dialog", (dialog) => dialog.accept());
  await input.setInputFiles({
    name: "exact.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(packet)),
  });
  await expect(page.locator("#selection-status")).toContainText("Research notes restored");
  await page.getByLabel("Author name", { exact: true }).fill("Changed author only");
  const again = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export research", exact: true }).click();
  const exact = info.outputPath("exact-reexport.json");
  await (await again).saveAs(exact);
  expect(JSON.parse(await readFile(exact, "utf8")).research.statement).toBe(
    "Imported\r\nline endings",
  );
  page.once("dialog", (dialog) => dialog.accept());
  await input.setInputFiles({
    name: "legacy.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(packet.selection)),
  });
  await expect(page.locator("#selection-status")).toContainText("no research notes");
  await expect(question).toHaveValue("");
});

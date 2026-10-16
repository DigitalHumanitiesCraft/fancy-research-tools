import { readFile } from "node:fs/promises";
import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";
import letterSources from "../../data/hsa-letter/sources.json" with { type: "json" };
import forecastSources from "../../data/nhc-milton/sources.json" with { type: "json" };
import correspondence from "../../data/schoenbach/collection.json" with { type: "json" };

async function exported(page: Page, name: string) {
  const pending = page.waitForEvent("download");
  await page.getByRole("button", { name, exact: true }).click();
  const path = await (await pending).path();
  if (!path) throw new Error("Missing downloaded output");
  return JSON.parse(await readFile(path, "utf8"));
}

async function delayCollectionRead(page: Page) {
  await page.evaluate(() => {
    const original = File.prototype.text;
    let release: () => void = () => {};
    const ready = new Promise<void>((resolve) => {
      release = resolve;
    });
    Object.assign(window, { releaseCollectionRead: release });
    File.prototype.text = async function () {
      const bytes = await original.call(this);
      if (this.name.startsWith("slow-")) await ready;
      return bytes;
    };
  });
}
async function releaseCollectionRead(page: Page) {
  await page.evaluate(() =>
    (window as unknown as { releaseCollectionRead: () => void }).releaseCollectionRead(),
  );
}

for (const save of [false, true]) {
  test(`collection import preserves intervening ${save ? "saved changes" : "unfinished input"}`, async ({
    page,
  }) => {
    await page.goto("/tool/");
    await delayCollectionRead(page);
    await page.locator("#import-file").setInputFiles({
      name: "slow-source.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify(correspondence)),
    });
    await page.getByRole("button", { name: "Edit record", exact: true }).click();
    const title = `${correspondence.records[0]?.title} (working correction)`;
    await page.getByLabel("Title", { exact: true }).fill(title);
    if (save) await page.getByRole("button", { name: "Save record", exact: true }).click();
    await releaseCollectionRead(page);
    await expect(page.locator("#error")).toContainText("changed while the file was loading");
    if (!save) {
      await expect(page.getByLabel("Title", { exact: true })).toHaveValue(title);
      await page.getByRole("button", { name: "Save record", exact: true }).click();
    }
    const expected = structuredClone(correspondence);
    const first = expected.records[0];
    if (!first) throw new Error("Missing real correspondence fixture");
    first.title = title;
    expect(await exported(page, "Export collection")).toEqual(expected);
  });
}

test("a later collection import cannot be replaced by an older pending read", async ({ page }) => {
  await page.goto("/tool/");
  await delayCollectionRead(page);
  await page.locator("#import-file").setInputFiles({
    name: "slow-earlier.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(correspondence)),
  });
  const latest = { ...correspondence, title: `${correspondence.title} (latest import)` };
  page.once("dialog", (dialog) => dialog.accept());
  await page.locator("#import-file").setInputFiles({
    name: "latest.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(latest)),
  });
  await expect(page.locator("#collection-title")).toHaveText(latest.title);
  await releaseCollectionRead(page);
  await page.evaluate(() => new Promise(requestAnimationFrame));
  await expect(page.locator("#error")).toBeHidden();
  await expect(page.locator("#provenance")).toHaveText("Imported from latest.json.");
  expect(await exported(page, "Export collection")).toEqual(latest);
});

const cases = [
  {
    route: "/annotations/",
    caseId: "nhc-milton-2024",
    sources: forecastSources,
    category: "observation",
    otherCategory: "forecast",
    quote: "Scatterometer data around midday confirmed",
  },
  {
    route: "/letters/",
    caseId: "hsa-benndorf-1879",
    sources: letterSources,
    category: "person",
    otherCategory: "place",
    quote: "Ich kenne E. Hübner fast gar nicht",
  },
];
for (const fixture of cases) {
  const source = fixture.sources[0];
  if (!source) throw new Error("Missing source fixture");
  const start = source.text.indexOf(fixture.quote);
  if (start < 0) throw new Error("Missing exact fixture quotation");
  const annotation = {
    id: "anchor-kept",
    sourceId: source.id,
    start,
    end: start + fixture.quote.length,
    quote: fixture.quote,
    category: fixture.category,
    note: "  Retained\r\ninterpretation  ",
    creator: { kind: "unknown", name: "" },
    review: {
      reviewer: { kind: "human", name: "Test reviewer" },
      criterion: "Exact source fit",
      result: "supports",
    },
  };
  const notebook = {
    schemaVersion: 1,
    caseId: fixture.caseId,
    sources: fixture.sources,
    researchQuestion: "What does this passage support?",
    annotations: [annotation],
  };
  async function open(page: Page, value: unknown = notebook) {
    await page.goto(fixture.route);
    page.once("dialog", (dialog) => dialog.accept());
    await page.getByLabel("Open notebook").setInputFiles({
      name: "retained-notebook.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify(value)),
    });
    await expect(page.locator("#notebook-status")).toHaveText("Saved locally");
  }
  test(`${fixture.route} revises an exact quotation without replacing identity or author text`, async ({
    page,
  }) => {
    await open(page);
    await page.getByRole("button", { name: "Edit", exact: true }).click();
    const sourceControl = page.locator("#bulletin-text");
    await sourceControl.focus();
    await sourceControl.evaluate((node, offset) => {
      (node as HTMLTextAreaElement).setSelectionRange(offset, offset);
    }, start);
    await page
      .getByRole("button", { name: "Use selection for this annotation", exact: true })
      .click();
    await expect(page.locator("#quotation")).toHaveText(fixture.quote);
    await expect(page.getByLabel("Record a source-fit review", { exact: true })).toBeChecked();
    const replacement = fixture.quote.slice(0, -5);
    await sourceControl.focus();
    await page.keyboard.down("Shift");
    for (let index = 0; index < replacement.length; index++)
      await page.keyboard.press("ArrowRight");
    await page.keyboard.up("Shift");
    await page
      .getByRole("button", { name: "Use selection for this annotation", exact: true })
      .click();
    await expect(page.locator("#quotation")).toHaveText(replacement);
    await expect(page.getByLabel("Record a source-fit review", { exact: true })).not.toBeChecked();
    await page.getByRole("button", { name: "Save annotation", exact: true }).click();
    const result = await exported(page, "Export notebook");
    expect(result.annotations).toEqual([
      { ...annotation, end: start + replacement.length, quote: replacement, review: null },
    ]);
    expect(result.sources).toEqual(fixture.sources);
    await page.reload();
    expect(await exported(page, "Export notebook")).toEqual(result);
  });
  test(`${fixture.route} filters saved annotations while exporting the complete notebook`, async ({
    page,
  }, info) => {
    const alternativeSource = fixture.sources[1] ?? source;
    const second = {
      ...annotation,
      id: "second-anchor",
      sourceId: alternativeSource.id,
      start: 0,
      end: 30,
      quote: alternativeSource.text.slice(0, 30),
      category: fixture.otherCategory,
      review: null,
    };
    const complete = { ...notebook, annotations: [annotation, second] };
    await open(page, complete);
    await page.getByLabel("Annotation category", { exact: true }).selectOption(fixture.category);
    await expect(page.locator("#annotations li")).toHaveCount(1);
    await expect(page.locator("#annotation-filter-status")).toContainText(
      "Export includes all 2 saved annotations",
    );
    expect(await exported(page, "Export notebook")).toEqual(complete);
    if (fixture.sources.length > 1) {
      await page
        .getByLabel("Annotation source", { exact: true })
        .selectOption(alternativeSource.id);
      await expect(page.locator("#annotations li")).toHaveCount(0);
      await expect(page.locator("#empty-notebook")).toHaveText(
        "No annotations match these filters.",
      );
      expect(await exported(page, "Export notebook")).toEqual(complete);
    } else await expect(page.locator("#annotation-source")).toBeHidden();
    await page.getByRole("button", { name: "Clear annotation filters", exact: true }).click();
    await expect(page.locator("#annotations li")).toHaveCount(2);
    await page.setViewportSize({ width: 320, height: 850 });
    await page.getByLabel("Annotation category", { exact: true }).scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await page.screenshot({
      path: info.outputPath("annotation-filters-narrow.png"),
      fullPage: true,
    });
  });
  test(`${fixture.route} preserves review on an unchanged anchor and clears each changed anchor`, async ({
    page,
  }) => {
    await open(page);
    await page.getByRole("button", { name: "Edit", exact: true }).click();
    const sourceControl = page.locator("#bulletin-text");
    async function useRange(length: number) {
      await sourceControl.evaluate(
        (node, range) => {
          (node as HTMLTextAreaElement).setSelectionRange(range.start, range.start + range.length);
        },
        { start, length },
      );
      await page
        .getByRole("button", { name: "Use selection for this annotation", exact: true })
        .click();
    }
    await useRange(fixture.quote.length);
    await expect(page.getByLabel("Record a source-fit review", { exact: true })).toBeChecked();
    await useRange(fixture.quote.length - 5);
    await expect(page.getByLabel("Record a source-fit review", { exact: true })).not.toBeChecked();
    await page.getByLabel("Record a source-fit review", { exact: true }).check();
    await page.getByLabel("Reviewer name", { exact: true }).fill("New test reviewer");
    await page
      .getByLabel("Review criterion", { exact: true })
      .fill("Review of the shorter quotation");
    await useRange(fixture.quote.length - 5);
    await expect(page.getByLabel("Record a source-fit review", { exact: true })).toBeChecked();
    await useRange(fixture.quote.length - 10);
    await expect(page.getByLabel("Record a source-fit review", { exact: true })).not.toBeChecked();
    await page.getByRole("button", { name: "Cancel", exact: true }).click();
    expect(await exported(page, "Export notebook")).toEqual(notebook);
  });
}

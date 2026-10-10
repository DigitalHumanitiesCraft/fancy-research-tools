import { readFile } from "node:fs/promises";
import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, type TestInfo, test } from "@playwright/test";
import sources from "../../data/nhc-milton/sources.json" with { type: "json" };

const first = sources[0];
const second = sources[1];
if (!first || !second) throw new Error("Missing annotation source fixtures.");
const storageKey = "frt.notebook./annotations/.nhc-milton.v1";

async function selectPassage(page: Page, passage = "Scatterometer data around midday confirmed") {
  const source = page.getByLabel("Original bulletin text", { exact: true });
  await source.focus();
  await source.evaluate((node, quote) => {
    const textarea = node as HTMLTextAreaElement;
    const start = textarea.value.indexOf(quote);
    if (start < 0) throw new Error("Passage not found");
    textarea.setSelectionRange(start, start);
  }, passage);
  // The keyboard extends the native selection; Annotate must retain it after focus changes.
  await page.keyboard.down("Shift");
  for (let index = 0; index < passage.length; index++) await page.keyboard.press("ArrowRight");
  await page.keyboard.up("Shift");
  await page.getByRole("button", { name: "Annotate selection", exact: true }).click();
  await expect(page.locator("#quotation")).toHaveText(passage);
}
async function exportNotebook(page: Page, info: TestInfo, name: string) {
  const pending = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export notebook", exact: true }).click();
  const path = info.outputPath(name);
  await (await pending).saveAs(path);
  return { path, value: JSON.parse(await readFile(path, "utf8")) };
}

test("archived passage annotation preserves exact source and reopens its actual download", async ({
  page,
  browser,
}, info) => {
  await page.goto("/annotations/");
  await expect(page.getByRole("heading", { name: "Annotate forecast discussions" })).toBeVisible();
  await expect(page.getByLabel("Original bulletin text", { exact: true })).toHaveValue(first.text);
  await expect(page.locator("#forecaster")).toHaveText("Brown");
  await page
    .getByLabel("Research question", { exact: true })
    .fill("How does the bulletin distinguish observation from prediction?");
  await selectPassage(page);
  await page
    .getByLabel("Interpretation", { exact: true })
    .fill("This passage names an observation instrument as evidence.");
  await page.getByLabel("Creator kind", { exact: true }).selectOption("human");
  await page.getByLabel("Creator name", { exact: true }).fill("Test researcher");
  await page.getByRole("button", { name: "Save annotation", exact: true }).click();
  const annotation = page.locator("#annotations li");
  await expect(annotation).toHaveCount(1);
  await annotation.getByRole("button", { name: "Return to quotation" }).click();
  const selection = await page.locator("#bulletin-text").evaluate((node) => {
    const control = node as HTMLTextAreaElement;
    return {
      start: control.selectionStart,
      end: control.selectionEnd,
      quote: control.value.slice(control.selectionStart, control.selectionEnd),
    };
  });
  const saved = await exportNotebook(page, info, "annotation-notebook.json");
  expect(saved.value.sources).toEqual(sources);
  expect(saved.value.annotations[0]).toMatchObject({
    ...selection,
    sourceId: first.id,
    creator: { kind: "human", name: "Test researcher" },
    review: null,
  });
  expect(first.text.slice(selection.start, selection.end)).toBe(selection.quote);
  await page.reload();
  await expect(page.locator("#annotations li")).toHaveCount(1);
  const context = await browser.newContext();
  const reopened = await context.newPage();
  await reopened.goto("/annotations/");
  reopened.once("dialog", (dialog) => dialog.accept());
  await reopened.getByLabel("Open notebook").setInputFiles(saved.path);
  await expect(reopened.locator("#notebook-status")).toHaveText("Saved locally");
  expect((await exportNotebook(reopened, info, "reopened-notebook.json")).value).toEqual(
    saved.value,
  );
  await context.close();
});

test("a changed interpretation clears its earlier explicit review", async ({ page }, info) => {
  await page.goto("/annotations/");
  await selectPassage(page);
  await page
    .getByLabel("Interpretation", { exact: true })
    .fill("The passage identifies a measured observation.");
  await page.getByLabel("Record a source-fit review", { exact: true }).check();
  await page.getByLabel("Reviewer kind", { exact: true }).selectOption("human");
  await page.getByLabel("Reviewer name", { exact: true }).fill("Test reviewer");
  await page
    .getByLabel("Review criterion", { exact: true })
    .fill("The quotation explicitly names measured source data.");
  await page
    .getByLabel("Does the quotation support this interpretation?", { exact: true })
    .selectOption("supports");
  await page.getByRole("button", { name: "Save annotation", exact: true }).click();
  await expect(page.locator("#annotations li")).toContainText("Source-fit review: Supports");
  const reviewed = await exportNotebook(page, info, "reviewed.json");
  expect(reviewed.value.annotations[0].review.reviewer.name).toBe("Test reviewer");
  await page.getByRole("button", { name: "Edit", exact: true }).click();
  await page.getByLabel("Category", { exact: true }).selectOption("observation");
  await expect(page.getByLabel("Record a source-fit review", { exact: true })).toBeChecked();
  await page
    .getByLabel("Interpretation", { exact: true })
    .fill("A changed interpretation requires another review.");
  await expect(page.locator("#review-change")).toContainText("previous review is cleared");
  await expect(page.getByLabel("Record a source-fit review", { exact: true })).not.toBeChecked();
  await page.getByRole("button", { name: "Save annotation", exact: true }).click();
  expect(
    (await exportNotebook(page, info, "review-cleared.json")).value.annotations[0].review,
  ).toBeNull();
});

test("reverting unsaved content retains the final deliberate review choice", async ({
  page,
}, info) => {
  const quote = "Scatterometer data around midday confirmed";
  const start = first.text.indexOf(quote);
  const reviewed = {
    schemaVersion: 1,
    caseId: "nhc-milton-2024",
    sources,
    researchQuestion: "Which words name observed evidence?",
    annotations: [
      {
        id: "review-undo",
        sourceId: first.id,
        start,
        end: start + quote.length,
        quote,
        category: "observation",
        note: "The passage names an observation instrument.",
        creator: { kind: "unknown", name: "" },
        review: {
          reviewer: { kind: "human", name: "Test reviewer" },
          criterion: " Named\r\nsource evidence ",
          result: "supports",
        },
      },
    ],
  };
  await page.goto("/annotations/");
  for (const choice of ["retain", "remove", "replace"] as const) {
    page.once("dialog", (dialog) => dialog.accept());
    await page.getByLabel("Open notebook").setInputFiles({
      name: "reviewed.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify(reviewed)),
    });
    await expect(page.locator("#notebook-status")).toHaveText("Saved locally");
    await page.getByRole("button", { name: "Edit", exact: true }).click();
    if (choice === "remove")
      await page.getByLabel("Record a source-fit review", { exact: true }).uncheck();
    if (choice === "replace")
      await page.getByLabel("Reviewer name", { exact: true }).fill("Replacement reviewer");
    await page.getByLabel("Interpretation", { exact: true }).fill("An unsaved temporary change");
    await expect(page.getByLabel("Record a source-fit review", { exact: true })).not.toBeChecked();
    await page
      .getByLabel("Interpretation", { exact: true })
      .fill(reviewed.annotations[0]?.note ?? "");
    await page.getByRole("button", { name: "Save annotation", exact: true }).click();
    const exported = (await exportNotebook(page, info, `review-undo-${choice}.json`)).value;
    const expected = structuredClone(reviewed);
    if (choice === "remove") {
      expect(exported.annotations[0].review).toBeNull();
      expect({ ...exported.annotations[0], review: expected.annotations[0]?.review }).toEqual(
        expected.annotations[0],
      );
    } else {
      if (choice === "replace" && expected.annotations[0])
        expected.annotations[0].review.reviewer.name = "Replacement reviewer";
      expect(exported).toEqual(expected);
    }
  }
});

test("pointer selection creates a quotation and removal requires an explicit decision", async ({
  page,
}, info) => {
  await page.goto("/annotations/");
  const source = page.getByLabel("Original bulletin text", { exact: true });
  await source.scrollIntoViewIfNeeded();
  const bounds = await source.boundingBox();
  if (!bounds) throw new Error("Missing source text");
  const geometry = await source.evaluate((node) => {
    const style = getComputedStyle(node);
    return {
      padding: Number.parseFloat(style.paddingTop),
      line: Number.parseFloat(style.lineHeight),
    };
  });
  // Select native source text using the pointer, retaining the browser's exact offsets.
  await page.mouse.move(bounds.x + 14, bounds.y + geometry.padding + geometry.line * 1.5);
  await page.mouse.down();
  await page.mouse.move(bounds.x + 145, bounds.y + geometry.padding + geometry.line * 1.5, {
    steps: 10,
  });
  await page.mouse.up();
  const selected = await source.evaluate((node) => {
    const textarea = node as HTMLTextAreaElement;
    return textarea.value.slice(textarea.selectionStart, textarea.selectionEnd);
  });
  expect(selected.length).toBeGreaterThan(0);
  await page.getByRole("button", { name: "Annotate selection", exact: true }).click();
  await expect(page.locator("#quotation")).toHaveText(selected);
  await page.getByRole("button", { name: "Save annotation", exact: true }).click();
  const saved = await exportNotebook(page, info, "pointer-selection.json");
  expect(saved.value.annotations[0].quote).toBe(selected);
  page.once("dialog", (dialog) => dialog.dismiss());
  await page.getByRole("button", { name: "Remove", exact: true }).click();
  await expect(page.locator("#annotations li")).toHaveCount(1);
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Remove", exact: true }).click();
  await expect(page.locator("#annotations li")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Saved annotations", exact: true })).toBeFocused();
});

test("work entered while an import is reading prevents replacement", async ({ page }, info) => {
  await page.goto("/annotations/");
  await page.getByLabel("Research question", { exact: true }).fill("Original question");
  const saved = await exportNotebook(page, info, "before-slow-import.json");
  await page.evaluate(() => {
    const original = File.prototype.text;
    let release: () => void = () => {};
    const ready = new Promise<void>((resolve) => {
      release = resolve;
    });
    Object.assign(window, { releaseNotebookRead: release });
    File.prototype.text = async function () {
      await ready;
      return original.call(this);
    };
  });
  await page.getByLabel("Open notebook").setInputFiles(saved.path);
  await page.getByLabel("Research question", { exact: true }).fill("Changed while reading");
  await page.evaluate(() =>
    (window as unknown as { releaseNotebookRead: () => void }).releaseNotebookRead(),
  );
  await expect(page.locator("#notebook-status")).toContainText(
    "changed while the file was loading",
  );
  expect((await exportNotebook(page, info, "after-slow-import.json")).value.researchQuestion).toBe(
    "Changed while reading",
  );
});

test("unfinished annotations survive declined source changes and block export or replacement", async ({
  page,
}, info) => {
  await page.goto("/annotations/");
  await page.getByLabel("Research question", { exact: true }).fill("Keep this notebook");
  const saved = await exportNotebook(page, info, "before-pending.json");
  await selectPassage(page);
  await page
    .getByLabel("Interpretation", { exact: true })
    .fill("Keep this unfinished interpretation");
  page.once("dialog", (dialog) => dialog.dismiss());
  await page.getByLabel("Bulletin", { exact: true }).selectOption(second.id);
  await expect(page.getByLabel("Bulletin", { exact: true })).toHaveValue(first.id);
  await expect(page.getByLabel("Interpretation", { exact: true })).toHaveValue(
    "Keep this unfinished interpretation",
  );
  await page.getByRole("button", { name: "Export notebook", exact: true }).click();
  await expect(page.locator("#notebook-status")).toContainText("Save or discard");
  await page.getByLabel("Open notebook").setInputFiles(saved.path);
  await expect(page.locator("#notebook-status")).toContainText("Save or discard");
  await expect(page.getByLabel("Interpretation", { exact: true })).toHaveValue(
    "Keep this unfinished interpretation",
  );
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await page.getByLabel("Bulletin", { exact: true }).selectOption(second.id);
  await expect(page).toHaveURL(new RegExp(second.id));
  await page.goBack();
  await expect(page.getByLabel("Bulletin", { exact: true })).toHaveValue(first.id);
  await expect(page.getByLabel("Original bulletin text", { exact: true })).toHaveValue(first.text);
});

test("rejected and cancelled imports preserve a valid notebook and accepted raw author strings", async ({
  page,
}, info) => {
  await page.goto("/annotations/");
  await selectPassage(page);
  await page.getByRole("button", { name: "Save annotation", exact: true }).click();
  const base = (await exportNotebook(page, info, "initial.json")).value;
  const payload = {
    ...base,
    researchQuestion: " First\r\nSecond ",
    annotations: [
      {
        ...base.annotations[0],
        note: " Note\r\nsecond ",
        creator: { kind: "unknown", name: " Unknown\r\nname " },
      },
    ],
  };
  const original = `${JSON.stringify(payload, null, 2)}\n`;
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByLabel("Open notebook").setInputFiles({
    name: "raw-author-text.json",
    mimeType: "application/json",
    buffer: Buffer.from(original),
  });
  await expect(page.locator("#notebook-status")).toHaveText("Saved locally");
  expect((await exportNotebook(page, info, "unmodified-author-text.json")).value).toEqual(payload);
  expect(await page.evaluate((key) => localStorage.getItem(key), storageKey)).toBe(original);
  const changedSource = structuredClone(payload);
  changedSource.sources[0].text += "changed";
  await page.getByLabel("Open notebook").setInputFiles({
    name: "changed-source.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(changedSource)),
  });
  await expect(page.locator("#notebook-status")).toContainText("Notebook not opened");
  expect((await exportNotebook(page, info, "after-rejected.json")).value).toEqual(payload);
  page.once("dialog", (dialog) => dialog.dismiss());
  await page.getByLabel("Open notebook").setInputFiles({
    name: "valid-replacement.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(base)),
  });
  expect((await exportNotebook(page, info, "after-cancelled.json")).value).toEqual(payload);
  await page.getByRole("button", { name: "Edit", exact: true }).click();
  await page.getByLabel("Category", { exact: true }).selectOption("uncertainty");
  await page.getByRole("button", { name: "Save annotation", exact: true }).click();
  expect((await exportNotebook(page, info, "category-only-edit.json")).value).toEqual({
    ...payload,
    annotations: [{ ...payload.annotations[0], category: "uncertainty" }],
  });
});

test("corrupt and externally changed saved copies remain recoverable without overwrite", async ({
  page,
  context,
}, info) => {
  await page.addInitScript(({ key }) => localStorage.setItem(key, ""), { key: storageKey });
  await page.goto("/annotations/");
  await expect(page.locator("#notebook-status")).toContainText("could not be opened");
  await page.getByLabel("Research question", { exact: true }).fill("Recover this work");
  expect(await page.evaluate((key) => localStorage.getItem(key), storageKey)).toBe("");
  expect((await exportNotebook(page, info, "corrupt-recovery.json")).value.researchQuestion).toBe(
    "Recover this work",
  );
  const other = await context.newPage();
  await other.goto("/annotations/");
  await other.evaluate((key) => localStorage.setItem(key, "external bytes"), storageKey);
  await expect(page.locator("#notebook-status")).toContainText("Another tab changed");
  await page.getByLabel("Research question", { exact: true }).fill("Recovered after conflict");
  expect(await page.evaluate((key) => localStorage.getItem(key), storageKey)).toBe(
    "external bytes",
  );
  expect((await exportNotebook(page, info, "conflict-recovery.json")).value.researchQuestion).toBe(
    "Recovered after conflict",
  );
  await other.close();
});

test("narrow reading and annotation controls are keyboard accessible and reflow", async ({
  page,
}, info) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/annotations/");
  await page.getByRole("button", { name: "Annotate selection", exact: true }).click();
  await expect(page.locator("#selection-status")).toContainText("Select a passage");
  await expect(page.getByLabel("Original bulletin text", { exact: true })).toBeFocused();
  await page.keyboard.press("Control+Home");
  await page.keyboard.press("Home");
  await page.keyboard.press("Shift+ArrowRight");
  expect(
    await page.locator("#bulletin-text").evaluate((node) => {
      const control = node as HTMLTextAreaElement;
      return [control.selectionStart, control.selectionEnd];
    }),
  ).toEqual([0, 1]);
  await selectPassage(page);
  await expect(page.getByLabel("Category", { exact: true })).toBeFocused();
  await page.getByLabel("Record a source-fit review", { exact: true }).check();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: info.outputPath("annotation-narrow.png"), fullPage: true });
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "200%";
  });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(page.getByRole("button", { name: "Annotate selection", exact: true })).toBeFocused();
});

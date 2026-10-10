# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: annotation.spec.ts >> narrow reading and annotation controls are keyboard accessible and reflow
- Location: ..\..\..\..\..\GitHub\fancy-research-tools\tests\e2e\annotation.spec.ts:234:1

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator:  locator('#quotation')
Expected: "Scatterometer data around midday confirmed"
Received: ""
Timeout:  5000ms

Call log:
  - Expect "toHaveText" locator('#quotation') with timeout 5000ms
  - waiting for locator('#quotation')
    14 × locator resolved to <pre tabindex="0" id="quotation" aria-labelledby="quotation-label"></pre>
       - unexpected value ""

```

```yaml
- link "Skip to bulletin":
  - /url: "#bulletin-text"
- banner:
  - heading "Forecast reading" [level=1]
  - button "Export notebook"
- main:
  - region "Archived source":
    - text: Bulletin
    - combobox "Bulletin":
      - option "Tropical Storm Milton Discussion Number 2" [selected]
      - option "Hurricane Milton Discussion Number 6"
    - term: Issued
    - definition: 400 PM CDT Sat Oct 05 2024
    - term: Forecaster
    - definition: Brown
    - paragraph: Archive from October 2024. These forecasts are historical.
    - link "Original NHC bulletin (opens a new tab)":
      - /url: https://www.nhc.noaa.gov/archive/2024/al14/al142024.discus.002.shtml
    - text: Original bulletin text
    - textbox "Original bulletin text": "ZCZC MIATCDAT4 ALL TTAA00 KNHC DDHHMM Tropical Storm Milton Discussion Number 2 NWS National Hurricane Center Miami FL AL142024 400 PM CDT Sat Oct 05 2024 Scatterometer data around midday confirmed that the circulation of the depression was well-defined, and it also revealed peak winds of 35 kt. Based on that data, the depression was upgraded to Tropical Storm Milton a few hours ago. The scatterometer data showed that the center was embedded within the area of cold cloud tops, but the area of tropical-storm-force winds was small. The overall structure has not changed much since that time, and the initial intensity remains 35 kt for this advisory. Given that the system is still in its development stage, the initial motion is a somewhat uncertain 020/3 kt. Milton is not expected to move much through tonight, but it should begin to move eastward to east-northeastward on Sunday as a shortwave trough drops southward over the northwestern Gulf of Mexico. On Monday, Milton should begin to track a little faster toward the east or east-northeast as it moves ahead of another mid-latitude trough approaching the southeastern United States. This trough is expected to cause Milton to further accelerate northeastward by Tuesday night with the center approaching the west coast of Florida. The overall track guidance envelope has nudged northward this cycle and it should also be noted that there remains large along-track or timing differences in the various dynamical models. The updated official forecast is slightly north of the previous track and is a little slower to be in better agreement with the latest multi-model consensus aids. Users are again reminded to not focus on the exact forecast track or timing at the longer range as the average NHC 4-day track error is about 150 miles. Milton is within favorable atmospheric and oceanic conditions for strengthening. The scatterometer data indicated that the radius of maximum was around 20 n mi, and with the expected low vertical wind shear conditions, steady to rapid strengthening appears likely during the next few days. The official intensity forecasts calls for Milton to become a hurricane in about 36 hours, and a major hurricane by 72 hours. The regional hurricane models continue to be quite aggressive in intensifying Milton. For now, the NHC intensity forecast is near the multi-model consensus aids, but upward adjustments could be required if the dynamical hurricane models continue their trends. Regardless of the exact details of the intensity forecast, an intense hurricane with multiple life-threatening hazards is likely to affect the west coast of the Florida Peninsula next week. Key Messages: 1. Milton is forecast to quickly intensify while it moves eastward to northeastward across the Gulf of Mexico and be at or near major hurricane strength when it reaches the west coast of the Florida Peninsula mid week. 2. There is an increasing risk of life-threatening storm surge and wind impacts for portions of the west coast of the Florida Peninsula beginning late Tuesday or Wednesday. Residents in these areas should ensure they have their hurricane plan in place, follow any advice given by local officials, and check back for updates to the forecast. 3. Areas of heavy rainfall will impact portions of Florida Sunday and Monday well ahead of Milton, with heavy rainfall more directly related to the system expected later on Tuesday through Wednesday night. This rainfall brings the risk of flash, urban, and areal flooding, along with minor to moderate river flooding. FORECAST POSITIONS AND MAX WINDS INIT 05/2100Z 22.7N 95.5W 35 KT 40 MPH 12H 06/0600Z 22.9N 95.0W 45 KT 50 MPH 24H 06/1800Z 23.0N 94.1W 55 KT 65 MPH 36H 07/0600Z 23.0N 92.8W 70 KT 80 MPH 48H 07/1800Z 23.1N 91.2W 80 KT 90 MPH 60H 08/0600Z 23.8N 89.3W 90 KT 105 MPH 72H 08/1800Z 24.8N 87.2W 100 KT 115 MPH 96H 09/1800Z 27.7N 83.0W 100 KT 115 MPH 120H 10/1800Z 30.4N 77.0W 65 KT 75 MPH...POST-TROP/EXTRATROP $$ Forecaster Brown NNNN"
    - button "Annotate selection"
    - status: Select a passage in the bulletin first. Use the pointer or Shift with the arrow keys.
    - group: Source identity
  - region "Research notebook":
    - text: Research question
    - textbox "Research question"
    - status
    - region "Saved annotations":
      - heading "Saved annotations" [level=2]
      - paragraph: No annotations saved.
      - list
- contentinfo:
  - text: Open notebook
  - button "Open notebook"
  - status
  - navigation "Documentation":
    - link "All tools":
      - /url: ../tools/
    - link "Guide":
      - /url: ../guides/getting-started.html
    - link "Data and provenance":
      - /url: ../reference/data.html
    - link "NOAA terms (opens a new tab)":
      - /url: https://www.weather.gov/disclaimer
    - link "Code license (opens a new tab)":
      - /url: https://github.com/DigitalHumanitiesCraft/fancy-research-tools/blob/main/LICENSE
```

# Test source

```ts
  1   | import { readFile } from "node:fs/promises";
  2   | import AxeBuilder from "@axe-core/playwright";
  3   | import { expect, type Page, type TestInfo, test } from "@playwright/test";
  4   | import sources from "../../data/nhc-milton/sources.json" with { type: "json" };
  5   | 
  6   | const first = sources[0];
  7   | const second = sources[1];
  8   | if (!first || !second) throw new Error("Missing annotation source fixtures.");
  9   | const storageKey = "frt.notebook./annotations/.nhc-milton.v1";
  10  | 
  11  | async function selectPassage(page: Page, passage = "Scatterometer data around midday confirmed") {
  12  |   const source = page.getByLabel("Original bulletin text", { exact: true });
  13  |   await source.focus();
  14  |   await source.evaluate((node, quote) => {
  15  |     const textarea = node as HTMLTextAreaElement;
  16  |     const start = textarea.value.indexOf(quote);
  17  |     if (start < 0) throw new Error("Passage not found");
  18  |     textarea.setSelectionRange(start, start);
  19  |   }, passage);
  20  |   // The keyboard extends the native selection; Annotate must retain it after focus changes.
  21  |   await page.keyboard.down("Shift");
  22  |   for (let index = 0; index < passage.length; index++) await page.keyboard.press("ArrowRight");
  23  |   await page.keyboard.up("Shift");
  24  |   await page.getByRole("button", { name: "Annotate selection", exact: true }).click();
> 25  |   await expect(page.locator("#quotation")).toHaveText(passage);
      |                                            ^ Error: expect(locator).toHaveText(expected) failed
  26  | }
  27  | async function exportNotebook(page: Page, info: TestInfo, name: string) {
  28  |   const pending = page.waitForEvent("download");
  29  |   await page.getByRole("button", { name: "Export notebook", exact: true }).click();
  30  |   const path = info.outputPath(name);
  31  |   await (await pending).saveAs(path);
  32  |   return { path, value: JSON.parse(await readFile(path, "utf8")) };
  33  | }
  34  | 
  35  | test("archived passage annotation preserves exact source and reopens its actual download", async ({
  36  |   page,
  37  |   browser,
  38  | }, info) => {
  39  |   await page.goto("/annotations/");
  40  |   await expect(page.getByRole("heading", { name: "Forecast reading" })).toBeVisible();
  41  |   await expect(page.getByLabel("Original bulletin text", { exact: true })).toHaveValue(first.text);
  42  |   await expect(page.locator("#forecaster")).toHaveText("Brown");
  43  |   await page
  44  |     .getByLabel("Research question", { exact: true })
  45  |     .fill("How does the bulletin distinguish observation from prediction?");
  46  |   await selectPassage(page);
  47  |   await page
  48  |     .getByLabel("Interpretation", { exact: true })
  49  |     .fill("This passage names an observation instrument as evidence.");
  50  |   await page.getByLabel("Creator kind", { exact: true }).selectOption("human");
  51  |   await page.getByLabel("Creator name", { exact: true }).fill("Test researcher");
  52  |   await page.getByRole("button", { name: "Save annotation", exact: true }).click();
  53  |   const annotation = page.locator("#annotations li");
  54  |   await expect(annotation).toHaveCount(1);
  55  |   await annotation.getByRole("button", { name: "Return to quotation" }).click();
  56  |   const selection = await page.locator("#bulletin-text").evaluate((node) => {
  57  |     const control = node as HTMLTextAreaElement;
  58  |     return {
  59  |       start: control.selectionStart,
  60  |       end: control.selectionEnd,
  61  |       quote: control.value.slice(control.selectionStart, control.selectionEnd),
  62  |     };
  63  |   });
  64  |   const saved = await exportNotebook(page, info, "annotation-notebook.json");
  65  |   expect(saved.value.sources).toEqual(sources);
  66  |   expect(saved.value.annotations[0]).toMatchObject({
  67  |     ...selection,
  68  |     sourceId: first.id,
  69  |     creator: { kind: "human", name: "Test researcher" },
  70  |     review: null,
  71  |   });
  72  |   expect(first.text.slice(selection.start, selection.end)).toBe(selection.quote);
  73  |   await page.reload();
  74  |   await expect(page.locator("#annotations li")).toHaveCount(1);
  75  |   const context = await browser.newContext();
  76  |   const reopened = await context.newPage();
  77  |   await reopened.goto("/annotations/");
  78  |   reopened.once("dialog", (dialog) => dialog.accept());
  79  |   await reopened.getByLabel("Open notebook").setInputFiles(saved.path);
  80  |   await expect(reopened.locator("#notebook-status")).toHaveText("Saved locally");
  81  |   expect((await exportNotebook(reopened, info, "reopened-notebook.json")).value).toEqual(
  82  |     saved.value,
  83  |   );
  84  |   await context.close();
  85  | });
  86  | 
  87  | test("a changed interpretation clears its earlier explicit review", async ({ page }, info) => {
  88  |   await page.goto("/annotations/");
  89  |   await selectPassage(page);
  90  |   await page
  91  |     .getByLabel("Interpretation", { exact: true })
  92  |     .fill("The passage identifies a measured observation.");
  93  |   await page.getByLabel("Record a source-fit review", { exact: true }).check();
  94  |   await page.getByLabel("Reviewer kind", { exact: true }).selectOption("human");
  95  |   await page.getByLabel("Reviewer name", { exact: true }).fill("Test reviewer");
  96  |   await page
  97  |     .getByLabel("Review criterion", { exact: true })
  98  |     .fill("The quotation explicitly names measured source data.");
  99  |   await page
  100 |     .getByLabel("Does the quotation support this interpretation?", { exact: true })
  101 |     .selectOption("supports");
  102 |   await page.getByRole("button", { name: "Save annotation", exact: true }).click();
  103 |   await expect(page.locator("#annotations li")).toContainText("Source-fit review: Supports");
  104 |   const reviewed = await exportNotebook(page, info, "reviewed.json");
  105 |   expect(reviewed.value.annotations[0].review.reviewer.name).toBe("Test reviewer");
  106 |   await page.getByRole("button", { name: "Edit", exact: true }).click();
  107 |   await page
  108 |     .getByLabel("Interpretation", { exact: true })
  109 |     .fill("A changed interpretation requires another review.");
  110 |   await expect(page.locator("#review-change")).toContainText("previous review is cleared");
  111 |   await expect(page.getByLabel("Record a source-fit review", { exact: true })).not.toBeChecked();
  112 |   await page.getByRole("button", { name: "Save annotation", exact: true }).click();
  113 |   expect(
  114 |     (await exportNotebook(page, info, "review-cleared.json")).value.annotations[0].review,
  115 |   ).toBeNull();
  116 | });
  117 | 
  118 | test("unfinished annotations survive declined source changes and block export or replacement", async ({
  119 |   page,
  120 | }, info) => {
  121 |   await page.goto("/annotations/");
  122 |   await page.getByLabel("Research question", { exact: true }).fill("Keep this notebook");
  123 |   const saved = await exportNotebook(page, info, "before-pending.json");
  124 |   await selectPassage(page);
  125 |   await page
```
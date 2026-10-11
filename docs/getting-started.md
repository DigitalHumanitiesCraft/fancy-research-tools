# Getting started

## Choose a starting point

The [tool gallery](../tools/) shows each example's task, material and interface. The [customization guide](customizing.md) explains how to adapt a workflow to a research question and documented source material.

## Work with a coding agent

Open the project folder in a coding-agent environment that can read files, run local commands and inspect a browser. Provide a question, a small source sample, an idea or a description of the work you want to improve. An existing tool can be the starting point. Programming knowledge is not an entry requirement. You remain responsible for judging whether the question, source interpretation and resulting tool fit your research.

Use this starting request with your material.

```text
Help me develop a research tool in this project. I do not program.
Start from the question, material, idea or existing workflow I provide.
Inspect the project instructions, existing files and working state first.
Preserve existing tools, source data and unfinished work.

Use actual source samples to clarify the smallest useful research task.
Identify missing information without inventing it. Ask me only about
research intent, source meaning, access or other decisions that I must make.
Explain choices through a concrete example from the material.

Handle environment setup, implementation and appropriate technical checks.
Build a small complete workflow that I can operate, interrupt, recover
and export. Keep source evidence and my interpretation distinguishable.
Record the data state, decisions, changes, checks and remaining limits
in the project's maintained knowledge.

Show me the working local tool and one concrete task for my assessment.
Explain how I can reopen the work and how another session can continue it.
Keep publication, external services and changes to access permissions
as separate decisions.
```

Expect a runnable local tool, a retained example result, and a project record explaining what changed and what was checked. Your agent should name any missing source or unavailable capability and continue the independent work it can complete. Give feedback by describing a research action or showing a source example. The agent translates that feedback into a bounded change and repeats the affected checks.

This is the supported development route. Independent development by researchers without programming experience still requires observed trials. The technical commands below remain available for researchers, maintainers and agents using that route.

## Create your repository

When the GitHub repository is configured as a template, choose “Use this template” and create a new repository with the visibility your project requires. An independent private repository is the default for confidential customer work. A fork is useful for changes intended to track or contribute to the upstream project.

Retain the applicable license notices. Replace the project identity, repository URLs and research purpose in `knowledge/`. Record the starting upstream commit so that future updates can be compared deliberately.

For an existing project, open its current repository and follow [adapt an existing tool](customizing.md#adapt-an-existing-tool). Preserve its history and data formats while examining whether any part of this starter is useful.

## Run locally

Use a supported Node.js runtime for the locked dependencies, then run these commands from the repository root.

```sh
npm ci
npm run dev
```

Use Node.js 22.14 or a compatible newer runtime for this lockfile. Optional local commit checks can be installed with `npm run hooks:install`; continuous integration runs independently of that hook.

Open the local URL printed by Vite. The start page links the tool gallery and documentation. To preview the complete generated site, run `npm run build` followed by `npm run preview`.

## Explore photographs

1. Open [Collection Explorer](../photographs/) and search for `Yosemite`.
2. Compare the visible dates and attributions. Select Bridal Veil and Yosemite Falls using their comparison controls, then open Comparison.
3. Inspect the different processes and the qualified attribution to Muybridge. Open either photograph to pan and zoom the local image. The source link opens the museum catalogue.
4. Return to the same result and open Timeline. Each photograph has a direct link beside its catalogue date; the order is chronological, while spacing does not measure elapsed years.
5. Export the selection. The JSON retains both records, original source fields and derivation evidence, including qualifiers. The search and selection also survive reload through the URL.

The example provides web-size images rather than full-resolution originals. It does not save annotations or reopen selection files. The sample and date limits are described in the [data contract](../knowledge/data.md#open-photograph-reference).

## Capture SZD

1. Open the [SZD source record](https://gams.uni-graz.at/o:szd.1079), Stefan Zweig's letter to Max Fleischer of 22 May 1901, shelfmark SZ-LAS/B3.1. Distinguish the two envelope scans, two text pages and colour-reference image before editing.
2. Download the [prepared TEI](../examples/szd/letter.tei.xml) and inspect its [source manifest](../examples/szd/manifest.json). Keep a working copy separately. The [source package](https://github.com/DigitalHumanitiesCraft/fancy-research-tools/tree/codex/version-0.1/data/szd-example) records the exact upstream revision, rights statement and transformations.
3. Open [teiCrafter](https://digitalhumanitiescraft.github.io/teiCrafter/) and load the UTF-8 XML with its file-open control or drag and drop. For a reproducible local run, use the repository revision in the source package's `verification.json`. Compare one paragraph with its linked facsimile and inspect the letter's metadata. Keep the original file separately.
4. Make one source-supported correction or structural annotation in the working copy. Preserve page references and record who made the change. The retained transcription and upstream review were machine-produced; they do not establish a human-verified reading.
5. Keep unfinished input with Working copy. Validate before downloading TEI, then reopen that downloaded XML and compare text, page references and metadata with the original. Working-copy recovery and schema-authorized TEI export are distinct. Record any unsupported structure or difference between the hosted editor and its current source repository.

The archive states CC-BY without specifying a version. Preserve its attribution and source-specific notice. Facsimiles remain hosted by the source; they are not bundled here. This is an editing task prepared with real material. Its end-to-end operation in the hosted editor remains subject to the recorded checks in [Testing](../knowledge/testing.md).

## Analyse correspondence

1. Open [CorrespExplorer](https://dhcraft.org/CorrespExplorer/) and choose its real Hugo Schuchardt Archiv dataset. Check the selected collection before interpreting results; its synthetic feature demonstration serves a different purpose.
2. Choose a correspondent or place and narrow the date range. Inspect the matching letters and their source references before drawing a conclusion about the relationship.
3. Compare the available temporal and geographic views while checking whether the same constraints remain active. A place attached to correspondence is not automatically a person's residence or a travel event.
4. Retain the supported export or address of the selected set and record the question it addresses. Reopen it and compare the actual record identities. If a view or export omits uncertain or unlocated records, keep that coverage limit with the observation.

This guide describes a task in the existing application. Its runtime, supported export formats and source mappings belong to the [CorrespExplorer repository](https://github.com/DigitalHumanitiesCraft/CorrespExplorer). Inclusion in this gallery does not establish a shared schema or a newly verified complete external workflow.

## Review bibliography

The [published Stefan Zweig Bibliography](https://chpollin.github.io/klawiter-rescue/) supports reading and exploration. Correction runs locally in the [Klawiter repository](https://github.com/chpollin/klawiter-rescue), whose [README](https://github.com/chpollin/klawiter-rescue#run-locally) defines required source files and setup.

1. Start a local copy using that repository's instructions and preserve its source revision. Its delivered source files are a prerequisite; a public reading page alone does not supply the complete reconstruction input.
2. Open a bibliographic entry and compare its structured fields with the complete retained source entry. Choose a correction supported by that source rather than inventing a demonstration error.
3. Enable the local Edit control. Record the changed value and its evidence while keeping the original visible. A page may contain several publications, so establish whether the field belongs to the whole page or one publication before editing.
4. Export the session's versioned patch and inspect its original value, correction, record identity and provenance. Preserve the patch outside browser storage.
5. Follow the upstream [patch-store contract](https://github.com/chpollin/klawiter-rescue/tree/main/data/corrections) when applying it to a test copy. Compare the affected output and retain the original source.

Field patches currently update the frontend projection, history and review state. The upstream README records a propagation gap for other canonical graphs and reports. This example demonstrates the local correction boundary; a complete general curation tool requires that gap to be closed and verified. No correction is written to the public website through this guide.

## Build SZD edition

Use the same Fleischer letter as the [capture task](#capture-szd). The [Agentic Edition Pipeline](https://github.com/DigitalHumanitiesCraft/agentic-edition-pipeline) supplies a configurable project template; the retained SZD material supplies real source and transcription examples.

1. Inspect the frozen package and reproduce its checks from the Fancy Research Tools repository root.

```sh
node scripts/prepare-szd-example.mjs --check
node scripts/check-szd-example.mjs
```

2. Inspect the original METS inventory, machine transcription and page JSON beside the derived TEI. Keep envelope, text and reference-image roles distinct. A source checksum establishes byte identity; it does not approve the reading.
3. Prepare a separate copy of [Agentic Edition Pipeline](https://github.com/DigitalHumanitiesCraft/agentic-edition-pipeline) at the revision recorded in the package's `verification.json`. Put a working copy of the prepared TEI into `results/tei/o_szd.1079.xml`. Configure the project's identity and rights before building. Keep automatic publication disabled.
4. Build a local reading preview from that external TEI entry point.

```sh
uv sync
uv run python pipeline/06_build_frontend.py --serve
```

5. Compare a rendered paragraph and each page image reference with the retained source. The actual step-6 parser has been checked for page order, image URLs and unchanged text. A complete frontend build and browser editing/reopen remain separate observations in [Testing](../knowledge/testing.md).
6. For another correction, edit the working XML in teiCrafter, preserve the original file, replace the external TEI deliberately and rebuild. This package has no canonical transcription JSON for the template's correction server or regeneration stages. Its `machine_unreviewed` state does not satisfy scholarly publication acceptance. The preview path needs no provider credentials or fresh transcription call.

[SZD-HTR](https://github.com/chpollin/szd-htr-ocr-pipeline) supplies the source transcription and a preceding workflow. [DoCTA](https://github.com/DigitalHumanitiesCraft/DoCTA) is an architectural comparison case. They inform generalisation without establishing a shared runtime or automatic transfer. The prepared package is not evidence that capture, correction services and edition rendering already form one verified workflow.

## Technical examples

These earlier implementations support development, compatibility checks and comparison of interaction choices. Their routes, local drafts and formats remain available. They are outside the main gallery's research-task examples.

| Example | Development purpose | Walkthrough |
|---|---|---|
| [Met catalogue comparison](../pilot/) | Source-preserving comparison and saved investigations | [Complete workflow](#exercise-a-complete-workflow) |
| [Schönbach metadata editor](../tool/) | Working corrections beside original CMIF values | [Local metadata editing](#exercise-local-metadata-editing) |
| [Benndorf letter annotation](../letters/) | Exact source anchors and interpretation | [Historical letter](#annotate-a-historical-letter) |
| [Archived forecast annotation](../annotations/) | Contrasting material with a separate notebook contract | [Archived discussion](#annotate-an-archived-discussion) |
| [Design studies](../concepts/) and [historical catalogue](../baseline/) | Bounded comparison of alternative interactions | [Research basis](research.md#evaluate-an-adaptation) |

[coOCR/HTR](https://dhcraft.org/co-ocr-htr/) is an additional page/transcription inspection reference. Its provider-backed features require their own configuration. The main gallery does not present it as another edition pipeline.

## Exercise a complete workflow

This contrasting Met workflow adds authored notes and saved investigations.

1. Open [Compare collection records](../pilot/) and search for `wood`.
2. Select two records with Compare, then open Comparison in the header.
3. Enter a research question and compare the original material descriptions side by side.
4. Choose Source beside a comparison value. Inspect its original source fields, transformation and recorded checks. Choose Return to comparison to continue with the same selection and notes. The source view has its own URL fragment and supports browser Back.
5. Record an observation and an unresolved question in their separate fields.
6. Reload and check the restored selection and notes.
7. Choose Export investigation and keep the downloaded JSON.
8. Choose Open investigation, reopen the file and confirm replacement. Check the question, records and notes.

The source snapshot contains 60 catalogue records, selected by lowest ID. It cannot establish a representative account of instruments or musical history. About records the provenance and limitations. Notes remain separate from the source evidence. A rejected import preserves the current investigation; a failed local save requires a successful export before leaving.

The source view identifies the catalogue publisher and the local projection. The original author and creation process are unknown in this snapshot. Technical checks apply to the properties they name. They do not establish a human or AI review of the catalogue value.

The [interface experiments](../concepts/) use the same investigation format. They compare interaction hypotheses on the same material. The [catalogue baseline](../baseline/) preserves the earlier filtering interface for bounded comparisons. It does not implement the complete investigation workflow.

## Exercise local metadata editing

1. Open [Edit collection records](../tool/) in a fresh browser context. The first of five Schönbach correspondence descriptions opens automatically. If a browser draft already exists, the editor restores that collection instead.
2. Compare the working date and place with Original source values. For the first letter, the source gives `1898-12-03` and `Habrovany`. Letter in the edition opens the published letter; CMIF snapshot opens the preserved metadata source.
3. Choose Edit record. Add a note such as `The edition records Habrovany as the sending place.` Keep Working review at Draft unless you intend to record a manual checked assertion. Working source note is editable provenance in the working collection. Save record.
4. Reload and confirm that the note remains. Original source values stay unchanged beside the working record.
5. Export collection and keep the downloaded JSON outside the browser. Import JSON, choose that file and confirm replacement. Check the note, source identity and other records.
6. Search for `Zdislavice` and open the letter from Marie von Ebner-Eschenbach to Anna Schönbach. Its source panel also retains the received place, Graz, which has no separate field in the flat editor.

This collection projects real CMIF metadata into the existing collection schema. The constructed title joins sender and recipient, and Letter is the assigned type. The export retains the source link, record key and source hash. It does not recreate the complete TEI document. The [data contract](../knowledge/data.md) describes this projection and its limits. Synthetic `fixtures/demo.json` remains available for compatibility and boundary tests; existing drafts using that fixture are preserved.

## Annotate a historical letter

1. Open [Annotate a letter](../letters/). Read the Benndorf to Schuchardt letter dated 14 February 1879. Check its historical author, modern editor and link to the Hugo Schuchardt Archiv.
2. Enter a question such as `How does Benndorf describe his acquaintance with Hübner?` Select `Ich kenne E. Hübner fast gar nicht` in Letter transcription and choose Annotate selection. Keyboard selection uses Shift with Left or Right, Home or End, and Ctrl+Home or Ctrl+End.
3. Choose Person and write an interpretation such as `Benndorf qualifies his personal knowledge of Hübner.` Record the creator only as known, then Save annotation. The other categories are Place, Research topic and Editorial question. A category records your reading, without identifying an entity automatically.
4. Choose Return to quotation to inspect the annotation at its source. If recording a review, choose Edit and enable Record a source-fit review. Name the reviewer, state the criterion and result, then save. Changing the quotation, category, interpretation or creator clears the previous review.
5. Export notebook, reopen the downloaded file through Open notebook and confirm replacement. Check the exact quotation, interpretation and source attribution.

The supplied teiCrafter transcription removes footnote numerals and retains the `|2|` page marker. The letter text is public domain under its retained source notice; images and the edition's apparatus are excluded. Browser text normalizes line endings to LF, with raw and displayed hashes recorded separately. Historical author, modern editor, annotation creator and reviewer have different roles. This case's notebook remains separate from the archived-discussion case.

## Annotate an archived discussion

1. Open [Annotate forecast discussions](../annotations/) and select discussion 2. Check the original issue time, forecaster and source link.
2. Select a passage in the full bulletin by pointer, or focus its text and hold Shift while pressing Left or Right. Home and End move within a source line, and Ctrl+Home and Ctrl+End reach the bulletin's ends. Choose Annotate selection.
3. Choose observation, forecast or stated uncertainty and write a note explaining the choice. Record the creator only as known. Save the annotation.
4. Choose Return to quotation and compare the annotation with the source. To record a review, choose Edit, enable Record a source-fit review, name the reviewer, state the criterion, select its result and save the annotation.
5. Edit the note and save. Its earlier review clears because the reviewed content changed.
6. Export the notebook, reopen it in a fresh browser context and check the exact quotation, note and source.

The two discussions are archived material from October 2024. Category choices and source-fit reviews are research assertions. They do not certify a weather forecast or authenticate the named people. Saved annotations recover locally when storage is available. An unfinished form is protected by a leaving warning but is not saved for crash recovery. Keep a notebook export outside the browser.

## Check the project

```sh
npm run check
npm run check:data
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

`npm run check:data` verifies the frozen source snapshots and their derived files without replacing them. The [data contract](../knowledge/data.md) defines the checks for Met metadata, Schönbach correspondence, the Benndorf transcription and NOAA/NHC discussions. Read the [testing protocol](../knowledge/testing.md) for executed evidence and remaining acceptance.

## Publish a static site

Configure GitHub Pages to use GitHub Actions and review the deployment workflow. The site combines documentation, public specifications and the tool below the repository's site path. Confirm paths in the actual deployment. Custom domains and organisation sites may require a different base path.

Customer data included in a static build becomes downloadable by visitors who can access that site. Use only material approved for that audience.

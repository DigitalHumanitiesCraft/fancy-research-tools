---
title: Data
project:
  name: Fancy Research Tools
  repository: https://github.com/DigitalHumanitiesCraft/fancy-research-tools
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
template:
  name: Vorlage Datengrundlage
  version: 0.3
  url: https://dhcraft.org/Promptotyping/promptotyping-document/data
status: draft
language: en
created: 2026-10-10
updated: 2026-10-10
---

# Data

The examples use separate data contracts and persisted working state. The editor starts with real Schönbach correspondence metadata, comparison uses frozen Met catalogue records, and annotation supports a historical letter and archived NOAA/NHC discussions. Each export preserves its defined material and authored work. Existing drafts and synthetic regression fixtures remain supported.

## Subject

Example descriptions represent collection items with descriptive metadata and review state. Projects must define the meaning and provenance of their own fields before importing real material.

## Sources

The editor's default collection is derived from the CC0 Schönbach CMIF sample retained in CorrespExplorer. The frozen XML, source identity, rights statement and deterministic projection live in `data/schoenbach/`. The projection combines sender and recipient in a title, retains the source date and sending place, and records the original description identity. Original CMIF remains available because the flat JSON format does not represent the complete correspondence structure. New baseline records have manual review state `draft`; no check or historical verification is inferred. Existing local drafts take precedence over this new default.

`fixtures/demo.json` remains the original synthetic collection for failure, compatibility and recovery tests. Synthetic source descriptions must remain distinguishable from citations to real objects.

The pilot snapshot in `data/met-instruments/` contains the first sixty numeric object IDs from the department 18 listing retrieved on 2026-10-10. `manifest.json` records retrieval, selection, source URLs and raw-file hashes. `README.md` documents mapping and limits. The [Met API documentation](https://metmuseum.github.io/) and [Open Access repository](https://github.com/metmuseum/openaccess) identify metadata reuse under CC0. No images are downloaded or displayed. This convenience sample supports catalogue inspection and software evaluation, with no claim to represent the collection or musical history.

`node scripts/import-dh-data.mjs` verifies the frozen source bytes and deterministically regenerates derived records. Network retrieval is an explicit acquisition step, outside the production browser path. Empty source strings become null. Descriptive dates and original classification/culture labels remain available. Artist names retain their separate attribution prefix and suffix, including uncertain attributions. Date indexing bounds are not treated as exact event dates or uncertainty intervals. A missing catalogue value does not establish that a historical property was absent.

`npm run check:data` executes that unchanged importer against temporary copies, compares the generated records, checksum and field-evidence registry byte for byte, and runs the independent raw-source oracle. It leaves the repository dataset unchanged and runs in both CI workflows. A changed importer digest changes the registry identity and therefore requires the compatibility decision described below before adoption.

The [research guide](../docs/research.md) lists candidates for inspection. Domain-specific material such as TEI structures or correspondence relations may require a different data contract. Mapping it into the current flat records must not silently discard meaningful structure. Synthetic fixtures remain appropriate for deterministic failure and boundary tests.

## Model

The validator in `src/domain/dataset.ts` implements the runtime contract, and `src/adapters/json.ts` handles interchange. `fixtures/demo.json` supplies synthetic examples.

| Field | Contract |
|---|---|
| Collection `schemaVersion` | Exactly `1` |
| Collection `title` | Nonempty string |
| Collection `records` | Array of records |
| Record `id` | Unique, stable, nonempty string, immutable during editing |
| Record `title`, `kind`, `source` | Nonempty strings |
| Record `place`, `date` | `null` or nonempty descriptive string |
| Record `notes` | String, including empty string |
| Record `review` | `draft` or `checked` |

Unknown fields and unsupported versions are rejected rather than silently discarded. The source field is plain-text provenance. The domain freezes validated objects and returns new values for edits.

Unknown or invalid input is rejected with actionable feedback. A successful import replaces the working collection only after complete validation. Updating the contract requires a coordinated change to validation, fixtures, import/export tests and the editor.

## Limits

Both the imported file and the formatted export must fit within 1 MiB. An edit that would exceed the export limit stays in the form for correction and does not replace the working collection. Browser persistence compares the last observed storage snapshot before writing. A detected change from another tab leaves that copy intact and offers export of the current in-memory state. This recovery mechanism does not implement collaborative editing or an atomic multi-tab transaction.

Dates are descriptive strings. The starter does not infer chronology, geographic identity or source authenticity. Empty metadata requires domain-specific interpretation. The `checked` review value is a manual user assertion, not automated scholarly verification. It remains selected when other fields change. A real project needs an accountable review policy, including whether edits should reset that state.

## Workflow

Keep a copy of source material outside the browser. Import a supported JSON collection, inspect it, make changes in the local draft and export a new file. Draft recovery depends on browser storage availability. Clearing site data can remove drafts. Exported JSON is the portable recovery route.

## Relationship to source material

The supplied input file and bundled baseline remain separate from edited working state. Export creates a new download. It does not write back to the selected source file or to a remote repository.

Accepted author text retains its exact string value, including whitespace and line endings, until that particular field is edited. Native form controls can normalize their displayed value. Restoring a form, exporting, or editing another field must not adopt that normalization into the underlying data. Editing a field adopts its current control value without trimming other fields. This rule applies to collection metadata, investigation questions and notes, and annotation notebook text.

## Investigation exchange

Collection comparison and Atlas, Bench and Trail share the investigation exchange in `src/research/investigation.ts`. New investigations use version 2. Required fields are `schemaVersion`, `query`, `researchQuestion`, `selectedIds`, `records`, `interpretation`, `provenance` and `fieldEvidence`. Interpretation contains `observation`, `unresolvedQuestion` and `author`; the default `user` label identifies the note channel and does not authenticate its author. The schema accepts up to four distinct selected records and preserves their ordering. Every embedded record, the snapshot manifest and version 2 field evidence must match this frozen dataset and its derivation registry exactly. Unknown fields, changed source evidence, duplicate IDs and other snapshots are rejected.

Exact version 1 investigations remain readable. They contain the same fields except `fieldEvidence`. Parsing and directly serializing a version 1 object preserve that shape. Opening a legacy file or restoring a legacy draft does not rewrite its source file or stored bytes. A subsequent explicit export or edit creates version 2 using the current derivation evidence; it does not assert that the earlier author recorded or checked that evidence. Storage keys remain unchanged. Older software that only accepts version 1 cannot reopen version 2. Keep original exports and a matching software copy for rollback. A future dataset or derivation change must provide an explicit compatibility strategy before replacing this registry; exact matching is a bounded snapshot contract, not an archive migration service.

The same validated serializer governs file export and reopening. Byte and text bounds are defined in that module and tested symmetrically. Earlier experimental concept exports used different shapes and are historical evidence, not supported input to this contract. They are never silently converted or overwritten. Tool-specific filter presentation remains distinct from the retained selected evidence.

## Annotation notebook

Forecast annotation uses the National Hurricane Center's Milton [discussion 2](https://www.nhc.noaa.gov/archive/2024/al14/al142024.discus.002.shtml) and [discussion 6](https://www.nhc.noaa.gov/archive/2024/al14/al142024.discus.006.shtml) from October 2024. The repository material record `data/nhc-milton/README.md` and manifest identify the preserved HTML, published bylines, selection and hashes. The retained [National Weather Service use policy](https://www.weather.gov/disclaimer) places page information in the public domain unless otherwise noted; no separate restriction was observed on the selected bulletin text. Reuse credits the source and keeps annotations separate from official information. This purposive sample supports examining wording and evidence references; measuring forecast accuracy requires additional observations and a different method.

`scripts/import-annotation-data.mjs` verifies the frozen source and rights-page hashes, then extracts each bulletin's literal `pre` text without normalizing spaces or newlines. `npm run check:data` also repeats this extraction in a temporary copy and compares the derived file byte for byte. Production tools make no live source requests.

`src/annotation/model.ts` defines notebook schema version 1 with a case-specific canonical source set and category vocabulary. Case `nhc-milton-2024` embeds both exact source snapshots. Case `hsa-benndorf-1879` embeds the real Benndorf letter. A notebook contains a research question and up to 200 annotations. Each annotation has a stable ID, source ID, start-inclusive and end-exclusive UTF-16 offsets, exact quote, category, note, declared creator and optional review. `source.text.slice(start, end)` must equal the quote. Overlapping annotations are permitted. The contract does not claim W3C Web Annotation compliance. Each route rejects a notebook for the other case before replacing work, and the existing NHC key, exported fields and file naming remain compatible.

The letter source is Friedrich August Otto Benndorf to Hugo Schuchardt, Vienna, 14 February 1879, edited by Hubert Szemethy (2022) in Bernhard Hurch's Hugo Schuchardt Archiv. The [edition](https://gams.uni-graz.at/o:hsa.letter.7711) and retained teiCrafter source notice identify it. `data/hsa-letter/raw/` preserves the existing plaintext and notice. The letter itself is public domain according to that notice. Images and editorial apparatus are excluded. Upstream removed footnote numerals and retained the page marker. The local derivation only normalizes line endings to LF for native text selection; raw and displayed hashes distinguish both representations. The letter vocabulary is Person, Place, Research topic and Editorial question. Author, recipient, editor and publisher remain separate source roles. No attribution is inferred for the annotation author.

Categories describe a proposed reading. Observation concerns reported measured or seen conditions, forecast concerns expected future developments, and stated uncertainty concerns express qualifications or limits. A note can explain ambiguity or overlapping readings. The notebook's interpretation remains separate from the preserved source wording and its printed forecaster attribution.

Creator kinds are human, LLM, agent and unknown. A supplied name declares an identity without authenticating it. A new annotation has no recorded review. An optional source-fit review requires a named reviewer, their declared kind, a criterion and a result of supports, does not support or unclear. It concerns the quotation's support for that annotation under that criterion. Editing the anchor, category, note or creator clears the previous review. No-op changes retain it. No timestamp or broader scientific-validation claim is inferred.

Unknown fields, unsupported versions, changed sources, duplicate IDs and invalid quote anchors are rejected before replacement. Input and formatted output must fit within 1,000,000 UTF-8 bytes. Each authored text field is bounded at 20,000 UTF-16 code units. Source changes require a new snapshot and an explicit compatibility decision. The Met investigation and collection-editor formats remain independent.

The annotation controller uses a separate route-specific local storage key. Opening a valid notebook preserves its imported bytes until an actual change. Corrupt or externally changed stored copies remain intact. Local-save failures expose export as the recovery route. Save or discard an unfinished annotation before importing, exporting or changing its source. A leaving warning protects an unfinished form, but crash recovery covers saved notebook state only.

## Provenance of individual values

Source, production and checking are separate dimensions. A publisher can supply a value whose original author is unknown. An LLM or agent may generate, transform or review a value; none of those actions alone makes it human-verified or suitable for a research claim. The terms verification and validation require a project-specific target and criterion. Multiple or contradictory assertions remain a domain decision, rather than a mandatory feature of every tool.

For a reviewable check, record the checked value and version, who or what checked it, the method or criterion, result and available execution evidence. Record a time only when actually known. Distinguish not checked, no check recorded, a failed check and a successful check. Do not infer confidence from the actor category or assign an undocumented percentage. These are adaptation rules; the current pilot has no editable review workflow or identity authentication.

`data/met-instruments/field-evidence.json` is generated with the derived records by `scripts/import-dh-data.mjs`. It records each original API field and value, the mapped value and transformation, raw-file path/URL/SHA-256, publisher, and the derivation script path/SHA-256. The original producer is explicitly unknown. Executed checks cover frozen-file hash agreement, object identity, department identity and field-projection agreement. These checks establish agreement with the frozen source and mapping. They do not test historical truth, catalogue authorship, source completeness or research fitness. No human or AI review and no check timestamp is invented.

The field-evidence registry has its own schema version 1, independent of investigation version 2 and the editor's collection version 1. It covers all projected source fields. Attribution combines name, prefix and suffix without dropping qualifiers. Date bounds include the descriptive-date dependency: a blank source date causes the displayed bounds to be null even when raw numeric indexing values exist. Empty strings mapped to null remain visible as original empty strings in the source reading view. The original records, raw snapshot and manifest remain unchanged.

`src/research/evidence.ts` exposes copied evidence for display and export. New portable investigations embed evidence for the selected records, including the common derivation and check declarations. The workbench shows it beside each comparison value; the alternative concepts preserve it in export through the shared exchange. The structure borrows the distinction between entities, activities and agents from the [W3C PROV Primer](https://www.w3.org/TR/prov-primer/), but does not implement PROV-O or claim standards-compliant interchange.

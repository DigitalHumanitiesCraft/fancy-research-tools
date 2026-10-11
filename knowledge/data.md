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
updated: 2026-10-11
---

# Data

Each example preserves a defined source snapshot and uses its own interchange contract. Source values, deterministic derivations, authored interpretation and recorded checks remain distinguishable. A format accepted by one tool is not implicitly accepted by another.

## Subject

The flat collection editor represents descriptive records with a manual review state. Investigations preserve selected catalogue evidence and notes. Notebooks preserve exact source quotations and interpretations. The photograph selection is an evidence packet, while the SZD package carries TEI and its source manifest.

| Format | Supported version and identity | Preservation boundary |
|---|---|---|
| [Collection](#model) | `schemaVersion: 1` | Complete flat record set, including imported author text |
| [Met investigation](#investigation-exchange) | Exact version 1 input, version 2 creation | Selected frozen records, snapshot and separately authored notes; version 2 adds canonical field evidence |
| [Annotation notebook](#annotation-notebook) | `schemaVersion: 1` and declared case | Exact sources, quote anchors, annotations and recorded reviews |
| [Photograph selection](#open-photograph-reference) | Current frozen projection and derivation identity | Selected source evidence; no editable-file reopening or image archive |
| [SZD package](#szd-edition-example) | Manifest-pinned TEI source and declared adapter | Retained source files, prepared TEI and facsimile references |

Projects must define field meaning and provenance before importing material. [Recovery and replacement](specification.md#recovery-and-replacement) defines what users observe when work is saved, imported or exported.

## Sources

The editor's default collection is derived from the CC0 Schönbach CMIF sample retained in CorrespExplorer. [Its material record](https://github.com/DigitalHumanitiesCraft/fancy-research-tools/blob/a217446/data/schoenbach/README.md) identifies the frozen XML, source, rights statement and deterministic projection. The projection combines sender and recipient in a title, retains the source date and sending place, and records the original description identity. Original CMIF remains available because the flat JSON format does not represent the complete correspondence structure. New baseline records have manual review state `draft`; no check or historical verification is inferred. CM-01 in [Specification](specification.md#correspondence-metadata-contract) preserves existing drafts when choosing this default.

`fixtures/demo.json` remains the original synthetic collection for failure, compatibility and recovery tests. Synthetic source descriptions must remain distinguishable from citations to real objects.

The pilot snapshot in `data/met-instruments/` contains the first sixty numeric object IDs from the department 18 listing retrieved on 2026-10-10. `manifest.json` records retrieval, selection, source URLs and raw-file hashes. `README.md` documents mapping and limits. The [Met API documentation](https://metmuseum.github.io/) and [Open Access repository](https://github.com/metmuseum/openaccess) identify metadata reuse under CC0. No images are downloaded or displayed. This convenience sample supports catalogue inspection and software evaluation, with no claim to represent the collection or musical history.

`node scripts/import-dh-data.mjs` verifies the frozen source bytes and deterministically regenerates derived records. Network retrieval is an explicit acquisition step, outside the production browser path. Empty source strings become null. Descriptive dates and original classification/culture labels remain available. Artist names retain their separate attribution prefix and suffix, including uncertain attributions. Date indexing bounds are not treated as exact event dates or uncertainty intervals. A missing catalogue value does not establish that a historical property was absent.

The importer digest is part of the field-evidence identity. Changing it requires the [investigation compatibility decision](#investigation-exchange), even if visible catalogue values remain the same. The [architecture](architecture.md#field-evidence-and-compatibility) and [testing contract](testing.md) define reproducibility and independent-oracle checks.

A descriptive projection must retain its original material separately when structures such as TEI markup or correspondence relations exceed the flat model. The [adaptation guide](../docs/customizing.md) requires an explicit decision about retained and replaced meaning.

## Open photograph reference

`data/photographs/` contains forty photographs from the Cleveland Museum of Art's Open Access API, acquired on 2026-10-11. Its README, manifest and frozen response record the selection and rights. Metadata and each selected image have CC0 evidence. The sample combines three deliberately chosen date cases with the lowest remaining numeric IDs; it is not representative. The API's period filter includes some later descriptive dates, which remain visible. Local images retain the downloaded JPEG bytes and their web resolution. Five publisher dimension values disagree with the actual files; the projection uses decoded JPEG dimensions and preserves the source values separately.

The JSON-LD separates catalogue date wording, conservatively parsed nominal bounds and the publisher's indexing bounds. Approximate dates remain approximate. Bare decades form a decade interval; unsupported compound descriptions retain their wording without a plotted date. Creator roles, attribution qualifiers, extents and authority references stay together. An attribution reference does not merge people or imply verified identity. No locations are inferred from culture, title or museum address.

[The photograph schema](https://github.com/DigitalHumanitiesCraft/fancy-research-tools/blob/a217446/data/photographs/schema.json) defines structure. Its material checks cover frozen source and image hashes, decoded JPEG dimensions, reproducible derivation and independently specified `semantic-cases.json`. Those criteria establish projection agreement and declared date cases. Historical correctness requires additional source assessment. The original source fields and derivation identity accompany exported selections. The selection file is a JSON evidence packet; it is not a supported editable investigation or an image archive.

The example contains no customer material and no LLM-produced catalogue values. Its interface therefore shows no LLM status marker. Synthetic skill trials exercise uncertain extraction separately under `benchmarks/cases/research-ui-skills/`.

## SZD edition example

`data/szd-example/` retains the public METS inventory and pinned pipeline transcription for Stefan Zweig's letter to Max Fleischer of 22 May 1901, SZ-LAS/B3.1. Its manifest identifies every frozen file and the upstream pipeline revision. The inventory distinguishes envelope scans, text pages and a colour reference. No facsimile bytes are bundled.

The source-specific rights statement names Literaturarchiv Salzburg and CC-BY without a version. Preserve that exact statement and attribution. A repository software licence does not relicense the archive material. The upstream transcription and review were produced by an LLM. The derived TEI marks its local state as `machine_unreviewed` and does not claim human verification. Derivation retains source text and zones while making page-image pointers explicit and recording attribution. The package README and checker define its exact reproducibility boundary.

The [package manifest](https://github.com/DigitalHumanitiesCraft/fancy-research-tools/blob/a217446/data/szd-example/manifest.json) and [README](https://github.com/DigitalHumanitiesCraft/fancy-research-tools/blob/a217446/data/szd-example/README.md) identify retained inputs and declared changes. The [capture and edition guide](../docs/getting-started.md#capture-szd) uses this material under SZD-01 through SZD-03 in [Specification](specification.md#prepared-szd-workflow). Source hashes, TEI schema validity, browser editing and full edition generation are separate verification targets.

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

Updating the contract requires coordinated changes to validation, fixtures, interchange tests and the editor under FR-04 through FR-07 in [Specification](specification.md#functional-requirements).

## Limits

Imported collection files and formatted exports must fit within 1 MiB (1,048,576 bytes). The implementation uses the same bound when validating an edited candidate. [Recovery and replacement](specification.md#recovery-and-replacement) defines overflow and storage-conflict behaviour.

The flat editor stores dates as descriptive strings and does not infer chronology, geographic identity or source authenticity. Empty metadata requires domain-specific interpretation. The `checked` review value is a manual user assertion with no recorded reviewer, criterion or check history. It remains selected when other fields change. A project adopting this editor must decide whether that policy fits its review task. Annotation reviews have the different invalidation rule defined below.

## Workflow

The [recovery contract](specification.md#recovery-and-replacement) governs separate working copies, explicit exports and storage failure. The [editing walkthrough](../docs/getting-started.md) provides the operated sequence.

## Relationship to source material

Accepted author text retains its exact string value, including whitespace and line endings, until that particular field is edited. Native form controls can normalize their displayed value. Restoring a form, exporting, or editing another field must not adopt that normalization into the underlying data. Editing a field adopts its current control value without trimming other fields. This rule applies to collection metadata, investigation questions and notes, and annotation notebook text.

## Investigation exchange

Collection comparison and Atlas, Bench and Trail share the investigation exchange in `src/research/investigation.ts`. New investigations use version 2. Required fields are `schemaVersion`, `query`, `researchQuestion`, `selectedIds`, `records`, `interpretation`, `provenance` and `fieldEvidence`. Interpretation contains `observation`, `unresolvedQuestion` and `author`; the default `user` label identifies the note channel and does not authenticate its author. The schema accepts up to four distinct selected records and preserves their ordering. Every embedded record, the snapshot manifest and version 2 field evidence must match this frozen dataset and its derivation registry exactly. Unknown fields, changed source evidence, duplicate IDs and other snapshots are rejected.

Exact version 1 investigations remain readable. They contain the same fields except `fieldEvidence`. Parsing and directly serializing a version 1 object preserve that shape. Opening a legacy file or restoring a legacy draft does not rewrite its source file or stored bytes. A subsequent explicit export or edit creates version 2 using the current derivation evidence; it does not assert that the earlier author recorded or checked that evidence. Storage keys remain unchanged. Older software that only accepts version 1 cannot reopen version 2. Keep original exports and a matching software copy for rollback. A future dataset or derivation change must provide an explicit compatibility strategy before replacing this registry; exact matching is a bounded snapshot contract, not an archive migration service.

The same validated serializer governs file export and reopening. Input and formatted output are bounded at 2,000,000 UTF-8 bytes. Each text field is bounded at 50,000 UTF-16 code units under `MAX_INVESTIGATION_BYTES` and `MAX_INVESTIGATION_TEXT` in the exchange module. The experimental exports retained under `benchmarks/runs/concepts/` used different shapes and remain historical evidence, outside supported input to this contract. They are never silently converted or overwritten. Tool-specific filter presentation remains distinct from the retained selected evidence.

## Annotation notebook

Forecast annotation uses the National Hurricane Center's Milton [discussion 2](https://www.nhc.noaa.gov/archive/2024/al14/al142024.discus.002.shtml) and [discussion 6](https://www.nhc.noaa.gov/archive/2024/al14/al142024.discus.006.shtml) from October 2024. The repository material record `data/nhc-milton/README.md` and manifest identify the preserved HTML, published bylines, selection and hashes. The retained [National Weather Service use policy](https://www.weather.gov/disclaimer) places page information in the public domain unless otherwise noted; no separate restriction was observed on the selected bulletin text. Reuse credits the source and keeps annotations separate from official information. This purposive sample supports examining wording and evidence references; measuring forecast accuracy requires additional observations and a different method.

Bulletin extraction preserves literal `pre` text, including spaces and newlines. The [offline adapters](architecture.md#bulletin-annotation) verify the frozen source and rights-page hashes before derivation.

`src/annotation/model.ts` defines notebook schema version 1 with a case-specific canonical source set and category vocabulary. Case `nhc-milton-2024` embeds both exact source snapshots. Case `hsa-benndorf-1879` embeds the real Benndorf letter. A notebook contains a research question and up to 200 annotations. Each annotation has a stable ID, source ID, start-inclusive and end-exclusive UTF-16 offsets, exact quote, category, note, declared creator and optional review. `source.text.slice(start, end)` must equal the quote. Overlapping annotations are permitted. The contract does not claim W3C Web Annotation compliance. Each route rejects a notebook for the other case before replacing work, and the existing NHC key, exported fields and file naming remain compatible.

The letter source is Friedrich August Otto Benndorf to Hugo Schuchardt, Vienna, 14 February 1879, edited by Hubert Szemethy (2022) in Bernhard Hurch's Hugo Schuchardt Archiv. The [edition](https://gams.uni-graz.at/o:hsa.letter.7711) and retained teiCrafter source notice identify it. `data/hsa-letter/raw/` preserves the existing plaintext and notice. The letter itself is public domain according to that notice. Images and editorial apparatus are excluded. Upstream removed footnote numerals and retained the page marker. The local derivation only normalizes line endings to LF for native text selection; raw and displayed hashes distinguish both representations. The letter vocabulary is Person, Place, Research topic and Editorial question. Author, recipient, editor and publisher remain separate source roles. No attribution is inferred for the annotation author.

Categories describe a proposed reading. Observation concerns reported measured or seen conditions, forecast concerns expected future developments, and stated uncertainty concerns express qualifications or limits. A note can explain ambiguity or overlapping readings. The notebook's interpretation remains separate from the preserved source wording and its printed forecaster attribution.

Creator kinds are human, LLM, agent and unknown. A supplied name declares an identity without authenticating it. A new annotation has no recorded review. An optional source-fit review requires a named reviewer, their declared kind, a criterion and a result of supports, does not support or unclear. It concerns the quotation's support for that annotation under that criterion. Editing the anchor, category, note or creator clears the previous review. No-op changes retain it. No timestamp or broader scientific-validation claim is inferred.

Unknown fields, unsupported versions, changed sources, duplicate IDs and invalid quote anchors are rejected before replacement. Input and formatted output must fit within 1,000,000 UTF-8 bytes. Each authored text field is bounded at 20,000 UTF-16 code units. Source changes require a new snapshot and an explicit compatibility decision. The Met investigation and collection-editor formats remain independent.

Notebook import preserves accepted bytes until an actual change. [AN-04 and AN-05](specification.md#contrasting-annotation-contract) and [Recovery and replacement](specification.md#recovery-and-replacement) define saved-state recovery, pending forms and protected stored copies. Separate case identities do not authorize conversion between the Met, editor and notebook formats.

## Provenance of individual values

Source, production and checking are separate dimensions. A publisher can supply a value whose original author is unknown. An LLM or agent may generate, transform or review a value; none of those actions alone makes it human-verified or suitable for a research claim. The terms verification and validation require a project-specific target and criterion. Multiple or contradictory assertions remain a domain decision, rather than a mandatory feature of every tool.

For a reviewable check, record the checked value and version, actor, method or criterion, result and available execution evidence. Record a time only when known. Distinguish not checked, no check recorded, a failed check and a successful check. Changed values require reassessment rather than inheriting the earlier result. The collection editor's bare manual flag and the annotation review's explicit invalidation rule remain distinct domain policies.

| Term | Required meaning |
|---|---|
| AI-generated | An LLM or agent produced the value. Record the available producer and derivation evidence. This says nothing about correctness. |
| Deterministically checked | A specified procedure checked a named property of the identified value/version and recorded its result. A passing structural or hash check establishes only that property. |
| AI-reviewed | An LLM or agent assessed the value under a stated criterion. Preserve the assessment as such, including negative or unresolved findings. |
| Human-verified | An identifiable human recorded a successful check of the identified value/version against a stated criterion. Do not infer this state from a publisher, institution or software result. |

These terms describe different acts and form no quality ladder. Actor category supplies no confidence percentage. The current Met pilot exposes recorded derivation evidence but has no editable review or identity-authentication workflow.

`data/met-instruments/field-evidence.json` is generated with the derived records by `scripts/import-dh-data.mjs`. It records each original API field and value, the mapped value and transformation, raw-file path/URL/SHA-256, publisher, and the derivation script path/SHA-256. The original producer is explicitly unknown. Executed checks cover frozen-file hash agreement, object identity, department identity and field-projection agreement. These checks establish agreement with the frozen source and mapping. They do not test historical truth, catalogue authorship, source completeness or research fitness. No human or AI review and no check timestamp is invented.

The field-evidence registry has its own schema version 1, independent of investigation version 2 and the editor's collection version 1. It covers all projected source fields. Attribution combines name, prefix and suffix without dropping qualifiers. Date bounds depend on descriptive-date presence. A blank source date causes displayed bounds to be null even when raw numeric indexing values exist. Empty strings mapped to null remain visible as original empty strings in the source reading view. The original records, raw snapshot and manifest remain unchanged.

Version 2 investigations embed selected-record evidence together with the common derivation and check declarations. IW-06 and IW-07 in [Specification](specification.md#investigation-workbench-contract) govern source inspection and export, implemented through the [field-evidence boundary](architecture.md#field-evidence-and-compatibility). The structure borrows the distinction between entities, activities and agents from the [W3C PROV Primer](https://www.w3.org/TR/prov-primer/), but does not implement PROV-O or claim standards-compliant interchange.

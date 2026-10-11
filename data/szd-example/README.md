# Stefan Zweig letter example

Stefan Zweig's letter to Max Fleischer, dated 22 May 1901 in the source catalogue, supplies one shared document for TEI editing and an edition preview. The [GAMS object](https://gams.uni-graz.at/o:szd.1079) has shelfmark SZ-LAS/B3.1 and five scans. The first two show the envelope, the next two the letter, and the last a repeat with a colour reference. The existing machine transcription preserves that repetition. Five scans therefore do not mean five distinct text pages.

## Material and rights

The [manifest](manifest.json) identifies every frozen source URL, retrieval date, byte size and SHA-256. `raw/gams-mets.xml` is the original GAMS descriptive, structural and rights metadata. `raw/pipeline.tei.xml` and `raw/pipeline-page.json` are unmodified public files from [szd-htr-ocr-pipeline at commit 8b0d7bc](https://github.com/chpollin/szd-htr-ocr-pipeline/tree/8b0d7bc2919a3cf9269686ae79ebf73a9239dc3d/results/korrespondenzen).

The GAMS rights field reads “Literaturarchiv Salzburg, https://stefanzweig.digital, CC-BY”. It supplies no licence version. This package retains that statement and attributes Literaturarchiv Salzburg, Paris Lodron University of Salzburg, and Stefan Zweig Digital. No image bytes are bundled or covered by the repository's MIT software licence. Facsimile references open the original GAMS images and need a network connection. A project that needs locally distributed images must settle its image reuse and attribution requirements before materialising them.

The transcription was produced with `gemini-3.1-flash-lite-preview`. Upstream records an agent review labelled `agent_verified`, while `quality.needs_review` remains true. Its accuracy estimate, confidence wording and review dates are preserved as source assertions. They establish no human verification or measured accuracy here. In particular, doubtful readings on the first text page remain useful material for checking against the facsimile.

## Files and transformations

| File | Purpose |
|---|---|
| `raw/gams-mets.xml` | Preserved catalogue, scan order and source rights |
| `raw/pipeline-page.json` | Preserved machine transcription, page roles and upstream processing history |
| `raw/pipeline.tei.xml` | Preserved upstream TEI with source image surfaces and zones |
| `letter.tei.xml` | Importable TEI with the same text and direct page image references |
| `manifest.json` | Source identities, hashes and declared reuse boundary |
| `verification.json` | Bounded parser and schema check results from 11 October 2026 |

`scripts/prepare-szd-example.mjs` verifies the frozen bytes before making the adaptation. It replaces each page break's `#surf_N` pointer with the corresponding original HTTPS image URL. The source facsimile surfaces, coordinates and all body text remain intact. It adds source attribution and an explicit `machine_unreviewed` revision. The edition pipeline's current frontend resolves direct image URLs but does not resolve this source's nested surface pointers. No words, names or dates are silently corrected. This fixed-source adapter is not a general XML converter.

Run the checks from the Fancy Research Tools repository root.

```console
node scripts/prepare-szd-example.mjs --check
node scripts/check-szd-example.mjs
```

To regenerate the adapted file deliberately, omit `--check` from the first command. Acquisition is separate from regeneration, and neither command calls a model or a network service.

## Work in teiCrafter

1. Keep `raw/pipeline.tei.xml` as the baseline and make a working copy of `letter.tei.xml`.
2. In [teiCrafter](https://digitalhumanitiescraft.github.io/teiCrafter/), open or drop that UTF-8 XML file. For a reproducible development session, use the application under `docs/` at the repository revision recorded in `verification.json`. The deployed site can differ.
3. Inspect the reading text and XML source. Open a page's source image and compare a doubtful reading with the facsimile before changing it. Use XML source for structures without a supported form. Preserve the original reading and record the reason for a deliberate correction in the working file's revision history.
4. Save a Working copy for unfinished input. Validate before requesting a TEI download, then reopen the downloaded XML and compare the changed passage and unrelated text. The application’s working-copy format and schema-authorized TEI download are separate outputs.

The source parser preserved this file exactly and found five page breaks. Both the original and adapted TEI passed the teiCrafter-vendored TEI P5 4.11.0 Relax NG schema. An isolated browser attempt reached the native file picker, which the available browser automation could not operate. The full browser import, edit, download and reopen sequence still needs observation. No successful parser check is presented as that browser acceptance.

## Preview an edition

Use a separate local copy of [Agentic Edition Pipeline](https://github.com/DigitalHumanitiesCraft/agentic-edition-pipeline) with the revision recorded in `verification.json`. Put a working copy of `letter.tei.xml` into `results/tei/o_szd.1079.xml`, with no fabricated step-5 generation report. Configure the project identity and rights in that copy before building.

```console
uv sync
uv run python pipeline/06_build_frontend.py --serve
```

This enters at the documented external-TEI frontend stage. The actual step-6 parser was checked against this package and resolves all five source images while retaining the upstream page text. The package contains no canonical Agentic Edition Pipeline transcription JSON, so its local correction server and regeneration stages are not a supported round trip for this imported TEI. Edit the XML in teiCrafter, preserve the original, replace the working external TEI deliberately and rebuild the local preview.

Keep automatic publication disabled for this research example. Its `machine_unreviewed` status intentionally does not satisfy the pipeline's scholarly publication gate. Source interpretation, human review and publication approval remain separate work. No provider credentials or paid transcription calls are needed for this external-TEI preview route.

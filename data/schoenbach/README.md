# Schönbach correspondence metadata

The collection editor starts with five real correspondence descriptions from [Fünf Briefe aus dem Nachlass von Anton Emanuel Schönbach](https://schoenbach.acdh.oeaw.ac.at/), edited by Martin Anton Müller. The frozen [CMIF source](cmif-schoenbach.xml) declares [CC0](https://creativecommons.org/publicdomain/zero/1.0/) in its TEI header. It was copied byte for byte from CorrespExplorer's `docs/data/schoenbach.xml` on 2026-10-10. [The manifest](manifest.json) records the repository revision, original upstream URL, licence and SHA-256. The original URL was read to check the source and rights declaration; acquisition used the local checkout.

## Projection

`node scripts/import-schoenbach-data.mjs` checks the frozen hash and regenerates `collection.json` and `evidence.json`. With `--check` it compares the derived bytes without writing. The extractor accepts this bounded snapshot only and provides no general TEI import.

| Collection field | Source or derivation |
| --- | --- |
| `id` | `schoenbach-` plus the three-digit `correspDesc/@key` |
| `title` | Sender `persName`, an arrow, then recipient `persName`; this display title is constructed |
| `kind` | `Letter`, a projection label |
| `place` | Sent `correspAction/placeName` |
| `date` | Sent `correspAction/date/@when`, kept as text |
| `source` | Edition link, CMIF record key, original URL, source hash and mapping qualification |
| `notes` | Empty working note |
| `review` | `draft`; no historical or human review is inferred |

The complete XML retains authority references, the received place of the fifth letter, correspondence action roles and publication metadata. `evidence.json` retains each literal correspondence element and the source values shown beside the working record. The collection JSON is a descriptive projection, not a lossless TEI export. Exporting it preserves its fields and source identity but does not recreate the CMIF document.

## Editing and compatibility

The source values are read-only. Changes affect the working collection and keep the frozen source available for comparison. Source evidence is shown only for a known record identifier with the exact bundled `source` string. Imported records do not acquire source evidence by identifier alone. Edited values are not labelled source-verified.

Existing schema version 1 collections, browser drafts and storage keys remain supported. A stored collection is restored before choosing a record; the new default never replaces it. Synthetic `fixtures/demo.json` records remain software test fixtures. This source does not include the letter texts or establish the historical accuracy of the edition's metadata.

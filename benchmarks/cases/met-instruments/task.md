# Musical-instrument collection exploration

This filtering and aggregation contract applies to `/baseline/`. The investigation workflow at `/pilot/` follows the [concept task](../../ui-concepts-brief.md) and its recovery contract.


Case version 0.2 asks how instrument classifications and supplied culture descriptions are distributed within a bounded Metropolitan Museum of Art metadata snapshot, and which descriptive fields are absent. This is a proposed descriptive research task for implementation and review.

## Material

Use the 60 lowest numeric object IDs in the retrieved Musical Instruments department listing, department 18. Preserve the exact retrieved object responses in `data/met-instruments/raw/`. The data agent records retrieval, selection and rights in that directory's provenance documents. The task uses metadata and displays no source images.

The numeric selection is reproducible and convenient for a small pilot. It is not a representative sample of instruments, cultures, periods or the full collection. Interpret counts only within the selected snapshot. Museum `culture` and `classification` values are source descriptions. Do not infer geographic identity or harmonize their meaning without an additional documented method.

## Required workflow

1. Inspect the collection's source, selection and number of records.
2. Narrow the material through text search and source classification or culture values, including absent culture descriptions.
3. Inspect an object's source metadata and follow its original museum reference.
4. Compare classification and culture counts within the current selection, with a visible denominator and explicit missing values.
5. Download a JSON result containing the filter state, selected source records and enough provenance to identify the original snapshot.

The original `/tool/` workspace and its existing drafts remain accessible. The reference case uses its own route and state. This case adds no metadata correction, historical inference, runtime Large Language Model service or image viewer.

## Calculation contract

Search matches a case-insensitive, diacritic-insensitive substring over the `title`, `objectName`, `culture`, `objectDate` and `medium` source fields joined with a single space, using NFD normalization, removal of combining marks and `ß` to `ss`. Empty fields contribute an empty string. A phrase can therefore cross a field boundary. Exact classification and culture filters combine with search using AND. A missing-value filter supports `culture`, `objectDate` or `medium` and means an absent or whitespace-only string. Empty filters select all records. Search has no fuzzy matching or historical synonym expansion.

Group by the exact source strings in `classification`, `culture` or `objectName`. Represent absent or whitespace-only values explicitly as missing. Missingness counts for `culture`, `objectDate` and `medium` describe absent values, with the selected-record count as denominator. They do not measure the completeness or quality of the underlying historical evidence. The oracle sorts group labels by code point for deterministic storage. A presentation may use a different documented order while preserving labels and counts.

Keep source date descriptions as strings. Numeric beginning and ending dates, where retained, remain museum metadata and are not converted into exact historical event dates. Preserve stable object IDs and source URLs in exports.

## Oracle and acceptance

Run `node benchmarks/cases/met-instruments/oracle.mjs --write` once after the snapshot is complete to freeze `expected.json`. Subsequent verification uses `node benchmarks/cases/met-instruments/oracle.mjs` without `--write`, which fails if current raw inputs or expected calculations differ. The script imports no application helpers.

The expected file records each raw response hash, selected IDs, exact counts and fixed filter cases. Compare UI results and downloaded output with it. Inspect at least two individual raw records against the displayed fields. Any intentional change to source selection or calculation rules requires a new recorded case revision and regenerated expectations before interpreting the new result.

Research acceptance remains pending until an accountable researcher assesses the task and interpretation. The development pilot assesses technical execution under the conditions in the [run record](../../runs/2026-10-10-met-instruments.md).

## Revision history

Case version 0.1 left the separator between search fields unspecified. Parent review found that the oracle used a newline while the application used a space. Version 0.2 explicitly uses a single space and adds `organ pipe organ` as a cross-field phrase case before final verification. The source snapshot and the original ten query results are unchanged. This recorded contract repair is part of the development pilot.

# Metropolitan Museum musical instruments snapshot

The frozen source supports the historical catalogue at `/baseline/` and the investigation interfaces at `/pilot/` and `/concepts/`. Descriptive counts below concern the catalogue task. The investigation task compares original source wording and stores researcher notes separately under the [investigation exchange contract](../../knowledge/data.md#investigation-exchange).


This pilot examines how catalogue classifications and missing descriptive metadata are distributed within a small selection of musical instrument records. Counts describe the selected catalogue records. They cannot establish the historical prevalence of instruments, makers or cultures.

## Source and rights

The Metropolitan Museum of Art publishes its selected collection metadata under [CC0](https://github.com/metmuseum/openaccess). The [official API documentation](https://metmuseum.github.io/) defines the source fields. The collection remains the source of the catalogue assertions. Fancy Research Tools selects and transforms a subset for a software adaptation experiment and does not imply endorsement by the museum.

The snapshot was retrieved on 10 October 2026. Exact UTC timestamps, source URLs and SHA-256 checksums are in [manifest.json](manifest.json). The source API does not supply an immutable release identifier. Preserved response bytes and their checksums identify this local data state. A copy of the source repository's CC0 license is preserved in [raw/LICENSE](raw/LICENSE).

Only metadata is used. Original API responses contain image URLs and artwork public-domain flags. No image files were downloaded, and the derived dataset contains no image URLs. The metadata license does not mean every represented artwork is in the public domain.

## Selection

The importer requests the object listing for department 18, Musical Instruments, sorts unique object IDs numerically and selects the first 60. The listing reported 5,269 objects at retrieval. The selected IDs are enumerated in the manifest. This is a bounded convenience sample ordered by identifiers. It was chosen for reproducible selection and a manageable interface experiment. It has no claim to represent the museum's holdings or a historical population.

The complete listing response and each selected object response are retained unchanged in `raw/`. Missing identifiers between the first and last selected object are not filled in. Responses are individually retrieved, so this is a retrieval interval rather than an atomic database snapshot.

## Derived contract

`records.json` contains an envelope with `schemaVersion: 1`, `datasetId: "met-instruments"`, a title and an array of records. This contract is specific to the pilot and independent of the editable starter collection schema.

| Derived field | Source field and transformation |
|---|---|
| `id` | `objectID` converted to a string |
| `title` | `title`, unchanged |
| `department` | `department`, unchanged and checked against Musical Instruments |
| `objectName` | `objectName` |
| `culture` | `culture` |
| `objectDate` | `objectDate`, retaining descriptive uncertainty and ranges |
| `beginYear`, `endYear` | `objectBeginDate`, `objectEndDate`, or null if the descriptive date is empty |
| `medium` | `medium` |
| `artist` | `artistDisplayName` |
| `artistPrefix`, `artistSuffix` | `artistPrefix`, `artistSuffix`, preserving attribution qualifiers |
| `classification` | `classification` |
| `sourceUrl` | `objectURL` |

Empty source strings in `objectName`, `culture`, `objectDate`, `medium`, `artist`, `artistPrefix`, `artistSuffix` and `classification` become JSON null. Other strings are retained without trimming, translation or inferred categories. Additional source fields remain available in raw responses. The selected fields are an explicit projection for this task.

Date bounds are museum indexing ranges. They are not exact creation dates, statistical confidence intervals or a basis for inventing a midpoint. The pilot's descriptive counts do not calculate dates. The `culture` field retains institutional terminology and should be read as a catalogue assertion rather than an independently established cultural identity. A missing artist name means that the source field is empty, which does not establish that an object had no maker. Artist names must be displayed with their prefix and suffix qualifiers. Constituent information remains in the raw source and must be considered before maker-level research.

Review of the initial projection identified attribution qualifiers in five selected records. The projection was corrected to preserve `artistPrefix` and `artistSuffix` before interface acceptance. For example, object 500553 attributes its maker to Vincentius Vinaccia, and object 500555 gives the qualifier “Signature possibly” for Plisbel. Displaying only the name would lose this uncertainty. This correction changes the derived checksum while preserving all original response bytes.

The first object, [Ūd, 500526](https://www.metmuseum.org/art/collection/search/500526), has no culture or artist name in these source fields. Its descriptive date is “19th century”, while the indexing bounds are 1801 and 1900. This illustrates why the display date and missing-value handling are preserved separately.

## Reproduction

Run this command from the repository root to verify every raw checksum and reproduce the derived data without network access:

```sh
node scripts/import-dh-data.mjs
```

`records.sha256` identifies the generated JSON bytes. Run the independent benchmark oracle to compare expected results with the application. The importer and its own output are not an independent check of analysis correctness.

The initial download used `node scripts/import-dh-data.mjs --fetch`. That command refuses to overwrite an existing manifest. To investigate a later source revision, preserve this snapshot and adapt the importer to a separately named destination. Retrieval from the current API may produce changed values and must be treated as a new data state.

## Research limits

An appropriate pilot task is to filter an exact catalogue classification, inspect the underlying objects and export descriptive counts with their selection criteria. A second task is to inspect missing catalogue fields and record a reviewer observation separately from the source assertion. Neither task validates a historical explanation. Further research requires a substantive question, a justified selection and domain review of the catalogue's terminology and coverage.

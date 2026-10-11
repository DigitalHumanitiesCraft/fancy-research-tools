# Historical photographs from the Cleveland Museum of Art

This frozen collection supports comparing photographic techniques, inspecting catalogue dates and following creator attributions to their source. It contains forty records and their web-size JPEGs from the [Cleveland Museum of Art Open Access API](https://openaccess-api.clevelandart.org/). The example was acquired independently for Fancy Research Tools. It contains no customer material.

## Acquisition and rights

`manifest.json` records the query, retrieval times, selected artwork IDs, each source URL and the SHA-256 of the raw response and every local image. The raw response contains the complete result of the stated query at acquisition. Three explicitly selected works provide literal year, approximate year and year-range cases. The remaining works are the thirty-seven smallest other numeric artwork IDs with type `Photograph`, licence field `CC0` and a web image on the museum's image host. This selection is reproducible against the frozen response. It is a convenience sample for interface work and makes no claim to represent photographic history or the museum collection.

The API's `created_before=1900` filter includes records labelled `c. 1900`, `c. 1902`, `c. 1900s` and `1890s-1930s`. Its numeric indexing contributes to retrieval and does not establish that all selected photographs predate 1900. The source filter and all descriptive dates remain visible in the retained evidence.

The museum's [API documentation](https://openaccess-api.clevelandart.org/) designates metadata CC0 and restricts CC0 image access to records whose `share_license_status` is `CC0`. The [Open Access page](https://www.clevelandart.org/open-access) describes the programme. The acquisition checked that field separately for every selected work. `manifest.json` records the rights-page URLs, check times and response hashes. Their HTML is not redistributed. Local images retain the supplied JPEG bytes and source image URLs. Display dimensions come from the JPEG frame header. The API's dimensions differ from the actual image in five selected records, so the manifest keeps both values and `source.fields.image` preserves the original metadata. These are the museum's web derivatives, with maximum dimensions of 1263 pixels in this sample. They support initial inspection. Close study of fine photographic detail requires the museum's print or full-resolution assets. [CC0](https://creativecommons.org/publicdomain/zero/1.0/) permits reuse, while attribution to the museum and photographer supports source tracing.

Historical titles and descriptions retain source wording. Open reuse rights alone establish neither community endorsement nor cultural appropriateness for every reuse. The snapshot contains no inferred cultural-sensitivity classifications or blanket claim of CARE compliance.

## Files and reproduction

| File | Purpose |
|---|---|
| `raw/artworks.json` | Exact museum response, including unselected records |
| `manifest.json` | Acquisition, rights findings, selection and source/asset hashes |
| `images/` | Unmodified web JPEGs for selected works |
| `collection.jsonld` | Deterministic application projection with embedded context and source evidence |
| `schema.json` | Version 1 structural interchange contract |
| `semantic-cases.json` | Independently recorded expectations for selected source cases |

From the repository root, run:

```sh
node scripts/import-photographs.mjs
node scripts/check-photographs.mjs
```

The importer verifies the frozen response and image hashes before regenerating the projection. Ordinary reproduction makes no network request. The check compares the regenerated projection byte for byte, checks its source associations and image metadata, and tests the independent semantic cases. The projection also records the importer digest. Format and review an importer change before regenerating the projection.

`node scripts/import-photographs.mjs --fetch` is an explicit acquisition operation. It refuses to replace an existing manifest. A changed source collection requires a separately named snapshot and an explicit decision about saved investigation compatibility. The importer refuses an incomplete single-page response. A future query exceeding the acquisition bound needs an explicit pagination revision.

## Projection and meanings

Each item represents one museum catalogue artwork record. The source artwork URL provides its stable identity. Distinct records with the same title remain distinct. Each item retains the original projected fields in `source.fields`, together with its source API URL and the raw snapshot path and hash. The complete response preserves other source fields for later adaptation.

| Projection | Source and transformation |
|---|---|
| `title`, `accession`, `sourceUrl` | Literal `title`, `accession_number` and `url` |
| `date.label` | Literal `creation_date` |
| `date.start`, `date.end`, `date.kind` | Conservative parsing of the literal date label described below |
| `date.indexStart`, `date.indexEnd` | Museum `creation_date_earliest` and `creation_date_latest`, retained separately |
| `creators` | Every source creator description, role, qualifier and extent; source creator API identity when available |
| `technique` | Source `technique`, with an empty value represented as null |
| `culture` | Source `culture` array, without geographic interpretation |
| `image` | Local path, dimensions read from the JPEG frame header, original web-image URL and checked CC0 status |
| `source.fields` | Original field values before projection, including complete creator objects |

Literal four-digit years become `exact-year`. A literal year range such as `1865–66` becomes `range`, with abbreviated end years expanded within the same century. The range gives the source's dating span and does not establish an event duration. A literal `c. 1865` or `ca. 1865` becomes `approximate`, anchored to the named year for ordering. Its `start` and `end` both contain the nominal year. No uncertainty width is inferred from the museum's numeric indexing bounds. An approximate marker must remain distinguishable and retain its descriptive label.

Literal decades such as `1860s` become `decade`, spanning 1860 through 1869 while retaining the original label. The span describes catalogue dating, without claiming a ten-year event duration. Other wording, including `c. 1900s` and `1890s-1930s`, stays unchanged with kind `unknown` and null nominal years. Here `unknown` means that this classifier does not position the date. It does not mean that the source lacks a date. Interfaces must keep these works available under a label such as “Other catalogue dates.” A richer parser needs explicit source cases and a coordinated rendering contract.

Creator names remain the complete supplied descriptions, including life dates. Role, qualifier and extent remain separate fields. For example, the attribution of `Yosemite Falls` to Muybridge retains `attributed to`, and `Footbridge Near Chingford` keeps its artist, author and publisher. JSON-LD models each creator entry as an attribution whose `id` refers to the source creator. It does not merge the attribution's role or qualifier into a global person node. No identity reconciliation is performed.

The embedded JSON-LD context uses Schema.org terms where their meaning fits and a small project vocabulary for catalogue dates and evidence. Original source fields are JSON literals. This contract provides no complete cultural-heritage ontology, PROV-O implementation or general migration service.

Culture, a museum gallery and a find spot do not establish the photographed or depicted place. This example has no generated coordinates or map. A map adaptation requires separately sourced location assertions with an explicit location type and provenance. There are no LLM-extracted values in this snapshot.

## Verification limits

The source and image checks establish byte agreement and reproduction. The semantic cases establish selected source-to-display distinctions independently of the date parser. They do not verify historical truth, image subject matter, catalogue authorship or community consent. Browser interaction, accessibility and research acceptance belong to the repository's interface evaluation.

---
title: Architecture
project:
  name: Fancy Research Tools
  repository: https://github.com/DigitalHumanitiesCraft/fancy-research-tools
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
template:
  name: Vorlage Architecture
  version: 0.4
  url: https://dhcraft.org/Promptotyping/promptotyping-document/architecture
status: draft
language: en
created: 2026-10-10
updated: 2026-10-11
---

# Architecture

The starter separates domain validation, browser recovery and rendering for each research workflow. Comparison uses frozen catalogue records. Annotation supports explicit letter and forecast cases with exact source spans. The collection editor maintains its flat-record contract while starting with a real correspondence projection. The gallery groups primary destinations by research task. Development guidance retains the earlier workspaces without merging their state, runtime dependencies or credentials.

## Core and adaptation boundaries

The core combines maintained contracts, build and verification tooling, and small UI primitives. The Met comparison and bulletin annotation now provide concrete adaptation boundaries. Broader reuse remains dependent on further cases and research assessment.

| Change | Current adaptation points | Evidence to preserve |
|---|---|---|
| Data meaning and structure | `knowledge/data.md`, domain validator and JSON adapter | Accepted and rejected inputs, meaningful round trips and provenance |
| Research workflow | Specification, application state and editing controls | Task completion, failure recovery and domain review |
| Presentation | Design contract, UI tokens and native controls | Keyboard access, reflow and understandable feedback |
| Persistence or deployment | Architecture, browser persistence and build configuration | Explicit trust boundary, recovery and deployment-path checks |

These editing locations provide no plugin API. The bulletin adaptation retains the static build, native controls, validation-before-replacement, exact author-text binding and the evidence-preservation rules. Its domain model, source extraction, notebook recovery controller and reading interface are independent. Catalogue field mappings cannot describe a quotation anchor or the authority of an annotation review. Forcing them into the Met investigation schema would discard that meaning.

Introduce another shared interface only after documenting the behaviour it preserves across actual cases. The existing flat collection model does not establish a common representation for TEI, correspondence networks or other material.

An adaptation brief should give the agent the research task, a referenced data state, allowed changes, relevant contracts and observable acceptance criteria. Decisions and checks return to those contracts and their evidence record. The development approach requires no particular Large Language Model (LLM) provider or runtime LLM integration.

## Stack

TypeScript supports explicit interfaces and compile-time checks. Native DOM controls keep the initial interaction surface inspectable. Vite builds static assets and provides local development. Dependency versions are maintained in the package manifest and lockfile.

## Components

| Route or component | Implementation | Responsibility |
|---|---|---|
| Overview and documentation | `docs/`, `scripts/build-docs.mjs`, `src/docs.ts` | Entry guidance and allowlisted contracts with source-relative links |
| Tool gallery at `/tools/` | `tools/index.html`, `src/gallery.ts`, `src/gallery.css` | Explicit links to runnable workflows and the concept study |
| Collection comparison at `/pilot/` | `src/workbench/`, `src/research/` | Catalogue comparison, field-source inspection and saved investigations |
| Collection Explorer at `/photographs/` | `src/photographs/`, `data/photographs/` | Separate frozen photographic catalogue, query/selection, chronological inspection, image viewer and evidence export |
| Instrument alternatives | `src/concepts/`, `src/research/` | Separate interactions sharing the same Met investigation contract |
| Historical catalogue at `/baseline/` | `src/pilot/` | Read-only filtering, aggregation, selected detail and URL navigation |
| Collection editor at `/tool/` | `src/domain/`, `src/app/` | Validated flat records, editable working copy and local collection recovery |
| Source annotation at `/annotations/` and `/letters/` | `src/annotation/` | Exact quotation anchors, separate annotation/review assertions and notebook recovery |
| Shared UI primitives | `src/ui/` | Text preservation, local symbols and reusable base styles where appropriate |

Feature code depends on domain operations. Domain code remains independent of the DOM and browser storage. Import failure must not partially replace application state.

The historical catalogue at `/baseline/` reads its form through one control-to-filter conversion before state transitions. Rendering and export consume the applied query, while pending inputs remain identifiable. The editor separates selected identity from filtered membership and restores only navigation controls when a dirty-form transition is cancelled. These boundaries prevent unrelated interactions from discarding input or presenting contradictory state.

`src/ui/icons.ts` supplies local SVG symbols with visible labels supplied by callers. `src/ui/text-value.ts` retains a field's accepted string until that field receives input, so native controls cannot silently normalize unrelated imported text. The editor, workbench, concepts and annotation form reuse that bounded behaviour. Documentation and the historical catalogue share base styles. Each research tool retains its own visual system, while concepts share a small reset and recovery-control stylesheet.

## Data flow

Offline importers produce the bundled snapshots. Domain validators accept or reject complete imported documents before rendering replaces the working state. Views derive from that validated state and their route controls. Edits validate a candidate before updating the working copy. Local persistence reports success or recovery failure, and explicit export creates a separate file while preserving the original input.

The historical catalogue derives its graphics and exports from the same pure aggregation and performs no persistence writes. The editor uses `src/app/storage.ts`, Met investigations use `src/research/browser.ts`, and bulletin notebooks use `src/annotation/browser.ts`. Their schemas and storage keys remain independent, so opening a new tool does not migrate another tool's drafts.

## Photograph reference boundary

The photograph reference uses its own JSON-LD projection of an independently acquired open snapshot. Pure source/query operations and rendering remain separate. Its URL state carries view, filters and selection without reading or writing the older tools' recovery keys. Source image assets are local build inputs and resolved through Vite so repository-subpath deployment preserves their URLs.

OpenSeadragon is installed from npm and bundled locally for direct image pan/zoom. A local JPEG image tile source supports this slice without claiming an IIIF service. Native controls provide keyboard operation and an ordinary image remains accessible as a fallback. [The OpenSeadragon image tile-source example](https://openseadragon.github.io/examples/tilesource-image/) documents that supported input. No museum API call is required in the runtime path. The build lockfile records the dependency version.

## External-TEI example boundary

The SZD package is a source-preserving adapter for one known TEI snapshot. Its prepared page references can be read by the edition template's frontend stage. It supplies no canonical transcription JSON for that template's correction server. The public build copies only the explicit downloadable package assets; raw source and verification details remain in the repository. External applications keep their own environments and contracts. The [data contract](data.md#szd-edition-example) owns source, rights and production status.

## Investigation workbench and concepts

`src/workbench/main.ts` owns the collection comparison interaction at `/pilot/`. `src/research/investigation.ts` owns the Met-specific investigation schema, source-preserving validation, attribution and safe source links. `src/research/browser.ts` handles download, reopen and local draft recovery for the workbench and all three concepts. The shared boundary is established for this snapshot and workflow. An interdisciplinary record schema remains unsupported by that evidence.

Each route has an independent storage key. An investigation preserves selected IDs and original records with the exact snapshot manifest, search, research question and separately authored interpretation. Imports validate before replacement. Pending edits during asynchronous file reading abort replacement. Local storage compares the last observed value before writing, preserving detected conflicts and corrupt copies. The editor's flat-record persistence remains a separate module and contract.

A stored empty string is a corrupt copy, distinct from a missing key. When another tab replaces or clears a saved investigation, the current work becomes unsaved. Export remains available, further persistence stays blocked and leaving the page requests confirmation. An unchanged restored draft, including version 1, requires no write or unload warning.

## Field evidence and compatibility

The offline Met importer derives records and the per-field evidence registry from the same frozen raw snapshot. `src/research/evidence.ts` provides copied evidence to the workbench and shared investigation exchange. Rendering uses text nodes. The external record link remains a separate action. The addressable source reading view owns no persistence and cannot change the investigation.

The Met exchange accepts exact legacy version 1 and current version 2. Creation produces version 2 with selected field evidence. Recovery reads both and retains the original stored bytes until a user change. Opening never performs a storage migration. Future changes to either domain's canonical snapshot require a deliberate compatibility decision. Strict snapshot matching supplies no general archive migration service.

Git attributes keep the importer at LF and preserve exact derived-file bytes across checkouts. The separate `scripts/check-data.mjs` runs the existing importer against temporary copies and compares its outputs before the independent oracle. Keeping this gate outside the importer avoids changing the generator digest embedded in existing version 2 exports.

The [maintenance guide](../docs/customizing.md) requires a recoverable source state, original exports, supported schema versions, dependency lockfile, known limitations and explicit owner assignments at handover. A maintenance document does not establish a support agreement. Review updates as bounded changes and repeat affected acceptance tasks before promoting them.

## Bulletin annotation

`src/annotation/model.ts` validates notebook schema 1 against an explicit case descriptor, holding canonical sources, permitted categories, storage suffix and export filename. The Milton and Benndorf cases use separate routes and keys. Cross-case imports are rejected before replacing work. Each annotation contains source identity, exact offsets and quotation, category, interpretation, declared creator and optional review. Source text must match the case snapshot. The [data contract](data.md) owns meanings and limits.

`src/annotation/main.ts` owns source navigation, native text selection, annotation editing and recorded review controls. It validates a complete candidate before replacing saved annotations. Changing the anchor, category, interpretation or creator clears the earlier review. A new review records its own declared actor, criterion and result. Neither a matching offset nor a declared identity authenticates the contributor or validates meteorology.

The separate recovery controller preserves imported bytes on an unchanged save, rejects edits made during asynchronous file reading, protects corrupt stored copies and blocks persistence after a detected external change. It stores the research question and saved annotations. Pending annotation forms remain in memory and require save or discard before import/export. Navigation guards and a beforeunload warning protect that pending work, but no crash recovery of the unfinished form is provided.

`scripts/import-annotation-data.mjs` extracts the retained bulletin HTML and checks raw and rights-page hashes. `scripts/check-annotation-data.mjs` repeats extraction in temporary storage and compares bytes. `data/hsa-letter/generate.mjs` converts the retained letter text to LF and supplies fixed source-role and rights metadata recorded from the upstream notice. Its check reproduces `sources.json` from the letter bytes and configured metadata without reading the notice. `scripts/import-schoenbach-data.mjs` creates the editor's descriptive collection and evidence from frozen CMIF. `npm run check:data` verifies the configured source derivations within these bounds; the package scripts define the current gate inventory. No new runtime source request is required.

## Documentation and gallery

The overview leads with Collection Explorer and links the tool gallery and development guidance. The gallery catalog leads with Collection Explorer and groups the remaining entries by capture, analysis, correction and edition building. Existing applications and guided setup remain distinct. Technical examples are linked from development guidance, with their original runtimes intact. Previous task-group fragments remain as aliases. The gallery provides explicit application links, leaving readable descriptions selectable. Documentation navigation groups guides and reference documents and generates section links from published headings. These pages guide entry without imposing a shared working interface on the tools.

The documentation generator and Vite read the same explicit `scripts/docs-pages.json` manifest. Local links resolve from Markdown locations into generated routes, including repository subpaths. Markdown targets require an allowlisted destination, heading IDs are unique, and published fragments are checked before output. `scripts/build-gallery.mjs` generates the gallery from `data/tools/catalog.json`. Both generators run before development and production builds. Tool entrypoints remain handwritten. The gallery's local screenshot assets add no third-party runtime request. External tools load only after ordinary navigation. The documentation footer reads the package version.
## Security

Imported files are untrusted input. Enforce shape and size limits before accepting them. Render record values and annotations as text. Only supported URL protocols may become links, and notebook source URLs must match the frozen source contract. Credentials and privileged API calls require a server-side design. Local storage shares the origin's trust boundary, so confidential deployments require a separate threat assessment. Sequential stale-copy detection provides no atomic collaboration guarantee.

## Accessibility

Use native labels and controls, semantic headings, visible focus and a skip link. Validation and storage feedback must be perceivable without relying on colour. [Testing](testing.md) separates automated checks from manual assessment.

## Repository structure

| Path | Responsibility |
|---|---|
| `src/` | Application and feature implementation |
| `knowledge/` | Canonical requirements and decisions |
| `docs/` | Public guides |
| `scripts/` | Reproducible build support |
| `tests/` | Behavioural evidence |
| `.github/workflows/` | Continuous integration and deployment |
| `dist/` | Generated static output |

## Build and deployment

The [getting-started guide](../docs/getting-started.md) provides local commands. GitHub Pages serves static output after repository-level Pages configuration and an authorised deployment. A successful local build does not establish that a public deployment exists. Project-site paths must work below a repository subdirectory. The current candidate's execution status is recorded in [Testing](testing.md#project-tool-revision-2026-10-10).


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

The static build separates domain validation, browser recovery and rendering for each research workflow. Shared primitives support bounded reuse while independent domains retain their own schemas, storage keys and source identities. Observable behaviour is defined in [Specification](specification.md), and versioned interchange in [Data](data.md).

## Core and adaptation boundaries

The core comprises maintained contracts, build and verification tooling, and small UI primitives. The Met investigation and annotation implementations demonstrate concrete reuse boundaries.

| Change | Implementation boundary | Contract and evidence |
|---|---|---|
| Material and data meaning | Domain validator and source adapter | [Data](data.md), accepted/rejected inputs and source-preserving round trips |
| Research workflow | Application state and interaction controller | [Specification](specification.md), operated task and recovery checks |
| Presentation | Tool styles, tokens and native controls | [Design](design.md), keyboard, reflow and interpretation review |
| Persistence or deployment | Browser recovery module and build configuration | Trust boundary, supported versions and deployment-path checks |

Annotation reuses the static build, native controls and exact author-text primitive. Its quote anchors, review assertions, case model and recovery controller remain separate from catalogue investigations. The flat collection model also remains independent. A shared plugin interface requires evidence that it preserves meaning across actual adaptations.

The [adaptation guide](../docs/customizing.md) records retained, modified and replaced responsibilities. A new brief identifies the task, referenced material, allowed changes and acceptance criteria. The architecture has no dependency on a particular development LLM provider or runtime LLM feature.

## Stack

TypeScript makes internal interfaces explicit. Native DOM controls provide the interaction surface. Vite supplies local development and builds static assets. The package manifest and committed lockfile define dependency versions. OpenSeadragon is bundled from npm for the photograph viewer.

## Components

| Route or component | Implementation | Responsibility |
|---|---|---|
| Overview and documentation | `docs/`, `scripts/build-docs.mjs`, `src/docs.ts` | Generated guidance and allowlisted contracts with source-relative links |
| Gallery at `/tools/` | `data/tools/catalog.json`, `scripts/build-gallery.mjs`, `src/gallery.ts`, `src/gallery.css` | Task entries with explicit application or setup destinations |
| Collection Explorer at `/photographs/` | `src/photographs/`, `data/photographs/` | Photograph query, selection, chronology, image inspection and evidence export |
| Comparison at `/pilot/` | `src/workbench/`, `src/research/` | Met investigation interaction, evidence view and recovery |
| Instrument concepts | `src/concepts/`, `src/research/` | Alternative interactions using the same investigation exchange |
| Historical catalogue at `/baseline/` | `src/pilot/` | Read-only Met filtering, aggregation and URL navigation |
| Collection editor at `/tool/` | `src/domain/`, `src/adapters/`, `src/app/` | Flat-record validation, JSON interchange, editing and recovery |
| Annotation at `/annotations/` and `/letters/` | `src/annotation/` | Case-specific sources, quotation anchors, editing and notebook recovery |
| Shared primitives | `src/ui/` | Local SVG symbols, exact author-text binding and bounded base styles |

Domain operations remain independent of the DOM and browser storage. Controllers validate complete candidates before replacing state. The baseline converts form controls into one applied query consumed by both rendering and export. The editor tracks selected identity separately from filtered membership, which lets cancellation restore navigation controls without discarding form input.

`src/ui/icons.ts` provides symbols whose labels belong to callers. `src/ui/text-value.ts` retains an accepted string until its own control receives input. The editor, workbench, concepts and annotation forms use that primitive to implement the [exact-string contract](data.md#relationship-to-source-material). Each tool keeps its own visual system. Shared base or reset styles do not imply a common tool layout.

## Data flow

```text
Frozen source bytes -> offline adapter -> bundled validated material
                                                 |
                                    route + application state
                                      /          |          \
                                   views      edits       explicit export
                                                 |
                                         local recovery
```

The baseline derives graphics and exports through pure query/aggregation functions and performs no persistence writes. The editor uses `src/app/storage.ts`, Met investigations use `src/research/browser.ts`, and notebooks use `src/annotation/browser.ts`. Each controller tracks the last observed storage value before writes. That comparison detects sequential stale copies but supplies no atomic multi-tab transaction.

The investigation and notebook controllers retain imported bytes alongside parsed state, avoid rewriting an unchanged restore, and use revision tracking to abort a file read after intervening input. The editor protects a corrupt stored copy through explicit overwrite confirmation. Recovery behaviour and its limits are specified in [Recovery and replacement](specification.md#recovery-and-replacement).

## Photograph reference boundary

The photograph tool derives pure source/query operations from its own JSON-LD snapshot. URL state carries view, filters and selection without accessing older tools' recovery keys. Local image assets resolve through Vite, including repository-subpath deployments.

OpenSeadragon uses a local JPEG image tile source, with native keyboard controls and a direct image fallback. This follows the supported [image tile-source input](https://openseadragon.github.io/examples/tilesource-image/) and supplies no IIIF service. The runtime needs no museum API request. Projection semantics and export limitations are in [Data](data.md#open-photograph-reference).

## External-TEI example boundary

The SZD adapter prepares page references from one pinned TEI snapshot for the edition template's frontend reader. It supplies no canonical transcription JSON for that template's correction server. External applications retain their own runtime and state contracts.

`scripts/build-example-assets.mjs` copies an explicit allowlist into `public/examples/szd/` before development and production builds. It publishes the prepared TEI, manifest, verification record, README and retained raw source files without altering their bytes. Facsimile bytes are not bundled. Source rights, production status and transfer limitations are defined in [Data](data.md#szd-edition-example).

## Investigation workbench and concepts

`src/workbench/main.ts` controls the comparison route. `src/research/investigation.ts` owns the Met-specific validator and serializer. `src/research/browser.ts` supplies download, import and recovery to the workbench and each concept through independent route keys. This shared exchange is established for one frozen catalogue and research workflow.

The addressable source view reads `src/research/evidence.ts` without persistence access. It returns copied evidence for display or export, preventing a view from mutating the canonical registry. External record navigation is a separate action.

## Field evidence and compatibility

The offline Met importer derives records and field evidence from the same frozen source. Git attributes preserve its LF source and exact derived bytes across checkouts. `scripts/check-data.mjs` runs the importer against temporary copies before the independent oracle. Keeping this check separate avoids changing the generator digest embedded in existing exports.

The [investigation exchange](data.md#investigation-exchange) owns supported versions, exact snapshot matching, legacy-byte preservation and rollback. Any change to the canonical snapshot or generator identity must resolve that compatibility contract before the new material replaces the existing registry.

## Bulletin annotation

`src/annotation/model.ts` accepts an explicit case descriptor containing canonical sources, permitted categories, storage suffix and export filename. `src/annotation/main.ts` implements source navigation, native text selection and candidate annotation/review editing. `src/annotation/browser.ts` handles saved notebook recovery. The [annotation contract](data.md#annotation-notebook) defines quotation offsets, producer and review semantics, bounds and cross-case rejection.

Offline adapters preserve each material's derivation boundary. The NHC importer checks raw and rights-page hashes and extracts literal bulletin text. The Benndorf generator normalizes retained text to LF and uses configured source-role and rights metadata. Its reproducibility check does not independently reread the upstream notice. The Schönbach importer derives a descriptive editor collection and evidence from frozen CMIF. Package scripts define the current source-check inventory. These local workspaces make no runtime source requests.

## Documentation and gallery

`scripts/build-docs.mjs` and Vite share the `scripts/docs-pages.json` publication allowlist. Markdown links resolve from their authored location into generated routes, including repository subpaths. Markdown targets require an allowlisted destination, generated heading IDs are unique, and published fragments are checked before output. The footer reads the package version.

`scripts/build-gallery.mjs` generates task entries from `data/tools/catalog.json`. Previous task-group fragments remain aliases. Local screenshot assets add no third-party runtime requests, while external applications load after ordinary navigation. The documentation and gallery generators run before development and production builds. Research-tool entrypoints remain handwritten and retain their independent runtimes. [NAV-01 through NAV-03](specification.md#project-entry-and-navigation) define navigation behaviour.

## Security

Imported files cross an untrusted-input boundary. Domain validators enforce shape, allowed fields and [format bounds](data.md) before state replacement. Rendering uses text nodes. Link helpers admit only supported protocols, while notebook source URLs must match their frozen contract. Credentials and privileged calls require an authenticated server design.

Local storage shares the browser origin's trust boundary. Confidential deployments require a separate threat assessment, and stale-copy protection is insufficient for collaborative editing. The documentation allowlist governs generated website content only. Files committed to a public repository are public regardless of that allowlist.

## Accessibility

Native controls, labels, semantic headings, a skip link, visible focus and feedback perceivable without colour implement [NFR-01 and NFR-02](specification.md#non-functional-requirements). Shared code does not establish accessibility of each assembled view. [Testing](testing.md) defines route-level automated and manual assessment.

## Repository structure

| Path | Responsibility |
|---|---|
| `src/` | Runtime implementation |
| `knowledge/` | Canonical project contracts and maintained process documents |
| `docs/` | Public task and development guides |
| `data/` | Frozen source, derived data and provenance |
| `scripts/` | Offline adapters, generators and checks |
| `tests/` | Executable behavioural checks |
| `benchmarks/` | Independent cases, protocols and immutable run evidence |
| `.github/workflows/` | Continuous integration and authorised deployment |
| `dist/` | Reproducible generated website |

## Build and deployment

The [start guide](../docs/getting-started.md) supplies commands. Continuous integration checks the committed source. The Pages workflow uses manual `workflow_dispatch`, so an ordinary push does not publish the website. Deployment additionally requires repository-level Pages configuration and authorisation. All local routes and assets must work beneath a repository subdirectory. A successful build establishes neither public deployment nor research acceptance.

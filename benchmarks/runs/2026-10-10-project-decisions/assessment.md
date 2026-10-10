# Five project commitments and field provenance, 2026-10-10

The operator delegated reasoned answers to the five overall-project questions and requested implementation. This is an assisted development increment in an existing dirty working tree, not a blinded method comparison. No human study participant, research acceptance, continuing maintenance agreement, commit, push or deployment is claimed.

## Decisions and delivery

The five qualified commitments are recorded in knowledge/project.md: assist researchers without programming experience; adapt existing tools; prepare maintainable handovers; require independent human evidence before broader reuse claims; investigate the development method separately from product acceptance. The public start and customization guides, development-study protocol, canonical requirements and agent instructions implement their immediate procedural consequences. Human observations and maintenance over time remain future empirical work.

The existing Met workbench is the concrete adaptation. Its comparison cells expose source raw values, deterministic mappings, publisher, unknown original producer, source/script identity and four limited technical checks. Notes remain distinct from the catalogue. All readable text stays selectable. Native Source dialogs close by button/Escape and return focus; the final header keeps Close available while scrolling. Plain-language mapping rules describe conditional conversion rather than implying every value was changed.

New investigations use schema 2 and include selected field evidence. Exact schema 1 remains readable. Initial restoration, view-only navigation, source inspection and export preserve stored v1 bytes; confirmed imports save the validated original file bytes. An actual edit stores v2. New exports are v2 without changing the original file or stored draft. The old v1-only application cannot read v2; rollback uses original v1 exports and a matching old application. Source and derivation identity remain intentionally bound to the frozen snapshot.

Retained responsibilities: existing Met data, comparison/question/notes workflow, recovery keys, static runtime and original editor. Modified: importer evidence generation, investigation compatibility, source detail UI and documentation. Added: per-field registry/helper, preservation regressions, preparation and maintenance procedures. Replaced: no application, source dataset or public-domain contract. This is one existing-workflow adaptation and does not establish a shared core across disciplines.

## Review, failures and corrections

An independent read-only agent inspected the implementation, 62 frozen source files, all 840 field mappings and their original values, and the generator digest. Ten targeted alterations of origin, raw values, mapping, identities and review claims were rejected. The largest four-record selection with maximally escaping allowed text was reported as 1,539,921 bytes against a 2,000,000-byte limit.

The reviewer reproduced a JSON overflow defect: JSON.parse accepts 1e999 as Infinity, whose JSON.stringify representation equals null. Canonical comparison now rejects non-finite numbers; the regression covers records and field evidence. Operated UI review also found navigation saving v1 as v2 without a work change. Shared persistence now checks editable state after stale-copy detection and preserves no-op bytes. Legacy file import retains the validated original bytes. The storage retry test was updated to exercise a real corrected change rather than expect a redundant write. Temporary write failure still proves actual retry and recovery.

Initial full browser integration passed 34 of 35 cases. The specification gained a second table with the same generated accessible region name; axe identified landmark-unique. A more specific development-outcome column resolves the duplicated name. The initial failing trace and rendered specification are retained in this run. Visual inspection also moved Close to the persistent source-dialog header and translated mapping identifiers into explanatory rules. There was no second full browser run: all nine affected workbench/documentation cases passed after these bounded changes; the other 26 cases retain their initial passing results.

## Executed checks

| Check | Result and scope |
|---|---|
| TypeScript/Biome | Passed, 47 files; two initial formatting reports were corrected. |
| Unit suite | Passed, 46 tests across six files, including provenance, hostile numeric input, schema compatibility and recovery. An earlier call-count expectation failed after the intentional no-op-write change and was replaced with byte assertions on a real edit. |
| Production build | Passed, including the new allowlisted development-study route and Markdown anchor validation. No dependency changes. |
| Integrated browser suite | 34/35 initially; duplicate documentation region label corrected; all nine affected cases passed in the final run. |
| Raw-source oracle | Passed, 60 source records and 11 expected queries. |
| Original data preservation | Root compared baseline hashes: all 67 pre-existing dataset files unchanged. 840 original field values and generator hash match. See preservation.json. |
| Production operation | The real prior 17,632-byte v1 export was restored in an isolated context, inspected, exported as v2 and reopened in another context. Exact stored legacy bytes and reopened dialog contents matched. Actual export retained as export-v2.json. |
| Accessibility observations | Native dialog button/Escape/focus, bounded keyboard sequences, pointer text selection, 320px reflow, 200% CSS text size and axe in tested states. Native browser zoom and screen-reader review not run. |

Environment: Windows, Node.js 22.14.0, npm 10.9.2, locked local dependencies and Playwright Chromium. Final browser operation used the local production preview at 127.0.0.1:4173. The UI author earlier used an isolated development server at 4174 and stopped it. All browser work used isolated contexts, with no user drafts changed. New field-evidence generation is deterministic; source changes are identified independently of the base commit by the matching source manifest.

## Fresh-context guide trials

Both trials used agents with no inherited conversation. No human participant took either task; no time, cost, satisfaction, autonomy or comparative effectiveness was measured. The prompts are preserved in benchmarks/development-study-protocol.md. These read-only trials do not implement another tool or establish a skill benchmark.

Preparation A used the question-first instrument request and repository instructions. The agent located Mandolin 500553 and Pandurina 500555, checked their raw descriptions, and proposed comparing materials and the phrases "Attributed to Vincentius Vinaccia" and "Signature possibly Plisbel". It identified the fixed sample, uneven descriptive specificity and missing original authorship, and explicitly said it had not operated the browser. It needed no programming-module choice. It noted a temporary guide claim that export retained v1, contradicting code and the data contract. The guide had been read while its author was completing the correction. This is a recorded preparation defect and timing limitation, not a frozen comparative run. Correct wording now distinguishes unchanged legacy storage from new v2 export.

Preparation B was held back until the guides were finished. Only the start and customization guides were supplied; the hypothetical inherited application's repository and saved file were unavailable. The agent requested the existing repository including unfinished work, a safe original-format old-file copy, and one example/meaning of the new annotation. It kept schema, compatibility, need for migration and continuing ownership unknown. It proposed baseline reproduction, a small entry/save/reopen/export change, old/new file checks and rollback with preserved originals. It did not create a replacement app, contact a former maintainer or claim successful migration. Its initial questions covered research purpose/blank meaning, annotation target, old/new exchange requirements and the responsible research reviewer. No guide revision followed B.

Guide hashes read by B:

- docs/getting-started.md: C2675E03976D460D6FE3066020ACA351E10111B04BE8FDC15971F880BF72D92C
- docs/customizing.md: 899B4A4255AF8AB1510826E2A07736A9A76CF50C22AE3E4F2CE264305B5E5BB4

## Source basis and reading limits

The local Vault and actual Hersch/AEP repository mechanisms informed the conceptual separation of producer, operation and checks. The Vault was read-only. Hersch and AEP were examples, not changed implementations or tested interoperability targets. Their inspected paths and distinctions are recorded in source-reading.md. No secrets or .env files were read.

Primary web material was read on 2026-10-10:

- W3C PROV Model Primer, Working Group Note of 30 April 2013: entity/activity/agent, roles, derivations/revisions and limits of incomplete provenance were read. It supports conceptual distinctions, not PROV-O conformance for this JSON.
- Writing and using a software management plan: the complete guidance text was read for roles, outputs, versioning, dependencies, support and preservation. No dated funder requirements were adopted.
- Irene Weber, Feasibility of AI-Assisted Programming for End-User Development, arXiv 2512.05666v1: main text including methods/results/limitations was read. This version states it had not undergone peer review. The guided survey-app workshop, introductory coding background and self-reported outcomes do not demonstrate autonomous nonprogrammer development of scientifically suitable tools.

The unchanged earlier research guide retains its separately recorded full-text/abstract reading limits. This increment is a targeted source-based implementation, not an exhaustive literature review.

## Remaining work

Independent researcher episodes, accountable research acceptance, a contrasting-domain adaptation, a measured comparison of development approaches, screen-reader/native-zoom review and maintenance over time remain unperformed. Continued ownership is explicitly unassigned. Editable human/AI review records and multi-source contradictory assertions need a domain-specific task and permissions; this frozen catalogue adaptation does not implement them. Version 0.2 is not complete. No recurring work is scheduled.

# Design decisions

This is an agent engineering trial using the explicitly synthetic catalogue in `task/input.json`. It records implementation decisions and observed software behaviour. Human acceptance and research fitness were not assessed.

## Decision and material

The supplied request is to find three waterside construction depictions associated with Northfield workshop, compare their catalogue evidence, revise the set and retain an unresolved question with the selected source records. There is no supplied existing executable workflow, image asset, package manifest or lockfile in this isolated copy. The reference contracts and the local `research-ui-design` procedure were read, including its reusable interaction patterns. The local copy is not a Git repository.

The first three records are plausible candidates from their titles. The fourth Northfield photographer entry is a courtyard, and the completed-pier entry assigns Northfield the publisher role. The interface leaves these distinctions to the researcher. It does not preselect records or assert that they share an event, depicted location or entity. The initial label/role filter is a reversible task hypothesis drawn from the brief; all twelve records remain accessible through Reset filters.

## Views

| View | Evidence visible on entry | Principal action | Retained context |
|---|---|---|---|
| Collection | Titles, shelfmarks, literal dates, qualified attribution plus role, place plus role, material, field-specific LLM production and absent review | Select candidates, then compare | Selection persists across search and filters; query is visible and represented in the URL |
| Comparison | One column per retained record; aligned date, attribution, place, material and catalogue-note rows | Write the unresolved question and download it with the evidence | Selection order, question, observation and query survive source inspection and selection changes |
| Field source | Exact field, source array address, original value, displayed value and display mapping; relevant catalogue semantics and recorded field production | Inspect the basis of a statement, then return to its comparison cell | Addressable source route; back link restores source-control focus; stored investigation survives reload |
| Source & limits | Synthetic character, source title and rights, input identity, retention and format boundaries | Establish what the supplied material and saved file contain | Investigation stays unchanged |

A compact semantic table is appropriate because the task compares parallel catalogue statements. A gallery would imply image material that was not supplied. A map would mix depicted and holding locations and exclude records lacking coordinates. A temporal plot would risk presenting retrieval bounds as event dates or durations. Those alternatives were considered from the data semantics and were not implemented.

The comparison retains up to four records, following the local contract's small-set limit while allowing one additional candidate during revision. Source order is used for finding candidates; chosen order is preserved in the comparison and export. Twelve records do not require pagination. The table's horizontal scroll region keeps readable columns on small screens, with sticky comparison field labels and keyboard scrolling. Native form controls, visible focus and selectable text support ordinary operation. Green/ink tokens follow the local collection-comparison direction. There are no introductory sublines beneath headings, image substitutes, dashboard metrics, runtime LLM features or confidence scores.

## Source and interpretation

All displayed catalogue strings use text nodes, including the deliberately hostile-looking note in DEMO-A-12. Dates use `catalogueDate.text`; index bounds remain in source inspection and JSON. Null material/date values receive the display label “Not recorded”, without changing their source value. Attributions retain qualifier, label, role and authority. Places retain their roles. A missing authority is not filled from another same-label entry.

Only `places[0]` on DEMO-A-03 carries the visible “LLM-extracted · no review recorded” status. The field source exposes its sourceText and null review. It is not promoted into a record-wide verification claim. The source record and input hash can wait behind disclosure because their technical detail is unnecessary to choose a candidate; original qualifiers, place role, missing material and production status are visible before that disclosure.

The authored question and observation are distinct from source assertions. Export records author and review as null rather than inventing an actor. The sample wording in browser evidence was entered by the implementing agent for testing; it is not a researcher's accepted conclusion.

## Retention and adaptation

The supplied input bytes were copied unchanged to `catalogue.json`. At load, the browser checks the copy against SHA-256 `9897cffd1990dac5b5476a0ed6aa7630eed0802a6fbc4196c9fdf4d285fc382c`. The check establishes byte agreement with this task's snapshot only. No historical or authorship verification is claimed.

`synthetic-catalogue-investigation` version 1 is a new case-specific envelope. It preserves the source object, synthetic flag, case ID, original full selected records, ordered IDs, query, input digest and separately authored text. It does not claim compatibility with the production Met investigation format. Existing production exports and storage keys were neither accessed nor changed. Whole-record copying preserves fields beyond those displayed in the table. Reopening requires exact evidence equality and rejects changed or unsupported fields before replacement. Imported text is retained exactly in state until its own field is edited.

Retained responsibilities from the supplied contracts: inspectable original evidence, explicit field transformations, qualified statements, small-set comparison, source navigation, recovery and explicit export. Adapted responsibilities: the fixture's schema, task-specific filters, field display and a separate exchange/storage identity. Replaced responsibilities: production routing and build infrastructure are replaced by a static local app, with no attempt to reproduce unrelated tools. There was no supplied prior executable tool to operate or migrate.

Drafts are saved to a case-specific localStorage key. Writes compare the last observed stored string; detected cross-tab changes or storage failures preserve the other copy and direct the researcher to export. This is not atomic shared editing. Local draft and portable download states have different labels. Reopening has a preview, cancellation and an intervening-edit check. No original file is overwritten.

## Evidence and assumptions

The executed browser sequence and remaining checks are recorded in `evidence/browser-checks.md`; `check.mjs` verifies input bytes, filters, interchange rejection and the actual downloaded output. Browser evidence prompted a correction to a stale comparison link after filtering and a compactness correction to source-link spacing and the selection column. These are bounded engineering findings.

Assumptions still needing research review: catalogue descriptions are sufficient for this episode despite absent images; the four-record limit and aligned-field arrangement are useful; label and role filters suit candidate discovery. Research reviewer, technical maintainer, operator and data custodian are unassigned. No hosting or continuing maintenance is implied.

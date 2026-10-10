# Operated UI review, 2026-10-10

The user requested that subagents operate all interfaces, review them critically and constructively, and improve code and repository knowledge. The lead assigned disjoint pilot, editor and documentation reviews. Agents used isolated Chromium contexts and shared prior project context. The lead also reproduced the lost-search issue in the Codex in-app browser and verified its correction there. No researcher participation or model ranking is inferred.

## Coverage

The documentation reviewer operated `/`, all three `/guides/` pages (getting-started, customizing, research), and all six `/reference/` pages (project, specification, architecture, data, design, testing). It followed section anchors, keyboard skip links and mobile documentation navigation. Local content links and target anchors resolved. The tool agents operated `/pilot/` and `/tool/`, including desktop and narrow states, invalid input, cancellation and actual file downloads. User drafts were isolated from test edits.

## Findings and corrections

| Observation from operation | Correction and verification |
|---|---|
| Pilot typing `wood` then changing grouping or clicking a chart discarded the input. | One control reader applies visible values coherently. `wood` retains 41 matches; combining missing culture gives 3. The lead repeated the fixed sequence in the in-app browser. |
| An empty pilot object pane displayed only its heading. | Explicit empty state and reset guidance. |
| The default 320px object list began about 3458px below the page start. | Six initial groups with disclosed expansion and a direct focus-moving object jump. Agent measurement after correction was about 2117px; density remains an improvement target. |
| Editor cancellation kept proposed filter values while results retained the old query. | Restore search controls without rebuilding the unfinished editor; regression retains the dirty note. |
| A selected editor record remained editable outside zero results with no context. | Explicit selected-record context, clear-filter recovery and an explanation that collection export includes all records. |
| A blocked-export error survived cancelling the edit. | Track the edit-error context and clear resolved messages. Unresolved storage warnings remain visible. |
| Following the guide's edit-to-export sequence produced a blocked export. | The guide explicitly saves first. Reviewer performed save, downloaded JSON and verified the edited value. |
| A narrow Design table shrank its first column to 53px and split words into several fragments. | Labelled focusable local scroll regions retain readable column widths. Keyboard-scrolling regression passes. |
| Guide text still treated real-data examples as future and the header used ambiguous Open example. | Current examples have direct, distinct entry links and the guides describe their actual data and export scope. |

Lead code review additionally found that applied missingness labels could read a pending select value when the group list was expanded. Labels now derive from applied state. This finding originated in code inspection, separate from the operated findings above.

## Verification

The integrated revision passed 24 unit tests, production build and 18 Playwright Chromium browser tests. TypeScript passed on the initial integration run; Biome found formatting drift in the new pilot test. Formatting was corrected and the full type/lint check then passed. The independent raw-data oracle still verifies 60 source records and 11 queries. No source data or oracle expectations changed.

Review covers browser navigation, source qualifiers, actual exports, editor recovery, chart focus, narrow reflow, local table scrolling and automated axe checks in the tested states. Native browser zoom, screen-reader use, independent agent reproduction and observed researcher interpretation remain unperformed. Additional browser engines were not tested. External source-page content and a fresh dependency installation were not rechecked in this round.

Final screenshot review found that the first column still fragmented words despite the table's minimum overall width. The shared cell rule now preserves a minimum column width, with an explicit regression assertion. The documentation browser checks were repeated after this correction.

The final source identity is `2026-10-10-ui-walkthrough-final-source.json`. Verify it with `node benchmarks/capture-source.mjs --output 2026-10-10-ui-walkthrough-final-source.json --check`. The earlier `ui-walkthrough-source.json` capture precedes this last column-width correction. Historical manifests remain unchanged. Temporary agent screenshots and scripts used `test-results/review-*`; the integrating test runner clears that working directory, so they are not retained evidence attachments. This record preserves the reported observations. Final screenshots are captured separately under `ui-walkthrough/` next to this record.

## Knowledge integration

Design holds the general state and readability contracts. Specification carries UI-07 and UI-08 acceptance scenarios. Testing defines operated review, evidence limits and coordination. Agent instructions route to these contracts. The implementation centralises pilot control reading and editor error cleanup instead of duplicating transitions. Passing these checks does not establish that the interface is optimal or scientifically accepted.

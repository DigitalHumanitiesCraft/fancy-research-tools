# Three UI concepts, initial engineering review

Atlas, Bench and Trail implement the same catalogue-comparison episode. The existing pilot remains unchanged. Evidence lives in `concepts/`, including actual selected-record exports and independent agent reviews. The protocol is `../ui-concepts-protocol.md`. Source identity is `2026-10-10-ui-concepts-source.json`.

All three concept task exports match selected original records exactly and retain provenance and separate interpretations. Type/lint, production build, 24 unit tests and the integrated 25 browser tests passed. Initial concept-only attempts failed because of test locator ambiguity and aria-hidden step numbers; the locators were corrected. Independent operation then found Trail's lost stage focus. After correcting it, five concept tests passed, including the new keyboard regression. Earlier app/editor/docs tests were not repeated after this isolated Trail fix.

Open observations: narrow matrices require substantial horizontal movement; Atlas cards use more space; Trail separates note-writing from full comparison and clips long question text in its narrow single-line input. These are recorded design concerns for participant review, not unsupported severity scores. The full-page Atlas screenshot showed a skip link outside normal viewport positioning; direct DOM measurement found it above the viewport when unfocused, so no live defect was established.

No participant sessions, preference scores, task timings or researcher acceptance have been fabricated. Independent reviews used agents; the Trail reviewer inspected code first and disclosed that limitation. Current work is in-session until downloaded. Skills are structurally valid and exercised on this case; general reliability remains unproven.

# Independent Bench review, 2026-10-10

Agent walkthrough using research-ui-evaluate in isolated headless Chromium, local production preview /concepts/bench/. Reviewer implemented Trail, not Bench. No Bench implementation was inspected or changed. This is engineering observation and design hypotheses, not researcher validation.

## Operated sequence

- At 1440 x 900, search wood and submit: 41 selectable records.
- Select Met 500526 with focused checkbox + Space, and 500527 with checkbox click.
- Search zzzz-nothing and submit with Enter: empty state offers broader search/reset, selection remains two.
- Reset restores both selected checkboxes. Remove and re-add 500526 works; comparison column order reflects selection order.
- Open Compare selection: material, original date, attribution, culture, classification and catalogue bounds visible with source links. No unqualified exact historical date invented.
- Write observation and unresolved question. Switch Find material and Compare selection by focused buttons + Enter. Both values retained.
- Download evidence: actual bytes saved as review-bench-export.json. Both selected records exactly match frozen source records 500526 and 500527, with interpretation and provenance separate.
- At 320 x 720, document scrollWidth equals 320. Comparison region has tabindex 0 and scrollWidth 720 against clientWidth 286. Focus + ArrowRight scrolls 40 pixels. No keyboard trap observed in these bounded actions.

## Visual observations and improvement hypotheses

Desktop comparison is readable and links stay beside source titles. It prioritizes aligned evidence over the initial catalogue list. The large table places note inputs below the first 900-pixel viewport, requiring scrolling while writing; a question for human review is whether this interruption harms evidence-based note taking.

At 320 pixels, the fixed field-label column consumes approximately 178 of the 286 visible comparison pixels. Only about 108 pixels of the first source column remain visible. Horizontal scrolling works by keyboard, but comparing two descriptions requires repeated panning. This is a material narrow-screen usability concern even though document overflow passes. Consider a field-at-a-time mobile comparison with both selected values stacked under each field, and validate against the same task.

The empty-search state exposes the zero-result wording twice in the operated body text (status and result heading). Check visual prominence before deciding whether the live-status copy should be visually hidden.

## Limits

No human participants, timings, ratings, native zoom, screen-reader task or complete keyboard journey. No claim about pleasure, intuitiveness or scientific acceptance. Screenshots support the observations above, while the operated controls and downloaded bytes support state/correctness claims. Evidence: review-bench-desktop.png, review-bench-narrow.png, review-bench-export.json. No code changes during this review.

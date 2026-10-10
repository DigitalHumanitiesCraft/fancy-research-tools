# CI reflow correction, 2026-10-10

GitHub Linux run 38079504011 on commit 37038f0 passed installation, code checks, data checks, 91 unit tests and production build, then failed two of 55 browser cases. Both failures concerned existing 200% text-size reflow assertions. Its failed output is retained here. The earlier passing Windows run did not establish Linux reflow.

## Cause and correction

Isolated Windows probes with broader font metrics reproduced excess intrinsic text widths. The annotation notebook had insufficient wrapping for labels and headings; comparison omitted h1 and button from its existing wrapping rule. The correction adds inherited overflow-wrap:anywhere for annotation and adds those two selectors in comparison. It introduces no clipping, font reduction or weakened width assertion. The comparison assertion now includes geometric diagnostics, and failed CI browser artifacts are retained for seven days.

## Completed verification

The matching source is ../2026-10-10-ci-reflow-source.json. TypeScript/Biome, all four data gates, 91 unit tests, the production build and all 55 browser tests passed locally. The maintained Markdown audit checked 31 files and 188 local links with no issues.

Annotation probes covered 40 combinations of two routes, two viewport widths, two root font sizes and five fonts. No document or listed text-element overflow remained; keyboard selection, review controls, Cancel focus and axe checks passed. Comparison probes retained 320 px document width at 200% text size with five fonts. Keyboard table scrolling and actual export preserved both selected records and the observation. Both retained screenshots were inspected. These are Windows font-stress probes; they are not relabelled as Linux execution. The scripts are retained as execution provenance and contain their original local harness paths and ports.

The next GitHub run supplies Linux verification for the correcting commit. The first failure remains part of the record. Frozen sources, data contracts and previous evidence records are unchanged. Human UI assessment and broader research acceptance remain open; this push does not deploy Pages.

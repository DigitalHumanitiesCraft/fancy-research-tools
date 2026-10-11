# Guided interface repair

This agent-only trial applied `research-ui-evaluate` and `research-ui-improve` on 2026-10-11. The current profile was clarified after the baseline was generated. Parent assistance identified the literal LLM-status wording and repeated middle-dot separators; this is a guided repair, not a blind comparison or a causal test of skill effectiveness. No human acceptance is claimed. The baseline verdict was not read.

The collection remains the first view. The principal action retains source records for comparison. Selection, original date wording, attribution qualifiers, place roles, shelfmarks and separately authored notes remain in context. Supplied data are synthetic, contain no images and support no historical inference.

The three observed findings and their prior evidence are in `evidence/baseline-findings.md`. Changes are confined to `candidate/app.mjs` and `candidate/style.css`:

- Metadata now uses separated fields or complete status sentences, without middle-dot separators.
- The affected place has one consistent `LLM-produced value` icon. Focus and pointer activation expose the exact source text, LLM extraction and separate recorded-review state. Escape dismisses the explanation. Catalogue-only fields have no LLM marker.
- Attribution labels with identifiers link directly to the existing source view. That view exposes the unchanged URN, its meaning and a copy action. A synthetic URN has no invented external destination. Back restores focus to the originating authority link.

The model, source bytes, export schema, source routes, filters, local persistence and replacement safeguards were retained. No responsibility or owner was reassigned. No maintained profile or rule changed, and no general reusable pattern was promoted. The generated display-mapping explanation was reconciled with the changed renderer. The full raw record remains an optional disclosure; routine field evidence remains directly visible.

Start from this improvement directory with `python -m http.server 4193 --bind 127.0.0.1`, then open `http://127.0.0.1:4193/candidate/`. `/baseline/` remains the recoverable original. The trial's server is still running on port 4193 for review. No installation or external network request was used; only local JSON exports were downloaded.

## Checks and limits

| Check | Result and evidence |
|---|---|
| Operated baseline before implementation diagnosis | Passed. Selected 01/02/03, compared dates/roles/qualifiers, authored question and observation, downloaded JSON and inspected sources. `before-*.jpg`, `before-export.json`. |
| Three profile findings repeated after correction | Passed for the operated states. `after-collection.jpg`, `after-comparison-status.jpg`, `after-source-attribution.jpg`, `after-source-place.jpg`. |
| Status keyboard operation | Passed. Shift+Tab entered the icon; explanation opened. Escape closed it. `after-status-keyboard.txt`. |
| Meaningful authority access | Passed. Enter opened the recorded attribution; copy returned `urn:synthetic:workshop:northfield`; Back restored `comparison-demo-image-01-authority-0`. `after-authority-return.txt`. |
| Dense and recovery states | Passed in operated sequence. Twelve-record reset had one field-bound LLM icon and no middle dots. Keyboard Space removed/readded 02; a no-match search retained selection. `after-dense-collection.txt`, `empty-results.txt`. |
| Source fidelity | Passed. Visible place array and production JSON equal input, including null coordinates, exact source quotation and null review. `rendered-source.json`, `verify.mjs`. |
| Actual export fidelity | Passed. Three actual downloads preserve every selected field, source semantics and exact author text. Revised selection order is 01/03/02. Reopened baseline export is byte-identical. `before-export.json`, `after-export-revised.json`, `after-export-restored.json`. |
| Reopening and rejection | Passed. Cancel preserved current work; old and new exports reopened. A modified source coordinate was rejected; current work remained. Reload restored question and selection. Relevant `*-reopen*.txt`, `reopened-*.txt`, `rejected-source.txt`, `candidate-reload.txt`. |
| Narrow reflow | A newly introduced source-explanation overflow failed initially: document width 398 at observed innerWidth 355. The local CSS repair passed on repeat: explanation within viewport, document width 339. Comparison document width 355, with its existing horizontal table region. `iteration-source-narrow.jpg` retains failure; `after-source-narrow.jpg` and `after-comparison-narrow.jpg` retain repeat. A requested 320px override produced observed 355px innerWidth; an exact 320px claim is not made. |
| Script checks | Passed: `node verify.mjs`, `node candidate/check.mjs`, `node --check candidate/app.mjs`. `evidence/check.log`. The inherited check uses its copied historical browser export; the new verifier uses this run's actual exports and rendered source observation. |
| Preservation | Passed. Every baseline file and task/input.json has its original SHA-256. Candidate catalogue and model equal original bytes. Manifests under `evidence/`. |
| Unexecuted | Native touch, native browser zoom/text enlargement, screen-reader use, automated accessibility scan, new storage-failure/concurrency cases, representative researcher interpretation and human design acceptance. |

Desktop browser innerWidth was observed as 1422. Browser interaction used only cua_repl. Baseline and candidate were operated in that order in the same local origin so prior draft restoration was tested; there was no independent participant or fresh-profile comparison. No timing, ranking or broader effectiveness result is inferred.

All three recorded findings are repaired in the operated states. The one new overflow found during repair was corrected and retained as negative evidence. Existing narrow comparison requires horizontal panning; broader accessibility acceptance remains open.

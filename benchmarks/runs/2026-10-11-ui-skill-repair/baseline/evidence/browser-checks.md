# Executed checks

Agent-operated local test on 2026-10-11, Codex in-app browser, port 4191. All material was the isolated synthetic fixture. Browser automation was through the available computer-use API. No external service, production application or private knowledge source was used.

| Operation | Observed result |
|---|---|
| Open the fresh collection | Northfield workshop / Photographer were explicit defaults; four matching records, no preselection |
| Select DEMO-A-01, 02 and 03; open Comparison | Three aligned columns with literal date expressions, qualifiers, distinct place roles, missing material and field-specific LLM production |
| Enter a question and observation; open DEMO-A-03 place Source | Original value, `records[2].places`, null coordinates, production sourceText and null review were inspectable |
| Reload the source URL and return | Source remained addressable; question and three selected records recovered; focus returned to `comparison-demo-image-03-places` |
| Download the investigation | A real browser download completed; a retained copy is `browser-download.json` |
| Inspect downloaded JSON using Node | Selected IDs were 01/02/03; all full selected records equal the original input records; source semantics, production sourceText and null review retained; authored text matched |
| Search `zzzz` | Zero results, active filters and three selected identities remained visible; reset action available |
| Reset all filters | All twelve records available, selection retained |
| Add record 04 then attempt record 05 | Four-record limit retained the first four and displayed a removal/retry message. Automation's `check()` reported a failure because it expected the correctly rejected fifth checkbox to stay checked |
| Remove record 04 via checkbox | Remaining three selected identities and question retained |
| Reopen actual exported JSON, cancel preview | Cancellation message; current investigation retained |
| Reopen actual exported JSON, confirm replacement | Exported query, selected records and question restored |
| Reopen altered-source fixture | Rejected with source/format error; existing question and selected records retained |
| Change filter then use selection-area comparison link | Found the link retaining an obsolete query. Corrected it, reloaded, and verified the `zzzz` query survived the same path |
| Keyboard-select record 12 with Space | Added record; comparison displayed its malicious-looking note as literal text; DOM contained zero image elements |
| Remove record 12 from its comparison column | Three remaining records and question retained; focus moved to the view heading |
| Keyboard ArrowRight in comparison scroll region | Horizontal scroll advanced about 44 CSS pixels; region retained focus |
| Keyboard-activate Skip to workspace | Main received focus and Comparison remained the active view |
| Read Source & limits | Synthetic material, absent images, rights statement, snapshot identity, retention and separate format were present |
| Desktop visual review | Long record title, row alignment, field qualifications, controls and notes were readable. Selection header and source-link spacing were corrected and the final screenshot recaptured |
| Responsive review | Requested browser widths 390 and 288 yielded measured CSS widths 433 and 320 under the browser's existing scaling. At 320 CSS px, document width was 303 px (scrollbar excluded), with table overflow contained in its local region; both collection and comparison were checked. Text fields and actions reflowed |
| Browser console | No captured warning/error entries in the final checked session |

The browser's native download path was `<LOCAL_USER>/Downloads/synthetic-catalogue-investigation.json`; the test copied that generated file into this evidence directory for inspection. No other non-output data files were edited. Browser draft state is isolated by localhost port and the case-specific storage key.

Evidence files: `collection-desktop.jpg`, `comparison-desktop.jpg`, `comparison-narrow.jpg`, `collection-dense-dom.txt`, `browser-download.json`, `rejected-source.json` and `check.log`. Screenshots show the particular captured state only. An early full-page narrow capture showed an artefact from the off-screen skip link; its live bounding rectangle was checked at y = -64 px. The retained narrow evidence is a final viewport capture at 320 CSS px.

## Not performed

No human or assistive-technology task, full accessibility audit, native zoom interaction, manual pointer text-selection exercise, additional browser engine, storage quota failure or concurrent-tab conflict scenario was performed. The code includes storage-failure/conflict handling, but those branches are not covered by the browser evidence. No empirical development-method comparison or research acceptance was performed. The repository's npm checks/build/e2e commands were not run because this isolated material has no package manifest, lockfile or application sources. The standalone checks used Node builtins and Python's HTTP server.

Input SHA-256 remained `9897cffd1990dac5b5476a0ed6aa7630eed0802a6fbc4196c9fdf4d285fc382c`; `node check.mjs` passed after the final logic changes. JavaScript syntax checks passed. These checks establish the documented software properties, not scholarly correctness or general usability.

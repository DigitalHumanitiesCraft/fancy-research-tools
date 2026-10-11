# Operated engineering trial, 2026-10-11

One implementation agent used the local research-ui-design, research-ui-evaluate and research-ui-improve procedures. This is a forward implementation with subsequent self-review, not an independent usability evaluation. Only the local task, three procedures and supplied project contracts were consulted. No human participant, comparative timing, rating or research acceptance is claimed.

## Identity and starting state

The initial folder contained copied instructions/contracts and the task files, without application code, package manifest or installed dependencies. A standalone implementation was added. Runtime: Node.js 22.14.0 on Windows. Browser: Codex in-app browser, driven exclusively through `cua_repl`; exact browser version was not collected. The new loopback origin `http://127.0.0.1:4192` initially displayed the supplied notebook, with no recovered work. Source and final implementation identity are retained in `source-manifest.json`.

## Actual operations

| Check | Result | Observed evidence |
|---|---|---|
| Initial source and pre-existing annotation | Passed | Notebook A, fictional author/date and synthetic qualification shown; annotation range 0–28 and Demonstration reviewer/criterion/confirmed shown. `01-entry.jpg`. |
| No-op save | Passed | Opened annotation 1, saved without edits, reopened it: the recorded review remained. |
| Revise interpretation | Passed | Changed annotation 1's note. Editor explained review removal. Saved row displayed revised text and No review recorded. |
| Unfinished export | Passed | Download during the unfinished edit produced the save/discard message; saved row still held its prior value. No download was requested by the application on this path. |
| Cancel source change | Passed | Selecting Notebook B during the draft opened Discard unfinished annotation. Keep current work retained Notebook A and the entire revised interpretation. |
| Recover unfinished edit | Passed | Opened the same origin in a second page. It restored the draft text, anchored quotation and original saved annotation separately. Saving then committed the revision. |
| Conflicting page | Passed for the observed sequence | Saving in page 2 caused page 1 to announce that another tab had changed recovery and that its own state remained in memory. No second write from page 1 was attempted. Atomic/racing conflict safety is not established. |
| Pointer selection | Passed | A pointer drag selected range 119–147 in the second occurrence. Annotate selection copied exactly that whitespace-inclusive range. This was then revised to the full sentence at 120–148 through the supported selectText UI operation with a disambiguating prefix. |
| Second source and comparison | Passed | Switched to Notebook B; selected the speculative sentence through the supported UI selection API; saved category speculation, the cause interpretation and creator Synthetic trial agent. Three rows retained both sources. |
| Show source and revise anchor | Passed | Show passage annotation 2 returned to Notebook A and its exact selected range. Edit plus Annotate selection changed only that anchor, preserving the question text and creator. |
| Actual download | Passed | Clicked Download notebook, awaited the browser download, moved its newly generated file into `downloaded-notebook.json`, and inspected the actual JSON. |
| Open actual downloaded file | Passed | Open notebook → file chooser → `downloaded-notebook.json` → Replace notebook. Three saved annotations and their original fields returned. |
| Unsupported fields | Passed | Pasted a notebook with an extra top-level field. Import was rejected with the expected-field error; current three-annotation notebook remained. `02-invalid-import.txt`. |
| Cancel supported replacement | Passed | Pasted a valid empty notebook. Keep current work followed by Cancel retained all three saved entries. |
| Empty state and restoration | Passed | Accepted the valid empty notebook and saw 0 saved plus the source and actionable empty state. Reopened the actual downloaded file to restore all three entries. `03-empty.txt`. |
| Reload saved notebook | Passed | Reload after source changes restored three saved entries from browser recovery. |
| Keyboard focus and Save | Passed, bounded | Tab from Interpretation focused Annotation creator; Tab then Enter on Save committed the form and returned focus to Annotate selection. `08-keyboard-save.txt`. This does not establish keyboard-only creation. |
| Full keyboard passage selection | Not verified | Control+Home and repeated ArrowRight/Shift+ArrowRight did not produce a selection through the automation. A second attempt using native key notation also left the range collapsed. The source control is a native readonly textarea; whether the failure came from key translation or the application remains unresolved. |
| Narrow reflow | Passed at observed 355 CSS px | Requested viewport 320×850 through the supported viewport capability. Browser reported innerWidth/clientWidth/scrollWidth all 355, with visualViewport about 355.56. Source, editor, buttons and annotation rows stacked without document horizontal overflow. `05-narrow.jpg`. Exact 320 CSS px was not established. Override was reset. |
| Dense desktop view | Passed visually for three saved entries plus editor | Source, quotation, editable interpretation, declared creator and comparison rows remained readable. `04-desktop.jpg`; saved view in `07-final-desktop.jpg`. |
| Download → reopen → download | Passed | Second actual file retained as `reopened-notebook.json`. `node check-export.mjs` found exact byte equality with the first download and independently checked all three source slices, categories, notes, creator and null reviews. `export-check.txt`. |
| Input bytes and model invariants | Passed | `node check.mjs`: 11 named checks, including both repeated sentence anchors, exact review retention/invalidation, untouched CRLF text, café, strict field rejection, malformed/oversized input and literal markup. `model-checks.json`. |
| Syntax | Passed | `node --check app.js` returned exit 0. |

## Failures and bounded corrections

The first model-check run incorrectly expected the repeated sentence to begin at 118. The source-derived position was 120, so that test failed before its later checks. `model-checks-initial.txt` retains the failure. The independent expectation was corrected to 120–148; the implementation was not changed for this failure. All 11 checks passed afterwards and after the later file-size correction.

The initial desktop source control reserved 17rem for two short notes, keeping much of the saved-work view below the first screen. Its minimum height was reduced to 12rem after rendered inspection. The narrow source retains its own scrollable 15rem reading control. Desktop and narrow screenshots were inspected after this correction.

Code review found two small issues during the operated pass: a preceding import-error message could remain after a later valid file reached its confirmation dialog, and the formatted byte bound did not count the serializer's final newline. Successful parsing now clears the older error; the formatted bound includes that newline. Empty/supported import, reload, real file reopening and model checks were repeated on the corrected build.

One attempt to create a second browser page with an explicit hidden option returned a subagent visibility restriction. Creating the page without a visibility override worked. No user-visible browser visibility change was requested. The keyboard-selection failure remains recorded rather than converted into a claimed pass.

## Unperformed checks

Not run: representative researcher use, screen reader, touch, native zoom or 200% text enlargement, formal contrast/conformance audit, real browser crash, unavailable/quota-exhausted storage, corrupt stored recovery through the browser, file-read race, 200-entry browser stress, download persistence across a different browser profile, creating a new review, deletion/undo workflow, and broad browser compatibility. Cross-case, duplicate-ID, invalid review structure and oversize rejection were model tests; they were not all replayed through the browser.

Recovery was observed in another page of the same browser profile and through saved-state reload. This is evidence of persisted recovery, not a destructive crash test. Browser-based HTML-injection execution was not attempted; the model retained markup literally and code inspection confirmed text-only rendering. No automatic accessibility scanner was available or installed.

## Preserved output

The evidence includes screenshots, accessible-state captures, both actual downloaded files, model results, the earlier failed expectation and the independent export check. The browser's default download destination was outside the isolated folder; each generated file was immediately moved into this evidence directory. No pre-existing download was read or modified. All screenshots and reports were written directly into this folder.

The final working notebook contains the three trial annotations. The unchanged example remains available through Open notebook → Open supplied notebook. An evaluator can start a new browser profile or open that supplied file to recover the original reviewed example.

# Field-note annotation prototype

This is an isolated agent engineering trial using the supplied synthetic material. It makes no claim of researcher acceptance, historical truth or general effectiveness of the three research UI procedures.

## Run

From this directory, with Node.js available:

```powershell
node serve.mjs
```

Open `http://127.0.0.1:4192`. The server binds only to loopback and serves an explicit allowlist of application files and the two supplied JSON files. No installation, build, external service or network asset is needed. Node.js 22.14.0 was used in this trial.

```powershell
node check.mjs
node check-export.mjs
```

The second command inspects the actual browser downloads retained in `evidence/`. It is an outcome check, independent of the application model.

## First view and principal action

The first view opens Notebook A and the supplied existing annotation. The source, its fictional author, its date and the synthetic qualification are visible. The existing annotation displays its exact quotation, source range, interpretation, self-declared creator and recorded reviewer/criterion/result. Valid browser recovery takes precedence on a later visit.

The principal action is **Annotate selection**. A read-only native text area supports direct passage selection; its start and end positions disambiguate repeated wording. The right-hand editor keeps the anchored quotation beside the category and interpretation. Save annotation adds or revises a notebook entry; it does not overwrite either supplied input file. The annotation ledger aligns evidence with interpretation across both notes. Show passage returns to the recorded source and range. Existing interpretations remain visible while reading another source.

A sequential wizard was considered unnecessary for two short texts because it would separate quotation from interpretation. A permanent pair of full source columns plus an editor would require three competing reading areas. The selected-source reading surface and retained cross-source annotation ledger are the chosen bounded hypothesis, not an evaluated universal pattern.

## Retained context and recovery

- The source selector retains saved annotations from both notes. When a draft exists, switching source or editing another annotation requires explicit draft discard; cancellation preserves the text and current source.
- Browser recovery stores the notebook, selected source and unfinished annotation after each field change. This deliberately extends the copied starter's saved-notebook-only crash recovery. Reopening the page restores the unfinished interpretation without adding it to saved annotations.
- Download and import require saving or discarding an unfinished annotation first. The interface distinguishes local browser recovery from a portable notebook download.
- Invalid files never replace current work. Valid replacement requires a dialog whose initial focus is Keep current work. File read completion checks for intervening changes.
- Local writes compare the last observed storage bytes. A change from another tab stops further overwrites and retains the current in-memory work for export. This is sequential conflict detection, not atomic collaboration.
- Invalid browser recovery remains untouched. A raw recovery download is available for technical recovery; it is a recovery envelope, not a supported notebook import. If storage is unavailable, the current notebook can still be downloaded after the annotation is saved.
- A browser leaving warning protects unfinished work or blocked storage. Browser recovery can disappear when site data is cleared; the download remains the preservation path.

## Source and notebook contract

The supplied `task/input.json` and `task/existing-notebook.json` are read directly and never rewritten. The preserved input hashes are checked by `check.mjs`.

The notebook schema is exactly the task's schema version 1: `schemaVersion`, `caseId`, `annotations`, with the nine specified annotation fields. Categories are observation, speculation and question. Creator and review fields remain strings; they do not authenticate people. Existing review strings are preserved rather than mapped to the different vocabulary of the copied production contract. New annotations have `review: null`; this small prototype reads existing reviews but does not author new ones.

Each quotation must equal the source slice at start-inclusive/end-exclusive UTF-16 offsets. Overlap is allowed. The two identical sentences in Notebook A remain separately addressable at 0–28 and 120–148. Editing source anchor, category, interpretation or creator removes a review at save; a no-op revision retains it. The saved entry remains unchanged until Save annotation.

Unknown fields at notebook, annotation and review level, duplicate annotation IDs, unsupported versions/cases, unknown sources/categories, invalid types and incorrect quote anchors are rejected. The implementation applies the copied contract's 200-annotation, 20,000-character field and 1,000,000-byte formatted-file limits. Those are technical bounds, not research judgements. Empty string fields are accepted and shown as missing where relevant because the task contract specifies strings without a nonempty requirement.

Imported author text retains its exact string until that field receives an input event. Native text controls may display normalized line endings; editing another field does not save that normalization. Imported strings are rendered using text nodes and `textContent`.

The fixed case ID identifies the bundled source set. The notebook format provides no source-version or source-hash field; adding one would violate its unknown-field rule. A source change therefore needs a new case ID and explicit migration. Keep the application/source folder alongside an exported notebook.

## Visual and accessibility decisions

The source uses serif text, the form uses system text, and one muted green denotes actions. Source text gets slightly more width than editing controls. Saved annotations use aligned rows instead of a dashboard or decorative statistics. All action names are text. There are no introductory sublines beneath headings. Selection instructions belong to the actual text-selection control; recovery statements report working state.

Source derivation and file path wait behind Source details because they are not required to distinguish observation from speculation. Source author/date, synthetic status, anchored quotation and recorded review remain visible. The narrow layout follows source, editor, saved annotations in document order. A read-only textarea may scroll internally on narrow screens; its full source value remains present and selectable.

Native labels, buttons, select controls and dialogs support ordinary keyboard operation; focus has a visible outline. Browser tests confirmed focus progression and keyboard Save, but the attempted modified-arrow selection did not produce a range through the available automation. Full keyboard passage selection remains unverified. No screen-reader, touch, native zoom or accessibility conformance claim is made.

## Adaptation responsibilities

Retained: exact source anchoring, separate interpretation and source roles, strict interchange, explicit export, review invalidation, local conflict protection and the operator's copy constraint.

Modified: source vocabulary and layout for the two short synthetic notes; a flat string creator and string review result as required by the supplied notebook; recovery expanded to include unfinished form state.

Replaced: the production application shell, external source collections and build stack with five browser/server files and a dependency-free Node server. No production application files were available or consulted. No runtime LLM, authentication, collaboration, publication or remote persistence is included.

The standalone prototype contracts are recorded here; the copied `knowledge/` and `docs/` remain reference material for their original application. Maintenance owner, research reviewer and future operator remain unassigned.

## Evidence and limits

The complete operated sequence, failures, repairs and unperformed checks are in [evidence/walkthrough.md](evidence/walkthrough.md). Model checks are in [evidence/model-checks.json](evidence/model-checks.json). Actual original and reopened downloads are retained separately and were byte-identical. Input and implementation hashes are in [evidence/source-manifest.json](evidence/source-manifest.json).

Only the supplied isolated directory and its local instructions/contracts were read. No original repository, Vault, evaluator file or other prototype was inspected. No package was installed or remote source fetched. The browser placed each requested download in its default Downloads location; each newly created file was immediately moved into this directory's evidence folder. Browser local recovery is scoped to this test's loopback origin.

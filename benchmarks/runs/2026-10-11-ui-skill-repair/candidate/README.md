# Collection comparison prototype

From this `output` directory, run:

```powershell
python -m http.server 4191 --bind 127.0.0.1
```

Open <http://127.0.0.1:4191>. Stop the server with Ctrl+C. Python 3.11.9 and Node 22.14.0 were available during this trial. The application requires a current browser and localhost HTTP for its source hash check. There is no build, package installation or external runtime request.

1. In Collection, retain DEMO-A-01, DEMO-A-02 and DEMO-A-03. The initial Northfield workshop / Photographer filters are visible and can be reset.
2. Open Comparison. Inspect dates, attribution qualifiers, place roles and notes in aligned rows. Each Source link opens its original field and display mapping.
3. Write an unresolved question. Optionally add an observation. Download question + selected records saves JSON containing every field of those source records and the catalogue semantics.
4. Revise selection through Collection or remove a comparison column. Notes survive. Reopen an exported JSON from Comparison to resume it; replacement is explicit and can be cancelled.

Browser storage is local convenience. Export is the portable retention path. A different or corrupt saved copy is not overwritten when detected. The application cannot authenticate an author or supply a scholarly review.

Run the implementation checks from this directory with `node check.mjs`. The byte-preservation check expects the unchanged `../task/input.json` from the isolated task. It also inspects the actual browser download retained at `evidence/browser-download.json`.

See `decisions.md` for the design decisions and boundaries, and `evidence/browser-checks.md` for performed and unperformed operations. Source files and contracts outside `output` were not edited.

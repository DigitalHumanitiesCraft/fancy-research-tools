# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: docs.spec.ts >> published documentation routes, headings and local links resolve
- Location: tests\e2e\docs.spec.ts:4:1

# Error details

```
Error: expect(received).toEqual(expected) // deep equality

- Expected  -  1
+ Received  + 45

- Array []
+ Array [
+   Object {
+     "description": "Ensure landmarks are unique",
+     "help": "Landmarks should have a unique role or role/label/title (i.e. accessible name) combination",
+     "helpUrl": "https://dequeuniversity.com/rules/axe/4.13/landmark-unique?application=playwright",
+     "id": "landmark-unique",
+     "impact": "moderate",
+     "nodes": Array [
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "accessibleText": "table: id, observable outcome, required evidence",
+               "role": "region",
+             },
+             "id": "landmark-is-unique",
+             "impact": "moderate",
+             "message": "The landmark must have a unique aria-label, aria-labelledby, or title to make landmarks distinguishable",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"table-scroll\" role=\"region\" aria-label=\"Table: ID, Observable outcome, Required evidence\" tabindex=\"0\">",
+                 "target": Array [
+                   ".table-scroll[role=\"region\"]:nth-child(52)",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   The landmark must have a unique aria-label, aria-labelledby, or title to make landmarks distinguishable",
+         "html": "<div class=\"table-scroll\" role=\"region\" aria-label=\"Table: ID, Observable outcome, Required evidence\" tabindex=\"0\">",
+         "impact": "moderate",
+         "none": Array [],
+         "target": Array [
+           ".table-scroll[role=\"region\"]:nth-child(12)",
+         ],
+       },
+     ],
+     "tags": Array [
+       "cat.semantics",
+       "best-practice",
+     ],
+   },
+ ]
```

# Page snapshot

```yaml
- generic [active] [ref=f12e1]:
  - link "Skip to content" [ref=f12e2] [cursor=pointer]:
    - /url: "#main"
  - banner [ref=f12e3]:
    - link "fancy (research) tools" [ref=f12e4] [cursor=pointer]:
      - /url: ../index.html
      - text: fancy (research) tools!
    - navigation "Tools" [ref=f12e5]:
      - link "Collection editor" [ref=f12e6] [cursor=pointer]:
        - /url: ../tool/
      - link "Explore instruments" [ref=f12e7] [cursor=pointer]:
        - /url: ../pilot/
  - generic [ref=f12e10]:
    - group [ref=f12e11]:
      - generic "Documentation" [ref=f12e12] [cursor=pointer]
      - navigation "Documentation" [ref=f12e13]:
        - generic [ref=f12e14]:
          - heading "Build a tool" [level=2] [ref=f12e15]
          - link "Overview" [ref=f12e16] [cursor=pointer]:
            - /url: ../index.html
          - link "Get started" [ref=f12e17] [cursor=pointer]:
            - /url: ../guides/getting-started.html
          - link "Customize" [ref=f12e18] [cursor=pointer]:
            - /url: ../guides/customizing.html
          - link "Research basis" [ref=f12e19] [cursor=pointer]:
            - /url: ../guides/research.html
          - link "Development study" [ref=f12e20] [cursor=pointer]:
            - /url: ../guides/development-study.html
        - generic [ref=f12e21]:
          - heading "Reference" [level=2] [ref=f12e22]
          - link "Project" [ref=f12e23] [cursor=pointer]:
            - /url: ../reference/project.html
          - link "Specification" [ref=f12e24] [cursor=pointer]:
            - /url: ../reference/specification.html
          - link "Architecture" [ref=f12e25] [cursor=pointer]:
            - /url: ../reference/architecture.html
          - link "Data" [ref=f12e26] [cursor=pointer]:
            - /url: ../reference/data.html
          - link "Design" [ref=f12e27] [cursor=pointer]:
            - /url: ../reference/design.html
          - link "Testing" [ref=f12e28] [cursor=pointer]:
            - /url: ../reference/testing.html
        - link "Source repository" [ref=f12e29] [cursor=pointer]:
          - /url: https://github.com/DigitalHumanitiesCraft/fancy-research-tools
    - main [ref=f12e30]:
      - heading "Specification" [level=1] [ref=f12e31]
      - group [ref=f12e32]:
        - generic "On this page" [ref=f12e33]
      - paragraph [ref=f12e34]:
        - text: The unreleased version 0.1 includes a real-data investigation workbench, three alternative interfaces, the historical catalogue baseline and a separate synthetic collection editor. Requirements describe observable behaviour and are assessed through the
        - link "testing protocol" [ref=f12e35] [cursor=pointer]:
          - /url: testing.html
        - text: .
      - heading "DH pilot contract" [level=2] [ref=f12e36]
      - paragraph [ref=f12e37]:
        - text: The original filtering and aggregation contract below is retained at
        - code [ref=f12e38]: /baseline/
        - text: . The current
        - code [ref=f12e39]: /pilot/
        - text: follows the investigation contract added below.
      - paragraph [ref=f12e40]:
        - text: The subsequent commissioned pilot added the read-only Met instrument explorer now retained at
        - code [ref=f12e41]: baseline/
        - text: . Its task is to inspect original catalogue labels, filter a frozen sample, count groups and identify missing metadata, then export selected source records with query parameters and provenance. The task and independently calculated expectations live under
        - code [ref=f12e42]: benchmarks/cases/met-instruments/
        - text: . Existing editor behaviour and stored drafts remain on their original route. Pilot results establish bounded engineering evidence, with researcher acceptance and wider adaptation still open.
      - paragraph [ref=f12e43]: Search uses a normalized substring across title, object name, culture, descriptive date and medium. Exact classification/culture filters combine with a missing-field filter. Counts and missingness use the current filtered result as denominator. Empty results are explicit. Grouping retains source labels and a separate missing value. Original date descriptions remain visible. Export includes source identifiers, supported fields, filters, summaries and the snapshot manifest. The pilot makes no claim of representative sampling, precise historical dates or causal explanation.
      - paragraph [ref=f12e44]:
        - text: Column-header controls sort the current result by title, date, culture or maker in either direction. Date sorting compares the source
        - code [ref=f12e45]: beginYear
        - text: numerically while retaining the original descriptive date in the cell. This orders catalogue bounds and does not establish exact historical dates. Missing values sort last in both directions. Equal values use the source object ID as a stable tie-breaker. Sorting preserves the filtered population, group counts and selected record.
      - heading "Requirements" [level=2] [ref=f12e46]
      - heading "UI refinement acceptance" [level=3] [ref=f12e47]
      - paragraph [ref=f12e48]:
        - text: The
        - link "design contract" [ref=f12e49] [cursor=pointer]:
          - /url: design.html
        - text: governs hierarchy, visual encodings and interaction across documentation, exploration and editing. The following outcomes are acceptance targets for the commissioned UI revision. Verification follows the
        - link "UI protocol" [ref=f12e50] [cursor=pointer]:
          - /url: testing.html#ui-acceptance-protocol
        - text: .
      - 'region "Table: ID, Observable outcome, Required evidence" [ref=f12e51]':
        - table [ref=f12e52]:
          - rowgroup [ref=f12e53]:
            - row [ref=f12e54]:
              - columnheader "ID" [ref=f12e55]
              - columnheader "Observable outcome" [ref=f12e56]
              - columnheader "Required evidence" [ref=f12e57]
          - rowgroup [ref=f12e58]:
            - row [ref=f12e59]:
              - cell "UI-01" [ref=f12e60]
              - cell "Each route exposes its primary task before extended explanatory material." [ref=f12e61]
              - cell "Desktop and narrow-layout review plus an observed first action." [ref=f12e62]
            - row [ref=f12e63]:
              - cell "UI-02" [ref=f12e64]
              - cell "Icons support understandable labelled actions across routes." [ref=f12e65]
              - cell "Label, focus and keyboard inspection, with local asset verification." [ref=f12e66]
            - row [ref=f12e67]:
              - cell "UI-03" [ref=f12e68]
              - cell "Baseline distributions and metadata gaps expose exact values and their scope." [ref=f12e69]
              - cell "Chart values match the independent oracle, including filtered and empty results." [ref=f12e70]
            - row [ref=f12e71]:
              - cell "UI-04" [ref=f12e72]
              - cell "Chart interactions and filters share query semantics and reversible state." [ref=f12e73]
              - cell "Keyboard selection, reset, URL reload and back navigation retain the expected selected IDs." [ref=f12e74]
            - row [ref=f12e75]:
              - cell "UI-05" [ref=f12e76]
              - cell "Selected-object details expose source qualifiers directly, with important limitations and recovery messages visible." [ref=f12e77]
              - cell "Source comparison, selection interaction and existing editing/storage regression checks." [ref=f12e78]
            - row [ref=f12e79]:
              - cell "UI-06" [ref=f12e80]
              - cell "A researcher completes the task and correctly explains its result and limits." [ref=f12e81]
              - cell "Observed task completion and interpretation recorded separately from automated tests." [ref=f12e82]
            - row [ref=f12e83]:
              - cell "UI-07" [ref=f12e84]
              - cell "Pending inputs, applied filters, selected record and exported population remain distinguishable through mixed interactions." [ref=f12e85]
              - cell "Type a search, operate a chart, inspect and export results; cancel navigation with a dirty editor and check both draft and controls." [ref=f12e86]
            - row [ref=f12e87]:
              - cell "UI-08" [ref=f12e88]
              - cell "The desktop pilot keeps controls, comparable result rows and selected-object evidence in one working viewport. Narrow layouts retain all content in a usable reading order." [ref=f12e89]
              - cell "Inspect 1440×900 and 1366×768 desktop states and 320 CSS-pixel reflow; operate every scroll region by keyboard and inspect long details." [ref=f12e90]
            - row [ref=f12e91]:
              - cell "UI-09" [ref=f12e92]
              - cell "The table supports understandable, deterministic sorting without changing the result population." [ref=f12e93]
              - cell [ref=f12e94]:
                - text: Operate all sortable headers in both directions, verify
                - code [ref=f12e95]: aria-sort
                - text: ", source-date order, missing values last, stable ties and preserved selection."
            - row [ref=f12e96]:
              - cell "UI-10" [ref=f12e97]
              - cell "About exposes provenance and limitations without crowding the working header. Data and code licenses remain distinct in the footer." [ref=f12e98]
              - cell "Open and close the dialog by keyboard, verify focus return, sample details, snapshot, guide destination and separate CC0/MIT links." [ref=f12e99]
      - paragraph [ref=f12e100]:
        - text: The historical catalogue at
        - code [ref=f12e101]: /baseline/
        - text: applies current form values when grouping or selecting a chart filter. Unsubmitted edits are identified as pending, and exports use the applied result state. The editor exports the complete collection. Filtering retains a selected record and explicitly explains when that record is outside the results. Cancelling a proposed navigation restores the applied search controls while preserving the unfinished form. Documentation's editing walkthrough includes saving before export.
      - paragraph [ref=f12e102]: The pilot presents results as comparable table rows and one directly visible detail pane. A contextual result count replaces the redundant Objects heading above the Object column. A valid selection remains visible within the result context. When filtering excludes it, select a matching record or expose an empty detail state. All distribution categories remain reachable without a Show more gate. The group area identifies its filtering purpose and its caption explains its relationship to the table. Both derive from the same filtered sample.
      - paragraph [ref=f12e103]: The header contains the tool title and export action. The footer contains About, the data license CC0 and the code license MIT. About opens a native dialog with the Met source, the 60 lowest-ID selection, its non-representative character, snapshot date and research guide link. It supports a close button, Escape and focus return. The pilot has no repeated catalogue accordions or Go to objects workaround.
      - heading "Planned version 0.2 acceptance" [level=3] [ref=f12e104]
      - paragraph [ref=f12e105]: The following criteria define the planned increment. They are not implemented or verified by the planning work. Preparation, Exploration, Distillation and Implementation recur as material and prototypes change the research question. The development harness supports this process. A resulting browser tool needs runtime LLM integration only when its task justifies it.
      - 'region "Table: ID, Planned outcome, Required evidence" [ref=f12e106]':
        - table [ref=f12e107]:
          - rowgroup [ref=f12e108]:
            - row [ref=f12e109]:
              - columnheader "ID" [ref=f12e110]
              - columnheader "Planned outcome" [ref=f12e111]
              - columnheader "Required evidence" [ref=f12e112]
          - rowgroup [ref=f12e113]:
            - row [ref=f12e114]:
              - cell "V02-01" [ref=f12e115]
              - cell "Start from a question, idea, material, method or existing workflow and develop an explicit research task." [ref=f12e116]
              - cell "A worked iteration records inputs, missing context, alternatives, a prototype observation and the resulting knowledge revision." [ref=f12e117]
            - row [ref=f12e118]:
              - cell "V02-02" [ref=f12e119]
              - cell "Acquire methodological knowledge appropriate to the task." [ref=f12e120]
              - cell "Source passages, reading limits, method prerequisites, alternatives and applicability are recorded separately from agent proposals and human decisions." [ref=f12e121]
            - row [ref=f12e122]:
              - cell "V02-03" [ref=f12e123]
              - cell "Use a browser interface and the simplest stack adequate to the requirements." [ref=f12e124]
              - cell "An architecture decision connects dependencies and any additional processing or services to concrete requirements." [ref=f12e125]
            - row [ref=f12e126]:
              - cell "V02-04" [ref=f12e127]
              - cell "Demonstrate one complete interdisciplinary case with real open data." [ref=f12e128]
              - cell "A reproducible source snapshot, rights record, explicit data semantics and a full exploration or analysis workflow with independently checked output." [ref=f12e129]
            - row [ref=f12e130]:
              - cell "V02-05" [ref=f12e131]
              - cell "Exercise a contrasting capture or annotation adaptation." [ref=f12e132]
              - cell "A bounded runnable workflow with real material records reused, modified and replaced parts and preserves its domain distinctions." [ref=f12e133]
            - row [ref=f12e134]:
              - cell "V02-06" [ref=f12e135]
              - cell "Preserve existing user work while separating responsibilities." [ref=f12e136]
              - cell "Regression checks cover import/export, unsaved forms, storage failures, stale copies and deliberate handling of v0.1 drafts and schema versions." [ref=f12e137]
            - row [ref=f12e138]:
              - cell "V02-07" [ref=f12e139]
              - cell "Make the approach reproducible by another developer or agent." [ref=f12e140]
              - cell "An independent attempt uses repository instructions without hidden conversation context, records interventions and reports unresolved limitations." [ref=f12e141]
            - row [ref=f12e142]:
              - cell "V02-08" [ref=f12e143]
              - cell "Present a reviewable local release candidate." [ref=f12e144]
              - cell "Production build, relevant unit and browser checks, manual interaction review and source/knowledge consistency are recorded. Human research acceptance is recorded separately and remains pending until actually provided." [ref=f12e145]
      - paragraph [ref=f12e146]: Research activities, material structures, file formats and collaboration requirements are separate description dimensions. TEI Crafter and CorrespExplorer remain useful comparison sources. Version 0.2 case selection should broaden the disciplinary coverage. A tabular case and a contrasting capture or annotation case are planned, with exact datasets and questions selected after inspection. General-purpose format support and a universal plugin API require separate evidence and scope.
      - heading "Functional requirements" [level=3] [ref=f12e147]
      - 'region "Table: ID, Behaviour, Acceptance evidence" [ref=f12e148]':
        - table [ref=f12e149]:
          - rowgroup [ref=f12e150]:
            - row [ref=f12e151]:
              - columnheader "ID" [ref=f12e152]
              - columnheader "Behaviour" [ref=f12e153]
              - columnheader "Acceptance evidence" [ref=f12e154]
          - rowgroup [ref=f12e155]:
            - row [ref=f12e156]:
              - cell "FR-01" [ref=f12e157]
              - cell "Explore records through search, kind filtering and selection." [ref=f12e158]
              - cell "Browser test exercises combined controls and empty results." [ref=f12e159]
            - row [ref=f12e160]:
              - cell "FR-02" [ref=f12e161]
              - cell "Restore explorer state from the URL." [ref=f12e162]
              - cell "Reload and navigation preserve supported query state." [ref=f12e163]
            - row [ref=f12e164]:
              - cell "FR-03" [ref=f12e165]
              - cell "Edit title, record type, place, date, source, notes and review status in a working copy." [ref=f12e166]
              - cell "Browser test edits and exports a record." [ref=f12e167]
            - row [ref=f12e168]:
              - cell "FR-04" [ref=f12e169]
              - cell "Validate imported collections before replacing working data." [ref=f12e170]
              - cell "Invalid imports leave the existing collection intact." [ref=f12e171]
            - row [ref=f12e172]:
              - cell "FR-05" [ref=f12e173]
              - cell "Export a collection that can be reimported without field loss." [ref=f12e174]
              - cell "Round-trip test compares structured values." [ref=f12e175]
            - row [ref=f12e176]:
              - cell "FR-06" [ref=f12e177]
              - cell "Preserve the supplied baseline during local edits." [ref=f12e178]
              - cell "State test checks baseline immutability." [ref=f12e179]
            - row [ref=f12e180]:
              - cell "FR-07" [ref=f12e181]
              - cell "Recover supported drafts after reload and expose storage errors." [ref=f12e182]
              - cell "Reload and unavailable-storage scenarios." [ref=f12e183]
            - row [ref=f12e184]:
              - cell "FR-08" [ref=f12e185]
              - cell "Publish selected specifications with practical guides." [ref=f12e186]
              - cell "Build and link checks include the publication allowlist." [ref=f12e187]
      - heading "Non-functional requirements" [level=3] [ref=f12e188]
      - 'region "Table: ID, Requirement, Assessment" [ref=f12e189]':
        - table [ref=f12e190]:
          - rowgroup [ref=f12e191]:
            - row [ref=f12e192]:
              - columnheader "ID" [ref=f12e193]
              - columnheader "Requirement" [ref=f12e194]
              - columnheader "Assessment" [ref=f12e195]
          - rowgroup [ref=f12e196]:
            - row [ref=f12e197]:
              - cell "NFR-01" [ref=f12e198]
              - cell "Provide labelled controls, visible focus and keyboard operation." [ref=f12e199]
              - cell "Automated checks plus manual keyboard review." [ref=f12e200]
            - row [ref=f12e201]:
              - cell "NFR-02" [ref=f12e202]
              - cell "Reflow on small screens without hiding essential actions." [ref=f12e203]
              - cell "Browser viewport review." [ref=f12e204]
            - row [ref=f12e205]:
              - cell "NFR-03" [ref=f12e206]
              - cell "Render imported values as text and validate external links." [ref=f12e207]
              - cell "Hostile-input tests and browser inspection." [ref=f12e208]
            - row [ref=f12e209]:
              - cell "NFR-04" [ref=f12e210]
              - cell "Build from the committed lockfile with locally bundled assets." [ref=f12e211]
              - cell "Clean install and production build." [ref=f12e212]
            - row [ref=f12e213]:
              - cell "NFR-05" [ref=f12e214]
              - cell "Keep process documents outside the public site build." [ref=f12e215]
              - cell "Inspect generated output." [ref=f12e216]
      - heading "Epics and user stories" [level=2] [ref=f12e217]
      - heading "Explore a collection" [level=3] [ref=f12e218]
      - paragraph [ref=f12e219]: As a researcher examining a collection, I want to narrow records and inspect their source so that I can decide which material merits closer reading.
      - paragraph [ref=f12e220]: This is an implementation assumption derived from the commissioned starter. Its usefulness requires observation with representative researchers. FR-01 and FR-02 implement the scenario through the explorer.
      - heading "Prepare a correction" [level=3] [ref=f12e221]
      - paragraph [ref=f12e222]: As a researcher correcting descriptive metadata, I want a recoverable working copy and an explicit export so that I can submit my changes for review.
      - paragraph [ref=f12e223]: This is an implementation assumption. FR-03 through FR-07 implement the scenario. A browser workflow does not establish institutional review authority.
      - heading "Functional scope" [level=2] [ref=f12e224]
      - paragraph [ref=f12e225]:
        - text: The explorer operates on the supplied collection and exposes shareable navigation state. The editor manages a local working copy. Switching research domains requires changes to the
        - link "data contract" [ref=f12e226] [cursor=pointer]:
          - /url: data.html
        - text: ", validation, controls and tests together."
      - heading "Adaptation scenarios for investigation" [level=2] [ref=f12e227]
      - 'region "Table: Candidate scenario, Adaptation question, Evidence needed" [ref=f12e228]':
        - table [ref=f12e229]:
          - rowgroup [ref=f12e230]:
            - row [ref=f12e231]:
              - columnheader "Candidate scenario" [ref=f12e232]
              - columnheader "Adaptation question" [ref=f12e233]
              - columnheader "Evidence needed" [ref=f12e234]
          - rowgroup [ref=f12e235]:
            - row [ref=f12e236]:
              - cell "Structured editing informed by TEI Crafter" [ref=f12e237]
              - cell "Can an agent adapt the foundation to a project's text structure and editorial rules?" [ref=f12e238]
              - cell "Source-preserving import/export, validation examples, editing and recovery tasks, expert assessment" [ref=f12e239]
            - row [ref=f12e240]:
              - cell "Correspondence exploration informed by CorrespExplorer" [ref=f12e241]
              - cell "Can an agent support people, places, dates and their uncertainty without flattening their meaning?" [ref=f12e242]
              - cell "Documented source mappings, exploration tasks, missing-data cases and review of derived views" [ref=f12e243]
      - paragraph [ref=f12e244]: These scenarios express intended investigations. Version 0.1 does not implement TEI editing or correspondence-specific views. Reviewing the existing tools and selecting open data must precede implementation. Compare what each adaptation reuses, changes and replaces before fixing shared interfaces.
      - heading "Decisions" [level=2] [ref=f12e245]
      - heading "ADR-001 Bounded browser starter" [level=3] [ref=f12e246]
      - paragraph [ref=f12e247]: The repository's purpose is to support agent-assisted development of research tools. Version 0.1 implements a small static application to make adaptation inspectable. A universal module interface has no supporting adaptation evidence yet. Additional cases determine the technical extent of the core.
      - heading "ADR-002 Explicit interchange" [level=3] [ref=f12e248]
      - paragraph [ref=f12e249]: Local draft storage aids continuity. Export creates a portable file the researcher can inspect and preserve. Browser storage can be cleared or unavailable, so visible error handling and export are part of the workflow.
      - heading "ADR-003 Canonical specifications" [level=3] [ref=f12e250]
      - paragraph [ref=f12e251]: Selected knowledge files feed the documentation build. Maintaining one authored source reduces contradictory copies. Publication uses an explicit allowlist.
      - heading "ADR-004 Reference cases and evidence" [level=3] [ref=f12e252]
      - paragraph [ref=f12e253]: Visible examples should use real open data with documented selection, rights and transformations. Synthetic inputs remain available for deterministic error cases. Simulated stakeholder perspectives can generate requirements and counterexamples, but their output is a hypothesis requiring source checks or assessment by actual stakeholders. Neither simulated agreement nor passing software tests establishes research usefulness.
      - heading "Provisional concept-study requirements" [level=2] [ref=f12e254]
      - paragraph [ref=f12e255]:
        - text: "The three concept routes support the same research episode: find records using the pilot's metadata search fields, select two to four candidates, inspect original descriptions and uncertainty, remove/reselect candidates, write an observation and unresolved question, and download a research artefact. Source records and source provenance are preserved; researcher text is separately identified. Search must not erase the retained comparison selection. Empty selection cannot produce a misleading completed comparison. Each concept uses the investigation exchange and local recovery contract in"
        - link "Data" [ref=f12e256] [cursor=pointer]:
          - /url: data.html#investigation-exchange
        - text: . Save success, failure and replacement are explicit. Export/reopen also preserves notes without selected records, which is unfinished work rather than a completed comparison. Each concept exposes a route back to the concept comparison. These requirements scope the study, not every future research tool.
      - heading "Investigation workbench contract" [level=2] [ref=f12e257]
      - list [ref=f12e258]:
        - listitem [ref=f12e259]:
          - text: "IW-01: At"
          - code [ref=f12e260]: /pilot/
          - text: ", inspect the real frozen catalogue through search, classification, pagination and title or catalogue-date ordering. Original attribution qualifiers remain visible."
        - listitem [ref=f12e261]: "IW-02: Select up to four records, change search without losing that selection, compare original fields and record a research question, observation and unresolved question. Browser navigation remains usable."
        - listitem [ref=f12e262]: "IW-03: Restore locally saved investigation state after reload. If storage fails or another tab changes the draft, preserve the existing stored bytes and allow export of current work."
        - listitem [ref=f12e263]: "IW-04: Export and reopen the canonical investigation, preserving selected source evidence, provenance and separately authored notes. Reject unsupported or changed evidence before replacing work. Confirm valid replacement and abort a file read if intervening edits would be lost."
        - listitem [ref=f12e264]: "IW-05: Keep readable content selectable, avoid introductory sublines, support keyboard focus and a readable narrow comparison region, and provide explicit source and rights context through About and record links."
        - listitem [ref=f12e265]: "IW-06: Inspect the provenance of each comparison value through a labelled Source control. Show original raw values, transformation, publisher, unknown original producer, source identity and the scope of executed technical checks. Keep source uncertainty visible before opening the dialog and return focus on close without changing work."
        - listitem [ref=f12e266]: "IW-07: Create version 2 exports containing selected field evidence, accept exact version 1 files and drafts, and leave legacy source/stored bytes untouched on opening. Reject changed field evidence before replacing the current investigation. Preserve original exports as the rollback path."
      - paragraph [ref=f12e267]: The instrument study is a candidate research workflow. Human acceptance and interdisciplinary transfer remain separate from engineering checks. The baseline and concepts remain accessible for controlled comparisons, with task scope recorded before comparing results.
      - heading "Development and handover acceptance" [level=2] [ref=f12e268]
      - paragraph [ref=f12e269]:
        - text: The
        - link "five development commitments" [ref=f12e270] [cursor=pointer]:
          - /url: project.html#development-commitments
        - text: govern the whole project. A prepared guide or protocol is implementation of the procedure; empirical acceptance requires its actual use.
      - 'region "Table: ID, Observable outcome, Required evidence" [ref=f12e271]':
        - table [ref=f12e272]:
          - rowgroup [ref=f12e273]:
            - row [ref=f12e274]:
              - columnheader "ID" [ref=f12e275]
              - columnheader "Observable outcome" [ref=f12e276]
              - columnheader "Required evidence" [ref=f12e277]
          - rowgroup [ref=f12e278]:
            - row [ref=f12e279]:
              - cell "DEV-01" [ref=f12e280]
              - cell "A researcher can start with a question, material or existing workflow in ordinary language and inspect a working slice." [ref=f12e281]
              - cell "The start guide supplies a copyable prompt and example; a real novice session records prerequisites, assistance, task result and understanding before claiming independent use." [ref=f12e282]
            - row [ref=f12e283]:
              - cell "DEV-02" [ref=f12e284]
              - cell "An existing tool can be adapted without losing its material or work." [ref=f12e285]
              - cell "Reproduce the prior workflow, preserve a referenced baseline and original exports, classify retained/changed/replaced parts, and test old plus new interchange and recovery." [ref=f12e286]
            - row [ref=f12e287]:
              - cell "DEV-03" [ref=f12e288]
              - cell "Another responsible person can maintain or retire an adaptation from its handover." [ref=f12e289]
              - cell "Record ownership or explicit vacancies, environment, supported versions, upgrade and rollback procedure, preservation/export path and outstanding checks. Demonstrate recovery; do not infer a long-term service commitment." [ref=f12e290]
            - row [ref=f12e291]:
              - cell "DEV-04" [ref=f12e292]
              - cell "Reuse claims reflect independent use." [ref=f12e293]
              - cell "Observe people outside implementation on relevant tasks, record failures and help, and bound claims to the observed cases. Agent-only trials remain preparation." [ref=f12e294]
            - row [ref=f12e295]:
              - cell "DEV-05" [ref=f12e296]
              - cell "Development-method claims have a traceable basis separate from product usefulness." [ref=f12e297]
              - cell "Follow the published development study protocol with a declared comparator, task/material/tool identity, interventions, outcome checks and held-out case. Report unperformed comparisons explicitly." [ref=f12e298]
      - paragraph [ref=f12e299]: Current delivery implements the procedures and the bounded Met provenance adaptation. Independent researcher sessions and comparative method outcomes are not implied by its completion.
  - contentinfo [ref=f12e300]:
    - text: Digital Humanities Craft. Development version 0.1.0.
    - link "Development and support" [ref=f12e301] [cursor=pointer]:
      - /url: https://dhcraft.org/fancy-research-tools/
```

# Test source

```ts
  1  | import AxeBuilder from "@axe-core/playwright";
  2  | import { expect, test } from "@playwright/test";
  3  | 
  4  | test("published documentation routes, headings and local links resolve", async ({
  5  |   page,
  6  |   request,
  7  | }) => {
  8  |   await page.goto("/");
  9  |   await expect(page.getByRole("heading", { level: 1 })).toHaveText("Fancy Research Tools");
  10 |   const routes = await page
  11 |     .locator(".docs-nav a")
  12 |     .evaluateAll((links) =>
  13 |       links
  14 |         .map((link) => (link as HTMLAnchorElement).href)
  15 |         .filter((href) => href.startsWith(location.origin)),
  16 |     );
  17 |   for (const route of routes) {
  18 |     await page.goto(route);
  19 |     const ids = await page
  20 |       .locator("[id]")
  21 |       .evaluateAll((elements) => elements.map((element) => element.id));
  22 |     expect(new Set(ids).size, route).toBe(ids.length);
  23 |     const links = await page
  24 |       .locator("main a")
  25 |       .evaluateAll((elements) =>
  26 |         elements
  27 |           .map((element) => (element as HTMLAnchorElement).href)
  28 |           .filter((href) => href.startsWith(location.origin)),
  29 |       );
  30 |     for (const link of links) {
  31 |       const response = await request.get(link);
  32 |       expect(response.status(), link).toBe(200);
  33 |       if (new URL(link).pathname.endsWith(".html"))
  34 |         expect(await response.text(), link).toContain("<!doctype html>");
  35 |       const hash = new URL(link).hash;
  36 |       if (hash) {
  37 |         const html = await response.text();
  38 |         const exists = await page.evaluate(
  39 |           ({ html, id }) =>
  40 |             new DOMParser().parseFromString(html, "text/html").getElementById(id) !== null,
  41 |           { html, id: decodeURIComponent(hash.slice(1)) },
  42 |         );
  43 |         expect(exists, `Missing fragment: ${link}`).toBe(true);
  44 |       }
  45 |     }
  46 |   }
  47 |   await page.goto("/reference/specification.html");
> 48 |   expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
     |                                                                 ^ Error: expect(received).toEqual(expected) // deep equality
  49 |   await page.screenshot({ path: "test-results/documentation-desktop.png", fullPage: true });
  50 |   await page.setViewportSize({ width: 320, height: 800 });
  51 |   expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  52 |   await page.screenshot({ path: "test-results/documentation-mobile.png", fullPage: true });
  53 |   await page.goto("/");
  54 |   await expect(page.locator("details.docs-nav")).not.toHaveAttribute("open");
  55 |   await page.getByText("Documentation", { exact: true }).click();
  56 |   await page.getByRole("link", { name: "Design", exact: true }).first().click();
  57 |   await expect(page.getByRole("heading", { name: "Design", exact: true })).toBeVisible();
  58 |   await page.getByText("On this page", { exact: true }).first().click();
  59 |   await page.getByRole("link", { name: "Information visualisation", exact: true }).click();
  60 |   await expect(page).toHaveURL(/#information-visualisation$/);
  61 | });
  62 | 
  63 | test("relative assets and navigation work below a repository subpath", async ({ page }) => {
  64 |   await page.route("**/fancy-research-tools/**", (route) => {
  65 |     const url = new URL(route.request().url());
  66 |     url.pathname = url.pathname.replace("/fancy-research-tools", "");
  67 |     return route.continue({ url: url.href });
  68 |   });
  69 |   await page.goto("/fancy-research-tools/");
  70 |   await page.getByRole("link", { name: "Explore instruments", exact: true }).click();
  71 |   await expect(page).toHaveURL(/\/fancy-research-tools\/pilot\/$/);
  72 |   await expect(page.getByRole("main")).toBeVisible();
  73 |   await page.reload();
  74 |   await expect(page.getByRole("main")).toBeVisible();
  75 | });
  76 | 
  77 | test("narrow reference tables retain readable columns and keyboard scrolling", async ({ page }) => {
  78 |   await page.setViewportSize({ width: 320, height: 800 });
  79 |   await page.goto("/reference/design.html");
  80 |   const table = page.getByRole("region", {
  81 |     name: "Table: Surface, Primary content, Supporting content",
  82 |   });
  83 |   await expect(table).toBeVisible();
  84 |   expect(
  85 |     await table
  86 |       .locator("th")
  87 |       .first()
  88 |       .evaluate((node) => node.getBoundingClientRect().width),
  89 |   ).toBeGreaterThanOrEqual(160);
  90 |   expect(await table.evaluate((node) => node.scrollWidth > node.clientWidth)).toBe(true);
  91 |   await table.focus();
  92 |   await page.keyboard.press("ArrowRight");
  93 |   await expect.poll(() => table.evaluate((node) => node.scrollLeft)).toBeGreaterThan(0);
  94 |   expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  95 | });
  96 | 
```
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
+               "accessibleText": "table: id, behaviour, acceptance evidence",
+               "role": "region",
+             },
+             "id": "landmark-is-unique",
+             "impact": "moderate",
+             "message": "The landmark must have a unique aria-label, aria-labelledby, or title to make landmarks distinguishable",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"table-scroll\" role=\"region\" aria-label=\"Table: ID, Behaviour, Acceptance evidence\" tabindex=\"0\">",
+                 "target": Array [
+                   ".table-scroll[role=\"region\"]:nth-child(35)",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   The landmark must have a unique aria-label, aria-labelledby, or title to make landmarks distinguishable",
+         "html": "<div class=\"table-scroll\" role=\"region\" aria-label=\"Table: ID, Behaviour, Acceptance evidence\" tabindex=\"0\">",
+         "impact": "moderate",
+         "none": Array [],
+         "target": Array [
+           ".table-scroll[role=\"region\"]:nth-child(22)",
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
    - link "Fancy Research Tools" [ref=f12e4] [cursor=pointer]:
      - /url: ../index.html
    - navigation "Project" [ref=f12e5]:
      - link "Overview" [ref=f12e6] [cursor=pointer]:
        - /url: ../index.html
      - link "Tools" [ref=f12e7] [cursor=pointer]:
        - /url: ../tools/
      - link "Documentation" [ref=f12e8] [cursor=pointer]:
        - /url: ../guides/getting-started.html
  - generic [ref=f12e10]:
    - main [ref=f12e11]:
      - heading "Specification" [level=1] [ref=f12e12]
      - paragraph [ref=f12e13]:
        - text: The unreleased starter includes catalogue comparison, annotation of real source texts and collection metadata editing, with task-based links to existing research tools. Design variants and the historical catalogue remain available for development comparisons. Requirements describe observable behaviour. The
        - link "testing record" [ref=f12e14] [cursor=pointer]:
          - /url: testing.html
        - text: identifies evidence and remaining acceptance.
      - heading "Project entry and navigation" [level=2] [ref=f12e15]
      - list [ref=f12e16]:
        - listitem [ref=f12e17]: "NAV-01: The start page provides an overview and links to Tools and Documentation. The project header presents Overview, Tools and Documentation with equal visual weight."
        - listitem [ref=f12e18]: "NAV-02: The gallery groups tools by research activity and identifies material and destination beside actual previews. Local workspaces provide All tools as a return path. External applications open through ordinary links with a visible host. Text remains selectable without triggering navigation. Templates receive setup links rather than a browser-tool launch claim."
        - listitem [ref=f12e19]:
          - text: "NAV-03: Documentation section navigation and page outlines remain visible at desktop and narrow widths. Additional disclosures require a specific optional-detail need under the"
          - link "design contract" [ref=f12e20] [cursor=pointer]:
            - /url: design.html#project-navigation
          - text: .
      - heading "DH pilot contract" [level=2] [ref=f12e21]
      - paragraph [ref=f12e22]:
        - text: The original filtering and aggregation contract below is retained at
        - code [ref=f12e23]: /baseline/
        - text: . The current
        - code [ref=f12e24]: /pilot/
        - text: follows the investigation contract added below.
      - paragraph [ref=f12e25]:
        - text: The subsequent commissioned pilot added the read-only Met instrument explorer now retained at
        - code [ref=f12e26]: baseline/
        - text: . Its task is to inspect original catalogue labels, filter a frozen sample, count groups and identify missing metadata, then export selected source records with query parameters and provenance. The task and independently calculated expectations live under
        - code [ref=f12e27]: benchmarks/cases/met-instruments/
        - text: . Existing editor behaviour and stored drafts remain on their original route. Pilot results establish bounded engineering evidence, with researcher acceptance and wider adaptation still open.
      - paragraph [ref=f12e28]: Search uses a normalized substring across title, object name, culture, descriptive date and medium. Exact classification/culture filters combine with a missing-field filter. Counts and missingness use the current filtered result as denominator. Empty results are explicit. Grouping retains source labels and a separate missing value. Original date descriptions remain visible. Export includes source identifiers, supported fields, filters, summaries and the snapshot manifest. The pilot makes no claim of representative sampling, precise historical dates or causal explanation.
      - paragraph [ref=f12e29]:
        - text: Column-header controls sort the current result by title, date, culture or maker in either direction. Date sorting compares the source
        - code [ref=f12e30]: beginYear
        - text: numerically while retaining the original descriptive date in the cell. This orders catalogue bounds and does not establish exact historical dates. Missing values sort last in both directions. Equal values use the source object ID as a stable tie-breaker. Sorting preserves the filtered population, group counts and selected record.
      - heading "Requirements" [level=2] [ref=f12e31]
      - heading "UI refinement acceptance" [level=3] [ref=f12e32]
      - paragraph [ref=f12e33]:
        - text: The
        - link "design contract" [ref=f12e34] [cursor=pointer]:
          - /url: design.html
        - text: governs hierarchy, visual encodings and interaction across documentation, exploration and editing. The following outcomes are acceptance targets for the commissioned UI revision. Verification follows the
        - link "UI protocol" [ref=f12e35] [cursor=pointer]:
          - /url: testing.html#ui-acceptance-protocol
        - text: .
      - 'region "Table: ID, Observable outcome, Required evidence" [ref=f12e36]':
        - table [ref=f12e37]:
          - rowgroup [ref=f12e38]:
            - row [ref=f12e39]:
              - columnheader "ID" [ref=f12e40]
              - columnheader "Observable outcome" [ref=f12e41]
              - columnheader "Required evidence" [ref=f12e42]
          - rowgroup [ref=f12e43]:
            - row [ref=f12e44]:
              - cell "UI-01" [ref=f12e45]
              - cell "Each route exposes its primary task before extended explanatory material." [ref=f12e46]
              - cell "Desktop and narrow-layout review plus an observed first action." [ref=f12e47]
            - row [ref=f12e48]:
              - cell "UI-02" [ref=f12e49]
              - cell "Icons support understandable labelled actions across routes." [ref=f12e50]
              - cell "Label, focus and keyboard inspection, with local asset verification." [ref=f12e51]
            - row [ref=f12e52]:
              - cell "UI-03" [ref=f12e53]
              - cell "Baseline distributions and metadata gaps expose exact values and their scope." [ref=f12e54]
              - cell "Chart values match the independent oracle, including filtered and empty results." [ref=f12e55]
            - row [ref=f12e56]:
              - cell "UI-04" [ref=f12e57]
              - cell "Chart interactions and filters share query semantics and reversible state." [ref=f12e58]
              - cell "Keyboard selection, reset, URL reload and back navigation retain the expected selected IDs." [ref=f12e59]
            - row [ref=f12e60]:
              - cell "UI-05" [ref=f12e61]
              - cell "Selected-object details expose source qualifiers directly, with important limitations and recovery messages visible." [ref=f12e62]
              - cell "Source comparison, selection interaction and existing editing/storage regression checks." [ref=f12e63]
            - row [ref=f12e64]:
              - cell "UI-06" [ref=f12e65]
              - cell "A researcher completes the task and correctly explains its result and limits." [ref=f12e66]
              - cell "Observed task completion and interpretation recorded separately from automated tests." [ref=f12e67]
            - row [ref=f12e68]:
              - cell "UI-07" [ref=f12e69]
              - cell "Pending inputs, applied filters, selected record and exported population remain distinguishable through mixed interactions." [ref=f12e70]
              - cell "Type a search, operate a chart, inspect and export results; cancel navigation with a dirty editor and check both draft and controls." [ref=f12e71]
            - row [ref=f12e72]:
              - cell "UI-08" [ref=f12e73]
              - cell [ref=f12e74]:
                - text: The desktop catalogue at
                - code [ref=f12e75]: /baseline/
                - text: keeps controls, comparable result rows and selected-object evidence in one working viewport. Narrow layouts retain all content in a usable reading order.
              - cell "Inspect 1440×900 and 1366×768 desktop states and 320 CSS-pixel reflow; operate every scroll region by keyboard and inspect long details." [ref=f12e76]
            - row [ref=f12e77]:
              - cell "UI-09" [ref=f12e78]
              - cell [ref=f12e79]:
                - text: The catalogue table at
                - code [ref=f12e80]: /baseline/
                - text: supports understandable, deterministic sorting without changing the result population.
              - cell [ref=f12e81]:
                - text: Operate all sortable headers in both directions, verify
                - code [ref=f12e82]: aria-sort
                - text: ", source-date order, missing values last, stable ties and preserved selection."
            - row [ref=f12e83]:
              - cell "UI-10" [ref=f12e84]
              - cell "About exposes provenance and limitations without crowding the working header. Data and code licenses remain distinct in the footer." [ref=f12e85]
              - cell "Open and close the dialog by keyboard, verify focus return, sample details, snapshot, guide destination and separate CC0/MIT links." [ref=f12e86]
      - paragraph [ref=f12e87]:
        - text: The historical catalogue at
        - code [ref=f12e88]: /baseline/
        - text: applies current form values when grouping or selecting a chart filter. Unsubmitted edits are identified as pending, and exports use the applied result state. The editor exports the complete collection. Filtering retains a selected record and explicitly explains when that record is outside the results. Cancelling a proposed navigation restores the applied search controls while preserving the unfinished form. Documentation's editing walkthrough includes saving before export.
      - paragraph [ref=f12e89]:
        - text: The catalogue at
        - code [ref=f12e90]: /baseline/
        - text: presents results as comparable table rows and one directly visible detail pane. A contextual result count replaces the redundant Objects heading above the Object column. A valid selection remains visible within the result context. When filtering excludes it, select a matching record or expose an empty detail state. All distribution categories remain reachable without a Show more gate. The group area identifies its filtering purpose and its caption explains its relationship to the table. Both derive from the same filtered sample. The investigation at
        - code [ref=f12e91]: /pilot/
        - text: follows IW-01 through IW-07 below, with separate Collection and Comparison views and retained multi-record selection.
      - paragraph [ref=f12e92]: The catalogue header contains the tool title and export action. The footer contains About, the data license CC0 and the code license MIT. About opens a native dialog with the Met source, the 60 lowest-ID selection, its non-representative character, snapshot date and research guide link. It supports a close button, Escape and focus return. The catalogue has no repeated accordions or Go to objects workaround.
      - heading "Planned version 0.2 acceptance" [level=3] [ref=f12e93]
      - paragraph [ref=f12e94]:
        - text: The following criteria define the planned increment. The
        - link "testing record" [ref=f12e95] [cursor=pointer]:
          - /url: testing.html
        - text: identifies execution evidence, while
        - code [ref=f12e96]: knowledge/plan.md
        - text: in the repository maintains remaining work. Preparation, Exploration, Distillation and Implementation recur as material and prototypes change the research question. Runtime LLM integration depends on the resulting tool's task.
      - 'region "Table: ID, Planned outcome, Required evidence" [ref=f12e97]':
        - table [ref=f12e98]:
          - rowgroup [ref=f12e99]:
            - row [ref=f12e100]:
              - columnheader "ID" [ref=f12e101]
              - columnheader "Planned outcome" [ref=f12e102]
              - columnheader "Required evidence" [ref=f12e103]
          - rowgroup [ref=f12e104]:
            - row [ref=f12e105]:
              - cell "V02-01" [ref=f12e106]
              - cell "Start from a question, idea, material, method or existing workflow and develop an explicit research task." [ref=f12e107]
              - cell "A worked iteration records inputs, missing context, alternatives, a prototype observation and the resulting knowledge revision." [ref=f12e108]
            - row [ref=f12e109]:
              - cell "V02-02" [ref=f12e110]
              - cell "Acquire methodological knowledge appropriate to the task." [ref=f12e111]
              - cell "Source passages, reading limits, method prerequisites, alternatives and applicability are recorded separately from agent proposals and human decisions." [ref=f12e112]
            - row [ref=f12e113]:
              - cell "V02-03" [ref=f12e114]
              - cell "Use a browser interface and the simplest stack adequate to the requirements." [ref=f12e115]
              - cell "An architecture decision connects dependencies and any additional processing or services to concrete requirements." [ref=f12e116]
            - row [ref=f12e117]:
              - cell "V02-04" [ref=f12e118]
              - cell "Demonstrate one complete interdisciplinary case with real open data." [ref=f12e119]
              - cell "A reproducible source snapshot, rights record, explicit data semantics and a full exploration or analysis workflow with independently checked output." [ref=f12e120]
            - row [ref=f12e121]:
              - cell "V02-05" [ref=f12e122]
              - cell "Exercise a contrasting capture or annotation adaptation." [ref=f12e123]
              - cell "A bounded runnable workflow with real material records reused, modified and replaced parts and preserves its domain distinctions." [ref=f12e124]
            - row [ref=f12e125]:
              - cell "V02-06" [ref=f12e126]
              - cell "Preserve existing user work while separating responsibilities." [ref=f12e127]
              - cell "Regression checks cover import/export, unsaved forms, storage failures, stale copies and deliberate handling of v0.1 drafts and schema versions." [ref=f12e128]
            - row [ref=f12e129]:
              - cell "V02-07" [ref=f12e130]
              - cell "Make the approach reproducible by another developer or agent." [ref=f12e131]
              - cell "An independent attempt uses repository instructions without hidden conversation context, records interventions and reports unresolved limitations." [ref=f12e132]
            - row [ref=f12e133]:
              - cell "V02-08" [ref=f12e134]
              - cell "Present a reviewable local release candidate." [ref=f12e135]
              - cell "Production build, relevant unit and browser checks, manual interaction review and source/knowledge consistency are recorded. Human research acceptance is recorded separately and remains pending until actually provided." [ref=f12e136]
      - paragraph [ref=f12e137]: Research activities, material structures, file formats and collaboration requirements are separate dimensions. Implemented cases cover catalogue comparison, letter and forecast annotation, and a descriptive projection of real correspondence metadata. teiCrafter and CorrespExplorer are integrated as existing applications through links; their runtime code and private project states are separate. General-purpose format support and a universal plugin API require separate evidence and scope.
      - heading "Functional requirements" [level=3] [ref=f12e138]
      - 'region "Table: ID, Behaviour, Acceptance evidence" [ref=f12e139]':
        - table [ref=f12e140]:
          - rowgroup [ref=f12e141]:
            - row [ref=f12e142]:
              - columnheader "ID" [ref=f12e143]
              - columnheader "Behaviour" [ref=f12e144]
              - columnheader "Acceptance evidence" [ref=f12e145]
          - rowgroup [ref=f12e146]:
            - row [ref=f12e147]:
              - cell "FR-01" [ref=f12e148]
              - cell "Explore records through search, kind filtering and selection." [ref=f12e149]
              - cell "Browser test exercises combined controls and empty results." [ref=f12e150]
            - row [ref=f12e151]:
              - cell "FR-02" [ref=f12e152]
              - cell "Restore explorer state from the URL." [ref=f12e153]
              - cell "Reload and navigation preserve supported query state." [ref=f12e154]
            - row [ref=f12e155]:
              - cell "FR-03" [ref=f12e156]
              - cell "Edit title, record type, place, date, source, notes and review status in a working copy." [ref=f12e157]
              - cell "Browser test edits and exports a record." [ref=f12e158]
            - row [ref=f12e159]:
              - cell "FR-04" [ref=f12e160]
              - cell "Validate imported collections before replacing working data." [ref=f12e161]
              - cell "Invalid imports leave the existing collection intact." [ref=f12e162]
            - row [ref=f12e163]:
              - cell "FR-05" [ref=f12e164]
              - cell "Export a collection that can be reimported without field loss." [ref=f12e165]
              - cell "Round-trip test compares structured values." [ref=f12e166]
            - row [ref=f12e167]:
              - cell "FR-06" [ref=f12e168]
              - cell "Preserve the supplied baseline during local edits." [ref=f12e169]
              - cell "State test checks baseline immutability." [ref=f12e170]
            - row [ref=f12e171]:
              - cell "FR-07" [ref=f12e172]
              - cell "Recover supported drafts after reload and expose storage errors." [ref=f12e173]
              - cell "Reload and unavailable-storage scenarios." [ref=f12e174]
            - row [ref=f12e175]:
              - cell "FR-08" [ref=f12e176]
              - cell "Publish selected specifications with practical guides." [ref=f12e177]
              - cell "Build and link checks include the publication allowlist." [ref=f12e178]
      - heading "Non-functional requirements" [level=3] [ref=f12e179]
      - 'region "Table: ID, Requirement, Assessment" [ref=f12e180]':
        - table [ref=f12e181]:
          - rowgroup [ref=f12e182]:
            - row [ref=f12e183]:
              - columnheader "ID" [ref=f12e184]
              - columnheader "Requirement" [ref=f12e185]
              - columnheader "Assessment" [ref=f12e186]
          - rowgroup [ref=f12e187]:
            - row [ref=f12e188]:
              - cell "NFR-01" [ref=f12e189]
              - cell "Provide labelled controls, visible focus and keyboard operation." [ref=f12e190]
              - cell "Automated checks plus manual keyboard review." [ref=f12e191]
            - row [ref=f12e192]:
              - cell "NFR-02" [ref=f12e193]
              - cell "Reflow on small screens without hiding essential actions." [ref=f12e194]
              - cell "Browser viewport review." [ref=f12e195]
            - row [ref=f12e196]:
              - cell "NFR-03" [ref=f12e197]
              - cell "Render imported values as text and validate external links." [ref=f12e198]
              - cell "Hostile-input tests and browser inspection." [ref=f12e199]
            - row [ref=f12e200]:
              - cell "NFR-04" [ref=f12e201]
              - cell "Build from the committed lockfile with locally bundled assets." [ref=f12e202]
              - cell "Clean install and production build." [ref=f12e203]
            - row [ref=f12e204]:
              - cell "NFR-05" [ref=f12e205]
              - cell "Keep process documents outside the public site build." [ref=f12e206]
              - cell "Inspect generated output." [ref=f12e207]
      - heading "Epics and user stories" [level=2] [ref=f12e208]
      - heading "Explore a collection" [level=3] [ref=f12e209]
      - paragraph [ref=f12e210]: As a researcher examining a collection, I want to narrow records and inspect their source so that I can decide which material merits closer reading.
      - paragraph [ref=f12e211]: This is an implementation assumption derived from the commissioned starter. Its usefulness requires observation with representative researchers. FR-01 and FR-02 implement the scenario through the explorer.
      - heading "Prepare a correction" [level=3] [ref=f12e212]
      - paragraph [ref=f12e213]: As a researcher correcting descriptive metadata, I want a recoverable working copy and an explicit export so that I can submit my changes for review.
      - paragraph [ref=f12e214]: This is an implementation assumption. FR-03 through FR-07 implement the scenario. A browser workflow does not establish institutional review authority.
      - heading "Functional scope" [level=2] [ref=f12e215]
      - heading "Open photograph reference" [level=3] [ref=f12e216]
      - paragraph [ref=f12e217]:
        - text: The independent
        - code [ref=f12e218]: /photographs/
        - text: tool compares an openly licensed historical-photograph sample. Its research task is to retain a small selection, compare catalogue date/creator/technique descriptions, inspect the image and retrieve its source without losing context. Source selection and rights are governed by
        - link "Data" [ref=f12e219] [cursor=pointer]:
          - /url: data.html
        - text: ", and the first-view contract by"
        - link "Design" [ref=f12e220] [cursor=pointer]:
          - /url: design.html#photograph-study
        - text: .
      - 'region "Table: ID, Behaviour, Acceptance evidence" [ref=f12e221]':
        - table [ref=f12e222]:
          - rowgroup [ref=f12e223]:
            - row [ref=f12e224]:
              - columnheader "ID" [ref=f12e225]
              - columnheader "Behaviour" [ref=f12e226]
              - columnheader "Acceptance evidence" [ref=f12e227]
          - rowgroup [ref=f12e228]:
            - row [ref=f12e229]:
              - cell "PHOTO-01" [ref=f12e230]
              - cell "Search and relevant filters coordinate collection and chronological views. View, query and retained selection are addressable." [ref=f12e231]
              - cell "Filtering, browser Back and reload reproduce independently expected record identities. An empty result preserves a recovery action." [ref=f12e232]
            - row [ref=f12e233]:
              - cell "PHOTO-02" [ref=f12e234]
              - cell "Every chronological entry shows the source date qualification and opens the photograph directly." [ref=f12e235]
              - cell "Approximate/range dates remain qualified, original text stays accessible and dense entries remain operable. Ordinal layout makes no proportional-duration claim." [ref=f12e236]
            - row [ref=f12e237]:
              - cell "PHOTO-03" [ref=f12e238]
              - cell "Image inspection preserves context and supports direct pan/zoom and keyboard operation." [ref=f12e239]
              - cell "Operate the locally bundled viewer, open a direct image fallback, return to the same query/selection and check narrow reflow." [ref=f12e240]
            - row [ref=f12e241]:
              - cell "PHOTO-04" [ref=f12e242]
              - cell "Up to four retained photographs can be compared and exported with their original source evidence." [ref=f12e243]
              - cell "Independent expectations agree with the actual downloaded IDs, source fields and snapshot identity. Clearing/removing selection changes no other tool's saved work." [ref=f12e244]
            - row [ref=f12e245]:
              - cell "PHOTO-05" [ref=f12e246]
              - cell "Source and derivation remain distinguishable, with original date/creator qualifications and image rights inspectable." [ref=f12e247]
              - cell "Check source cases against the frozen raw records. Culture or museum location is never rendered as a capture/depicted location." [ref=f12e248]
      - paragraph [ref=f12e249]: The photograph reference has separate data and route state. It introduces no annotation editor or persistence migration for existing investigations. A declared access route, accessible image fallback and retained original values remain available if enhanced image rendering fails.
      - heading "Existing collection workflows" [level=3] [ref=f12e250]
      - paragraph [ref=f12e251]:
        - text: The explorer operates on the supplied collection and exposes shareable navigation state. The editor manages a local working copy. Switching research domains requires changes to the
        - link "data contract" [ref=f12e252] [cursor=pointer]:
          - /url: data.html
        - text: ", validation, controls and tests together."
      - heading "Adaptation scenarios for investigation" [level=2] [ref=f12e253]
      - 'region "Table: Candidate scenario, Adaptation question, Evidence needed" [ref=f12e254]':
        - table [ref=f12e255]:
          - rowgroup [ref=f12e256]:
            - row [ref=f12e257]:
              - columnheader "Candidate scenario" [ref=f12e258]
              - columnheader "Adaptation question" [ref=f12e259]
              - columnheader "Evidence needed" [ref=f12e260]
          - rowgroup [ref=f12e261]:
            - row [ref=f12e262]:
              - cell "Structured editing informed by TEI Crafter" [ref=f12e263]
              - cell "Can an agent adapt the foundation to a project's text structure and editorial rules?" [ref=f12e264]
              - cell "Source-preserving import/export, validation examples, editing and recovery tasks, expert assessment" [ref=f12e265]
            - row [ref=f12e266]:
              - cell "Correspondence exploration informed by CorrespExplorer" [ref=f12e267]
              - cell "Can an agent support people, places, dates and their uncertainty without flattening their meaning?" [ref=f12e268]
              - cell "Documented source mappings, exploration tasks, missing-data cases and review of derived views" [ref=f12e269]
      - paragraph [ref=f12e270]: These scenarios express intended investigations. The local editor implements a descriptive correspondence projection with original sender, recipient, date and place values. A general CMIF importer, correspondence-network exploration and TEI editing remain outside this starter. The gallery links existing applications for those broader tasks. Any adaptation must inspect its source tool and material, then compare what it reuses, changes and replaces before fixing shared interfaces.
      - heading "Decisions" [level=2] [ref=f12e271]
      - heading "ADR-001 Bounded browser starter" [level=3] [ref=f12e272]
      - paragraph [ref=f12e273]: The repository's purpose is to support agent-assisted development of research tools. Version 0.1 implements a small static application to make adaptation inspectable. A universal module interface has no supporting adaptation evidence yet. Additional cases determine the technical extent of the core.
      - heading "ADR-002 Explicit interchange" [level=3] [ref=f12e274]
      - paragraph [ref=f12e275]: Local draft storage aids continuity. Export creates a portable file the researcher can inspect and preserve. Browser storage can be cleared or unavailable, so visible error handling and export are part of the workflow.
      - heading "ADR-003 Canonical specifications" [level=3] [ref=f12e276]
      - paragraph [ref=f12e277]: Selected knowledge files feed the documentation build. Maintaining one authored source reduces contradictory copies. Publication uses an explicit allowlist.
      - heading "ADR-004 Reference cases and evidence" [level=3] [ref=f12e278]
      - paragraph [ref=f12e279]: Visible examples should use real open data with documented selection, rights and transformations. Synthetic inputs remain available for deterministic error cases. Simulated stakeholder perspectives can generate requirements and counterexamples, but their output is a hypothesis requiring source checks or assessment by actual stakeholders. Neither simulated agreement nor passing software tests establishes research usefulness.
      - heading "Provisional concept-study requirements" [level=2] [ref=f12e280]
      - paragraph [ref=f12e281]:
        - text: "The three concept routes support the same research episode: find records using the pilot's metadata search fields, select two to four candidates, inspect original descriptions and uncertainty, remove/reselect candidates, write an observation and unresolved question, and download a research artefact. Source records and source provenance are preserved; researcher text is separately identified. Search must not erase the retained comparison selection. Empty selection cannot produce a misleading completed comparison. Each concept uses the investigation exchange and local recovery contract in"
        - link "Data" [ref=f12e282] [cursor=pointer]:
          - /url: data.html#investigation-exchange
        - text: . Save success, failure and replacement are explicit. Export/reopen also preserves notes without selected records, which is unfinished work rather than a completed comparison. Each concept exposes a route back to the concept comparison. These requirements scope the study, not every future research tool.
      - heading "Investigation workbench contract" [level=2] [ref=f12e283]
      - list [ref=f12e284]:
        - listitem [ref=f12e285]:
          - text: "IW-01: At"
          - code [ref=f12e286]: /pilot/
          - text: ", inspect the real frozen catalogue through search, classification, pagination and title or catalogue-date ordering. Original attribution qualifiers remain visible."
        - listitem [ref=f12e287]: "IW-02: Select up to four records, change search without losing that selection, compare original fields and record a research question, observation and unresolved question. Browser navigation remains usable."
        - listitem [ref=f12e288]: "IW-03: Restore locally saved investigation state after reload. If storage fails or another tab changes or clears the draft, preserve the existing stored bytes, allow export of current work and warn before leaving with work that is no longer saved."
        - listitem [ref=f12e289]: "IW-04: Export and reopen the canonical investigation, preserving selected source evidence, provenance and separately authored notes. Preserve accepted whitespace and line endings until the corresponding text field is edited. Reject unsupported or changed evidence before replacing work. Confirm valid replacement and abort a file read if intervening edits would be lost."
        - listitem [ref=f12e290]: "IW-05: Keep readable content selectable, avoid introductory sublines, support keyboard focus and a readable narrow comparison region, and provide explicit source and rights context through About and record links."
        - listitem [ref=f12e291]: "IW-06: Inspect comparison-value provenance through a labelled Source control and addressable reading view. Show original values, transformation, publisher, unknown original producer, source identity and technical-check scope. Keep source uncertainty visible in comparison and restore focus on return without changing work."
        - listitem [ref=f12e292]: "IW-07: Create version 2 exports containing selected field evidence, accept exact version 1 files and drafts, and leave legacy source/stored bytes untouched on opening. Reject changed field evidence before replacing the current investigation. Preserve original exports as the rollback path."
      - paragraph [ref=f12e293]: The instrument study is a candidate research workflow. Human acceptance and interdisciplinary transfer remain separate from engineering checks. The baseline and concepts remain accessible for controlled comparisons, with task scope recorded before comparing results.
      - heading "Contrasting annotation contract" [level=2] [ref=f12e294]
      - list [ref=f12e295]:
        - listitem [ref=f12e296]:
          - text: "AN-01: At"
          - code [ref=f12e297]: /annotations/
          - text: ", read the full frozen text of archived NOAA/NHC Milton discussions 2 and 6, with original source link, issue time and printed forecaster attribution. Distinguish this historical material from current operational guidance."
        - listitem [ref=f12e298]: "AN-02: Select an exact contiguous passage by pointer or keyboard, categorize it as observation, forecast or stated uncertainty, and save a separate interpretation. Preserve quoted text, source identity and exact offsets."
        - listitem [ref=f12e299]: "AN-03: Record creator kind and name as self-declarations. A source-fit review requires a named reviewer, an explicit criterion and a supports/does-not-support/unclear result. Editing reviewed content clears its prior review; no actor type automatically establishes trust."
        - listitem [ref=f12e300]: "AN-04: Edit and remove annotations, retain a research question, recover locally saved work, export a complete notebook and reopen it in a fresh context. Preserve accepted author text until its own field is edited, and protect unfinished forms during source navigation or file replacement."
        - listitem [ref=f12e301]: "AN-05: Reject altered sources, mismatched quote anchors, duplicate annotation IDs, unknown fields, unsupported versions and oversized files before replacing work. Keep corrupt or externally changed browser copies intact and expose a recovery export plus unload warning."
        - listitem [ref=f12e302]: "AN-06: Keep the Met investigation and collection editor schemas, source identities, drafts and routes unchanged. Document which responsibilities the annotation case reuses and which it replaces. Tests establish the bounded technical contrast; human interpretation remains for operator and domain review."
        - listitem [ref=f12e303]:
          - text: "AN-07: At"
          - code [ref=f12e304]: /letters/
          - text: ", read the Benndorf letter with author, recipient, date, place, edition and rights context. Annotate exact passages as Person, Place, Research topic or Editorial question. Preserve the frozen raw transcription and explicitly identify the LF display transformation. Keep this case's notebook and storage separate from the existing NHC case, reject cross-case imports and preserve unchanged NHC exports byte for byte."
      - heading "Correspondence metadata contract" [level=2] [ref=f12e305]
      - list [ref=f12e306]:
        - listitem [ref=f12e307]: "CM-01: A fresh editor starts with the frozen CC0 Schönbach CMIF projection. An existing valid draft takes precedence. The original synthetic fixture remains supported input, and collection schema 1 and its storage key stay unchanged."
        - listitem [ref=f12e308]: "CM-02: Show original correspondence values and edition identity beside the editable description. Source evidence requires both the known record identifier and exact source identity. Imported same-ID records with another source must not inherit a verification claim."
        - listitem [ref=f12e309]: "CM-03: Preserve the full frozen XML separately from the descriptive JSON. Title construction and the assigned Letter type are explicit transformations. Date, place and source qualifiers retain their source values. The default manual review state is Draft."
        - listitem [ref=f12e310]: "CM-04: Editing, cancelling, exporting and reopening preserve working fields under the existing bounds and recovery contract. The export is a flat descriptive collection and must not be presented as a lossless CMIF round trip."
      - heading "Development and handover acceptance" [level=2] [ref=f12e311]
      - paragraph [ref=f12e312]:
        - text: The
        - link "five development commitments" [ref=f12e313] [cursor=pointer]:
          - /url: project.html#development-commitments
        - text: govern the whole project. A prepared guide or protocol is implementation of the procedure; empirical acceptance requires its actual use.
      - 'region "Table: ID, Development outcome, Required evidence" [ref=f12e314]':
        - table [ref=f12e315]:
          - rowgroup [ref=f12e316]:
            - row [ref=f12e317]:
              - columnheader "ID" [ref=f12e318]
              - columnheader "Development outcome" [ref=f12e319]
              - columnheader "Required evidence" [ref=f12e320]
          - rowgroup [ref=f12e321]:
            - row [ref=f12e322]:
              - cell "DEV-01" [ref=f12e323]
              - cell "A researcher can start with a question, material or existing workflow in ordinary language and inspect a working slice." [ref=f12e324]
              - cell "The start guide supplies a copyable prompt and example; a real novice session records prerequisites, assistance, task result and understanding before claiming independent use." [ref=f12e325]
            - row [ref=f12e326]:
              - cell "DEV-02" [ref=f12e327]
              - cell "An existing tool can be adapted without losing its material or work." [ref=f12e328]
              - cell "Reproduce the prior workflow, preserve a referenced baseline and original exports, classify retained/changed/replaced parts, and test old plus new interchange and recovery." [ref=f12e329]
            - row [ref=f12e330]:
              - cell "DEV-03" [ref=f12e331]
              - cell "Another responsible person can maintain or retire an adaptation from its handover." [ref=f12e332]
              - cell "Record ownership or explicit vacancies, environment, supported versions, upgrade and rollback procedure, preservation/export path and outstanding checks. Demonstrate recovery; do not infer a long-term service commitment." [ref=f12e333]
            - row [ref=f12e334]:
              - cell "DEV-04" [ref=f12e335]
              - cell "Reuse claims reflect independent use." [ref=f12e336]
              - cell "Observe people outside implementation on relevant tasks, record failures and help, and bound claims to the observed cases. Agent-only trials remain preparation." [ref=f12e337]
            - row [ref=f12e338]:
              - cell "DEV-05" [ref=f12e339]
              - cell "Development-method claims have a traceable basis separate from product usefulness." [ref=f12e340]
              - cell "Follow the published development study protocol with a declared comparator, task/material/tool identity, interventions, outcome checks and held-out case. Report unperformed comparisons explicitly." [ref=f12e341]
      - paragraph [ref=f12e342]: Current delivery implements the procedures, the Met provenance adaptation and the contrasting annotation case. Independent researcher sessions and comparative method outcomes remain separate acceptance work.
    - navigation [ref=f12e343]:
      - heading "On this page" [level=2] [ref=f12e344]
      - list [ref=f12e345]:
        - listitem [ref=f12e346]:
          - link "Project entry and navigation" [ref=f12e347] [cursor=pointer]:
            - /url: "#project-entry-and-navigation"
        - listitem [ref=f12e348]:
          - link "DH pilot contract" [ref=f12e349] [cursor=pointer]:
            - /url: "#dh-pilot-contract"
        - listitem [ref=f12e350]:
          - link "Requirements" [ref=f12e351] [cursor=pointer]:
            - /url: "#requirements"
        - listitem [ref=f12e352]:
          - link "Epics and user stories" [ref=f12e353] [cursor=pointer]:
            - /url: "#epics-and-user-stories"
        - listitem [ref=f12e354]:
          - link "Functional scope" [ref=f12e355] [cursor=pointer]:
            - /url: "#functional-scope"
        - listitem [ref=f12e356]:
          - link "Adaptation scenarios for investigation" [ref=f12e357] [cursor=pointer]:
            - /url: "#adaptation-scenarios-for-investigation"
        - listitem [ref=f12e358]:
          - link "Decisions" [ref=f12e359] [cursor=pointer]:
            - /url: "#decisions"
        - listitem [ref=f12e360]:
          - link "Provisional concept-study requirements" [ref=f12e361] [cursor=pointer]:
            - /url: "#provisional-concept-study-requirements"
        - listitem [ref=f12e362]:
          - link "Investigation workbench contract" [ref=f12e363] [cursor=pointer]:
            - /url: "#investigation-workbench-contract"
        - listitem [ref=f12e364]:
          - link "Contrasting annotation contract" [ref=f12e365] [cursor=pointer]:
            - /url: "#contrasting-annotation-contract"
        - listitem [ref=f12e366]:
          - link "Correspondence metadata contract" [ref=f12e367] [cursor=pointer]:
            - /url: "#correspondence-metadata-contract"
        - listitem [ref=f12e368]:
          - link "Development and handover acceptance" [ref=f12e369] [cursor=pointer]:
            - /url: "#development-and-handover-acceptance"
    - navigation [ref=f12e370]:
      - heading "Documentation" [level=2] [ref=f12e371]
      - generic [ref=f12e372]:
        - generic [ref=f12e373]:
          - heading "Build a tool" [level=3] [ref=f12e374]
          - link "Get started" [ref=f12e375] [cursor=pointer]:
            - /url: ../guides/getting-started.html
          - link "Customize" [ref=f12e376] [cursor=pointer]:
            - /url: ../guides/customizing.html
          - link "Research basis" [ref=f12e377] [cursor=pointer]:
            - /url: ../guides/research.html
          - link "Development study" [ref=f12e378] [cursor=pointer]:
            - /url: ../guides/development-study.html
        - generic [ref=f12e379]:
          - heading "Reference" [level=3] [ref=f12e380]
          - link "Project" [ref=f12e381] [cursor=pointer]:
            - /url: ../reference/project.html
          - link "Specification" [ref=f12e382] [cursor=pointer]:
            - /url: ../reference/specification.html
          - link "Architecture" [ref=f12e383] [cursor=pointer]:
            - /url: ../reference/architecture.html
          - link "Data" [ref=f12e384] [cursor=pointer]:
            - /url: ../reference/data.html
          - link "Design" [ref=f12e385] [cursor=pointer]:
            - /url: ../reference/design.html
          - link "Testing" [ref=f12e386] [cursor=pointer]:
            - /url: ../reference/testing.html
      - link "Source repository" [ref=f12e387] [cursor=pointer]:
        - /url: https://github.com/DigitalHumanitiesCraft/fancy-research-tools
  - contentinfo [ref=f12e388]:
    - text: Digital Humanities Craft. Development version 0.1.0.
    - link "Development and support" [ref=f12e389] [cursor=pointer]:
      - /url: https://dhcraft.org/fancy-research-tools/
```

# Test source

```ts
  1   | import AxeBuilder from "@axe-core/playwright";
  2   | import { expect, test } from "@playwright/test";
  3   | 
  4   | test("published documentation routes, headings and local links resolve", async ({
  5   |   page,
  6   |   request,
  7   | }) => {
  8   |   await page.goto("/");
  9   |   await expect(page.getByRole("heading", { level: 1 })).toHaveText("Fancy Research Tools");
  10  |   await expect(page.getByRole("link", { name: "Open the tool gallery" })).toBeVisible();
  11  |   await page.goto("/guides/getting-started.html");
  12  |   const routes = await page
  13  |     .locator(".docs-nav a")
  14  |     .evaluateAll((links) =>
  15  |       links
  16  |         .map((link) => (link as HTMLAnchorElement).href)
  17  |         .filter((href) => href.startsWith(location.origin)),
  18  |     );
  19  |   for (const route of routes) {
  20  |     await page.goto(route);
  21  |     const ids = await page
  22  |       .locator("[id]")
  23  |       .evaluateAll((elements) => elements.map((element) => element.id));
  24  |     expect(new Set(ids).size, route).toBe(ids.length);
  25  |     const links = await page
  26  |       .locator("main a")
  27  |       .evaluateAll((elements) =>
  28  |         elements
  29  |           .map((element) => (element as HTMLAnchorElement).href)
  30  |           .filter((href) => href.startsWith(location.origin)),
  31  |       );
  32  |     for (const link of links) {
  33  |       const response = await request.get(link);
  34  |       expect(response.status(), link).toBe(200);
  35  |       if (new URL(link).pathname.endsWith(".html"))
  36  |         expect(await response.text(), link).toContain("<!doctype html>");
  37  |       const hash = new URL(link).hash;
  38  |       if (hash) {
  39  |         const html = await response.text();
  40  |         const exists = await page.evaluate(
  41  |           ({ html, id }) =>
  42  |             new DOMParser().parseFromString(html, "text/html").getElementById(id) !== null,
  43  |           { html, id: decodeURIComponent(hash.slice(1)) },
  44  |         );
  45  |         expect(exists, `Missing fragment: ${link}`).toBe(true);
  46  |       }
  47  |     }
  48  |   }
  49  |   await page.goto("/reference/specification.html");
> 50  |   expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
      |                                                                 ^ Error: expect(received).toEqual(expected) // deep equality
  51  |   await page.screenshot({ path: "test-results/documentation-desktop.png", fullPage: true });
  52  |   await page.setViewportSize({ width: 320, height: 800 });
  53  |   expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  54  |   await page.screenshot({ path: "test-results/documentation-mobile.png", fullPage: true });
  55  |   await page
  56  |     .getByRole("navigation", { name: "Documentation", exact: true })
  57  |     .getByRole("link", { name: "Design", exact: true })
  58  |     .click();
  59  |   await expect(page.getByRole("heading", { name: "Design", exact: true })).toBeVisible();
  60  |   await page
  61  |     .getByRole("navigation", { name: "On this page", exact: true })
  62  |     .getByRole("link", { name: "Information visualisation", exact: true })
  63  |     .click();
  64  |   await expect(page).toHaveURL(/#information-visualisation$/);
  65  | });
  66  | 
  67  | test("relative assets and navigation work below a repository subpath", async ({ page }) => {
  68  |   await page.route("**/fancy-research-tools/**", (route) => {
  69  |     const url = new URL(route.request().url());
  70  |     url.pathname = url.pathname.replace("/fancy-research-tools", "");
  71  |     return route.continue({ url: url.href });
  72  |   });
  73  |   await page.goto("/fancy-research-tools/");
  74  |   await page.getByRole("link", { name: "Open the tool gallery" }).click();
  75  |   await expect(page).toHaveURL(/\/fancy-research-tools\/tools\/$/);
  76  |   await page
  77  |     .getByRole("main")
  78  |     .getByRole("link", { name: "Compare catalogue records", exact: true })
  79  |     .click();
  80  |   await expect(page).toHaveURL(/\/fancy-research-tools\/pilot\/$/);
  81  |   await expect(page.getByRole("main")).toBeVisible();
  82  |   await page.reload();
  83  |   await expect(page.getByRole("main")).toBeVisible();
  84  |   await page.goto("/fancy-research-tools/");
  85  |   await page.getByRole("link", { name: "Open the tool gallery" }).click();
  86  |   await page
  87  |     .getByRole("main")
  88  |     .getByRole("link", { name: "Edit letter metadata", exact: true })
  89  |     .click();
  90  |   await expect(page).toHaveURL(/\/fancy-research-tools\/tool\/$/);
  91  |   await expect(page.getByRole("main")).toBeVisible();
  92  | });
  93  | 
  94  | test("gallery previews, tool entry and return work at narrow width", async ({ page }) => {
  95  |   await page.setViewportSize({ width: 320, height: 800 });
  96  |   await page.goto("/tools/");
  97  |   const destinations = await page
  98  |     .locator(".open-tool")
  99  |     .evaluateAll((links) => links.map((link) => (link as HTMLAnchorElement).href));
  100 |   expect(destinations).toHaveLength(9);
  101 |   const localDestinations = destinations.filter(
  102 |     (href) => new URL(href).origin === "http://127.0.0.1:4173",
  103 |   );
  104 |   expect(localDestinations.map((href) => new URL(href).pathname).sort()).toEqual([
  105 |     "/letters/",
  106 |     "/photographs/",
  107 |     "/pilot/",
  108 |     "/tool/",
  109 |   ]);
  110 |   await expect(page.getByRole("navigation", { name: "Research tasks" })).toBeVisible();
  111 |   await expect(
  112 |     page.getByRole("heading", { name: "Alternative instrument interfaces" }),
  113 |   ).toHaveCount(0);
  114 |   await expect(page.getByRole("link", { name: /Open repository template/ })).toHaveAttribute(
  115 |     "href",
  116 |     "https://github.com/DigitalHumanitiesCraft/agentic-edition-pipeline",
  117 |   );
  118 |   for (const preview of await page.locator(".tool-entry img").all()) {
  119 |     await preview.scrollIntoViewIfNeeded();
  120 |     await expect
  121 |       .poll(() =>
  122 |         preview.evaluate(
  123 |           (image) =>
  124 |             (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0,
  125 |         ),
  126 |       )
  127 |       .toBe(true);
  128 |   }
  129 |   expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  130 |   expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  131 |   for (const destination of localDestinations) {
  132 |     await page.goto(destination);
  133 |     await expect(page.getByRole("main")).toBeVisible();
  134 |     await page.getByRole("link", { name: "All tools", exact: true }).click();
  135 |     await expect(page).toHaveURL(/\/tools\/$/);
  136 |   }
  137 | });
  138 | 
  139 | test("narrow reference tables retain readable columns and keyboard scrolling", async ({ page }) => {
  140 |   await page.setViewportSize({ width: 320, height: 800 });
  141 |   await page.goto("/reference/design.html");
  142 |   const table = page.getByRole("region", {
  143 |     name: "Table: Surface, Primary content, Supporting content",
  144 |   });
  145 |   await expect(table).toBeVisible();
  146 |   expect(
  147 |     await table
  148 |       .locator("th")
  149 |       .first()
  150 |       .evaluate((node) => node.getBoundingClientRect().width),
```
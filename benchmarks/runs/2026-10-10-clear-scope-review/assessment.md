# Bounded workbench and knowledge review, 2026-10-10

The operated Instrument study workflow and focused recovery/import review confirmed no application defect within the examined scope. The review preserved the application and its data. Two stale passages in the Vault project concept require reconciliation. Provenance for individual data points is the operator's intended direction, with its schema and checking policy still open.

## Source state

The repository was on `codex/version-0.1` at HEAD `85353dd942ebdcc1a53dd976c42b762f7a1a0be2`, with substantial uncommitted and untracked implementation. The lead runner captured 234 files before this review. [source-manifest.json](source-manifest.json) identifies their bytes. Its SHA256 is `164F943310B5B0233AD6958862727B151495F2283CA17E57156CDD81B898E786`. The complete local source snapshot is retained in the chat workspace at `work/fancy-clear-scope-baseline/`.

The knowledge reviewer compared the project, specification, plan, Met manifest, Met records and three project-local UI skills with that snapshot. All matched. The review changed no application source, research data or skill. This documentation update follows the captured state. Generated application output was refreshed by the lead runner's later build. The [evidence manifest](evidence-manifest.json) records hashes of the retained source manifest and UI evidence, whose copied bytes were checked against the original files.

## Executed checks

| Work | Observed result | Evidence and scope |
|---|---|---|
| Operated `/pilot/` review | Search, selection, original-description comparison, question and notes, reload, actual download and fresh-context reopening succeeded. Empty search retained the selection. Source text could be selected without navigation. | [Original UI assessment](ui/assessment.md), screenshots and [downloaded investigation](ui/instrument-investigation.json). The UI agent used isolated headless Chromium contexts at desktop and narrow sizes. |
| Source preservation | The UI agent compared both complete exported records, Met 500531 and 500533, with the repository's frozen projection and reported deep equality. The knowledge reviewer inspected the downloaded records and confirmed the same two source IDs and wording in the retained reopening screenshot. | Downloaded JSON, `data/met-instruments/records.json` and [reopened-confirmed.png](ui/reopened-confirmed.png). Catalogue assertions retain their source qualifications. |
| Shared investigation and recovery review | The engineering agent examined `src/research/` and ran the two focused test files, with all 11 tests passing and no reproduced defect. | Delegated engineering result in the session record. This assessment does not claim an independent rerun by its author. |
| Integrated code checks | The lead runner reported successful `npm run check` and `npm test`, covering 38 tests in five files. | Lead-runner tool results in the session record. No code change followed these checks. |
| Build and observed resource identity | The lead runner's `npm run build` passed. All seven observed pilot HTML/asset hashes matched the fresh output. | [Observed response hashes](ui/served-assets.json) and [later build comparison](ui/rebuilt-asset-check.json). |
| Repository/Vault and skill-source review | Two stale project-concept passages were confirmed. Installed `promptotyping` and `vault-orient` instructions matched their Vault sources by SHA256. | Read-only file inspection and hash comparison, with the outgoing corrections specified in the [plan](../../../knowledge/plan.md#outgoing-vault-follow-up). |

The original UI assessment records build freshness as uncertain at the time of operation. The later lead-runner build and byte comparison resolved that uncertainty for the seven resources actually observed on `/pilot/`. The preserved original assessment retains its earlier wording. This addendum does not extend the operated route coverage.

## Browser observations and interventions

The UI agent applied `research-ui-evaluate` before inspecting implementation. Searching `wood` returned 41 records. It compared Book Harmonium 500531 and Oboe 500533, preserving the `Lepuye (?)` attribution and catalogue date qualifiers, and wrote a bounded catalogue observation. Reload restored the question and note. The actual 17,632-byte investigation download reopened in a fresh browser context after confirmation.

At 320 pixels the document retained its width, and the locally scrollable comparison could be panned with a keyboard action. The agent targeted some controls through `focus()` before keyboard activation. These actions provide bounded keyboard evidence. Full keyboard-only traversal remains unperformed in this run.

Early harness readings captured focus before asynchronous navigation settled and automatically dismissed the native replacement confirmation. Settled navigation and explicit dialog acceptance produced the expected focus and reopened content. [observations.json](ui/observations.json) retains the provisional readings. The [corrected import procedure](ui/followup-confirm.cjs) and [reopening screenshot](ui/reopened-confirmed.png) support the final account. These harness interventions produced no confirmed product defect.

The review covers the current `/pilot/` only. Three-concept comparison, the documentation/editor tutorial, native browser zoom, screen-reader use, full keyboard traversal, new storage-failure/corrupt-import browser trials and representative human interpretation remain outside this run. The earlier engineering evidence remains in its original run directories. No participant, timing result, preference score or researcher acceptance is inferred here.

## Skill application

The practical focus was `research-ui-evaluate` and `vault-orient`. The former guided the operated workflow. The latter guided selective reading from a session started outside the Vault, repository verification of mutable project claims and preservation of the Vault's read-only boundary.

| Procedure | Loaded source and revision | Actual use |
|---|---|---|
| `research-ui-evaluate` | Repository `.agents/skills/research-ui-evaluate/SKILL.md`, SHA256 `E6BB098E29ACF0E001396FF96E0EBE73614120F7391373DFA30522E7F4E8CE07` | One operated workbench case by the UI agent, which identifies its model as `gpt-6.1-sol`. Tools and interventions are recorded in the original UI assessment and scripts. |
| `vault-orient` | Installed `~/.agents/skills/vault-orient/SKILL.md`, SHA256 `C84E6073009290A40040C38D294778E614333FCA42DDA79034EB1D261C7F9147` | One read-only orientation and repository-comparison case using PowerShell, `rg`, Git inspection and file hashes. The subagent inherited the parent model, whose exact runtime identifier was not separately exposed to this reviewer. |
| `promptotyping` | Installed `~/.agents/skills/promptotyping/SKILL.md`, SHA256 `8CBF2D90437111B378F6818FF3509827C8E000F48359A0EB40B0A7806BDA9DDA` | Repository orientation and this bounded write-back. Its other workflows were not exercised. |

The personal procedures are maintained in the Vault's `.claude/skills/` and installed through its existing rollout. Their loaded instruction files matched the canonical sources. The three `research-ui-*` procedures have their own project-local source under `.agents/skills/`. The design and improve procedures were read in the knowledge review without a new design or correction run. `writing-style` guided the assessment and knowledge-document prose.

The knowledge review used the inherited conversation and an explicit, bounded assignment. It read repository agent instructions, Index, handoff, plan, relevant contracts and run records. Vault reading followed `AGENTS.md`, `HOME.md`, the repository mapping, the linked project concept, relevant conventions and the skill register. Additional source paths and versions were checked as needed. No extra user clarification was required for this reading.

No skill was changed. The additional held-out case, controlled comparison of original and revised procedures and broader effectiveness evaluation remain open. Reading, matching installed files and applying a procedure once provide only their stated evidence.

## Conceptual follow-up

The operator wants provenance attached to individual data points, identifying human, source and LLM/AI-agent contributions and showing verification or validation. The representation of those dimensions, the meaning and authority of checking, and the evidence required for a status remain unresolved. The [next design discussion](../../../knowledge/plan.md#open-decisions-and-dependencies) must establish these before changes to the data or interaction contracts. Additional export products and broad style formulations suggested during planning remain proposals.

The Vault follow-up concerns the concept document's obsolete either/or entry decision and its description of Met as a candidate alongside a general synthetic-data statement. The plan records the exact target passages, checked sources and intended correction. The Vault, skills and incoming handoff inbox were unchanged.

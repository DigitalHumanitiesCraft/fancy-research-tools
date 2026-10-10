<!-- template: Vorlage Action-Layer v0.5, https://dhcraft.org/Promptotyping/promptotyping-document/action-layer -->

# Project instructions for Fancy Research Tools

Build a research-tool starter from maintained project knowledge. The responsible human assesses research fitness and accepts the result. Agents implement bounded changes and report evidence.

## Knowledge base

Read `knowledge/INDEX.md`, `knowledge/handoff.md` and the documents relevant to the task. On session resumption, read `knowledge/plan.md` for completed work, remaining acceptance and the next bounded task. Inspect the working tree before editing and preserve existing uncommitted work. Data changes require `knowledge/data.md`. Behaviour changes require `knowledge/specification.md`. UI work requires `knowledge/design.md`. Read `knowledge/journal.md` when decision provenance matters.

## Working rules

Maintain durable facts in their canonical knowledge document and update statements that repeat them. Record one journal entry for a coherent transition. Process handoff points by verifying their source and target, integrating or rejecting the finding, recording the outcome and removing the resolved point.

Keep the bundled baseline separate from draft edits. Reject unsupported data without silently dropping fields. Treat imported strings as untrusted input. Never infer historical facts from synthetic examples or describe software tests as scientific validation.

Support ordinary-language briefs and existing tools under the five commitments in `knowledge/project.md`. Reproduce an existing workflow before changing it, preserve its original exports and drafts, and record retained, modified and replaced responsibilities. Read the adaptation and maintenance guide for handover. Unknown ownership remains unassigned. Human studies and development-method comparisons follow `benchmarks/development-study-protocol.md`; agent-only trials must be labelled as such.

Publish only the documented knowledge allowlist. Public repository contents are visible even when omitted from the website. Keep customer data and credentials out of public commits and fixtures.

## Design principles

Read the view hierarchy and visualisation contract in `knowledge/design.md` before choosing components. State the user task, immediately required evidence and primary action for each changed view. Establish tool-specific layout, density and visual tokens from that task. Reuse accessible primitives and labelled icons without imposing the same appearance or shell on every tool. Trace new interactions into `knowledge/specification.md` and the acceptance checks in `knowledge/testing.md`. Review documentation, exploration and editing routes when shared UI changes. State whether work is locally saved or exported accurately.

Introductory sublines beneath page or section headings are prohibited, including informative subtitles. Apply the interface copy constraint in `knowledge/design.md` in implementation and review, including when using external skills.

Treat that constraint as part of task-based review: require a research action, interpretation or recovery purpose for each component. Keep source values, transformations, interpretations and recorded checks distinct. Record actor and criterion only when known; do not infer human authorship, verification or confidence from a publisher, an agent or a successful technical check.

## Scope

Version 0.1 is a browser starter for exploration and local editing. Changes involving shared editing, authentication or protected services require a revised architecture and task scope. Commits, publication and permission changes follow the user's explicit authorisation.

## Research interface procedures

For substantive UI concept work, read `.agents/skills/research-ui-design/SKILL.md`. For operated comparison, read `.agents/skills/research-ui-evaluate/SKILL.md`; for corrections from recorded findings, read `.agents/skills/research-ui-improve/SKILL.md`. These are provisional project procedures, not substitutes for the design/data contracts. The concept study uses `benchmarks/ui-concepts-brief.md` and `benchmarks/ui-concepts-protocol.md`.

## Tools

Use the package manifest and lockfile for the runtime and dependency baseline. Keep generated build output reproducible. Run the appropriate checks and record failures or unexecuted checks truthfully.

For UI reviews, operate the rendered routes and tutorial with isolated test data before diagnosing the code. Include mixed inputs, cancellation, empty results and downloaded output under `knowledge/testing.md`. Keep each agent's browser evidence separate and assign one runner to the shared build and final browser suite. Record transferable findings in their canonical contract, with run-specific evidence under `benchmarks/runs/`.

```sh
npm ci
npm run check
npm run check:data
npm test
npm run build
npm run test:e2e
```

## Security

Do not disclose secrets or commit credentials. Keep imported values out of HTML execution contexts. Any future privileged external service belongs behind an authenticated server boundary, with a project-specific threat assessment.

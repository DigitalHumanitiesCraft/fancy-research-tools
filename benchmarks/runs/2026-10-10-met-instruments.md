# Met instruments development pilot, 2026-10-10

## Conditions

The user commissioned web research for open Digital Humanities data, implementation through subagents and evaluation toward a Fancy Research Tools benchmark. Earlier human steering established a material-led Promptotyping process, a browser-first interface and a simple stack that can grow with requirements. This run carries that conversation context.

The lead agent coordinates source research, benchmark design and application implementation. The benchmark agent inspects the existing repository and writes only under `benchmarks/`. Source and application agents share filesystem state. This is a development pilot with an openly available oracle. Model comparisons, blinded evaluation and unaided autonomy are outside the recorded design.

The benchmark agent read `AGENTS.md`, the knowledge index, handoff, plan, data contract, specification, testing document and existing tests before defining the task. The existing tests use synthetic v0.1 record IDs. Preserving that workspace and adding a separate real-data route avoids using a data replacement as evidence of generality.

The lead agent selected a bounded Met Musical Instruments snapshot after source research. This follows the user's latest request for DH data. The earlier v0.2 plan's broader disciplinary demonstration remains untested by this case.

## Evidence state

Task and oracle are defined under [the case directory](../cases/met-instruments/task.md). Raw retrieval and rights evidence belong to `data/met-instruments/`. The oracle was generated and successfully rechecked before 14:46:31 UTC on 2026-10-10, while the application agent was still implementing the case. It reads 60 preserved responses and verifies ten fixed queries. Full-selection missingness is five absent culture descriptions, zero absent date descriptions and one absent medium description. The literal search `flute` returns no records in the specified search fields. These are raw-data calculation observations, with application agreement still to be checked.

The lead agent reported that the pre-change baseline passed type/lint checks, 19 unit tests and ten production browser tests. This author did not execute those baseline checks. Implementation, production build, browser verification of the new case, independent reproduction and researcher acceptance have no results recorded here yet. The integrating agent must append only checks actually performed, including failures and repairs.

## Run identity

The inspected base commit is `85353dd942ebdcc1a53dd976c42b762f7a1a0be2`, and the oracle ran on Node.js v22.14.0 in Windows. The implementation includes uncommitted files. Record the final source manifest or snapshot, dirty-tree state, lockfile hash and browser version with the completed run. A final manifest must not be represented as a previously captured baseline. Agent model identity and resource telemetry are unavailable to this benchmark author. No elapsed-time or token-use estimates have been inferred.

## Observations and interventions

The benchmark author proposed exact query semantics and an independent raw-data oracle to the lead agent before finishing the implementation. Case specification and expected output are shared openly with the implementation team. Changes requested during integration must be appended here with their reason.

Parent review found that five source objects carry attribution qualifiers in `artistPrefix` or `artistSuffix`, which the first derived data and interface omitted. The affected IDs are `500531`, `500553`, `500555`, `500564` and `500580`. The lead requested preserving and displaying those qualifiers. This illustrates a domain-preservation issue that the initial count oracle did not cover. Raw snapshots and count expectations remain unchanged.

Parent review also identified different search-field separators in the oracle and application. The benchmark author confirmed a newline in the oracle and a space in `src/pilot/domain.ts`. Case version 0.2 specifies a single-space join and adds the `organ pipe organ` cross-field phrase case before final tests. The original expected file had SHA-256 `e867a74bacd466e621206e247fce170bdc6d842fff05adf744f05cbcb177963b`. The original ten queries are retained. Regeneration after this explicit contract revision is not an independent pass on the original ambiguous contract.

The benchmark author independently compared every projected text field and both date bounds with all 60 raw responses after the attribution repair. All mapped values agreed with the documented mapping. No projected source string consisted solely of whitespace. The importer currently maps exact empty strings to null, while the oracle also treats whitespace-only strings as missing. This difference has no effect on this snapshot and remains a boundary to address before using broader input material.

Source inspection confirms that the new pilot does not write browser storage and uses its own route, while the existing editable tool remains present. Full regression execution is recorded separately. The benchmark author also inspected the new browser tests. Their keyboard check focuses the search field programmatically and submits with Enter, which exercises a bounded interaction rather than a complete manual keyboard workflow. Screen-reader usability and researcher task completion remain unobserved.

## Final integration results

The lead independently ran the offline importer (62 raw files verified, 60 records regenerated), the revised oracle (11 queries), type/lint checks, 24 unit tests and the production build successfully. The final browser run, executed by the lead alone after documentation integration, passed all 13 tests in Playwright Chromium 156.0.8078.4. The pilot route returned HTTP 200 on the local preview server. Desktop and mobile screenshots were visually reviewed.

One earlier interaction test incorrectly assumed that the sample contained a searchable `flute`; the actual result is zero. The implementation agent corrected the positive interaction example to `ud`, while the oracle retains the zero-result case. Concurrent integration browser runs also collided on shared trace output, causing two teardown ENOENT failures in the implementation agent's run. The final sole-runner pass resolves that execution collision; it does not erase the failed attempt.

The recorded source identity is [the final manifest](2026-10-10-met-instruments-source.json), covering 122 source files. `node benchmarks/capture-source.mjs --check` passed immediately after capture. Package-lock SHA-256 is `971dd71ce00ba3a4a74ef6ffbfa0e1a647aadd05c7d977a59a9e278043bf8d31`. This is an uncommitted working-tree identity, not a release or a pristine starting snapshot. Mutable run records and generated build/test output are excluded from the manifest.

The result demonstrates descriptive exploration and export of this fixed museum-metadata sample. It does not establish representative collection statistics, scholarly correctness of catalogue claims, independent agent reproducibility, cross-domain generality or a ranking of models. No aggregate benchmark score is assigned.

## Remaining assessment

The accountable human's review of research usefulness is pending. Cross-domain adaptation and a repository-only reproduction by a fresh agent remain separate evaluations.

# Commit preparation, 2026-10-10

The operator authorised commit and push after stable checks and controlled closeout. This preparation adds a root Git attribute policy to preserve exact source and evidence bytes across platforms. The importer's more specific LF policy is retained. The source-capture script now includes the root policy. Maintained resumption wording no longer assumes that the work must remain uncommitted, and the unpublished-state statement is explicitly scoped to its historical documentation closeout.

The matching source identity is ../2026-10-10-commit-preparation-source.json. Source comparison records the exact changes from the preceding documentation closeout. Application code and frozen data are unchanged.

## Executed checks

- TypeScript and Biome passed without repairs.
- All four frozen-source derivation checks passed.
- All 91 unit tests passed.
- Production build passed with current documentation.
- All 55 Playwright browser cases passed against the production build.
- Maintained Markdown links: 31 files and 186 local links, with no missing targets or anchors.

The logs retain the actual command output. Historical captures and run files were not rewritten. Git index and remote identity are checked separately during the authorised commit/push operation; this pre-commit record does not claim a completed push.

## Remaining scope

Human UI acceptance, representative research use, screen-reader operation and comparative method evaluation remain open. A development-branch push is not a release or Pages deployment. The website deployment workflow is manual.

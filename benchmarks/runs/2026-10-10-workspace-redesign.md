# Task-specific workspace redesign, 2026-10-10

Operator-directed redesign of the Met explorer, collection editor and documentation. Two implementation subagents owned separate explorer/editor files; the integrating agent reviewed rendered screenshots and ran the shared production checks.

The explorer now exposes an analytical distribution, comparable table and selected-object evidence together. The editor has a separate warm ink/amber identity with record navigation and a dominant editing surface. Documentation has neutral typography. All tools have task-specific design contracts; DHCraft remains the organisational context rather than a required visual identity.

Verification: 24 unit tests passed; TypeScript/Biome and production build passed. Final browser suite: 20 passed. It covers real downloaded JSON, the independent Met oracle, filter state, keyboard selection, storage and recovery, subpath routes, desktop viewport fit, narrow overflow and bounded axe checks. Desktop screenshots in `workspace-redesign/` were inspected at 1440×900. Tests additionally check 1366×768 and 320px narrow layouts.

Earlier attempts: the first integrated browser run had 18 passed and two ambiguous missing-metadata selectors; the corrected locators target the combobox. Visual review then found CSS layer precedence overriding compact typography and grid rows compressing long category labels; both were fixed before final verification. These defects show why passing interaction checks alone do not establish visual acceptance.

Source identity: `2026-10-10-workspace-redesign-source.json`. Historical run records remain unchanged.

Limits: agent operation is engineering evidence. Representative researcher acceptance, native browser zoom and screen-reader task review remain unperformed. The editor still uses its explicitly fictional demonstration collection; the explorer uses the real Met sample. Long datasets scroll within desktop workspace regions; narrow layouts retain document flow.

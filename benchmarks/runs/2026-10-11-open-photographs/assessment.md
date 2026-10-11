# Open photograph reference and UI procedure trials

Executed on 2026-10-11 with Node.js 22.14.0 on Windows. The source manifest `../2026-10-11-open-photographs-source.json` identifies the final uncommitted source. No publication or human acceptance was performed.

## Integrated example

The separate Photograph study uses forty CC0 Cleveland Museum of Art photographs, frozen API material and unchanged local JPEGs. The importer, schema, independent semantic cases and runtime preserve catalogue dates, uncertain attribution, creator roles, original source fields and derivation identity. No customer records, images, screenshots, private code or project history were transferred. No spatial inference or runtime LLM feature was added.

The operated episode searched Yosemite, retained Bridal Veil and Yosemite Falls, compared source wording, opened a chronological mark, inspected the image with pointer pan and keyboard zoom, returned to the same context and downloaded both records. The actual downloaded records and derivation equal their original JSON-LD values. Screenshots in `manual/` show the desktop states.

Independent code review found the skip-link route reset and incorrect selection focus. Browser review found a misleading icon, duplicated comparison tray, image controls below the fold, a guide link error and timeline sizing/overlap. These were corrected. Data inspection found five incorrect publisher image dimensions; decoded dimensions are used while source values remain retained.

## Verification

- TypeScript and Biome passed. All five frozen-data gates and 96 unit tests passed.
- JSON Schema Draft 2020-12 checked both the schema and complete collection.
- The dependency audit reported zero known vulnerabilities at execution; this is not a security audit of every behaviour.
- The integrated browser run passed 58 of 59 cases. It exposed a shared documentation renderer problem: repeated column headings produced duplicate accessible region names. The renderer now disambiguates using section context.
- Four documentation cases passed after correction. Four photograph cases passed again after the narrow date/mark and header corrections. Source, export, no external image requests, viewer interaction, route state, keyboard focus, 320px reflow and axe checks are included in the bounded photograph cases.
- `browser.log` retains the failed run. `documentation-retest.log` and `photo-reflow-retest.log` retain repetitions. Browser artifacts are separately preserved in the sibling directories named in `knowledge/testing.md`.
- The in-app browser did not apply the root agent's requested mobile viewport; it remained desktop width. Exact 320px evidence comes from Playwright and its screenshots, not that request.

## Skill trials

Fresh collection and annotation agents received isolated copied contracts and synthetic tasks without the evaluator's answers, original application code, private knowledge or other agents' results. Their original inputs and actual exports are preserved in the sibling skill run directories. Initial context is retained separately.

The collection trial preserved source meaning and complete exported fields but failed parts of the intended presentation profile. It repeated separators and lengthy production status. The annotation trial preserved source anchoring, review semantics and export/reopen fidelity, but retained ISO date labels and separators; full keyboard passage selection remained unverified. These failures are part of the result.

The profile was clarified after those trials. A fresh repair agent received the two observed collection findings and the clarified contracts. Its guided repair fixed separators, field-bound status explanation and authority access, then repeated source/export/reopen checks. It introduced a narrow overflow and corrected it before closing. The original baseline remains byte-identical. This is assisted repair evidence, not a controlled before/after experiment proving that the skills cause better interfaces.

## Remaining limits

Operator assessment, the agreed formative session with another person, real screen-reader use, native touch and comparative method evaluation remain open. Images are web-size derivatives. The sample is purposive and its chronology expresses catalogue wording, not independently verified historical dates. The runnable skill prototypes are retained evaluation artifacts, not accepted components in the product gallery.

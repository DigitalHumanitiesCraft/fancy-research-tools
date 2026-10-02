---
title: Data
project:
  name: fancy (research) tools!
  repository: https://github.com/DigitalHumanitiesCraft/fancy-research-tools
status: draft
language: en
created: 2026-10-01
updated: 2026-10-02
authors: [Christopher Pollin]
generated-with: Claude Code (Claude Opus 5.5)
method:
  name: Promptotyping
  url: https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin
template:
  name: Vorlage Datengrundlage
  version: 0.1
  url: https://dhcraft.org/Promptotyping/promptotyping-document/data
  alias: https://dhcraft.org/Promptotyping/#promptotyping-document-data
related: [project, specification, testing, method-images]
---

The facts the page states about its provider, tools, methods and images, with the source each fact is taken from. Every link in the tables answered HTTP 200 on the check date given. The page text and the structured tool and method data stand in `src/i18n/fancy.ts` of the site repository DigitalHumanitiesCraft/digitalhumanitiescraft.github.io, and a change of a fact starts here and is then carried there.

## Provider

| Fact on the page | Source |
|---|---|
| Name, seat, telephone, e-mail | imprint of the site repository, `src/pages/imprint.astro`, published at https://dhcraft.org/imprint/ |
| Target groups, teaching across Europe, project partnership, GAMS cooperation | `src/i18n/content.ts` of the site repository |
| Institutions the company works for | same file, partner and project lists |
| Billing per hour, per working day or as a flat fee, starting from the client's budget, decision after every step | operator statement, 2026-10-02, replacing the statement of 2026-10-01 |
| Costs for the use of language models may be billed separately, depending on the scope of the project. The effort lies mainly in understanding the project together with the client and making the resulting systems comprehensible. Tools run in the browser without a server where the use case allows | operator statement, 2026-10-02 |
| Frontier language models, commercial and open from any origin, never named by provider, used by coding agents and inside tools, model and access chosen per project | operator statement, 2026-10-02 |
| Long-term archiving of research data in GAMS through the framework agreement with the Department of Digital Humanities of the University of Graz | cooperation stated in `src/i18n/content.ts` of the site repository, wording of the offer from the check of the quality claims on 2026-10-02, conditions undocumented, see [plan](plan.md#open-points) |
| Training formats (workshops, intensive days) | excellence section of dhcraft.org, `src/i18n/excellence.ts` of the site repository |
| Privacy statement | the page's own behaviour (no cookies, no third-party request, see NFR-03 in [specification](specification.md#non-functional-requirements)), delivery by GitHub Pages, contact by e-mail and telephone |

## Tools

The anchor is the fragment identifier on the page. Links checked on 2026-10-01 unless a later date is given.

| Tool | Anchor | Maturity on the page | Demo | Repository | Licence | Evidence |
|---|---|---|---|---|---|---|
| coOCR/HTR | `#t-coocr` | Forschungsvorschau | https://dhcraft.org/co-ocr-htr/ | https://github.com/DigitalHumanitiesCraft/co-ocr-htr | CC BY 4.0 | https://dhcraft.org/co-ocr-htr/knowledge.html |
| teiCrafter | `#t-tei` | Forschungsvorschau | https://dhcraft.org/teiCrafter/editor.html | https://github.com/DigitalHumanitiesCraft/teiCrafter | MIT | https://github.com/DigitalHumanitiesCraft/teiCrafter/blob/main/knowledge/INDEX.md |
| CorrespExplorer | `#t-corresp` | Laufende Demo | https://dhcraft.org/CorrespExplorer/ | https://github.com/DigitalHumanitiesCraft/CorrespExplorer | MIT, docs CC BY 4.0 | https://dhcraft.org/CorrespExplorer/vault.html |
| SZD-HTR | `#t-szd` | Experiment | https://chpollin.github.io/szd-htr-ocr-pipeline/ | https://github.com/chpollin/szd-htr-ocr-pipeline | MIT, facsimiles with the Literaturarchiv Salzburg via GAMS | https://github.com/chpollin/szd-htr-ocr-pipeline/blob/main/knowledge/index.md, state from its README (experimental sub-project, checking tiers 1 and 2 populated, tier 0 empty), checked on 2026-10-02 |
| Stefan-Zweig-Bibliographie (Klawiter-Rescue) | `#t-klawiter` | Bestand gesichert | https://chpollin.github.io/klawiter-rescue/ | https://github.com/chpollin/klawiter-rescue | MIT, data CC BY 4.0 | https://github.com/chpollin/klawiter-rescue/blob/main/knowledge/status.md, checked on 2026-10-02 |

Ability icons per tool, as set in `fancy.ts`:

- coOCR/HTR: LLM-gestützt with model choice down to a local model, Fachliche Prüfung im Werkzeug, Läuft im Browser.
- teiCrafter: LLM-gestützt with model choice down to a local model, Lesbarer Text statt Tags, Fachliche Prüfung im Werkzeug, Läuft im Browser.
- CorrespExplorer: Überblick über den ganzen Bestand, Läuft im Browser.
- SZD-HTR: LLM-gestützt, Überblick über den ganzen Bestand, Fachliche Prüfung im Werkzeug.
- Stefan-Zweig-Bibliographie: LLM-gestützt, Überblick über den ganzen Bestand, Belege bis zur Quelle.

The page uses no ability that says data stay in-house, because the LLM-supported tools send data to the chosen model.

## Methods and frameworks

| Method | Anchor | Maturity on the page | Page | Repository | Evidence |
|---|---|---|---|---|---|
| Promptotyping | `#m-pt` | Im Einsatz | https://dhcraft.org/Promptotyping/ and the article https://lisa.gerda-henkel-stiftung.de/digitale_geschichte_pollin | https://github.com/DigitalHumanitiesCraft/Promptotyping | the method page, article and repository |
| Grounded Vault | `#m-gv` | Im Einsatz | https://dhcraft.org/grounded-vault/ | https://github.com/DigitalHumanitiesCraft/grounded-vault | https://github.com/DigitalHumanitiesCraft/grounded-vault/tree/main/knowledge |
| Agentic Edition Pipeline | `#m-aep` | Forschungsvorschau | video https://youtu.be/krL-xMxTa_c | https://github.com/DigitalHumanitiesCraft/agentic-edition-pipeline | https://github.com/DigitalHumanitiesCraft/agentic-edition-pipeline/blob/main/knowledge/00_INDEX.md |
| Research Mission Control | `#m-rmc` | Release Candidate | https://dhcraft.org/research-mission-control/ | https://github.com/DigitalHumanitiesCraft/research-mission-control | https://github.com/DigitalHumanitiesCraft/research-mission-control/blob/main/knowledge/INDEX.md, state from its README (release candidate 0.9.0 for model-level acceptance testing), checked on 2026-10-02 |

## Images

All published images lie in `public/fancy-research-tools/img/` of the site repository, the screenshots and method images as WebP in 1440 and 720 pixel width.

| File | Shows | Rights basis |
|---|---|---|
| `coocr-htr-*.webp` | coOCR/HTR with a printed page of 1617 from the bundled sample | own tool, historical print |
| `teicrafter-*.webp` | teiCrafter with the bundled synthetic letter | own tool, synthetic text |
| `correspexplorer-*.webp` | CorrespExplorer timeline of the synthetic demo dataset | own tool, synthetic data |
| `szd-htr-*.webp` | SZD-HTR statistics view with checking tiers and review reasons | own tool, no facsimile shown, because the image rights lie with the archive |
| `klawiter-*.webp` | start page of the Stefan Zweig Bibliography | own tool, data CC BY 4.0 |
| `method-*.webp` | infographics of the methods, series infographic-v3 | generated with gpt-image through Codex on 2026-10-02, exact model version not reported, prompt logs in `assets/img/source/method-*-infographic-v3.txt` of this repository, see [method images](method-images.md) |
| `og.jpg` | hero of the German page for link previews, 1200 by 630 | rendered by `tools/shoot-og.cjs` from the site preview |

Tool screenshots are taken by `tools/shoot-tools.cjs` at double pixel density from the live demos, each recipe choosing a state of the real tool without altering its interface. The coOCR/HTR link points to the demo root and never to individual samples. The logo and favicon of the page belong to the site.

## Candidates kept off the page

| Candidate | Reason |
|---|---|
| Date extraction and timeline (`chpollin/vizerektor-zeitstrahl`) | internal university training material, no licence file |
| `vetmed-berichtswesen` | client reporting material, no GitHub Pages site |
| M³GIM | open rights question recorded in the vault |
| viewCrafter | ended on 2026-09-29, repository private |
| zbz-ocr-tei | same task as coOCR/HTR and the Agentic Edition Pipeline |
| Wissensbilanz-Dashboard, Kulturpool-Demo, Objekt-Bestimmung | shown until 2026-10-02, removed on the operator's decision |

# Milton forecast discussions

The National Hurricane Center issued these discussions for cyclone AL142024 on 5 and 6 October 2024. The bounded annotation task asks how the forecasters distinguish reported observations, forecasts and stated uncertainty. Discussion 2 attributes an intensity estimate to scatterometer data. Discussion 6 describes an evolving forecast and its possible limits. The selected texts support examining that wording and its evidence references. Measuring forecast accuracy requires additional observations and a different method.

## Source and rights

The original [discussion 2](https://www.nhc.noaa.gov/archive/2024/al14/al142024.discus.002.shtml) and [discussion 6](https://www.nhc.noaa.gov/archive/2024/al14/al142024.discus.006.shtml) remain in `raw/` as downloaded HTML. Their published bylines name Brown and Blake. The manifest records their exact issue strings, URLs and hashes, the retrieval date, and the selection rationale. These are historical products, not current weather advice.

The [National Weather Service use policy](https://www.weather.gov/disclaimer) places its page information in the public domain unless specifically noted otherwise. No separate restriction was observed on the selected bulletin text. The frozen policy page is retained in `raw/nws-disclaimer.html`. Reuse credits the National Weather Service, preserves the source text and keeps annotations visibly separate. It must not imply agency endorsement or present altered material as official information. The repository's code and documentation licenses do not replace these source terms.

## Reproduce and check

`node scripts/import-annotation-data.mjs` verifies raw-source and rights-page checksums, extracts the literal content of each bulletin's single `pre` element, checks the source title, issue time and byline, and writes `sources.json`. It performs no network requests. It preserves source newlines, spaces and spelling. The selected product bodies contain ASCII characters and need no entity decoding. Title labels collapse header spacing, while the full source text remains exact. A source change requires a new snapshot and an explicit interchange decision.

`node scripts/check-annotation-data.mjs` repeats extraction in a temporary copy and compares the result byte for byte. It leaves this dataset unchanged. Hash and offset checks establish agreement with the frozen documents. They do not establish meteorological truth or scholarly acceptance.

## Annotation contract

`src/annotation/model.ts` implements notebook schema version 1 for case `nhc-milton-2024`. Each notebook embeds both exact source snapshots and a research question. Each annotation retains a stable ID, source ID, start-inclusive and end-exclusive UTF-16 offsets, the exact quoted text, category, note, declared creator and a separate review assertion. `source.text.slice(start, end)` must equal the quote. The selected sources use ASCII, so UTF-16 offsets also equal code-point offsets here. This bounded JSON contract does not claim W3C Web Annotation compliance.

The categories describe an annotation proposal. Observation identifies a source's report of measured or seen conditions. Forecast identifies an expected future development. Uncertainty identifies a source's express qualification or limit. A passage can support more than one reading, so overlapping annotations are allowed and notes can explain the choice. Category choice and creator kind confer no verification status.

Creator kinds are human, LLM, agent and unknown. A name is a declaration and does not authenticate identity. A new annotation has no recorded review. An optional review records a named reviewer, their declared kind, a criterion and a result of supports, does not support or unclear. Its scope is whether the quoted source supports the annotation under the stated criterion. It cannot certify later weather conditions or the notebook as a whole. Editing an annotation's anchor, category, note or creator clears its prior review. No-op changes retain it. Timestamps and claims of authentication are unsupported.

The validator rejects changed source snapshots, unsupported fields or versions, duplicate IDs, invalid anchors and oversized files before replacement. The file and formatted export limit is 1 MB. A notebook supports up to 200 annotations and each authored text field up to 20,000 UTF-16 code units. Accepted author text retains whitespace and line endings. An export is a new file, and browser recovery uses a separate local draft from all Met investigations and collection edits.

## Worked anchors

These spans were checked against the frozen text during implementation. Their proposed categories are agent-authored task examples. No annotated answers are preloaded as researcher work.

| Source | Span | Proposed category | Interpretation to examine |
|---|---|---|---|
| Discussion 2 | `[168, 309)` | Observation | Scatterometer data and the reported peak winds |
| Discussion 2 | `[672, 781)` | Uncertainty | Qualification of the initial-motion estimate |
| Discussion 6 | `[786, 902)` | Forecast | Expected weakening of the frontal feature |
| Discussion 6 | `[1991, 2113)` | Uncertainty | Possibility that the intensity forecast remains too low |

The sample is purposive and contains two issued products from one event. It broadens the implementation material to meteorological prose while leaving disciplinary validity, category usefulness and representative communication analysis for human assessment.

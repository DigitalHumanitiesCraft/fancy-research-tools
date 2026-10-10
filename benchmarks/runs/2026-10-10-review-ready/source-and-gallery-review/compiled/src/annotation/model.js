"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sources = exports.MAX_ANNOTATIONS = exports.MAX_TEXT_LENGTH = exports.MAX_NOTEBOOK_BYTES = exports.reviewResults = exports.creatorKinds = exports.categories = void 0;
exports.createNotebook = createNotebook;
exports.parseNotebook = parseNotebook;
exports.serializeNotebook = serializeNotebook;
exports.reviseAnnotation = reviseAnnotation;
const sources_json_1 = __importDefault(require("../../data/nhc-milton/sources.json"));
exports.categories = ["observation", "forecast", "uncertainty"];
exports.creatorKinds = ["human", "llm", "agent", "unknown"];
exports.reviewResults = ["supports", "does-not-support", "unclear"];
exports.MAX_NOTEBOOK_BYTES = 1_000_000;
exports.MAX_TEXT_LENGTH = 20_000;
exports.MAX_ANNOTATIONS = 200;
exports.sources = Object.freeze(sources_json_1.default.map((source) => Object.freeze({ ...source })));
const sourceKeys = [
    "id",
    "title",
    "issuedAt",
    "forecaster",
    "url",
    "text",
    "rawSha256",
    "textSha256",
];
function object(value) {
    if (!value || typeof value !== "object" || Array.isArray(value))
        throw new Error("Expected a notebook object.");
    return value;
}
function keys(value, expected) {
    const actual = Object.keys(value);
    if (actual.length !== expected.length || actual.some((key) => !expected.includes(key)))
        throw new Error("Unsupported or missing notebook fields.");
}
function text(value, label, required = false) {
    if (typeof value !== "string" || value.length > exports.MAX_TEXT_LENGTH || (required && !value.trim()))
        throw new Error(`Invalid or oversized ${label}.`);
}
function member(value, options, label) {
    if (typeof value !== "string" || !options.includes(value))
        throw new Error(`Unsupported ${label}.`);
}
function actor(value, nameRequired = false) {
    const candidate = object(value);
    keys(candidate, ["kind", "name"]);
    member(candidate.kind, exports.creatorKinds, "actor kind");
    text(candidate.name, "actor name", nameRequired);
}
function review(value) {
    if (value === null)
        return;
    const candidate = object(value);
    keys(candidate, ["reviewer", "criterion", "result"]);
    actor(candidate.reviewer, true);
    text(candidate.criterion, "review criterion", true);
    member(candidate.result, exports.reviewResults, "review result");
}
function annotation(value) {
    const candidate = object(value);
    keys(candidate, [
        "id",
        "sourceId",
        "start",
        "end",
        "quote",
        "category",
        "note",
        "creator",
        "review",
    ]);
    if (typeof candidate.id !== "string" || !/^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/.test(candidate.id))
        throw new Error("Annotation IDs require an initial letter or digit and up to 128 letters, digits, dots, underscores, colons or hyphens.");
    const source = exports.sources.find((item) => item.id === candidate.sourceId);
    if (!source)
        throw new Error("Unknown annotation source.");
    const { start, end } = candidate;
    if (typeof start !== "number" ||
        typeof end !== "number" ||
        !Number.isSafeInteger(start) ||
        !Number.isSafeInteger(end) ||
        start < 0 ||
        end <= start ||
        end > source.text.length)
        throw new Error("Quotation offsets must select a nonempty span inside the source text.");
    if (candidate.quote !== source.text.slice(start, end))
        throw new Error("Quotation does not match its exact source offsets.");
    member(candidate.category, exports.categories, "annotation category");
    text(candidate.note, "annotation note");
    actor(candidate.creator);
    review(candidate.review);
    return structuredClone(candidate);
}
function validate(input) {
    const value = object(input);
    keys(value, ["schemaVersion", "caseId", "sources", "researchQuestion", "annotations"]);
    if (value.schemaVersion !== 1 || value.caseId !== "nhc-milton-2024")
        throw new Error("Unsupported annotation notebook version or case.");
    if (!Array.isArray(value.sources) || value.sources.length !== exports.sources.length)
        throw new Error("The notebook must contain the complete frozen source snapshot.");
    value.sources.forEach((candidate, index) => {
        const source = object(candidate);
        keys(source, sourceKeys);
        const original = exports.sources[index];
        if (!original || sourceKeys.some((key) => source[key] !== original[key]))
            throw new Error("Unknown or changed source snapshot. Preserve the original bulletin text.");
    });
    text(value.researchQuestion, "research question");
    if (!Array.isArray(value.annotations) || value.annotations.length > exports.MAX_ANNOTATIONS)
        throw new Error(`A notebook supports up to ${exports.MAX_ANNOTATIONS} annotations.`);
    const annotations = value.annotations.map(annotation);
    if (new Set(annotations.map((item) => item.id)).size !== annotations.length)
        throw new Error("Annotation IDs must be unique.");
    const result = {
        schemaVersion: 1,
        caseId: "nhc-milton-2024",
        sources: exports.sources.map((source) => ({ ...source })),
        researchQuestion: value.researchQuestion,
        annotations,
    };
    if (new TextEncoder().encode(JSON.stringify(result, null, 2)).byteLength > exports.MAX_NOTEBOOK_BYTES)
        throw new Error("Annotation notebook exceeds 1 MB. Export smaller notes or fewer annotations.");
    return result;
}
function createNotebook(input = {}) {
    return validate({
        schemaVersion: 1,
        caseId: "nhc-milton-2024",
        sources: exports.sources,
        researchQuestion: input.researchQuestion ?? "",
        annotations: input.annotations ?? [],
    });
}
function parseNotebook(input) {
    if (typeof input !== "string" || new TextEncoder().encode(input).byteLength > exports.MAX_NOTEBOOK_BYTES)
        throw new Error("Annotation notebook exceeds 1 MB or is not JSON text.");
    let value;
    try {
        value = JSON.parse(input);
    }
    catch {
        throw new Error("Cannot read notebook JSON. Choose an exported annotation notebook.");
    }
    return validate(value);
}
function serializeNotebook(value) {
    return JSON.stringify(validate(value), null, 2);
}
function reviseAnnotation(original, changes) {
    const editable = ["sourceId", "start", "end", "quote", "category", "note", "creator"];
    if (Object.keys(changes).some((key) => !editable.includes(key)))
        throw new Error("A revision cannot replace annotation identity or record a review.");
    const candidate = annotation({ ...original, ...changes });
    const unchanged = candidate.sourceId === original.sourceId &&
        candidate.start === original.start &&
        candidate.end === original.end &&
        candidate.quote === original.quote &&
        candidate.category === original.category &&
        candidate.note === original.note &&
        candidate.creator.kind === original.creator.kind &&
        candidate.creator.name === original.creator.name;
    if (!unchanged)
        candidate.review = null;
    return candidate;
}

import { bindTextValue } from "../ui/text-value";
import { MAX_SELECTION_BYTES, openSelection } from "./exchange";
import { type PhotographCollection, type PhotoState, selectionExport } from "./model";

export interface PhotoResearch {
  question: string;
  statement: string;
  reasoning: string;
  unresolvedQuestion: string;
  author: { kind: "unknown" | "human" | "agent" | "llm"; name: string };
}

export function emptyResearch(): PhotoResearch {
  return {
    question: "",
    statement: "",
    reasoning: "",
    unresolvedQuestion: "",
    author: { kind: "unknown", name: "" },
  };
}

function object(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function keys(value: Record<string, unknown>, expected: string[]) {
  return (
    Object.keys(value).length === expected.length &&
    expected.every((key) => Object.hasOwn(value, key))
  );
}

function validateResearch(value: unknown): asserts value is PhotoResearch {
  if (
    !object(value) ||
    !keys(value, ["question", "statement", "reasoning", "unresolvedQuestion", "author"]) ||
    ![value.question, value.statement, value.reasoning, value.unresolvedQuestion].every(
      (text) => typeof text === "string" && text.length <= 20_000,
    ) ||
    !object(value.author) ||
    !keys(value.author, ["kind", "name"]) ||
    typeof value.author.kind !== "string" ||
    !["unknown", "human", "agent", "llm"].includes(value.author.kind) ||
    typeof value.author.name !== "string" ||
    value.author.name.length > 20_000
  )
    throw new Error("The research file contains unsupported notes or author details.");
}

export function researchPacket(
  collection: PhotographCollection,
  state: PhotoState,
  research: PhotoResearch,
) {
  validateResearch(research);
  const packet = {
    schemaVersion: 1,
    kind: "photograph-investigation",
    selection: selectionExport(collection, state),
    research,
  };
  if (new TextEncoder().encode(JSON.stringify(packet, null, 2)).length > MAX_SELECTION_BYTES)
    throw new Error("The research file exceeds 2 MB.");
  return packet;
}

/** Catalogue fields remain subject to the unchanged frozen-source selection validator. */
export function openPhotographFile(text: string, collection: PhotographCollection) {
  if (new TextEncoder().encode(text).length > MAX_SELECTION_BYTES)
    throw new Error("The selection file exceeds 2 MB.");
  const packet: unknown = JSON.parse(text);
  if (!object(packet)) throw new Error("This is not a supported photograph file.");
  if (packet.kind === "photograph-selection")
    return { state: openSelection(text, collection), research: emptyResearch(), legacy: true };
  if (
    !keys(packet, ["schemaVersion", "kind", "selection", "research"]) ||
    packet.schemaVersion !== 1 ||
    packet.kind !== "photograph-investigation"
  )
    throw new Error("This is not a supported photograph research file.");
  validateResearch(packet.research);
  const state = openSelection(JSON.stringify(packet.selection), collection);
  const research = structuredClone(packet.research);
  researchPacket(collection, state, research);
  return { state, research, legacy: false };
}

export function hasResearch(research: PhotoResearch) {
  return Boolean(
    research.question ||
      research.statement ||
      research.reasoning ||
      research.unresolvedQuestion ||
      research.author.name ||
      research.author.kind !== "unknown",
  );
}

export function mountResearch(
  target: HTMLElement,
  initial: PhotoResearch,
  change: (research: PhotoResearch) => void,
  download: () => void,
) {
  let research = initial;
  const section = document.createElement("section");
  section.className = "photo-research";
  section.setAttribute("aria-labelledby", "research-heading");
  const heading = document.createElement("h2");
  heading.id = "research-heading";
  heading.textContent = "Your research";
  const grid = document.createElement("div");
  grid.className = "research-fields";
  const fields = [
    ["question", "Research question"],
    ["statement", "Your statement"],
    ["reasoning", "Your reasoning"],
    ["unresolvedQuestion", "Unresolved question"],
  ] as const;
  for (const [key, title] of fields) {
    const label = document.createElement("label");
    label.textContent = title;
    const input = document.createElement("textarea");
    input.rows = key === "question" ? 2 : 3;
    input.maxLength = 20_000;
    const value = bindTextValue(input);
    value.restore(research[key]);
    input.addEventListener("input", () => {
      research = { ...research, [key]: value.read() };
      change(research);
    });
    label.append(input);
    const field = document.createElement("div");
    field.append(label);
    grid.append(field);
    if (key === "reasoning") {
      const guidance = document.createElement("span");
      guidance.id = "reasoning-guidance";
      guidance.className = "research-guidance";
      guidance.textContent =
        "Explain which retained catalogue values support or limit your statement. Catalogue agreement does not establish historical truth.";
      input.setAttribute("aria-describedby", guidance.id);
      // Keep guidance outside the label so the control's accessible name stays concise.
      field.append(guidance);
    }
  }
  for (const [key, title] of [
    ["kind", "Author kind"],
    ["name", "Author name"],
  ] as const) {
    const label = document.createElement("label");
    label.textContent = title;
    if (key === "kind") {
      const select = document.createElement("select");
      for (const [value, text] of [
        ["unknown", "Unknown"],
        ["human", "Human"],
        ["agent", "AI agent"],
        ["llm", "LLM"],
      ] as const) {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = text;
        select.append(option);
      }
      select.value = research.author.kind;
      select.addEventListener("change", () => {
        research = {
          ...research,
          author: { ...research.author, kind: select.value as PhotoResearch["author"]["kind"] },
        };
        change(research);
      });
      select.id = "research-author-kind";
      label.htmlFor = select.id;
      const field = document.createElement("div");
      field.append(label, select);
      grid.append(field);
      continue;
    } else {
      const input = document.createElement("input");
      input.maxLength = 20_000;
      const value = bindTextValue(input);
      value.restore(research.author.name);
      input.addEventListener("input", () => {
        research = { ...research, author: { ...research.author, name: value.read() } };
        change(research);
      });
      label.append(input);
    }
    grid.append(label);
  }
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "Export research";
  button.addEventListener("click", download);
  const guidance = document.createElement("p");
  guidance.className = "research-guidance";
  guidance.textContent =
    "Your question and statements stay in this tab until exported. Open the downloaded research file with Open selection. Author details are self-declared.";
  section.append(heading, grid, button, guidance);
  target.append(section);
}

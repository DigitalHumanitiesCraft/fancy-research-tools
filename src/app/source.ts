import snapshotUrl from "../../data/schoenbach/cmif-schoenbach.xml?url";
import collection from "../../data/schoenbach/collection.json";
import sourceValues from "../../data/schoenbach/evidence.json";
import manifest from "../../data/schoenbach/manifest.json";
import type { ResearchRecord } from "../domain/dataset";

function link(label: string, href: string): HTMLAnchorElement {
  const node = document.createElement("a");
  node.textContent = label;
  node.href = href;
  return node;
}

/** The source identity must match; a familiar imported id is insufficient evidence. */
export function showSource(target: HTMLElement, record: ResearchRecord | undefined): boolean {
  target.replaceChildren();
  const original = collection.records.find((item) => item.id === record?.id);
  const evidence = sourceValues.find((item) => item.id === record?.id);
  if (!record || !evidence || !original || record.source !== original.source) {
    target.hidden = true;
    return false;
  }
  target.hidden = false;
  const heading = document.createElement("h2");
  heading.id = "source-heading";
  heading.textContent = "Original source values";
  const fields = document.createElement("dl");
  for (const [label, value] of [
    ["Sender", evidence.sender],
    ["Recipient", evidence.recipient],
    ["Sent date", evidence.date],
    ["Sent from", evidence.sentPlace],
    ...(evidence.receivedPlace ? [["Received in", evidence.receivedPlace]] : []),
  ]) {
    const term = document.createElement("dt");
    term.textContent = label ?? "";
    const description = document.createElement("dd");
    description.textContent = value ?? "";
    fields.append(term, description);
  }
  const links = document.createElement("div");
  links.className = "source-links";
  links.append(
    link("Letter in the edition", evidence.url),
    link("CMIF snapshot", snapshotUrl),
    link("CC0", manifest.licenceUrl),
  );
  const attribution = document.createElement("p");
  attribution.className = "meta";
  attribution.textContent = `Edition editor: ${manifest.sourceEditor}.`;
  const mapping = document.createElement("p");
  mapping.className = "meta";
  mapping.textContent =
    "The working title joins sender and recipient. Letter is the assigned record type.";
  const review = document.createElement("p");
  review.className = "source-review";
  review.textContent = "No review of historical accuracy recorded.";
  target.append(heading, fields, links, attribution, mapping, review);
  return true;
}

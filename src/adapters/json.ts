import { type Dataset, validateDataset } from "../domain/dataset";

/** Reject unsupported fields instead of silently losing them on export. */
export function parseDataset(text: string): Dataset {
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    throw new Error("Invalid JSON. Import a dataset file in the documented format.");
  }
  return validateDataset(value);
}

export function serializeDataset(dataset: Dataset): string {
  return `${JSON.stringify(validateDataset(dataset), null, 2)}\n`;
}

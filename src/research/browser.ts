import {
  type Investigation,
  MAX_INVESTIGATION_BYTES,
  parseInvestigation,
  serializeInvestigation,
} from "./investigation";

export function downloadInvestigation(state: Investigation, filename: string) {
  const url = URL.createObjectURL(
    new Blob([serializeInvestigation(state)], { type: "application/json" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function connectInvestigation(options: {
  key: string;
  read: () => Investigation;
  restore: (state: Investigation) => void;
  mount: HTMLElement;
}) {
  const key = `frt.investigation.${options.key}.v1`;
  options.mount.setAttribute("role", "region");
  options.mount.setAttribute("aria-label", "Investigation files and local draft");
  const status = document.createElement("span");
  status.setAttribute("role", "status");
  status.id = "draft-status";
  const label = document.createElement("label");
  label.textContent = "Open investigation ";
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json,application/json";
  label.append(input);
  options.mount.append(label, status);
  let baseline: string | null = null;
  let baselineState: Investigation | undefined;
  let blocked = false;
  let unsaved = false;
  let revision = 0;
  document.addEventListener("input", () => {
    revision += 1;
  });
  const failure = (message: string) => {
    blocked = true;
    status.textContent = message;
  };
  try {
    baseline = localStorage.getItem(key);
    if (baseline !== null) {
      baselineState = parseInvestigation(JSON.parse(baseline));
      options.restore(baselineState);
      status.textContent = "Local draft restored";
    }
  } catch (error) {
    if (baseline !== null) {
      failure(
        "Local draft could not be restored. It has not been overwritten. Export current work before leaving.",
      );
    } else {
      status.textContent = `Local storage could not be read: ${error instanceof Error ? error.message : "Storage unavailable."} Export current work before leaving.`;
    }
  }
  const sameWork = (left: Investigation, right: Investigation) =>
    left.query === right.query &&
    left.researchQuestion === right.researchQuestion &&
    JSON.stringify(left.selectedIds) === JSON.stringify(right.selectedIds) &&
    left.interpretation.author === right.interpretation.author &&
    left.interpretation.observation === right.interpretation.observation &&
    left.interpretation.unresolvedQuestion === right.interpretation.unresolvedQuestion;
  function save(imported?: { text: string; state: Investigation }) {
    revision += 1;
    unsaved = true;
    if (blocked) return;
    try {
      if (localStorage.getItem(key) !== baseline) {
        failure(
          "Another tab changed this draft. Export your work, then reload to read that version.",
        );
        return;
      }
      const state = imported?.state ?? options.read();
      // Validated source records and snapshot are fixed; only working fields can change.
      // A view-only save must not migrate or reformat the last observed draft.
      if (!imported && baselineState && sameWork(state, baselineState)) {
        unsaved = false;
        status.textContent = "Saved locally";
        return;
      }
      const next = imported?.text ?? JSON.stringify(state);
      localStorage.setItem(key, next);
      baseline = next;
      baselineState = state;
      unsaved = false;
      status.textContent = "Saved locally";
    } catch (error) {
      status.textContent = `Local saving failed: ${error instanceof Error ? error.message : "Storage unavailable."} Correct the problem and edit again to retry; export your work before leaving.`;
    }
  }
  input.addEventListener("change", async () => {
    const file = input.files?.[0];
    if (!file) return;
    try {
      const beforeRead = JSON.stringify(options.read());
      const beforeRevision = revision;
      if (file.size > MAX_INVESTIGATION_BYTES) throw new Error("Investigation file exceeds 2 MB.");
      const fileText = await file.text();
      const state = parseInvestigation(JSON.parse(fileText));
      if (revision !== beforeRevision || JSON.stringify(options.read()) !== beforeRead)
        throw new Error(
          "Your work changed while the file was loading. Open the file again when ready.",
        );
      if (
        !window.confirm(
          "Replace the current investigation with this file? Export current work first if you want to keep it.",
        )
      )
        return;
      options.restore(state);
      save({ text: fileText, state });
    } catch (error) {
      status.textContent = `File not opened: ${error instanceof Error ? error.message : "Invalid investigation."} Current work is unchanged.${blocked ? " Local saving remains blocked; export before leaving." : ""}`;
    } finally {
      input.value = "";
    }
  });
  window.addEventListener("storage", (event) => {
    if ((event.key === key || event.key === null) && event.newValue !== baseline) {
      unsaved = true;
      failure(
        "Another tab changed this draft. Export your work, then reload to read that version.",
      );
    }
  });
  window.addEventListener("beforeunload", (event) => {
    if (unsaved) event.preventDefault();
  });
  return { save: () => save() };
}

import {
  type CaseId,
  MAX_NOTEBOOK_BYTES,
  type Notebook,
  notebookCases,
  parseNotebook,
  serializeNotebook,
} from "./model";

/** The annotation contract remains separate from Met investigation recovery. */
export function connectNotebook(options: {
  mount: HTMLElement;
  read: () => Notebook;
  restore: (notebook: Notebook) => void;
  hasPending: () => boolean;
  caseId?: CaseId;
}) {
  const caseId = options.caseId ?? "nhc-milton-2024";
  const definition = notebookCases[caseId];
  const key = `frt.notebook.${location.pathname.replace(/index\.html$/, "")}.${definition.storageSuffix}`;
  const status = document.createElement("p");
  status.id = "notebook-status";
  status.setAttribute("role", "status");
  const label = document.createElement("label");
  label.textContent = "Open notebook ";
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json,application/json";
  label.append(input);
  options.mount.append(label, status);
  let baseline: string | null = null;
  let canonical: string | null = null;
  let blocked = false;
  let unsaved = false;
  let revision = 0;
  document.addEventListener("input", () => {
    revision += 1;
  });
  const conflict = () => {
    blocked = true;
    unsaved = true;
    status.textContent =
      "Another tab changed this notebook. Export your work before reloading to read that copy.";
  };
  try {
    baseline = localStorage.getItem(key);
    if (baseline !== null) {
      const notebook = parseNotebook(baseline, caseId);
      canonical = serializeNotebook(notebook);
      options.restore(notebook);
      status.textContent = "Local notebook restored";
    }
  } catch {
    blocked = baseline !== null;
    status.textContent = blocked
      ? "The stored notebook could not be opened and is preserved. Export current work before leaving."
      : "Local storage is unavailable. Export your notebook to keep your work.";
  }
  function save(imported?: { bytes: string; notebook: Notebook }) {
    revision += 1;
    unsaved = true;
    if (blocked) return;
    try {
      if (localStorage.getItem(key) !== baseline) {
        conflict();
        return;
      }
      const next = serializeNotebook(imported?.notebook ?? options.read());
      if (imported || next !== canonical) {
        const bytes = imported?.bytes ?? next;
        localStorage.setItem(key, bytes);
        baseline = bytes;
        canonical = next;
      }
      unsaved = false;
      status.textContent = "Saved locally";
    } catch (error) {
      status.textContent = `Local saving failed: ${error instanceof Error ? error.message : "Storage unavailable."} Export your work before leaving.`;
    }
  }
  input.addEventListener("change", async () => {
    const file = input.files?.[0];
    if (!file) return;
    try {
      if (options.hasPending()) throw new Error("Save or discard the unfinished annotation first.");
      const before = serializeNotebook(options.read());
      const beforeRevision = revision;
      if (file.size > MAX_NOTEBOOK_BYTES) throw new Error("Notebook exceeds the file size limit.");
      const bytes = await file.text();
      const notebook = parseNotebook(bytes, caseId);
      if (
        revision !== beforeRevision ||
        options.hasPending() ||
        serializeNotebook(options.read()) !== before
      ) {
        throw new Error("Your work changed while the file was loading. Open it again when ready.");
      }
      if (!window.confirm("Replace this notebook? Export current work first to keep a copy."))
        return;
      options.restore(notebook);
      save({ bytes, notebook });
    } catch (error) {
      status.textContent = `Notebook not opened: ${error instanceof Error ? error.message : "Invalid file."} Current work is unchanged.${blocked ? " Local saving remains blocked; export before leaving." : ""}`;
    } finally {
      input.value = "";
    }
  });
  window.addEventListener("storage", (event) => {
    if ((event.key === key || event.key === null) && event.newValue !== baseline) conflict();
  });
  window.addEventListener("beforeunload", (event) => {
    if (unsaved || options.hasPending()) event.preventDefault();
  });
  return {
    save: () => save(),
    export() {
      try {
        if (options.hasPending())
          throw new Error("Save or discard the unfinished annotation first.");
        const bytes = serializeNotebook(options.read());
        const url = URL.createObjectURL(new Blob([bytes], { type: "application/json" }));
        const link = document.createElement("a");
        link.href = url;
        link.download = definition.filename;
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        status.textContent = `Notebook download requested.${blocked || unsaved ? " Local saving remains unavailable; keep the downloaded file before leaving." : ""}`;
      } catch (error) {
        status.textContent = `Notebook not exported: ${error instanceof Error ? error.message : "Invalid notebook."}`;
      }
    },
  };
}

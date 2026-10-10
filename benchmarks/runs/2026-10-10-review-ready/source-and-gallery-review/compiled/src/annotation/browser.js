"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectNotebook = connectNotebook;
const model_1 = require("./model");
/** The annotation contract remains separate from Met investigation recovery. */
function connectNotebook(options) {
    const key = `frt.notebook.${location.pathname.replace(/index\.html$/, "")}.nhc-milton.v1`;
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
    let baseline = null;
    let canonical = null;
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
            const notebook = (0, model_1.parseNotebook)(baseline);
            canonical = (0, model_1.serializeNotebook)(notebook);
            options.restore(notebook);
            status.textContent = "Local notebook restored";
        }
    }
    catch {
        blocked = baseline !== null;
        status.textContent = blocked
            ? "The stored notebook could not be opened and is preserved. Export current work before leaving."
            : "Local storage is unavailable. Export your notebook to keep your work.";
    }
    function save(imported) {
        revision += 1;
        unsaved = true;
        if (blocked)
            return;
        try {
            if (localStorage.getItem(key) !== baseline) {
                conflict();
                return;
            }
            const next = (0, model_1.serializeNotebook)(imported?.notebook ?? options.read());
            if (imported || next !== canonical) {
                const bytes = imported?.bytes ?? next;
                localStorage.setItem(key, bytes);
                baseline = bytes;
                canonical = next;
            }
            unsaved = false;
            status.textContent = "Saved locally";
        }
        catch (error) {
            status.textContent = `Local saving failed: ${error instanceof Error ? error.message : "Storage unavailable."} Export your work before leaving.`;
        }
    }
    input.addEventListener("change", async () => {
        const file = input.files?.[0];
        if (!file)
            return;
        try {
            if (options.hasPending())
                throw new Error("Save or discard the unfinished annotation first.");
            const before = (0, model_1.serializeNotebook)(options.read());
            const beforeRevision = revision;
            if (file.size > model_1.MAX_NOTEBOOK_BYTES)
                throw new Error("Notebook exceeds the file size limit.");
            const bytes = await file.text();
            const notebook = (0, model_1.parseNotebook)(bytes);
            if (revision !== beforeRevision ||
                options.hasPending() ||
                (0, model_1.serializeNotebook)(options.read()) !== before) {
                throw new Error("Your work changed while the file was loading. Open it again when ready.");
            }
            if (!window.confirm("Replace this notebook? Export current work first to keep a copy."))
                return;
            options.restore(notebook);
            save({ bytes, notebook });
        }
        catch (error) {
            status.textContent = `Notebook not opened: ${error instanceof Error ? error.message : "Invalid file."} Current work is unchanged.${blocked ? " Local saving remains blocked; export before leaving." : ""}`;
        }
        finally {
            input.value = "";
        }
    });
    window.addEventListener("storage", (event) => {
        if ((event.key === key || event.key === null) && event.newValue !== baseline)
            conflict();
    });
    window.addEventListener("beforeunload", (event) => {
        if (unsaved || options.hasPending())
            event.preventDefault();
    });
    return {
        save: () => save(),
        export() {
            try {
                if (options.hasPending())
                    throw new Error("Save or discard the unfinished annotation first.");
                const bytes = (0, model_1.serializeNotebook)(options.read());
                const url = URL.createObjectURL(new Blob([bytes], { type: "application/json" }));
                const link = document.createElement("a");
                link.href = url;
                link.download = "milton-annotation-notebook.json";
                link.click();
                setTimeout(() => URL.revokeObjectURL(url), 1000);
                status.textContent = `Notebook download requested.${blocked || unsaved ? " Local saving remains unavailable; keep the downloaded file before leaving." : ""}`;
            }
            catch (error) {
                status.textContent = `Notebook not exported: ${error instanceof Error ? error.message : "Invalid notebook."}`;
            }
        },
    };
}

import { afterEach, describe, expect, it, vi } from "vitest";
import { connectNotebook } from "../src/annotation/browser";
import { createNotebook, type Notebook, serializeNotebook } from "../src/annotation/model";

class ElementStub extends EventTarget {
  textContent = "";
  value = "";
  files: { size: number; text: () => Promise<string> }[] = [];
  children: ElementStub[] = [];
  setAttribute() {}
  append(...children: ElementStub[]) {
    this.children.push(...children);
  }
}
function setup(stored: string | null = null) {
  const documentStub = Object.assign(new EventTarget(), { createElement: () => new ElementStub() });
  const key = "frt.notebook./annotations/.nhc-milton.v1";
  const values = new Map<string, string>(stored === null ? [] : [[key, stored]]);
  const setItem = vi.fn((key: string, value: string) => values.set(key, value));
  vi.stubGlobal("document", documentStub);
  vi.stubGlobal("window", new EventTarget());
  vi.stubGlobal("location", { pathname: "/annotations/" });
  vi.stubGlobal("localStorage", { getItem: (key: string) => values.get(key) ?? null, setItem });
  const mount = new ElementStub();
  let notebook = createNotebook();
  let pending = false;
  const restore = vi.fn((next: Notebook) => {
    notebook = next;
  });
  const controller = connectNotebook({
    mount: mount as unknown as HTMLElement,
    read: () => notebook,
    restore,
    hasPending: () => pending,
  });
  return {
    key,
    values,
    setItem,
    controller,
    restore,
    input: mount.children[0]?.children[0] as ElementStub,
    status: () => mount.children[1]?.textContent,
    change: () => {
      notebook = createNotebook({ researchQuestion: "Changed question" });
    },
    pending: () => {
      pending = true;
    },
  };
}
function unloadPrevented() {
  const event = new Event("beforeunload", { cancelable: true });
  window.dispatchEvent(event);
  return event.defaultPrevented;
}
afterEach(() => vi.unstubAllGlobals());
describe("annotation notebook recovery", () => {
  it("retains imported bytes on a no-op save, then protects an externally replaced copy", () => {
    const bytes = `${serializeNotebook(createNotebook({ researchQuestion: " Original\r\ntext " }))}\n`;
    const ui = setup(bytes);
    ui.controller.save();
    expect(ui.values.get(ui.key)).toBe(bytes);
    expect(ui.setItem).not.toHaveBeenCalled();
    expect(unloadPrevented()).toBe(false);
    ui.values.set(ui.key, "another copy");
    window.dispatchEvent(
      Object.assign(new Event("storage"), { key: ui.key, newValue: "another copy" }),
    );
    ui.controller.save();
    expect(ui.values.get(ui.key)).toBe("another copy");
    expect(ui.status()).toContain("Another tab changed");
    expect(unloadPrevented()).toBe(true);
  });
  it.each(["", "broken JSON"])("preserves corrupt stored bytes %j", (bytes) => {
    const ui = setup(bytes);
    expect(ui.status()).toContain("preserved");
    ui.change();
    ui.controller.save();
    expect(ui.values.get(ui.key)).toBe(bytes);
    expect(ui.setItem).not.toHaveBeenCalled();
    expect(unloadPrevented()).toBe(true);
  });
  it("requires saving or discarding a pending annotation before import or export", async () => {
    const ui = setup();
    ui.pending();
    ui.controller.export();
    expect(ui.status()).toContain("Save or discard");
    ui.input.files = [{ size: 1, text: async () => serializeNotebook(createNotebook()) }];
    ui.input.dispatchEvent(new Event("change"));
    await vi.waitFor(() => expect(ui.status()).toContain("Notebook not opened"));
    expect(ui.restore).not.toHaveBeenCalled();
    expect(unloadPrevented()).toBe(true);
  });
  it("rejects a file whose asynchronous read overlaps another edit", async () => {
    const ui = setup();
    let finish: (value: string) => void = () => {};
    ui.input.files = [
      {
        size: 1,
        text: () =>
          new Promise((resolve) => {
            finish = resolve;
          }),
      },
    ];
    ui.input.dispatchEvent(new Event("change"));
    ui.change();
    document.dispatchEvent(new Event("input"));
    finish(serializeNotebook(createNotebook()));
    await vi.waitFor(() => expect(ui.status()).toContain("work changed while"));
    expect(ui.restore).not.toHaveBeenCalled();
    expect(ui.setItem).not.toHaveBeenCalled();
  });
  it("can retry a temporary storage failure after preserving the last good draft", () => {
    const ui = setup();
    ui.controller.save();
    const bytes = ui.values.get(ui.key);
    ui.change();
    ui.setItem.mockImplementationOnce(() => {
      throw new Error("Quota exceeded");
    });
    ui.controller.save();
    expect(ui.values.get(ui.key)).toBe(bytes);
    expect(ui.status()).toContain("Local saving failed");
    expect(unloadPrevented()).toBe(true);
    ui.controller.save();
    expect(ui.status()).toBe("Saved locally");
    expect(unloadPrevented()).toBe(false);
    expect(ui.values.get(ui.key)).not.toBe(bytes);
  });
});

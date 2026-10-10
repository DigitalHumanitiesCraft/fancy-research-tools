import { afterEach, describe, expect, it, vi } from "vitest";
import { connectInvestigation } from "../src/research/browser";
import { createInvestigation } from "../src/research/investigation";

class ElementStub extends EventTarget {
  textContent = "";
  children: ElementStub[] = [];
  setAttribute() {}
  append(...children: ElementStub[]) {
    this.children.push(...children);
  }
}
function setup() {
  const documentStub = Object.assign(new EventTarget(), { createElement: () => new ElementStub() });
  const values = new Map<string, string>();
  const storage = {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: vi.fn((key: string, value: string) => {
      values.set(key, value);
    }),
  };
  vi.stubGlobal("document", documentStub);
  vi.stubGlobal("window", new EventTarget());
  vi.stubGlobal("localStorage", storage);
  const mount = new ElementStub();
  return { mount, storage, values, status: () => mount.children[1]?.textContent };
}
const state = () =>
  createInvestigation({
    query: "",
    researchQuestion: "A question before selecting evidence",
    selectedIds: [],
    observation: "",
    unresolvedQuestion: "",
  });
function unloadPrevented() {
  const event = new Event("beforeunload", { cancelable: true });
  window.dispatchEvent(event);
  return event.defaultPrevented;
}
afterEach(() => {
  vi.unstubAllGlobals();
});
describe("local investigation recovery", () => {
  it.each([1, 2] as const)(
    "leaves unchanged version %i draft bytes intact without an unload warning",
    (schemaVersion) => {
      const ui = setup();
      const current = state();
      const { fieldEvidence: _evidence, ...common } = current;
      const stored = schemaVersion === 1 ? { ...common, schemaVersion } : current;
      const bytes = `${JSON.stringify(stored, null, 2)}\n`;
      const key = "frt.investigation.test.v1";
      ui.values.set(key, bytes);
      const connection = connectInvestigation({
        key: "test",
        mount: ui.mount as unknown as HTMLElement,
        restore() {},
        read: () => current,
      });
      connection.save();
      window.dispatchEvent(Object.assign(new Event("storage"), { key, newValue: bytes }));
      window.dispatchEvent(
        Object.assign(new Event("storage"), { key: "another-draft", newValue: "changed" }),
      );
      expect(ui.values.get(key)).toBe(bytes);
      expect(ui.storage.setItem).not.toHaveBeenCalled();
      expect(unloadPrevented()).toBe(false);
    },
  );
  it.each(["frt.investigation.test.v1", null])(
    "protects the local investigation on unload after an external storage change to %j",
    (key) => {
      const ui = setup();
      const connection = connectInvestigation({
        key: "test",
        mount: ui.mount as unknown as HTMLElement,
        restore() {},
        read: state,
      });
      connection.save();
      expect(unloadPrevented()).toBe(false);
      const external = { ...state(), researchQuestion: "Another tab's question" };
      const newValue = key === null ? null : JSON.stringify(external);
      if (newValue === null) ui.values.clear();
      else ui.values.set("frt.investigation.test.v1", newValue);
      window.dispatchEvent(Object.assign(new Event("storage"), { key, newValue }));
      expect(ui.status()).toContain("Another tab changed");
      expect(unloadPrevented()).toBe(true);
      connection.save();
      expect(ui.storage.setItem).toHaveBeenCalledTimes(1);
      expect(ui.values.get("frt.investigation.test.v1") ?? null).toBe(newValue);
      expect(unloadPrevented()).toBe(true);
    },
  );
  it("retries after correcting invalid input without overwriting the last good draft", () => {
    const ui = setup();
    let invalid = false;
    let current = state();
    const connection = connectInvestigation({
      key: "test",
      mount: ui.mount as unknown as HTMLElement,
      restore() {},
      read() {
        if (invalid) throw new Error("Text exceeds limit");
        return current;
      },
    });
    connection.save();
    const previous = ui.values.get("frt.investigation.test.v1");
    invalid = true;
    connection.save();
    expect(ui.status()).toContain("Text exceeds limit");
    expect(ui.values.get("frt.investigation.test.v1")).toBe(previous);
    invalid = false;
    current = createInvestigation({
      query: "",
      researchQuestion: "Corrected question after invalid input",
      selectedIds: [],
      observation: "",
      unresolvedQuestion: "",
    });
    connection.save();
    expect(ui.status()).toBe("Saved locally");
    expect(ui.values.get("frt.investigation.test.v1")).toBe(JSON.stringify(current));
    expect(ui.values.get("frt.investigation.test.v1")).not.toBe(previous);
  });
  it("retries a temporary storage write failure", () => {
    const ui = setup();
    const connection = connectInvestigation({
      key: "test",
      mount: ui.mount as unknown as HTMLElement,
      restore() {},
      read: state,
    });
    ui.storage.setItem.mockImplementationOnce(() => {
      throw new Error("Quota exceeded");
    });
    connection.save();
    expect(ui.status()).toContain("Quota exceeded");
    expect(ui.values.has("frt.investigation.test.v1")).toBe(false);
    connection.save();
    expect(ui.status()).toBe("Saved locally");
    expect(ui.values.get("frt.investigation.test.v1")).toBe(JSON.stringify(state()));
  });
  it("keeps corrupt and externally changed drafts blocked", () => {
    const ui = setup();
    ui.values.set("frt.investigation.test.v1", "bad JSON");
    const connection = connectInvestigation({
      key: "test",
      mount: ui.mount as unknown as HTMLElement,
      restore() {},
      read: state,
    });
    connection.save();
    expect(ui.storage.setItem).not.toHaveBeenCalled();
    expect(ui.values.get("frt.investigation.test.v1")).toBe("bad JSON");
    const other = connectInvestigation({
      key: "other",
      mount: new ElementStub() as unknown as HTMLElement,
      restore() {},
      read: state,
    });
    ui.values.set("frt.investigation.other.v1", JSON.stringify(state()));
    other.save();
    other.save();
    expect(ui.storage.setItem).not.toHaveBeenCalled();
  });
});

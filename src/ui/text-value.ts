/** Preserve imported text until this control is edited: native controls normalize line endings. */
export function bindTextValue(
  control: HTMLInputElement | HTMLTextAreaElement,
  normalizeInput: (value: string) => string = (value) => value,
) {
  let value = control.value;
  control.addEventListener("input", () => {
    value = normalizeInput(control.value);
  });
  return {
    read: () => value,
    restore(next: string) {
      value = next;
      control.value = next;
    },
  };
}

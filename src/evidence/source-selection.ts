/** Readonly textarea caret movement needs an explicit fallback in some browsers. */
export function connectSourceSelection(control: HTMLTextAreaElement) {
  function reveal(offset: number, align = false) {
    const style = getComputedStyle(control);
    const measure = document.createElement("div");
    measure.className = "source-measure";
    measure.style.inlineSize = `${control.clientWidth}px`;
    measure.style.font = style.font;
    measure.style.padding = style.padding;
    measure.textContent = control.value.slice(0, offset);
    const marker = document.createElement("span");
    marker.textContent = "\u200b";
    measure.append(marker);
    document.body.append(measure);
    const top = marker.getBoundingClientRect().top - measure.getBoundingClientRect().top;
    const line = Number.parseFloat(style.lineHeight);
    if (align || top < control.scrollTop || top + line > control.scrollTop + control.clientHeight)
      control.scrollTop = Math.max(0, top - 2 * line);
    measure.remove();
  }
  control.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key) || event.altKey) return;
    const {
      selectionStart: start,
      selectionEnd: end,
      selectionDirection: direction,
      value,
    } = control;
    const anchor = direction === "backward" ? end : start;
    const cursor = direction === "backward" ? start : end;
    let next = cursor;
    if (event.key === "ArrowLeft")
      next = !event.shiftKey && start !== end ? start : Math.max(0, cursor - 1);
    if (event.key === "ArrowRight")
      next = !event.shiftKey && start !== end ? end : Math.min(value.length, cursor + 1);
    if (event.key === "Home")
      next =
        event.ctrlKey || event.metaKey || cursor === 0
          ? 0
          : value.lastIndexOf("\n", cursor - 1) + 1;
    if (event.key === "End") {
      const newline = value.indexOf("\n", cursor);
      next = event.ctrlKey || event.metaKey || newline < 0 ? value.length : newline;
    }
    event.preventDefault();
    if (event.shiftKey)
      control.setSelectionRange(
        Math.min(anchor, next),
        Math.max(anchor, next),
        next < anchor ? "backward" : "forward",
      );
    else control.setSelectionRange(next, next);
    reveal(next);
  });
  return { reveal };
}

import OpenSeadragon from "openseadragon";
import type { Photograph } from "./model";

/** Enhance the ordinary image; retain it if the zoom viewer cannot open. */
export function mountViewer(
  record: Photograph,
  imageUrl: string,
  container: HTMLElement,
): () => void {
  const frame = document.createElement("div");
  frame.className = "viewer";
  const fallback = document.createElement("img");
  fallback.src = imageUrl;
  fallback.alt = record.title;
  fallback.width = record.image.width;
  fallback.height = record.image.height;
  const surface = document.createElement("div");
  surface.className = "viewer-canvas";
  surface.setAttribute("aria-label", `${record.title}, zoomable image`);
  surface.setAttribute("role", "group");
  surface.setAttribute("aria-describedby", "image-keyboard-help");
  frame.append(fallback, surface);
  container.append(frame);
  const controls = document.createElement("div");
  controls.className = "viewer-controls";
  controls.hidden = true;
  const help = document.createElement("p");
  help.id = "image-keyboard-help";
  help.className = "sr-only";
  help.textContent = "Image controls: arrow keys to pan, + and − to zoom, 0 to fit.";
  help.hidden = true;
  const viewer = OpenSeadragon({
    element: surface,
    showNavigationControl: false,
    showSequenceControl: false,
    showNavigator: false,
    animationTime: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 0.25,
    visibilityRatio: 0.5,
    constrainDuringPan: true,
    maxZoomPixelRatio: 3,
    gestureSettingsMouse: { clickToZoom: false, dblClickToZoom: true, scrollToZoom: true },
    gestureSettingsTouch: { pinchToZoom: true, flickEnabled: false, dblClickToZoom: true },
    tileSources: { type: "image", url: imageUrl },
  });
  const act = (label: string, text: string, action: () => void) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = text;
    button.setAttribute("aria-label", label);
    button.title = label;
    button.addEventListener("click", action);
    controls.append(button);
  };
  act("Zoom in", "+", () => viewer.viewport.zoomBy(1.5));
  act("Zoom out", "−", () => viewer.viewport.zoomBy(1 / 1.5));
  act("Fit image", "Fit image", () => viewer.viewport.goHome());
  const onKey = (event: KeyboardEvent) => {
    if (event.target !== surface && event.target !== viewer.canvas) return;
    const step = 0.08 / viewer.viewport.getZoom();
    const directions: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    };
    const direction = directions[event.key];
    if (direction) viewer.viewport.panBy(new OpenSeadragon.Point(...direction));
    else if (event.key === "+" || event.key === "=") viewer.viewport.zoomBy(1.5);
    else if (event.key === "-") viewer.viewport.zoomBy(1 / 1.5);
    else if (event.key === "0") viewer.viewport.goHome();
    else return;
    viewer.viewport.applyConstraints();
    event.preventDefault();
    event.stopPropagation();
  };
  // Capture prevents the library's own key handler from applying a second move.
  surface.addEventListener("keydown", onKey, true);
  viewer.addHandler("open", () => {
    fallback.hidden = true;
    controls.hidden = false;
    help.hidden = false;
    surface.tabIndex = 0;
    viewer.canvas.tabIndex = -1;
    // Exposed as observable viewer state for the browser interaction checks.
    surface.dataset.ready = "true";
  });
  viewer.addHandler("open-failed", () => {
    surface.hidden = true;
    fallback.hidden = false;
    controls.hidden = true;
    help.hidden = true;
  });
  viewer.addHandler("viewport-change", () => {
    surface.dataset.zoom = String(viewer.viewport.getZoom());
    surface.dataset.center = viewer.viewport.getCenter().toString();
  });
  frame.append(controls);
  container.append(help);
  return () => viewer.destroy();
}

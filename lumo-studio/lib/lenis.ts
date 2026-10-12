import type Lenis from "lenis";

// Shared handle so overlays can pause smooth scrolling while they are open.
let instance: Lenis | null = null;
export const setLenis = (l: Lenis | null) => { instance = l; };
export const getLenis = () => instance;

export function lockScroll(locked: boolean) {
  if (instance) { if (locked) instance.stop(); else instance.start(); }
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

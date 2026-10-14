import type Lenis from "lenis";

let instance: Lenis | null = null;
export const setLenis = (l: Lenis | null) => { instance = l; };
export const getLenis = () => instance;

export function lockScroll(locked: boolean) {
  if (instance) { if (locked) instance.stop(); else instance.start(); }
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

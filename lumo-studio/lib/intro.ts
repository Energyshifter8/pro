"use client";
import { useEffect, useState } from "react";

// Load-sequence clock. Delays are seconds after fonts are ready, measured on the reference.
export const INTRO = {
  heroLines: [0, 0.3, 0.6], // headline lines: 1s power4.out each
  pen: 0.06,
  stickers: { rating: 0.81, built: 1.86, support: 2.08, response: 3.36, audit: 3.88, years: 4.48 },
  header: 2.67, // 0.45s power2.out
  bottomNav: 5.0, // 0.5s ease-in-out
};

let readyAt: number | null = null;
const waiters = new Set<() => void>();
function markReady() {
  if (readyAt !== null) return;
  readyAt = performance.now();
  waiters.forEach((f) => f());
}
if (typeof window !== "undefined") {
  const go = () => document.fonts.ready.then(markReady);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go); else go();
}

// True once the intro has started; components schedule their own delays from INTRO.
export function useIntroReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (readyAt !== null) { setReady(true); return; }
    const f = () => setReady(true);
    waiters.add(f);
    return () => { waiters.delete(f); };
  }, []);
  return ready;
}

export const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

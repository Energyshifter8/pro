"use client";
import { useEffect, useState } from "react";

// Load-sequence clock. Delays are seconds after fonts are ready, measured on the reference.
export const INTRO = {
  heroLines: [0, 0.3, 0.6], // headline lines: 1s power4.out each
  pen: 0.06,
  stickers: { rating: 0.81, built: 1.86, support: 2.08, response: 3.36, audit: 3.88, years: 4.48 },
  header: 2.67, // 0.45s power2.out from scale 0.5
  bottomNav: 5.0, // 0.5s ease-in-out
};

// Below 992px the reference runs a shorter sequence: five stacked lines, then everything
// pops in with back.out(1.7) over 0.4s from scale 0.
export const INTRO_ADAPTIVE = {
  heroLines: [0, 0.3, 0.6, 0.9, 1.2],
  header: 0.61,
  stickers: { rating: 0.85, response: 0.97, audit: 1.09, support: 1.21, built: 1.33, years: 1.45 },
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

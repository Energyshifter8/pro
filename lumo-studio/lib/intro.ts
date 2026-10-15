"use client";
import { useEffect, useState } from "react";

export const INTRO = {
  heroLines: [0, 0.3, 0.6],
  pen: 0.06,
  stickers: { fund: 1.86, club: 2.08, itpark: 3.36, fee: 3.88, first: 4.48 },
  sub: 1.45,
  header: 2.67,
  bottomNav: 5.0,
};

export const INTRO_ADAPTIVE = {
  heroLines: [0, 0.3, 0.6, 0.9, 1.2],
  header: 0.61,
  stickers: { itpark: 0.97, fee: 1.09, club: 1.21, fund: 1.33, first: 1.45 },
  sub: 1.55,
  bottomNav: 0.06,
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

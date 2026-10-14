"use client";
import { useEffect, useState } from "react";
import { lockScroll } from "./lenis";

export function usePresence(open: boolean, exitMs: number, onEscape?: () => void) {
  const [mounted, setMounted] = useState(open);
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (open) {
      setMounted(true);
      lockScroll(true);
      let r2 = 0;
      const r1 = requestAnimationFrame(() => { r2 = requestAnimationFrame(() => setOn(true)); });
      const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onEscape?.(); };
      window.addEventListener("keydown", esc);
      return () => { cancelAnimationFrame(r1); cancelAnimationFrame(r2); window.removeEventListener("keydown", esc); };
    }
    setOn(false);
    const t = window.setTimeout(() => { setMounted(false); lockScroll(false); }, exitMs);
    return () => clearTimeout(t);
  }, [open, exitMs, onEscape]);
  return { mounted, on };
}

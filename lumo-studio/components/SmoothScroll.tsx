"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { setLenis } from "@/lib/lenis";

// Matches the reference inertia: a 100px wheel tick scrolls 40px, decaying at ~4.4/s.
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.07, wheelMultiplier: 0.4 });
    setLenis(lenis);
    let id = 0;
    const raf = (t: number) => { lenis.raf(t); id = requestAnimationFrame(raf); };
    id = requestAnimationFrame(raf);
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null;
      const href = a?.getAttribute("href");
      if (!href || href === "#") return;
      const el = document.querySelector(href);
      if (el) { e.preventDefault(); lenis.scrollTo(el as HTMLElement); }
    };
    document.addEventListener("click", onClick);
    return () => { cancelAnimationFrame(id); lenis.destroy(); setLenis(null); document.removeEventListener("click", onClick); };
  }, []);
  return null;
}

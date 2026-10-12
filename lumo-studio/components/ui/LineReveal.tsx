"use client";
import { animate, motion, useMotionValue, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useState, type RefObject } from "react";
import { power4Out } from "@/lib/ease";
import { reducedMotion } from "@/lib/intro";

// Progress 0→1 over 1s (power4.out) when `go` turns true, after `delay` seconds; snaps
// back to 0 when `go` turns false so the reveal replays on re-entry (as on the reference).
export function useLineProgress(go: boolean, delay = 0) {
  const p = useMotionValue(0);
  useEffect(() => {
    if (!go) { p.set(0); return; }
    if (reducedMotion()) { p.set(1); return; }
    const c = animate(p, 1, { duration: 1, delay, ease: power4Out });
    return () => c.stop();
  }, [go, delay, p]);
  return p;
}

// The reference's line reveal: the element starts `d` em lower, skewed 6° about its
// bottom-left corner, and is clipped `off` em above its own displaced bottom edge, so it
// rises out of a mask at its resting baseline while fading in.
export function Frag({ p, d, off, className = "", style, as = "span", children }: {
  p: MotionValue<number>; d: number; off: number; className?: string; style?: React.CSSProperties; as?: "span" | "div"; children: React.ReactNode;
}) {
  const transform = useTransform(p, (v) => (v >= 1 ? "none" : `translateY(${(d * (1 - v)).toFixed(4)}em) skewY(${(6 * (1 - v)).toFixed(3)}deg)`));
  const clipPath = useTransform(p, (v) => (v >= 1 ? "none" : `inset(-0.3em -0.25em ${(d * (1 - v) - off).toFixed(4)}em)`));
  const C = as === "div" ? motion.div : motion.span;
  return (
    <C className={className} style={{ ...style, transform, clipPath, opacity: p, transformOrigin: "0% 100%" }}>
      {children}
    </C>
  );
}

// True while any part of the element is in the viewport.
export function useInViewToggle(ref: RefObject<Element>) {
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setV(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return v;
}

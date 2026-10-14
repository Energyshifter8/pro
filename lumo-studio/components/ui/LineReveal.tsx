"use client";
import { animate, motion, useMotionValue, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useState, type RefObject } from "react";
import { power4Out } from "@/lib/ease";
import { reducedMotion } from "@/lib/intro";

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

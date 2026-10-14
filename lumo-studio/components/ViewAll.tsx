"use client";
import { animate, useMotionValue, useMotionValueEvent } from "framer-motion";
import { useEffect, useRef } from "react";
import { viewAll, viewAllLabel } from "@/lib/content";
import { backOut } from "@/lib/ease";
import { GlyphText, fitSpacing, type GlyphSlot } from "./ui/GlyphText";

// Two 3D signposts on a shared pole. Once the upper sign's top passes 75% of the viewport
// (until it has left the top), the signs swing open to ±45° (back.out(1.7), 1s, right sign 0.1s later); they
// swing shut when the section leaves. Each sign has an arrow tip and a side face that
// gives it thickness; hovering pushes the tip outward (padding, 0.8s).
const GLYPHS: Record<string, GlyphSlot> = { "т": { k: "T", adv: 0.66, ix: 0.04, asc: 0.73, iw: 0.6, ih: 0.73 } };
const sign = "relative block whitespace-nowrap px-[21rem] py-[33rem] text-[42rem] uppercase [transform-style:preserve-3d] transition-[padding] duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] md:px-[40rem] md:py-[62rem] md:text-[80rem] lg:px-[50rem] lg:py-[70rem] lg:text-[100rem]";

function Sparkle() {
  return (
    <svg viewBox="0 0 33 33" className="block h-full w-full animate-[spin_8s_linear_infinite]" aria-hidden>
      <path d="M16.5 0c1.2 8.6 4.6 13.4 16.5 16.5-11.9 3.1-15.3 7.9-16.5 16.5C15.3 24.4 11.9 19.6 0 16.5 11.9 13.4 15.3 8.6 16.5 0z" fill="#FBD402" />
    </svg>
  );
}

export default function ViewAll() {
  const sec = useRef<HTMLElement>(null);
  const left = useRef<HTMLAnchorElement>(null);
  const right = useRef<HTMLAnchorElement>(null);
  const pL = useMotionValue(0), pR = useMotionValue(0);

  useEffect(() => {
    let on = false, raf = 0;
    const play = (to: boolean) => {
      on = to;
      animate(pL, to ? 1 : 0, { duration: 1, ease: (t) => (to ? backOut(t) : 1 - backOut(1 - t)) });
      animate(pR, to ? 1 : 0, { duration: 1, delay: 0.1, ease: (t) => (to ? backOut(t) : 1 - backOut(1 - t)) });
    };
    const tick = () => {
      // the right sign's untransformed box (it is centred in its column, then lifted 50%)
      const r = sec.current!.getBoundingClientRect();
      const h = right.current!.offsetHeight, vh = window.innerHeight;
      const top = r.top + r.height / 2 - h / 2;
      const inside = top < vh * 0.75 && top + h > -vh * 0.06;
      if (inside !== on) play(inside);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [pL, pR]);

  useMotionValueEvent(pL, "change", (v) => { if (left.current) left.current.style.transform = `rotateY(${-45 * v}deg) translateY(50%)`; });
  useMotionValueEvent(pR, "change", (v) => { if (right.current) right.current.style.transform = `rotateY(${45 * v}deg) translateY(-50%)`; });

  const [cases, blogs] = viewAll;
  return (
    <section ref={sec} aria-label={viewAllLabel} className="relative mt-[135rem] flex h-[340rem] items-center justify-center overflow-hidden md:mt-0 md:h-[788rem] lg:h-[max(1320rem,110svh)]">
      <div className="relative flex h-[100svh] min-w-0 flex-[0_0_50%] flex-row-reverse items-center justify-start [perspective:403rem] md:[perspective:775rem] lg:flex-[0_1_50%] lg:[perspective:2000rem]">
        <div aria-hidden className="pointer-events-none absolute -left-[480rem] right-0 top-[120rem] h-[960rem] border-[2px] border-r-0 border-[#d9d9d9] opacity-[.04] [transform:rotateY(-1deg)]" />
        <a ref={left} href={blogs.href} data-cursor="pointer" style={{ ...fitSpacing(), transform: "translateY(50%)", transformOrigin: "100% 100%" }}
          className={`display bg-[#dee6ff] text-[#3d71ff] hover:pl-[80rem] ${sign}`}>
          <span aria-hidden className="absolute left-0 top-0 z-[-1] h-full -translate-x-1/2 bg-[#dee6ff] [clip-path:polygon(100%_0,33.333%_0,0_50%,33.333%_100%,100%_100%)]" style={{ aspectRatio: "1.5 / 1" }} />
          <span className="relative block leading-[1.2]"><GlyphText text={blogs.label} fit /></span>
          <span aria-hidden className="absolute right-0 top-0 h-full bg-[#3d71ff] [aspect-ratio:1/1] [transform-origin:right_center] [transform:rotateY(-90deg)]" />
        </a>
      </div>
      <div className="relative flex h-[100svh] min-w-0 flex-[0_0_50%] items-center justify-start [perspective:403rem] md:[perspective:775rem] lg:[perspective:2000rem]">
        <a ref={right} href={cases.href} data-cursor="pointer" style={{ ...fitSpacing(), transform: "translateY(-50%)", transformOrigin: "0 50%" }}
          className={`display bg-pink text-[#ffe1ed] hover:pr-[80rem] ${sign}`}>
          <span aria-hidden className="absolute right-0 top-0 z-[-1] h-full translate-x-1/2 bg-pink [clip-path:polygon(0_0,66.667%_0,100%_50%,66.667%_100%,0_100%)]" style={{ aspectRatio: "1.5 / 1" }} />
          <span className="relative block leading-[1.2]"><GlyphText text={cases.label} glyphs={GLYPHS} lh={1.2} fit /></span>
          <span aria-hidden className="absolute left-0 top-0 h-full bg-[#ffe1ed] [aspect-ratio:1/1] [transform-origin:left_center] [transform:rotateY(90deg)]" />
        </a>
        <div aria-hidden className="absolute left-[-1rem] top-1/2 z-[1] h-[55rem] w-[55rem] -translate-y-[128rem] md:left-[-2rem] md:h-[100rem] md:w-[100rem] md:-translate-y-[246rem] lg:left-[40rem] lg:h-[120rem] lg:w-[120rem] lg:-translate-y-[330rem]"><Sparkle /></div>
        <div aria-hidden className="pointer-events-none absolute -right-[480rem] left-0 top-[120rem] h-[960rem] border-[2px] border-[#d9d9d9] bg-[#d9d9d9] opacity-[.04] [transform:rotateY(1deg)]" />
      </div>
    </section>
  );
}

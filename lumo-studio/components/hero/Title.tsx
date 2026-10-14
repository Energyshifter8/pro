"use client";
import { useLayoutEffect, useRef } from "react";
import { hero } from "@/lib/olympiad";
import { INTRO, INTRO_ADAPTIVE, useIntroReady } from "@/lib/intro";
import { Frag, useLineProgress } from "../ui/LineReveal";
import { GlyphText, type GlyphSlot } from "../ui/GlyphText";
import PenLine from "./PenLine";

// Decorative glyph slots, keyed by the letter they stand in for: Cyrillic о as the stretched
// Plex o, and the year's 0 as a narrower o.
const DESKTOP_GLYPHS: Record<string, GlyphSlot> = {
  "о": { k: "o", adv: 1.045, ix: 0.014, asc: 0.761, iw: 1.026, ih: 0.763 },
  "0": { k: "o", adv: 0.66, ix: 0.02, asc: 0.761, iw: 0.62, ih: 0.763 },
};
const MOBILE_GLYPHS: Record<string, GlyphSlot> = {
  ...DESKTOP_GLYPHS,
  "о": { k: "o", adv: 0.8, ix: 0.014, asc: 0.761, iw: 0.78, ih: 0.763 },
};

// Squeeze a line horizontally (never stretch) when it is wider than its box — the original
// headline fitted its fragments with scaleX the same way. Runs once the fonts are in, before
// the reveal starts, and again on resize.
function useFitLines(ready: boolean) {
  const els = useRef<(HTMLSpanElement | null)[]>([]);
  useLayoutEffect(() => {
    if (!ready) return;
    const fit = () => els.current.forEach((el) => {
      if (!el?.parentElement) return;
      el.style.transform = "";
      const w = el.getBoundingClientRect().width, max = el.parentElement.clientWidth;
      if (w > max + 0.5) el.style.transform = `scaleX(${(max / w).toFixed(4)})`;
    });
    fit();
    const ro = new ResizeObserver(fit);
    els.current.forEach((el) => el?.parentElement && ro.observe(el.parentElement));
    return () => ro.disconnect();
  }, [ready]);
  return (i: number) => (n: HTMLSpanElement | null) => { els.current[i] = n; };
}

// Desktop layout (≥992px): three lines absolutely placed in em of the 240rem headline at the
// reference line tops; the middle line hangs from the right edge and the year is lime. Each
// line rises through the same skewed mask as before, and the pen line is drawn over them.
const LINE_TOP = [0.0833, 1.06, 1.92];

function DesktopTitle({ ready }: { ready: boolean }) {
  const lines = [useLineProgress(ready, INTRO.heroLines[0]), useLineProgress(ready, INTRO.heroLines[1]), useLineProgress(ready, INTRO.heroLines[2])];
  const fit = useFitLines(ready);
  return (
    <h1 aria-label={hero.label} className="display relative hidden pt-[20rem] text-[240rem] leading-[0.78] text-lilac lg:block">
      {hero.lines.map((l, i) => (
        <Frag key={i} p={lines[i]} d={1.01} off={0} className={`absolute inset-x-0 z-[1] whitespace-pre ${i === 1 ? "text-right" : ""} ${i === 2 ? "text-lime" : ""}`} style={{ top: `${LINE_TOP[i]}em` }}>
          <span ref={fit(i)} className={`inline-block ${i === 1 ? "origin-right" : "origin-left"}`}><GlyphText text={l} glyphs={DESKTOP_GLYPHS} lh={0.78} /></span>
        </Frag>
      ))}
      <PenLine />
    </h1>
  );
}

// Below 992px: four stacked rows, alternately hung from the left and right edges.
const ROWS = [
  "md:ml-[24rem] ml-[16rem]",
  "text-right md:mr-[24rem] md:mt-[6rem] mr-[16rem] mt-[-10rem]",
  "md:ml-[24rem] md:mt-[6rem] ml-[16rem] mt-[-10rem]",
  "text-right text-lime md:mr-[24rem] md:mt-[6rem] mr-[16rem] mt-[-10rem]",
];

function AdaptiveTitle({ ready }: { ready: boolean }) {
  const ps = INTRO_ADAPTIVE.heroLines.map((d) => useLineProgress(ready, d)); // fixed-length list
  const fit = useFitLines(ready);
  return (
    <h1 aria-label={hero.label} className="display relative z-[2] m-0 text-[76rem] leading-none tracking-[-0.017em] text-lilac md:text-[108rem] lg:hidden">
      {hero.mobileLines.map((l, i) => (
        <Frag key={i} p={ps[i]} d={1.165} off={0.3} className={`block whitespace-nowrap ${ROWS[i] ?? ROWS[2]}`}>
          <span ref={fit(i)} className={`inline-block ${(ROWS[i] ?? "").includes("text-right") ? "origin-right" : "origin-left"}`}><GlyphText text={l} glyphs={MOBILE_GLYPHS} /></span>
        </Frag>
      ))}
    </h1>
  );
}

export default function Title() {
  const ready = useIntroReady();
  return (
    <>
      <DesktopTitle ready={ready} />
      <div className="pt-[190rem] md:pt-[150rem] lg:hidden">
        <AdaptiveTitle ready={ready} />
      </div>
    </>
  );
}

"use client";
import { animate, motion, useMotionValue, useTransform, type MotionValue } from "framer-motion";
import { useEffect } from "react";
import { Glyph, InlineGlyph } from "../Glyph";
import type { GlyphKey } from "@/lib/glyphs";
import { INTRO, INTRO_ADAPTIVE, reducedMotion, useIntroReady } from "@/lib/intro";
import { power4Out } from "@/lib/ease";
import PenLine from "./PenLine";

const TITLE = "Websites people trust. Designed to sell.";
const TAN6 = Math.tan((6 * Math.PI) / 180);

// One progress value per line, eased 0→1 over 1s (power4.out) after its intro delay.
function useLine(delay: number, ready: boolean) {
  const p = useMotionValue(0);
  useEffect(() => {
    if (!ready) return;
    if (reducedMotion()) { p.set(1); return; }
    const c = animate(p, 1, { duration: 1, delay, ease: power4Out });
    return () => c.stop();
  }, [ready, delay, p]);
  return p;
}

// Line reveal: the fragment starts `d` em lower, skewed 6° about its bottom-left, and is
// clipped `off` em below its own bottom edge so it rises out of the line's baseline mask.
function Frag({ p, d, off, className = "", style, children }: { p: MotionValue<number>; d: number; off: number; className?: string; style?: React.CSSProperties; children: React.ReactNode }) {
  const transform = useTransform(p, (v) => (v >= 1 ? "none" : `translateY(${(d * (1 - v)).toFixed(4)}em) skewY(${(6 * (1 - v)).toFixed(3)}deg)`));
  const clipPath = useTransform(p, (v) => (v >= 1 ? "none" : `inset(-0.3em -0.25em ${(d * (1 - v) - off).toFixed(4)}em)`));
  return (
    <motion.span aria-hidden className={className} style={{ ...style, transform, clipPath, opacity: p, transformOrigin: "0% 100%" }}>
      {children}
    </motion.span>
  );
}

// Desktop layout (≥992px): absolutely placed fragments in em of the 240rem headline.
// Text fragments carry `left`/`sx` chosen so each fragment's ink box matches the reference
// fragment's ink box (letter widths differ between the two display faces even though
// whole lines match). Glyph fragments carry their ink box [x, y, w, h].
const LINE_TOP = [0.0833, 1.06, 1.92];
const LINE_START = [0, 4.58, -0.14];
type Piece = { line: 0 | 1 | 2; z?: boolean } & ({ text: string; left: number; sx: number } | { glyph: GlyphKey; box: [number, number, number, number] });
const PIECES: Piece[] = [
  { line: 0, text: "W", left: -0.005, sx: 0.893, z: true },
  { line: 0, glyph: "e", box: [0.516, -0.099, 0.794, 0.75] },
  { line: 0, text: "BSITES", left: 1.298, sx: 1.077 },
  { line: 0, text: "PE", left: 3.477, sx: 0.979 },
  { line: 0, glyph: "o", box: [4.166, -0.104, 1.028, 0.756], z: true },
  { line: 0, text: "PLE", left: 5.183, sx: 0.951 },
  { line: 1, glyph: "T", box: [4.908, 0.888, 0.594, 0.717], z: true },
  { line: 1, text: "RUST.", left: 5.478, sx: 1.051 },
  { line: 2, text: "DE", left: 0.007, sx: 0.964 },
  { line: 2, glyph: "S", box: [0.712, 1.731, 1.122, 0.739] },
  { line: 2, text: "IGNED TO SE", left: 1.833, sx: 1.026 },
  { line: 2, glyph: "L", box: [5.251, 1.742, 0.522, 0.722], z: true },
  { line: 2, text: "L.", left: 5.773, sx: 0.996 },
];

function DesktopTitle({ ready }: { ready: boolean }) {
  const lines = [useLine(INTRO.heroLines[0], ready), useLine(INTRO.heroLines[1], ready), useLine(INTRO.heroLines[2], ready)];
  return (
    <h1 aria-label={TITLE} className="display relative hidden pt-[20rem] text-[240rem] leading-[0.78] text-lilac lg:block">
      {PIECES.map((pc, i) => {
        const p = lines[pc.line];
        if ("text" in pc) {
          const d = 1.01 + (pc.left - LINE_START[pc.line]) * TAN6;
          return (
            <Frag key={i} p={p} d={d} off={0} className={`absolute whitespace-pre ${pc.z ? "z-[1]" : ""}`} style={{ left: `${pc.left}em`, top: `${LINE_TOP[pc.line]}em` }}>
              <span className="inline-block origin-left" style={{ transform: `scaleX(${pc.sx})` }}>{pc.text}</span>
            </Frag>
          );
        }
        const [x, y, w, h] = pc.box;
        const d = 1.01 + (x - LINE_START[pc.line]) * TAN6;
        return (
          <Frag key={i} p={p} d={d} off={LINE_TOP[pc.line] + 0.78 - (y + h)} className={`absolute block ${pc.z ? "z-[1]" : ""}`} style={{ left: `${x}em`, top: `${y}em`, width: `${w}em`, height: `${h}em` }}>
            <Glyph k={pc.glyph} className="block h-full w-full" />
          </Frag>
        );
      })}
      <PenLine />
    </h1>
  );
}

// Below 992px: five stacked lines with inline glyphs (slots measured at lh 1).
const G = {
  e: { k: "e", adv: 0.815, ix: 0.014, asc: 0.761, iw: 0.789, ih: 0.763 },
  o: { k: "o", adv: 1.045, ix: 0.014, asc: 0.761, iw: 1.026, ih: 0.763 },
  t: { k: "T", adv: 0.648, ix: 0.052, asc: 0.735, iw: 0.592, ih: 0.724 },
  s: { k: "S", adv: 1.161, ix: 0.013, asc: 0.748, iw: 1.132, ih: 0.737 },
  l: { k: "L", adv: 0.55, ix: 0.013, asc: 0.734, iw: 0.526, ih: 0.724 },
} as const;

function AdaptiveTitle({ ready }: { ready: boolean }) {
  const ps = INTRO_ADAPTIVE.heroLines.map((d) => useLine(d, ready)); // fixed-length list
  const rows: { cls: string; content: React.ReactNode }[] = [
    { cls: "md:inline-block md:ml-[24rem] ml-[16rem]", content: <>W<InlineGlyph {...G.e} />BSITES</> },
    { cls: "md:inline-block md:ml-[30rem] md:mt-0 ml-[16rem] mt-[-13.5rem]", content: <>PE<InlineGlyph {...G.o} />PLE</> },
    { cls: "text-right md:mr-[24rem] md:mt-[21rem] mr-[16rem] mt-[-15.5rem]", content: <><InlineGlyph {...G.t} />RUST.</> },
    { cls: "md:ml-[24rem] md:mt-[21rem] ml-[16rem] mt-[-14.5rem]", content: <>DE<InlineGlyph {...G.s} />IGNED</> },
    { cls: "text-right md:mr-[23rem] md:mt-[13rem] mr-[16rem] mt-[-15.5rem]", content: <>TO SE<InlineGlyph {...G.l} />L.</> },
  ];
  return (
    <h1 aria-label={TITLE} className="display relative z-[2] m-0 text-[76rem] leading-none tracking-[-0.017em] text-lilac md:text-[108rem] lg:hidden">
      {rows.map((r, i) => (
        <Frag key={i} p={ps[i]} d={1.165} off={0.3} className={`block whitespace-nowrap ${r.cls}`}>{r.content}</Frag>
      ))}
    </h1>
  );
}

export default function Title() {
  const ready = useIntroReady();
  return (
    <>
      <DesktopTitle ready={ready} />
      <div className="pt-[190rem] md:pt-[201rem] lg:hidden">
        <AdaptiveTitle ready={ready} />
      </div>
    </>
  );
}

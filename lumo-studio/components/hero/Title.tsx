"use client";
import { useLayoutEffect, useRef } from "react";
import { hero } from "@/lib/olympiad";
import { INTRO, INTRO_ADAPTIVE, useIntroReady } from "@/lib/intro";
import { Frag, useLineProgress } from "../ui/LineReveal";
import PenLine from "./PenLine";

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

const LINE_TOP = [0.0833, 1.06, 1.92];

function DesktopTitle({ ready }: { ready: boolean }) {
  const lines = [useLineProgress(ready, INTRO.heroLines[0]), useLineProgress(ready, INTRO.heroLines[1]), useLineProgress(ready, INTRO.heroLines[2])];
  const fit = useFitLines(ready);
  return (
    <h1 aria-label={hero.label} className="display relative hidden pt-[20rem] text-[240rem] leading-[0.78] text-lilac lg:block">
      {hero.lines.map((l, i) => (
        <Frag key={i} p={lines[i]} d={1.01} off={0} className={`absolute inset-x-0 z-[1] whitespace-pre ${i === 1 ? "text-right" : ""} ${i === 2 ? "text-lime" : ""}`} style={{ top: `${LINE_TOP[i]}em` }}>
          <span ref={fit(i)} className={`inline-block ${i === 1 ? "origin-right" : "origin-left"}`}>{l}</span>
        </Frag>
      ))}
      <PenLine />
    </h1>
  );
}

const ROWS = [
  "md:ml-[24rem] ml-[16rem]",
  "text-right md:mr-[24rem] md:mt-[6rem] mr-[16rem] mt-[-10rem]",
  "md:ml-[24rem] md:mt-[6rem] ml-[16rem] mt-[-10rem]",
  "text-right text-lime md:mr-[24rem] md:mt-[6rem] mr-[16rem] mt-[-10rem]",
];

function AdaptiveTitle({ ready }: { ready: boolean }) {
  const ps = INTRO_ADAPTIVE.heroLines.map((d) => useLineProgress(ready, d));
  const fit = useFitLines(ready);
  return (
    <h1 aria-label={hero.label} className="display relative z-[2] m-0 text-[76rem] leading-none tracking-[-0.017em] text-lilac md:text-[108rem] lg:hidden">
      {hero.mobileLines.map((l, i) => (
        <Frag key={i} p={ps[i]} d={1.165} off={0.3} className={`block whitespace-nowrap ${ROWS[i] ?? ROWS[2]}`}>
          <span ref={fit(i)} className={`inline-block ${(ROWS[i] ?? "").includes("text-right") ? "origin-right" : "origin-left"}`}>{l}</span>
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

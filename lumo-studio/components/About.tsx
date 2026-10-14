"use client";
import { useEffect, useRef, useState } from "react";
import { about } from "@/lib/olympiad";
import { backOut, power1In, power1Out, power2InOut, power2Out, sineInOut } from "@/lib/ease";
import { useDesktop } from "@/lib/useMedia";
import { Frag, useInViewToggle, useLineProgress } from "./ui/LineReveal";
import { GlyphText, capMarkGap, fitSpacing, plain, type GlyphSlot } from "./ui/GlyphText";
import { ICONS, TileShape, type Shape } from "./about/TileArt";

const TILES: { shape: Shape; color: string; a: string; b: string; slot: number }[] = [
  { shape: "square", color: "#F04C8A", a: "cursor", b: "star", slot: 3 },
  { shape: "square", color: "#C2EC40", a: "heart", b: "smile", slot: 1 },
  { shape: "circle", color: "#104EFF", a: "chart", b: "eye", slot: 4 },
  { shape: "tag", color: "#E1611C", a: "crown", b: "spark", slot: 0 },
  { shape: "circle", color: "#EA3323", a: "bolt", b: "note", slot: 2 },
];

const INTRO_FADE = [[0, 88], [15, 103], [30, 118]];
const GATHER = { start: [42, 56, 71, 88, 101], dur: 118 };
const DROP: [number, number, (t: number) => number][] = [
  [310, 420, power2InOut], [243, 345, (t) => backOut(t)], [262, 380, (t) => backOut(t)], [205, 290, power2Out], [222, 320, power2Out],
];
const SLIDE = [[470, 625], [355, 505], [470, 625], [315, 445], [415, 565]];
const SENTENCE_ON = 210;
const WORDS = { start: 397, step: 60, dur: 103 };
const ROW_GAP_REM = 125;
const SCRUB_TAU = 0.25;

const seg = (u: number, a: number, b: number) => Math.min(1, Math.max(0, (u - a) / (b - a)));

const TITLE_GLYPHS: Record<string, GlyphSlot> = {
  "о": { k: "o", adv: 0.8, ix: 0.014, asc: 0.72, iw: 0.78, ih: 0.69 },
};
const SENTENCE_GLYPHS: Record<string, GlyphSlot> = {
  "о": { k: "o", adv: 0.8, ix: 0.012, asc: 0.625, iw: 0.78, ih: 0.752 },
};
const OUTLINE: React.CSSProperties = { color: "transparent", WebkitTextStroke: "0.028em #150734" };

function Tile({ t, i, tileRef }: { t: (typeof TILES)[number]; i: number; tileRef: (n: HTMLLIElement | null) => void }) {
  const [showB, setShowB] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let iv = 0;
    const to = window.setTimeout(() => { setShowB((v) => !v); iv = window.setInterval(() => setShowB((v) => !v), 3000); }, 2200 + i * 400);
    return () => { clearTimeout(to); clearInterval(iv); };
  }, [i]);
  const vb = t.shape === "tag" ? "0 0 370 340" : "0 0 340 340";
  const icon = (name: string, on: boolean) => (
    <span className="absolute inset-0" style={{
      transform: `scale(${on ? 1 : 0})`,
      transition: on ? "transform 0.35s cubic-bezier(0.215,0.61,0.355,1) 0.3s" : "transform 0.3s cubic-bezier(0.55,0.055,0.675,0.19)",
    }}>
      <svg viewBox={vb} className="block h-full w-full">{ICONS[name]}</svg>
    </span>
  );
  return (
    <li ref={tileRef} className={`relative shrink-0 will-change-transform ${t.shape === "tag" ? "aspect-[412/360]" : "aspect-square"} h-[min(66rem,9vh)] md:h-[min(128rem,11vh)] lg:h-full lg:max-h-[calc(0.194401*(-20px-96rem+min(100vw,1920rem)))]`}>
      <svg viewBox={vb} className="absolute inset-0 block h-full w-full" aria-hidden><TileShape shape={t.shape} color={t.color} /></svg>
      {icon(t.a, !showB)}
      {icon(t.b, showB)}
    </li>
  );
}

export default function About() {
  const wrap = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLElement>(null);
  const tiles = useRef<(HTMLLIElement | null)[]>([]);
  const slots = useRef<(HTMLSpanElement | null)[]>([]);
  const words = useRef<{ el: HTMLSpanElement | null; line: number; dir: number }[]>([]);
  const fades = useRef<(HTMLElement | null)[]>([]);
  const sentence = useRef<HTMLDivElement>(null);
  const entered = useInViewToggle(wrap);
  const desktop = useDesktop();
  const l1 = useLineProgress(entered, 0);
  const l2 = useLineProgress(entered, 0.3);

  useEffect(() => {
    type Pt = { x: number; y: number; w: number };
    let base: Pt[] = [], slot: Pt[] = [], W = 0, H = 0, rem = 1;
    const measure = () => {
      const st = stage.current!.getBoundingClientRect();
      tiles.current.forEach((el) => el && (el.style.transform = "none"));
      const c = (el: Element): Pt => { const r = el.getBoundingClientRect(); return { x: r.left - st.left + r.width / 2, y: r.top - st.top + r.height / 2, w: r.width }; };
      base = tiles.current.map((el) => c(el!));
      slot = slots.current.map((el) => c(el!));
      W = st.width; H = st.height;
      rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    };
    const render = (u: number) => {
      fades.current.forEach((el, j) => {
        if (!el) return;
        const p = power1In(seg(u, INTRO_FADE[j][0], INTRO_FADE[j][1]));
        el.style.transform = p ? `translate3d(0, ${-60 * p}px, 0)` : "";
        el.style.opacity = `${1 - p}`;
      });
      TILES.forEach((t, i) => {
        const el = tiles.current[i]; if (!el) return;
        const b = base[i], s = slot[t.slot];
        const cx = W / 2 + (i - 2) * ROW_GAP_REM * rem, cy = H / 2;
        const pa = power2InOut(seg(u, GATHER.start[i], GATHER.start[i] + GATHER.dur));
        const pb = DROP[i][2](seg(u, DROP[i][0], DROP[i][1]));
        const pc = sineInOut(seg(u, SLIDE[i][0], SLIDE[i][1]));
        const x = b.x + (cx - b.x) * pa + (s.x - cx) * pc;
        const y = b.y + (cy - b.y) * pa + (s.y - cy) * pb;
        const sc = 1 + (s.w / b.w - 1) * pa;
        el.style.transform = `translate3d(${x - b.x}px, ${y - b.y}px, 0) scale(${sc})`;
      });
      if (sentence.current) sentence.current.style.opacity = u >= SENTENCE_ON ? "1" : "0";
      words.current.forEach(({ el, line, dir }) => {
        if (!el) return;
        const a = WORDS.start + WORDS.step * line;
        const p = power1Out(seg(u, a, a + WORDS.dur));
        el.style.transform = `translate3d(${dir * 50 * (1 - p)}px, 0, 0)`;
        el.style.opacity = `${Math.min(1, p / 0.2)}`;
      });
    };

    let raf = 0, last = performance.now(), uS = NaN;
    const target = () => (-wrap.current!.getBoundingClientRect().top / window.innerHeight) * 900;
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000); last = now;
      const u = target();
      uS = Number.isNaN(uS) ? u : uS + (u - uS) * (1 - Math.exp(-dt / SCRUB_TAU));
      if (Math.abs(u - uS) < 0.05) uS = u;
      render(uS);
      raf = requestAnimationFrame(tick);
    };
    measure();
    raf = requestAnimationFrame(tick);
    const ro = new ResizeObserver(() => { measure(); render(uS || 0); });
    ro.observe(stage.current!);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  let wi = 0, si = 0;
  words.current = [];
  return (
    <div ref={wrap} id="about" className="relative h-[185svh] mb-[-8svh]">
      <section ref={stage} className="sticky top-0 flex h-[100svh] min-h-[100vh] flex-col justify-start overflow-hidden bg-lilac pb-[min(48rem,4vh)] pt-[min(98rem,8vh)] text-ink md:pt-[min(92rem,6vh)] lg:pt-[min(60rem,5vh)]">
        <div className="relative mx-auto w-full max-w-[1920rem] px-[16rem] md:pl-[24rem] md:pr-[25rem] lg:px-[48rem]">
          <h3 ref={(n) => { fades.current[0] = n; }} className="mb-[47rem] text-[13rem] font-bold uppercase leading-[1.5] md:mb-[min(92rem,6vh)] md:text-[18rem] lg:mb-0 lg:text-[15rem]">
            {about.label}
          </h3>
          <h2 ref={(n) => { fades.current[1] = n; }} aria-label={about.title.map(plain).join(" ")}
            style={fitSpacing()} className="display flex flex-col items-stretch text-[44rem] leading-none md:mt-[85rem] md:text-[86rem] md:leading-[1.02] lg:text-[156rem] lg:leading-[0.85]">
            <Frag p={l1} d={0.919} off={0.3} className="block"><GlyphText text={about.title[0]} glyphs={TITLE_GLYPHS} lh={desktop ? 0.85 : 1} /></Frag>
            <Frag p={l2} d={0.919} off={0.3} className={`block text-right lg:mt-[10rem] lg:whitespace-nowrap ${capMarkGap(about.title[1], 1)}`}><GlyphText text={about.title[1]} glyphs={TITLE_GLYPHS} lh={desktop ? 0.85 : 1} /></Frag>
          </h2>
          <div ref={(n) => { fades.current[2] = n; }} className="mt-[20rem] text-[12rem] leading-[1.2] md:mt-[45rem] md:text-[16rem] lg:pl-[591rem] lg:text-[19rem]">
            <p className="mb-[14rem] max-w-[760rem] font-medium md:mb-[18rem] lg:mb-[22rem]">{about.text}</p>
            <ul className="flex flex-wrap gap-[8rem] md:gap-[12rem]">
              {about.metrics.map((m) => (
                <li key={m.label} className="flex items-baseline gap-[6rem] rounded-[14rem] bg-ink px-[12rem] py-[8rem] text-lilac md:rounded-[18rem] md:px-[16rem] md:py-[10rem] lg:gap-[10rem] lg:px-[20rem] lg:py-[12rem]">
                  <b className="display text-[22rem] leading-none text-lime md:text-[30rem] lg:text-[36rem]">{m.value}</b>{m.label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <ul aria-hidden className="relative z-[2] mt-[min(50rem,6vh)] flex shrink-0 items-center justify-start gap-[5.8rem] px-[16rem] md:mt-[min(100rem,6vh)] md:gap-[10.9rem] md:pl-[24rem] md:pr-[25rem] lg:mt-[min(73rem,6.08vh)] lg:min-h-0 lg:flex-auto lg:justify-center lg:gap-0 lg:px-[32rem]">
          {TILES.map((t, i) => <Tile key={i} t={t} i={i} tileRef={(n) => { tiles.current[i] = n; }} />)}
        </ul>

        <div ref={sentence} className="pointer-events-none absolute inset-x-0 top-0 z-[1] flex h-[100vh] flex-col items-center justify-center px-[16rem] opacity-0 md:px-0">
          <p className="flex flex-col items-center text-[25.9rem] font-bold leading-[0.92] tracking-[-0.04em] md:text-[52rem] lg:text-[110rem]"
            aria-label={about.sentence.map((l) => l.filter((x) => x !== "slot").map(plain).join(" ")).join(" ")}>
            {about.sentence.map((line, li) => {
              let seenSlot = false;
              return (
                <span key={li} aria-hidden className="flex items-center justify-center whitespace-nowrap">
                  {line.map((part, pi) => {
                    if (part === "slot") {
                      const k = si++;
                      seenSlot = true;
                      const tileIdx = TILES.findIndex((t) => t.slot === k);
                      const isTag = TILES[tileIdx]?.shape === "tag";
                      return <span key={pi} ref={(n) => { slots.current[k] = n; }}
                        className={`inline-block shrink-0 ${isTag ? "h-[0.88em] w-[1.01em] lg:h-[97rem] lg:w-[111rem]" : k === 1 ? "h-[0.85em] w-[0.85em] lg:h-[94rem] lg:w-[94rem]" : "h-[0.88em] w-[0.88em] lg:h-[97rem] lg:w-[97rem]"} mx-[0.15em] lg:mx-[16rem] ${k === 2 ? "!mr-0" : ""} ${k === 3 ? "!mr-[0.05em] lg:!mr-[5rem]" : ""} ${k === 4 ? "!ml-[0.05em] lg:!ml-[5rem]" : ""}`} />;
                    }
                    const w = wi++;
                    const dir = seenSlot ? 1 : -1;
                    return (
                      <span key={pi} ref={(n) => { words.current[w] = { el: n, line: li, dir }; }} className="inline-block opacity-0 will-change-transform" style={li % 2 ? OUTLINE : undefined}>
                        <GlyphText text={part} glyphs={SENTENCE_GLYPHS} lh={0.92} extra={0.109} />
                      </span>
                    );
                  })}
                </span>
              );
            })}
          </p>
        </div>
      </section>
    </div>
  );
}

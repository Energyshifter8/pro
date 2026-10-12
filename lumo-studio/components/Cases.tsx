"use client";
import { animate } from "framer-motion";
import { useEffect, useRef } from "react";
import { cases, testimonials } from "@/lib/content";
import { sineInOut } from "@/lib/ease";
import Bubble from "./ui/Bubble";
import CaseArt from "./cases/CaseArt";

// An open book of client reviews. Desktop: drag a page across the spine to turn it
// (0.1875°/px at 1440 wide; released past 90° it completes, otherwise it falls back).
// Below 992px the book is vertical and pages turn upward as you scroll a sticky stage.
// Ten page edges (five per side) frame the book; a large star turns 180° while the
// section crosses the viewport.

const N = testimonials.length;
const pad2 = (n: number) => String(n).padStart(2, "0");

function Star() {
  const pts: string[] = [];
  for (let i = 0; i < 24; i++) {
    const a = (Math.PI * i) / 12 - Math.PI / 2;
    const r = i % 2 ? 190 : i % 4 ? 560 : 686;
    pts.push(`${(686 + r * Math.cos(a)).toFixed(1)},${(686 + r * Math.sin(a)).toFixed(1)}`);
  }
  return <svg viewBox="0 0 1372 1372" className="block h-auto w-full" aria-hidden><polygon points={pts.join(" ")} fill="#104EFF" /></svg>;
}

function Review({ i }: { i: number }) {
  const t = testimonials[i];
  return (
    <>
      <p className="text-center text-[12rem] font-bold">{pad2(i + 1)} / {pad2(N)}</p>
      <div className="flex flex-col items-center">
        <blockquote className="display m-0 text-center text-[40rem] leading-[0.82] tracking-[-0.015em]">
          “{t.quote}”
          <Bubble href="#cases" className="mx-auto mt-[0.75em] flex w-max max-w-full rounded-[10rem] bg-[#222] px-[0.32em] pb-[0.01em] pt-[0.26em] leading-[0.72] text-lime hover:text-ink">
            view case
          </Bubble>
        </blockquote>
        <div className="mt-[22rem] flex items-center gap-[12rem]">
          <span className="flex aspect-square w-[55rem] items-center justify-center rounded-full bg-ink text-[17rem] font-semibold text-white">{t.rating}</span>
          <span className="text-[17rem] font-bold uppercase tracking-[0.06em]">{t.client}</span>
        </div>
        <p className="mt-[33rem] rounded-[170rem] bg-black/[.04] px-[14rem] py-[11rem] text-[12rem] font-bold uppercase leading-none">{t.type}</p>
      </div>
    </>
  );
}

const front = "flex flex-col items-center justify-between border border-black/[.03] bg-lilac text-[#222]";
const back = "border border-black/[.03] bg-lilac p-[18rem]";
const art = (k: number) => {
  const c = cases[k % cases.length];
  return <CaseArt name={c.name} tag={c.tag} color={c.color} className="block h-full w-full rounded-[16rem]" />;
};

// ---------- desktop: drag-to-turn ----------
function DesktopBook() {
  const book = useRef<HTMLOListElement>(null);
  const pages = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const el = book.current!;
    const angle = Array(N - 1).fill(0) as number[];
    const set = (k: number, a: number, z?: number) => {
      angle[k] = a;
      const li = pages.current[k]!;
      li.style.transform = `rotateY(${a}deg)`;
      li.style.zIndex = String(z ?? (a <= -90 ? 10 + k : N - 1 - k));
    };
    let drag: { k: number; x: number; base: number; moved: boolean } | null = null;
    const degPerPx = () => 180 / (1280 * parseFloat(getComputedStyle(document.documentElement).fontSize));
    const down = (e: PointerEvent) => {
      if (e.button !== 0) return;
      const r = el.getBoundingClientRect();
      const right = e.clientX > r.left + r.width / 2;
      const k = right ? angle.findIndex((a) => a > -90) : angle.map((a, i) => (a <= -90 ? i : -1)).filter((i) => i >= 0).pop() ?? -1;
      if (k < 0) return;
      drag = { k, x: e.clientX, base: angle[k] <= -90 ? -180 : 0, moved: false };
    };
    const move = (e: PointerEvent) => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) < 4) return;
      drag.moved = true;
      set(drag.k, Math.max(-180, Math.min(0, drag.base + dx * degPerPx())), 100);
    };
    const up = () => {
      if (!drag) return;
      const { k, moved } = drag;
      drag = null;
      if (!moved) return;
      const from = angle[k], to = from < -90 ? -180 : 0;
      animate(from, to, { duration: 0.34, ease: [0.3, 0.3, 0.5, 1], onUpdate: (v) => set(k, v, 100), onComplete: () => set(k, to) });
    };
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => { el.removeEventListener("pointerdown", down); window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
  }, []);

  const block = (k: number, side: "left" | "right", i: number) => {
    const c = cases[k];
    const pos = [0, 72, 145, 220, 290][i];
    return (
      <a key={k} href="#cases" data-cursor="pointer" aria-label={c.name}
        className={`group absolute top-0 h-full w-[450rem] rounded-[16rem] bg-lilac p-[18rem] transition-[translate] duration-300 ease-[cubic-bezier(0.3,1.25,0.45,1)] ${side === "left" ? "hover:[translate:-20rem]" : "hover:[translate:20rem]"}`}
        style={{ [side]: `${pos}rem`, zIndex: i + 1, transform: `scale(${[0.834, 0.86, 0.89, 0.92, 0.95][i]})` }}>
        {art(k)}
        <span className={`absolute bottom-[30rem] top-[30rem] flex w-[44rem] items-center justify-center overflow-hidden text-[17rem] font-bold uppercase leading-none tracking-[0.14em] text-white transition-[letter-spacing] duration-300 ease-[cubic-bezier(0.3,1.25,0.45,1)] [text-shadow:0_2rem_14rem_rgba(0,0,0,0.65)] [writing-mode:vertical-rl] group-hover:tracking-[0.2em] ${side === "left" ? "left-[22rem]" : "right-[22rem]"}`}>
          {c.name}
        </span>
      </a>
    );
  };

  return (
    <div className="relative w-full select-none">
      <div className="absolute inset-0 z-0">
        {[0, 1, 2, 3, 4].map((i) => block(i, "left", i))}
        {[0, 1, 2, 3, 4].map((i) => block(9 - i, "right", i))}
      </div>
      <ol ref={book} data-cursor="drag" aria-label="Client reviews" className="relative z-[1] flex h-[600rem] justify-center [perspective:1431px] [touch-action:pan-y]">
        <li className="relative flex h-full w-[450rem] translate-x-1/2 flex-row-reverse">
          <div className={`h-full w-full shrink-0 rounded-r-[16rem] px-[28rem] py-[18rem] ${front}`}><Review i={N - 1} /></div>
          <div className={`h-full w-full shrink-0 rounded-l-[16rem] ${back}`}>{art(0)}</div>
        </li>
        {testimonials.slice(0, N - 1).map((_, k) => (
          <li key={k} ref={(n) => { pages.current[k] = n; }} className="absolute left-1/2 top-0 h-full w-[450rem] origin-left [transform-style:preserve-3d]" style={{ zIndex: N - 1 - k }}>
            <div className={`absolute inset-0 rounded-r-[16rem] px-[28rem] py-[18rem] [backface-visibility:hidden] ${front}`}><Review i={k} /></div>
            <div className={`absolute inset-0 rounded-l-[16rem] [backface-visibility:hidden] [transform:rotateY(180deg)] ${back}`}>{art(k + 1)}</div>
          </li>
        ))}
      </ol>
    </div>
  );
}

// ---------- below 992px: scroll-to-turn ----------
function StackedBook({ section }: { section: React.RefObject<HTMLElement> }) {
  const pages = useRef<(HTMLLIElement | null)[]>([]);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const s = section.current;
      if (s) {
        const vh = window.innerHeight;
        const off = -s.getBoundingClientRect().top / vh;
        const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
        const p = pages.current.map((_, k) => sineInOut(Math.min(1, Math.max(0, (off - 0.232 - 0.563 * k) / 0.38))));
        pages.current.forEach((li, k) => {
          if (!li) return;
          const lift = p.slice(0, k).reduce((acc, pj) => acc + (1 - Math.min(1, pj * 2)), 0);
          li.style.transform = `translate3d(0, ${8 * rem * lift}px, 0) rotateX(${180 * p[k]}deg)`;
          li.style.zIndex = String(p[k] > 0.5 ? 10 + k : N - 1 - k);
        });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [section]);

  const edge = (k: number, i: number, below: boolean) => {
    const c = cases[k];
    const inset = [48, 96, 144][i % 3];
    const max = [632, 584, 536][i % 3];
    return (
      <a key={k} href="#cases" aria-label={c.name} data-cursor="pointer"
        className={`group absolute left-1/2 h-[240rem] -translate-x-1/2 rounded-[16rem] bg-lilac px-[18rem] pt-[18rem] transition-[translate] duration-300 ease-[cubic-bezier(0.3,1.25,0.45,1)] ${below ? "hover:[translate:0_-8rem]" : "hover:[translate:0_8rem]"}`}
        style={{ width: `calc(100% - ${inset}rem)`, maxWidth: `${max}rem`, zIndex: 3 - (i % 3), ...(below ? { bottom: `${-60 - 44 * (i % 3)}rem` } : { top: `${-44 - 44 * i}rem` }) }}>
        <div className={below ? "absolute bottom-[18rem] left-[18rem] h-[44rem] w-[calc(100%-36rem)] overflow-hidden rounded-[16rem]" : "h-full overflow-hidden rounded-[16rem]"}>{art(k)}</div>
        <span className={`absolute left-[18rem] right-[18rem] flex h-[26rem] items-center justify-center text-[15rem] font-bold uppercase leading-none tracking-[0.1em] text-white [text-shadow:0_1rem_4rem_rgba(21,7,52,0.9),0_0_12rem_rgba(21,7,52,0.7)] ${below ? "bottom-[18rem]" : "top-[18rem]"}`}>{c.name}</span>
      </a>
    );
  };

  const half = "h-[468rem] md:h-[434rem]";
  return (
    <div className="relative mx-auto w-full max-w-[680rem] select-none [zoom:0.8] md:[zoom:1]">
      <div className="absolute inset-0">
        {[0, 1, 2].map((i) => edge(i, i, false))}
        {[3, 4, 5].map((k, i) => edge(k, i, true))}
      </div>
      <ol aria-label="Client reviews" className="relative z-[1] [perspective:1200rem]">
        <li className="flex flex-col-reverse">
          <div className={`${half} rounded-b-[16rem] px-[28rem] pb-[34rem] pt-[28rem] shadow-[0_16rem_34rem_rgba(20,9,58,0.15)] ${front}`}><Review i={N - 1} /></div>
          <div className={`${half} rounded-t-[16rem] ${back}`}>{art(0)}</div>
        </li>
        {testimonials.slice(0, N - 1).map((_, k) => (
          <li key={k} ref={(n) => { pages.current[k] = n; }} className="absolute inset-x-0 top-1/2 h-1/2 origin-top [transform-style:preserve-3d]" style={{ zIndex: N - 1 - k }}>
            <div className={`absolute inset-0 rounded-b-[16rem] px-[28rem] pb-[34rem] pt-[28rem] shadow-[0_16rem_34rem_rgba(20,9,58,0.15)] [backface-visibility:hidden] ${front}`}><Review i={k} /></div>
            <div className={`absolute inset-0 rounded-t-[16rem] [backface-visibility:hidden] [transform:rotateX(180deg)] ${back}`}>{art(k + 1)}</div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function Cases() {
  const section = useRef<HTMLElement>(null);
  const star = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const r = section.current!.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
      if (star.current) star.current.style.transform = `translate(-50%, -50%) rotate(${180 * p}deg)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section ref={section} id="cases" className="relative z-[1] min-h-[calc(220rem+265svh)] bg-ink pb-[100rem] pt-[120rem] md:min-h-[calc(320rem+280svh)] md:pb-[140rem] md:pt-[180rem] lg:z-0 lg:min-h-0 lg:py-[367rem]">
      <h2 className="sr-only">Cases</h2>
      <div className="sticky top-0 flex h-[calc(100svh-87rem)] items-center justify-center px-[16rem] md:h-[calc(100svh-175rem)] md:px-[24rem] lg:relative lg:h-auto lg:max-w-[1920rem] lg:px-[80rem]">
        <div ref={star} aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 z-[-1] w-[620rem] md:w-[900rem] lg:w-[1100rem]"><Star /></div>
        <div className="hidden w-full lg:block"><DesktopBook /></div>
        <div className="w-full lg:hidden"><StackedBook section={section} /></div>
      </div>
    </section>
  );
}

"use client";
import { useEffect, useRef } from "react";
import { prizes } from "@/lib/olympiad";
import { openRegister } from "@/lib/store";
import { sineInOut } from "@/lib/ease";
import { Frag, useInViewToggle, useLineProgress } from "./ui/LineReveal";
import { fitSpacing } from "./ui/GlyphText";
import Bubble from "./ui/Bubble";
import PrizeArt from "./prizes/PrizeArt";

const P = prizes.places;
const N = P.length;
const rowLabel = (k: number) => `${P[k % N].place} — ${P[k % N].amount}`;
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

function Prize({ i }: { i: number }) {
  const pl = P[i];
  return (
    <>
      <p className="text-center text-[12rem] font-bold">{pad2(i + 1)} / {pad2(N)}</p>
      <div className="flex flex-col items-center">
        <span className="rounded-full px-[16rem] py-[8rem] text-[14rem] font-bold uppercase leading-none tracking-[0.04em] text-ink" style={{ background: pl.color }}>{pl.place}</span>
        <p className="display mt-[18rem] text-center text-[76rem] leading-[0.85]">{pl.amount}</p>
        <ul className="mt-[22rem] flex flex-col gap-[9rem] text-[15rem] font-bold leading-[1.25]">
          {pl.perks.map((k) => (
            <li key={k} className="flex items-start gap-[9rem]">
              <svg viewBox="0 0 20 20" aria-hidden className="mt-[0.1em] h-[1em] w-[1em] shrink-0"><circle cx="10" cy="10" r="10" fill="#150734" /><path d="M5.5 10.2l3 3 6-6.4" stroke={pl.color} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
              {k}
            </li>
          ))}
        </ul>
        <Bubble onClick={openRegister} className="mt-[26rem] flex w-max rounded-[10rem] bg-[#222] px-[16rem] pb-[8rem] pt-[10rem] text-[15rem] font-bold leading-none text-lime hover:text-ink">
          {prizes.cta}
        </Bubble>
      </div>
      <p className="rounded-[170rem] bg-black/[.04] px-[14rem] py-[11rem] text-[12rem] font-bold uppercase leading-none">{prizes.label}</p>
    </>
  );
}

const front = "flex flex-col items-center justify-between border border-black/[.03] bg-lilac text-[#222]";
const back = "border border-black/[.03] bg-lilac p-[18rem]";
const art = (k: number) => {
  const c = P[k % N];
  return <PrizeArt n={(k % N) + 1} place={c.place} amount={c.amount} color={c.color} className="block h-full w-full rounded-[16rem]" />;
};

// Pages turn as the sticky stage scrolls: page k flips over 0.38 viewport heights, starting 0.563·k
// viewport heights after the stage sticks under the title. frame gets each page's 0→1 progress.
function useScrollFlip(section: React.RefObject<HTMLElement>, frame: (p: number[]) => void) {
  useEffect(() => {
    let raf = 0;
    let mb = 0;
    const measure = () => { const h2 = section.current?.querySelector("h2"); mb = h2 ? parseFloat(getComputedStyle(h2).marginBottom) : 0; };
    measure();
    window.addEventListener("resize", measure);
    const tick = () => {
      const s = section.current;
      if (s) {
        const h2 = s.querySelector("h2")!;
        const stick = h2.offsetTop + h2.offsetHeight + mb;
        const off = (-s.getBoundingClientRect().top - stick) / window.innerHeight;
        frame(Array.from({ length: N - 1 }, (_, k) => sineInOut(Math.min(1, Math.max(0, (off - 0.025 - 0.563 * k) / 0.38)))));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", measure); };
  }, [section]); // frame only writes to refs, so the first render's copy is enough
}

function DesktopBook({ section }: { section: React.RefObject<HTMLElement> }) {
  const pages = useRef<(HTMLLIElement | null)[]>([]);

  useScrollFlip(section, (p) => pages.current.forEach((li, k) => {
    if (!li) return;
    li.style.transform = `rotateY(${-180 * p[k]}deg)`;
    li.style.zIndex = String(p[k] > 0.5 ? 10 + k : N - 1 - k);
  }));

  const block = (k: number, side: "left" | "right", i: number) => {
    const pos = [0, 72, 145, 220, 290][i];
    return (
      <a key={k} href="#prizes" data-cursor="pointer" aria-label={rowLabel(k)}
        className={`group absolute top-0 h-full w-[450rem] rounded-[16rem] bg-lilac p-[18rem] transition-[translate] duration-300 ease-[cubic-bezier(0.3,1.25,0.45,1)] ${side === "left" ? "hover:[translate:-20rem]" : "hover:[translate:20rem]"}`}
        style={{ [side]: `${pos}rem`, zIndex: i + 1, transform: `scale(${[0.834, 0.86, 0.89, 0.92, 0.95][i]})` }}>
        {art(k)}
        <span className={`absolute bottom-[30rem] top-[30rem] flex w-[44rem] items-center justify-center overflow-hidden text-[17rem] font-bold uppercase leading-none tracking-[0.14em] text-white transition-[letter-spacing] duration-300 ease-[cubic-bezier(0.3,1.25,0.45,1)] [text-shadow:0_2rem_14rem_rgba(0,0,0,0.65)] [writing-mode:vertical-rl] group-hover:tracking-[0.2em] ${side === "left" ? "left-[22rem]" : "right-[22rem]"}`}>
          {rowLabel(k)}
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
      <ol aria-label={prizes.title} className="relative z-[1] flex h-[600rem] justify-center [perspective:1431px]">
        <li className="relative flex h-full w-[450rem] translate-x-1/2 flex-row-reverse">
          <div className={`h-full w-full shrink-0 rounded-r-[16rem] px-[28rem] py-[18rem] ${front}`}><Prize i={N - 1} /></div>
          <div className={`h-full w-full shrink-0 rounded-l-[16rem] ${back}`}>{art(0)}</div>
        </li>
        {P.slice(0, N - 1).map((_, k) => (
          <li key={k} ref={(n) => { pages.current[k] = n; }} className="absolute left-1/2 top-0 h-full w-[450rem] origin-left [transform-style:preserve-3d]" style={{ zIndex: N - 1 - k }}>
            <div className={`absolute inset-0 rounded-r-[16rem] px-[28rem] py-[18rem] [backface-visibility:hidden] ${front}`}><Prize i={k} /></div>
            <div className={`absolute inset-0 rounded-l-[16rem] [backface-visibility:hidden] [transform:rotateY(180deg)] ${back}`}>{art(k + 1)}</div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function StackedBook({ section }: { section: React.RefObject<HTMLElement> }) {
  const pages = useRef<(HTMLLIElement | null)[]>([]);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const w = wrap.current!, stage = w.closest<HTMLElement>(".sticky")!;
    const fit = () => {
      w.style.transform = "";
      const book = w.querySelector("ol")!.getBoundingClientRect().height;
      const room = stage.clientHeight * 0.92;
      if (book > room) w.style.transform = `scale(${(room / book).toFixed(4)})`;
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(stage);
    return () => ro.disconnect();
  }, []);

  useScrollFlip(section, (p) => {
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    pages.current.forEach((li, k) => {
      if (!li) return;
      const lift = p.slice(0, k).reduce((acc, pj) => acc + (1 - Math.min(1, pj * 2)), 0);
      li.style.transform = `translate3d(0, ${8 * rem * lift}px, 0) rotateX(${180 * p[k]}deg)`;
      li.style.zIndex = String(p[k] > 0.5 ? 10 + k : N - 1 - k);
    });
  });

  const edge = (k: number, i: number, below: boolean) => {
    const inset = [48, 96, 144][i % 3];
    const max = [632, 584, 536][i % 3];
    return (
      <a key={k} href="#prizes" aria-label={rowLabel(k)} data-cursor="pointer"
        className={`group absolute left-1/2 h-[240rem] -translate-x-1/2 rounded-[16rem] bg-lilac px-[18rem] pt-[18rem] transition-[translate] duration-300 ease-[cubic-bezier(0.3,1.25,0.45,1)] ${below ? "hover:[translate:0_-8rem]" : "hover:[translate:0_8rem]"}`}
        style={{ width: `calc(100% - ${inset}rem)`, maxWidth: `${max}rem`, zIndex: 3 - (i % 3), ...(below ? { bottom: `${-60 - 44 * (i % 3)}rem` } : { top: `${-44 - 44 * i}rem` }) }}>
        <div className={below ? "absolute bottom-[18rem] left-[18rem] h-[44rem] w-[calc(100%-36rem)] overflow-hidden rounded-[16rem]" : "h-full overflow-hidden rounded-[16rem]"}>{art(k)}</div>
        <span className={`absolute left-[18rem] right-[18rem] flex h-[26rem] items-center justify-center text-[15rem] font-bold uppercase leading-none tracking-[0.1em] text-white [text-shadow:0_1rem_4rem_rgba(21,7,52,0.9),0_0_12rem_rgba(21,7,52,0.7)] ${below ? "bottom-[18rem]" : "top-[18rem]"}`}>{rowLabel(k)}</span>
      </a>
    );
  };

  const half = "h-[468rem] md:h-[434rem]";
  return (
    <div ref={wrap} className="relative mx-auto w-full max-w-[680rem] select-none [zoom:0.8] md:[zoom:1]">
      <div className="absolute inset-0 z-0">
        {[0, 1, 2].map((i) => edge(i, i, false))}
        {[3, 4, 5].map((k, i) => edge(k, i, true))}
      </div>
      <ol aria-label={prizes.title} className="relative z-[1] [perspective:1200rem]">
        <li className="flex flex-col-reverse">
          <div className={`${half} rounded-b-[16rem] px-[28rem] pb-[34rem] pt-[28rem] shadow-[0_16rem_34rem_rgba(20,9,58,0.15)] ${front}`}><Prize i={N - 1} /></div>
          <div className={`${half} rounded-t-[16rem] ${back}`}>{art(0)}</div>
        </li>
        {P.slice(0, N - 1).map((_, k) => (
          <li key={k} ref={(n) => { pages.current[k] = n; }} className="absolute inset-x-0 top-1/2 h-1/2 origin-top [transform-style:preserve-3d]" style={{ zIndex: N - 1 - k }}>
            <div className={`absolute inset-0 rounded-b-[16rem] px-[28rem] pb-[34rem] pt-[28rem] shadow-[0_16rem_34rem_rgba(20,9,58,0.15)] [backface-visibility:hidden] ${front}`}><Prize i={k} /></div>
            <div className={`absolute inset-0 rounded-t-[16rem] [backface-visibility:hidden] [transform:rotateX(180deg)] ${back}`}>{art(k + 1)}</div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function Prizes() {
  const section = useRef<HTMLElement>(null);
  const star = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const tp = useLineProgress(useInViewToggle(title), 0);

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
    <section ref={section} id="prizes" className="relative z-[1] min-h-[calc(320rem+210svh)] bg-ink pb-[100rem] pt-[110rem] md:min-h-[calc(420rem+225svh)] md:pb-[140rem] md:pt-[160rem] lg:z-0 lg:min-h-[calc(410rem+215svh)] lg:pb-[200rem] lg:pt-[220rem]">
      <h2 ref={title} style={fitSpacing()} className="display relative z-[2] mb-[76rem] text-center text-[54rem] leading-[0.85] text-lilac md:text-[100rem] md:mb-[90rem] lg:mb-0 lg:text-[160rem]">
        <Frag p={tp} d={0.92} off={0.3} className="block">{prizes.title}</Frag>
      </h2>
      <div className="sticky top-0 flex h-[calc(100svh-87rem)] items-center justify-center px-[16rem] md:h-[calc(100svh-175rem)] md:px-[24rem] lg:h-[calc(100svh-150rem)] lg:max-w-[1920rem] lg:px-[80rem]">
        <div ref={star} aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 z-[-1] w-[620rem] md:w-[900rem] lg:w-[1100rem]"><Star /></div>
        <div className="hidden w-full lg:block"><DesktopBook section={section} /></div>
        <div className="w-full lg:hidden"><StackedBook section={section} /></div>
      </div>
    </section>
  );
}

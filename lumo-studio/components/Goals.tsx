"use client";
import { useEffect, useRef } from "react";
import { goals } from "@/lib/olympiad";
import { openRegister } from "@/lib/store";
import { Frag, useInViewToggle, useLineProgress } from "./ui/LineReveal";
import { GlyphText, capMarkGap, fitSpacing, plain } from "./ui/GlyphText";
import Bubble from "./ui/Bubble";

const WAVE =
  "M0 6C83.3 16.2 166.7 25.7 250 36.5C333.3 47.3 416.7 60.3 500 71C550 77.5 600 83.2 650 89C683.3 92.9 716.7 97 750 100.4C816.7 107.1 883.3 113.8 950 118C983.3 120.1 1016.7 121.8 1050 121.8C1083.3 121.8 1116.7 118 1150 114.7C1200 109.8 1250 102.5 1300 95.7C1333.3 91.2 1366.7 86.1 1400 81.2C1450 73.8 1500 66 1550 58.5C1583.3 53.5 1616.7 48.4 1650 43.5C1683.3 38.6 1716.7 33.5 1750 29.1C1800 22.5 1850 15.7 1900 11C1933.3 7.9 1966.7 6.1 2000 4.4C2033.3 2.7 2066.7 1.6 2100 0.9C2133.3 0.2 2166.7 0.2 2200 0.2C2238.3 0.2 2276.7 1.1 2315 1.6V160H0Z";

type Color = (typeof goals.cards)[number]["color"];
type Card = (typeof goals.cards)[number];

// Original card icons (256rem square).
function CardIcon({ variant }: { variant: Color }) {
  const c = variant === "lav" ? "#4e00ff" : "#150734";
  return (
    <svg viewBox="0 0 256 256" className="inline h-auto w-full align-baseline" aria-hidden>
      {variant === "lime" && (
        <g fill={c}>{Array.from({ length: 8 }, (_, i) => <rect key={i} x="110" y="8" width="36" height="120" rx="18" transform={`rotate(${i * 45} 128 128)`} />)}</g>
      )}
      {variant === "lav" && (
        <g fill={c}>{Array.from({ length: 6 }, (_, i) => <ellipse key={i} cx="128" cy="62" rx="34" ry="58" transform={`rotate(${i * 60} 128 128)`} />)}<circle cx="128" cy="128" r="30" /></g>
      )}
      {variant === "sun" && (
        <g fill="none" stroke={c} strokeWidth="26">{[0, 1, 2, 3].map((i) => <circle key={i} cx={128 + 44 * Math.cos((i * Math.PI) / 2)} cy={128 + 44 * Math.sin((i * Math.PI) / 2)} r="58" />)}</g>
      )}
    </svg>
  );
}

const CARD = {
  lime: { box: "bg-lime text-ink", btn: "bg-ink text-lime hover:text-white", circle: "bg-pink" },
  lav: { box: "bg-[#d9ccff] text-ink", btn: "bg-ink text-[#d9ccff] hover:text-white", circle: "bg-violet" },
  sun: { box: "bg-[#fbd402] text-ink", btn: "bg-ink text-[#fbd402] hover:text-white", circle: "bg-pink" },
} as const;

const pad = "px-[30rem] pb-[40rem] pt-[50rem] md:px-[40rem] md:pb-[60rem] md:pt-[50rem] lg:px-[50rem] lg:py-[78rem]";

function CardBody({ s }: { s: Card }) {
  const v = CARD[s.color];
  return (
    <>
      <h3 className="text-center text-[26rem] font-bold leading-[0.92] md:text-[40rem] lg:text-[65rem]">{s.title[0]}<br />{s.title[1]}</h3>
      <p className="mt-[14rem] text-center text-[12rem] md:mt-[18rem] md:text-[16rem] lg:mt-[32rem] lg:text-[19rem]">{s.text}</p>
      <div className="mt-[24rem] w-[170rem] md:mt-[30rem] md:w-[256rem] lg:mt-[42rem]"><CardIcon variant={s.color} /></div>
      <Bubble onClick={openRegister} circle={v.circle}
        className={`mt-[28rem] rounded-[90rem] px-[24rem] py-[16rem] text-[12rem] font-bold leading-[1.5] md:mt-[43rem] md:px-[30rem] md:py-[20rem] md:text-[15rem] ${v.btn}`}>
        {goals.cta}
      </Bubble>
    </>
  );
}

// Cards travel into place while the list's top moves from the viewport bottom to 45% of
// its height (linear scrub): on desktop the outer cards rise from +55% / +50% of card height,
// and the middle one drops from -50% while spinning 360° around Y; stacked, only the middle
// one moves (from -30%). The full goal statement follows the cards.
export default function Goals() {
  const title = useRef<HTMLHeadingElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const cards = useRef<(HTMLLIElement | null)[]>([]);
  const seen = useInViewToggle(title);
  const lines = [useLineProgress(seen, 0), useLineProgress(seen, 0.3), useLineProgress(seen, 0.6)];

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 992px)");
    let raf = 0, last = performance.now(), pS = NaN;
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000); last = now;
      const vh = window.innerHeight;
      const top = list.current!.getBoundingClientRect().top;
      const p = Math.min(1, Math.max(0, (vh - top) / (vh * 0.55)));
      pS = Number.isNaN(pS) ? p : pS + (p - pS) * (1 - Math.exp(-dt / 0.15));
      const q = 1 - pS;
      const [g, pk, vi] = cards.current;
      if (pk) pk.style.transform = `translate3d(0, ${-(desktop.matches ? 0.5 : 0.3) * pk.offsetHeight * q}px, 0) rotateY(${360 * pS}deg)`;
      if (g) g.style.transform = desktop.matches && q ? `translate3d(0, ${0.55 * g.offsetHeight * q}px, 0)` : "";
      if (vi) vi.style.transform = desktop.matches && q ? `translate3d(0, ${0.5 * vi.offsetHeight * q}px, 0)` : "";
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section id="goals" className="relative bg-[linear-gradient(180deg,#d3c5f6,#d3c5f6_330rem,#150734_330rem)] pb-[120rem] pt-[80rem] md:bg-[linear-gradient(180deg,#d3c5f6,#d3c5f6_480rem,#150734_480rem)] md:pb-[140rem] md:pt-[180rem] lg:bg-[linear-gradient(180deg,#d3c5f6,#d3c5f6_28.5%,#150734_28.5%)] lg:pb-[355rem] lg:pt-[155rem]">
      <div aria-hidden className="absolute inset-x-0 top-[330rem] z-0 -translate-y-full bg-[linear-gradient(180deg,#d3c5f6,#d3c5f6_95%,#150734_95%)] pt-[200rem] leading-[0] md:top-[480rem] lg:top-1/4 lg:translate-y-0">
        <svg viewBox="0 0 2315 160" className="block h-auto w-full"><path d={WAVE} fill="#150734" /></svg>
      </div>
      <div className="relative mx-auto w-full max-w-[1920rem] px-[16rem] md:px-[80rem]">
        <p className="text-center text-[13rem] font-bold uppercase leading-[1.5] text-ink md:text-[18rem] lg:text-[15rem]">{goals.label}</p>
        <h2 ref={title} aria-label={goals.title.map(plain).join(" ")} style={fitSpacing()}
          className="display mx-auto mt-[14rem] max-w-[6em] text-center text-[40rem] leading-[0.85] text-ink md:mt-[20rem] md:text-[56rem] lg:mt-[24rem] lg:text-[100rem]">
          {goals.title.map((l, i) => (
            <Frag key={i} p={lines[i]} d={0.981} off={0.3} className={`block ${i ? "mt-[0.06em]" : ""} ${capMarkGap(l, i)}`}><GlyphText text={l} /></Frag>
          ))}
        </h2>
        <ul ref={list} className="mt-[40rem] flex flex-col gap-[20rem] md:mt-[170rem] lg:mt-[500rem] lg:flex-row lg:justify-between lg:gap-[45rem] lg:[perspective:1600px]">
          {goals.cards.map((s, i) => {
            const v = CARD[s.color];
            const ref = (n: HTMLLIElement | null) => { cards.current[i] = n; };
            if (i === 1)
              return (
                <li key={s.title.join()} ref={ref} className="relative mx-auto w-[358rem] shrink-0 rounded-[37rem] [transform-style:preserve-3d] max-lg:order-first md:w-[458rem] lg:mx-0 lg:w-auto lg:flex-1 lg:px-[50rem] lg:py-[78rem]">
                  <div className={`relative flex h-full flex-col items-center justify-between rounded-[inherit] [backface-visibility:hidden] lg:absolute lg:inset-0 ${pad} ${v.box}`}><CardBody s={s} /></div>
                  <div aria-hidden className={`absolute inset-0 rounded-[inherit] [backface-visibility:hidden] [transform:rotateY(180deg)] ${v.box}`} />
                </li>
              );
            return (
              <li key={s.title.join()} ref={ref} className={`mx-auto flex w-[358rem] shrink-0 flex-col items-center justify-between rounded-[37rem] md:w-[458rem] lg:mx-0 lg:w-auto lg:flex-1 ${pad} ${v.box}`}>
                <CardBody s={s} />
              </li>
            );
          })}
        </ul>
        <p className="mx-auto mt-[40rem] max-w-[1180rem] text-center text-[15rem] leading-[1.45] text-lilac md:mt-[70rem] md:text-[20rem] lg:mt-[110rem] lg:text-[30rem] lg:leading-[1.35]">{goals.full}</p>
      </div>
    </section>
  );
}

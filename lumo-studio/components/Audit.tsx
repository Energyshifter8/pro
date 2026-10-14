"use client";
import { animate, useMotionValue, useMotionValueEvent, type MotionValue } from "framer-motion";
import { useEffect, useRef } from "react";
import { audit } from "@/lib/content";
import { ui } from "@/lib/store";
import { power2Out } from "@/lib/ease";
import { Frag, useInViewToggle, useLineProgress } from "./ui/LineReveal";
import { GlyphText, capMarkGap, fitSpacing, type GlyphSlot } from "./ui/GlyphText";
import ArrowButton from "./ui/ArrowButton";

// Cyrillic в / а drawn as the stretched Plex B / a.
const GLYPHS: Record<string, GlyphSlot> = {
  "в": { k: "B", adv: 0.62, ix: 0.03, asc: 0.741, iw: 0.56, ih: 0.752 },
  "а": { k: "a", adv: 0.83, ix: 0.011, asc: 0.741, iw: 0.81, ih: 0.752 },
};

// Cards in DOM order; positions per breakpoint relative to the title box (the stacked
// layouts use a centred 744/390rem frame).
const CARDS = [
  { cls: "bg-blue text-[#ffe1ed] top-[149rem] left-[100rem] md:top-[-83rem] md:left-[286rem] lg:top-[-110rem] lg:left-[390rem]", bar: "bg-ink/20" },
  { cls: "bg-pink text-[#ffe1ed] hidden md:block md:top-[66rem] md:left-[61rem] lg:top-[105rem] lg:left-[870rem]", bar: "bg-ink/20" },
  { cls: "bg-[#fbd402] text-ink top-[91rem] left-[46rem] md:top-[180rem] md:left-[414rem] lg:top-[230rem] lg:left-[230rem]", bar: "bg-white" },
  { cls: "bg-lime text-ink top-[282rem] left-[27rem] md:top-[318rem] md:left-[146rem] lg:top-[360rem] lg:left-auto lg:right-0", bar: "bg-white" },
  { cls: "bg-[#e1611c] text-lilac top-[391rem] left-[179rem] md:bg-violet md:top-[420rem] md:left-[330rem] lg:top-[365rem] lg:left-[-80rem]", bar: "bg-ink/20" },
];

function Card({ i, p }: { i: number; p: MotionValue<number> }) {
  const card = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const { label, value } = audit.scores[i];
  // p runs 0→1.7s of the card's own timeline: pop 0–0.6s, counter 0.2–1.2s, bar 0.3–1.3s
  useMotionValueEvent(p, "change", (t) => {
    const pop = power2Out(Math.min(1, Math.max(0, t / 0.6)));
    const cnt = power2Out(Math.min(1, Math.max(0, (t - 0.2) / 1)));
    const fill = power2Out(Math.min(1, Math.max(0, (t - 0.3) / 1)));
    if (card.current) { card.current.style.scale = String(0.5 + 0.5 * pop); card.current.style.opacity = String(pop); }
    if (num.current) num.current.textContent = `${Math.round(value * cnt)}%`;
    if (bar.current) bar.current.style.width = `${10 + (value - 10) * fill}%`;
  });
  return (
    <div ref={card} className={`absolute w-[190.6rem] rounded-[9.8rem] border-[1.2rem] border-current px-[9.8rem] pb-[9.8rem] pt-[7.9rem] opacity-0 [scale:0.5] md:w-auto md:min-w-[312rem] md:rounded-[16rem] md:border-[2rem] md:px-[16rem] md:pb-[16rem] md:pt-[13rem] lg:py-[18rem] ${CARDS[i].cls}`} data-card={i}>
      <p className="flex items-center text-[12.2rem] font-semibold leading-none md:text-[20rem] lg:leading-[1.2]">
        <span aria-hidden className="mr-[14rem] inline-block h-[14rem] w-[14rem] rounded-full border-[2rem] border-ink bg-lime" />
        {label}
        <span ref={num} className="ml-auto">0%</span>
      </p>
      <div className={`mt-[7.9rem] flex h-[3rem] overflow-hidden rounded-[10rem] md:mt-[13rem] md:h-[5rem] lg:mt-[20rem] ${CARDS[i].bar}`}>
        <div ref={bar} className="h-full min-w-[5%] rounded-[inherit] bg-current" style={{ width: "10%" }} />
      </div>
    </div>
  );
}

// Title lines reveal on view; once the section's top reaches mid-viewport the score cards
// pop in one after another (0.15s apart) while their counters and bars fill, and the whole
// sequence plays backwards once the section has mostly scrolled past. Cards drift with the
// pointer at different depths.
export default function Audit() {
  const sec = useRef<HTMLElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const deco = useRef<HTMLDivElement>(null);
  const seen = useInViewToggle(title);
  const lines = [useLineProgress(seen, 0), useLineProgress(seen, 0.3), useLineProgress(seen, 0.6)];
  const tl = useMotionValue(0); // master timeline in seconds (0 → 2.3)
  const cardT = [useMotionValue(0), useMotionValue(0), useMotionValue(0), useMotionValue(0), useMotionValue(0)];
  useMotionValueEvent(tl, "change", (t) => cardT.forEach((m, i) => m.set(Math.max(0, t - 0.15 * i))));

  useEffect(() => {
    let on = false, raf = 0, ctl: ReturnType<typeof animate> | null = null;
    // pointer parallax: each card gets a random depth (0.02–0.10 of the pointer's offset
    // from the viewport centre), re-rolled per page load like the reference
    const depth = CARDS.map(() => 0.02 + Math.random() * 0.08);
    const mouse = { x: 0, y: 0 }, pos = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => { mouse.x = e.clientX - window.innerWidth / 2; mouse.y = e.clientY - window.innerHeight / 2; };
    window.addEventListener("pointermove", onMove, { passive: true });
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000); last = now;
      const r = sec.current!.getBoundingClientRect(), vh = window.innerHeight;
      const inside = r.top < vh * 0.5 && r.bottom > vh * 0.72;
      if (inside !== on) {
        on = inside;
        ctl?.stop();
        const to = inside ? 2.3 : 0;
        ctl = animate(tl, to, { duration: Math.abs(to - tl.get()), ease: "linear" });
      }
      const k = 1 - Math.exp(-dt / 0.12);
      pos.x += (mouse.x - pos.x) * k; pos.y += (mouse.y - pos.y) * k;
      deco.current?.querySelectorAll<HTMLElement>("[data-card]").forEach((el) => {
        const d = depth[+el.dataset.card!];
        el.style.translate = `${pos.x * d}px ${pos.y * d}px`;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("pointermove", onMove); ctl?.stop(); };
  }, [tl]);

  return (
    <section ref={sec} id="audit" className="relative flex items-center justify-center pb-[120rem] pt-[150rem] md:pb-[140rem] md:pt-[180rem] lg:min-h-[max(1200rem,100svh)] lg:pb-[100rem] lg:pt-[258rem]">
      <div className="relative flex flex-col items-center justify-center px-[16rem] md:px-[24rem] lg:px-[80rem]">
        <div className="relative pb-[63rem] pt-[189rem] md:p-0">
          <h2 ref={title} aria-label={audit.title.join(" ").replace(/[{}]/g, "")} style={fitSpacing()}
            className="display text-center text-[74rem] leading-[0.8] text-lilac md:text-[145rem] lg:text-[250rem]">
            {audit.title.map((l, i) => (
              <Frag key={i} p={lines[i]} d={0.92} off={0.3} className={`block ${capMarkGap(l, i)}`}><GlyphText text={l} glyphs={GLYPHS} lh={0.8} fit /></Frag>
            ))}
          </h2>
          <div ref={deco} aria-hidden className="pointer-events-none absolute inset-y-0 left-1/2 ml-[-195rem] w-[390rem] [perspective:1000px] md:ml-[-372rem] md:w-[744rem] lg:inset-0 lg:ml-0 lg:w-auto">
            {CARDS.map((_, i) => <Card key={i} i={i} p={cardT[i]} />)}
          </div>
        </div>
        <ArrowButton onClick={() => ui.set({ contact: true })}
          className="mt-[50rem] gap-[3rem] text-[16rem] font-bold lowercase leading-[1.2] [--arrow-size:49rem] md:mt-[175rem] md:text-[20rem] md:[--arrow-size:60rem] lg:mt-[96rem] lg:text-[19rem] lg:[--arrow-size:70.8rem]"
          pillClass="rounded-[210rem] bg-white px-[28rem] py-[14.9rem] text-ink md:px-[34rem] md:py-[18rem] lg:px-[31rem] lg:py-[24rem]"
          arrowClass="bg-lime text-ink">
          {audit.cta}
        </ArrowButton>
      </div>
    </section>
  );
}

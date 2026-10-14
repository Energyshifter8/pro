"use client";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { olympiad as o } from "@/lib/olympiad";
import { brand } from "@/lib/content";
import { openRegister } from "@/lib/store";
import { outQuint } from "@/lib/ease";
import { Frag, useInViewToggle, useLineProgress } from "./ui/LineReveal";
import { fitSpacing } from "./ui/GlyphText";
import ArrowButton from "./ui/ArrowButton";
import Wave from "./Wave";
import { BankRows, Reference } from "./olympiad/BankInfo";

// Programming Olympiad section (copy in lib/olympiad.ts). On ink: intro with the spinning
// participants burst and countdown, goal card, prize podium, fee + bank card, sponsor and
// organizer cards, FAQ accordion, then a lime call-to-action band between two waves.
// Display headings rise through the site's line mask; cards fade up once on entering view.

// Star/scallop polygon in a 100×100 box (as on the hero stickers).
function star(n: number, inner: number, r = 44) {
  const pts: string[] = [];
  for (let i = 0; i < n * 2; i++) {
    const a = (Math.PI * i) / n - Math.PI / 2;
    const rr = i % 2 ? r * inner : r;
    pts.push(`${(50 + rr * Math.cos(a)).toFixed(2)},${(50 + rr * Math.sin(a)).toFixed(2)}`);
  }
  return pts.join(" ");
}

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div className={className} initial={reduce ? false : { opacity: 0, y: "60rem" }} whileInView={{ opacity: 1, y: "0rem" }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }} transition={{ duration: 0.9, delay, ease: outQuint }}>
      {children}
    </motion.div>
  );
}

// Display heading line that rises on view (replays on re-entry, like the other headings).
function useReveal<T extends Element>(delay = 0) {
  const ref = useRef<T>(null);
  return [ref, useLineProgress(useInViewToggle(ref), delay)] as const;
}

function Head({ n, title }: { n: string; title: string }) {
  const [ref, p] = useReveal<HTMLHeadingElement>();
  return (
    <div className="flex items-end justify-between gap-[16rem] border-b-[2rem] border-lilac/15 pb-[14rem] md:pb-[22rem] lg:pb-[30rem]">
      <h3 ref={ref} style={fitSpacing()} className="display text-[46rem] leading-[0.85] text-lilac md:text-[84rem] lg:text-[140rem]">
        <Frag p={p} d={0.92} off={0.3} className="block">{title}</Frag>
      </h3>
      <span className="shrink-0 pb-[0.2em] text-[13rem] font-bold md:text-[18rem] lg:text-[22rem]">{n}</span>
    </div>
  );
}

function LogoDisc({ className = "" }: { className?: string }) {
  return (
    <span className={`block shrink-0 rounded-full bg-white p-[2.5rem] ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={o.organizer.logo} alt="" width={88} height={88} className="block h-full w-full rounded-full" />
    </span>
  );
}

// Sponsor logo; falls back to the name when the file is missing (also if it failed before hydration).
function SponsorLogo({ src, name }: { src: string; name: string }) {
  const img = useRef<HTMLImageElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => { const el = img.current; if (el?.complete && el.naturalWidth === 0) setFailed(true); }, []);
  if (failed) return <span className="display text-center text-[30rem] leading-[0.9] text-ink md:text-[40rem] lg:text-[54rem]">{name}</span>;
  // eslint-disable-next-line @next/next/no-img-element
  return <img ref={img} src={src} alt={name} onError={() => setFailed(true)} className="block max-h-full max-w-full object-contain" />;
}

function Countdown() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    if (!o.startsAt) return;
    setNow(Date.now());
    const iv = window.setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(iv);
  }, []);
  const pill = "inline-flex min-h-[44rem] items-center gap-[10rem] rounded-full border-[2rem] border-lilac/25 bg-white/[.06] px-[18rem] py-[10rem] text-[13rem] font-bold text-white md:min-h-[58rem] md:px-[24rem] md:text-[17rem] lg:min-h-[83rem] lg:gap-[14rem] lg:px-[34rem] lg:text-[20rem]";
  const dot = <span aria-hidden className="h-[8rem] w-[8rem] shrink-0 animate-pulse rounded-full bg-lime lg:h-[12rem] lg:w-[12rem]" />;
  if (!o.startsAt) return <p className={pill}>{dot}{o.dateSoon}</p>;
  const left = now === null ? null : Math.max(0, new Date(o.startsAt).getTime() - now);
  if (left === 0) return <p className={pill}>{dot}{o.started}</p>;
  const parts = left === null ? null : [Math.floor(left / 864e5), Math.floor(left / 36e5) % 24, Math.floor(left / 6e4) % 60, Math.floor(left / 1e3) % 60];
  return (
    <p className={`${pill} gap-[14rem] lg:gap-[22rem]`} role="timer">
      {o.units.map((u, i) => (
        <span key={u} className="inline-flex items-baseline gap-[5rem]">
          <b className="display text-[1.5em] leading-none text-lime [font-variant-numeric:tabular-nums]">{parts ? String(parts[i]).padStart(2, "0") : "--"}</b>{u}
        </span>
      ))}
    </p>
  );
}

function Intro() {
  const ref = useRef<HTMLHeadingElement>(null);
  const seen = useInViewToggle(ref);
  const l1 = useLineProgress(seen, 0), l2 = useLineProgress(seen, 0.3);
  const words = o.title.split(" ");
  return (
    <div className="relative">
      <Reveal>
        <p className="inline-flex items-center gap-[10rem] rounded-full border-[2rem] border-lilac/25 bg-white/[.06] py-[6rem] pl-[6rem] pr-[16rem] text-[11rem] font-bold uppercase leading-none tracking-[0.04em] text-white md:text-[14rem] lg:gap-[14rem] lg:py-[8rem] lg:pl-[8rem] lg:pr-[26rem] lg:text-[17rem]">
          <LogoDisc className="h-[28rem] w-[28rem] md:h-[34rem] md:w-[34rem] lg:h-[44rem] lg:w-[44rem]" />
          {o.organizerPill}
        </p>
      </Reveal>
      <h2 ref={ref} aria-label={`${o.title} ${o.year}`} style={fitSpacing()}
        className="display relative z-[1] mt-[24rem] text-[46rem] leading-[0.86] text-lilac md:mt-[36rem] md:text-[90rem] lg:mt-[48rem] lg:text-[220rem]">
        <Frag p={l1} d={0.92} off={0.3} className="block">{words[0]}</Frag>
        <Frag p={l2} d={0.92} off={0.3} className="block">{words.slice(1).join(" ")} <span className="text-lime max-md:block">{o.year}</span></Frag>
      </h2>
      <div aria-hidden className="pointer-events-none absolute right-[14rem] top-[90rem] z-[2] w-[108rem] md:right-[-10rem] md:top-[160rem] md:w-[130rem] lg:right-[10rem] lg:top-[250rem] lg:w-[280rem]">
        <svg viewBox="0 0 100 100" className="block w-full animate-[spin_30s_linear_infinite] text-pink">
          <polygon points={star(16, 0.8)} fill="currentColor" stroke="currentColor" strokeWidth={6} strokeLinejoin="round" />
        </svg>
        <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-center text-[10rem] font-semibold leading-[1.2] text-white md:text-[13rem] lg:text-[24rem]">
          <span className="display block text-[24rem] leading-[1] md:text-[34rem] lg:text-[70rem]">{o.participants}</span>{o.participantsLabel}
        </p>
      </div>
      <Reveal delay={0.15}>
        <p className="mt-[20rem] max-w-[760rem] text-[16rem] leading-[1.3] text-white md:mt-[28rem] md:text-[22rem] lg:mt-[44rem] lg:text-[30rem]">{o.tagline}</p>
        <div className="mt-[24rem] flex flex-wrap items-center gap-[12rem] md:mt-[32rem] md:gap-[16rem] lg:mt-[48rem] lg:gap-[24rem]">
          <Countdown />
          <ArrowButton onClick={openRegister}
            className="gap-[3rem] text-[16rem] font-bold lowercase leading-[1.2] [--arrow-size:44rem] md:text-[20rem] md:[--arrow-size:58rem] lg:text-[19rem] lg:[--arrow-size:70.8rem]"
            pillClass="rounded-[210rem] bg-lime px-[24rem] py-[12rem] text-ink md:px-[32rem] md:py-[17rem] lg:px-[31rem] lg:py-[24rem]"
            arrowClass="bg-white text-ink">
            {o.registerButton}
          </ArrowButton>
        </div>
      </Reveal>
    </div>
  );
}

// Eight rounded bars, as in the footer band (slowly turning here).
function Mark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 191 191" aria-hidden className={`block animate-[spin_40s_linear_infinite] ${className}`}>
      <g fill="currentColor">{Array.from({ length: 8 }, (_, i) => <rect key={i} x="84" y="6" width="23" height="62" rx="11.5" transform={`rotate(${i * 45} 95.5 95.5)`} />)}</g>
    </svg>
  );
}

function Goal() {
  return (
    <div className="mt-[70rem] grid gap-[20rem] md:mt-[110rem] lg:mt-[190rem] lg:grid-cols-2 lg:gap-[40rem]">
      <Reveal className="flex flex-col justify-center">
        <p className="text-[22rem] font-bold leading-[1.12] tracking-[-0.02em] text-white md:text-[34rem] lg:text-[50rem]">{o.intro}</p>
      </Reveal>
      <Reveal delay={0.1} className="relative overflow-hidden rounded-[36rem] bg-lime p-[26rem] text-ink md:p-[44rem] lg:p-[60rem]">
        <Mark className="pointer-events-none absolute right-[-50rem] top-[-50rem] w-[170rem] text-ink/[.08] md:w-[240rem] lg:right-[-70rem] lg:top-[-70rem] lg:w-[340rem]" />
        <h3 style={fitSpacing()} className="display relative text-[40rem] leading-[0.85] md:text-[64rem] lg:text-[80rem]">{o.goal.title}</h3>
        <p className="relative mt-[16rem] text-[14rem] leading-[1.45] md:mt-[24rem] md:text-[18rem] lg:mt-[32rem] lg:text-[22rem]">{o.goal.text}</p>
      </Reveal>
    </div>
  );
}

// 1st place sits in the middle and stands tallest on desktop; stacked, it comes first.
const PODIUM = [
  { order: "lg:order-2", h: "lg:min-h-[780rem]", delay: 0.15 },
  { order: "lg:order-1", h: "lg:min-h-[660rem]", delay: 0 },
  { order: "lg:order-3", h: "lg:min-h-[580rem]", delay: 0.3 },
];

function Prizes() {
  const reduce = useReducedMotion();
  return (
    <div className="mt-[90rem] md:mt-[140rem] lg:mt-[230rem]">
      <Head n="(01)" title={o.prizes.title} />
      <ul className="mt-[24rem] flex flex-col gap-[14rem] md:mt-[40rem] md:gap-[20rem] lg:mt-[60rem] lg:flex-row lg:items-end lg:gap-[30rem]">
        {o.prizes.places.map((pl, i) => (
          <motion.li key={pl.place} style={{ background: pl.color }}
            initial={reduce ? false : { opacity: 0, y: "120rem" }} whileInView={{ opacity: 1, y: "0rem" }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }} transition={{ duration: 1, delay: PODIUM[i].delay, ease: outQuint }}
            className={`relative flex flex-col overflow-hidden rounded-[36rem] p-[24rem] text-ink md:p-[36rem] lg:flex-1 lg:p-[44rem] ${PODIUM[i].order} ${PODIUM[i].h}`}>
            <span aria-hidden className="display pointer-events-none absolute bottom-[-0.18em] right-[0.04em] text-[220rem] leading-none text-ink/[.07] md:text-[300rem] lg:text-[440rem]">{i + 1}</span>
            <div className="relative flex items-center justify-between gap-[12rem]">
              <span className="rounded-full bg-ink px-[14rem] py-[8rem] text-[12rem] font-bold uppercase leading-none tracking-[0.04em] text-white md:text-[15rem] lg:px-[18rem] lg:py-[10rem] lg:text-[17rem]">{pl.place}</span>
              <span className="relative block h-[56rem] w-[56rem] shrink-0 md:h-[72rem] md:w-[72rem] lg:h-[96rem] lg:w-[96rem]">
                <svg viewBox="0 0 100 100" aria-hidden className="absolute inset-0 animate-[spin_14s_linear_infinite]">
                  <polygon points={star(12, 0.82)} fill="#150734" stroke="#150734" strokeWidth={6} strokeLinejoin="round" />
                </svg>
                <span className="display absolute inset-0 flex items-center justify-center pt-[0.06em] text-[26rem] md:text-[34rem] lg:text-[46rem]" style={{ color: pl.color }}>{i + 1}</span>
              </span>
            </div>
            <p className="display relative mt-[28rem] text-[64rem] leading-[0.85] md:mt-[40rem] md:text-[96rem] lg:mt-auto lg:pt-[60rem] lg:text-[104rem]">{pl.amount}</p>
            <ul className="relative mt-[18rem] flex flex-col gap-[8rem] border-t-[2rem] border-ink/15 pt-[16rem] text-[14rem] font-semibold leading-[1.3] md:text-[18rem] lg:mt-[28rem] lg:gap-[12rem] lg:pt-[24rem] lg:text-[20rem]">
              {pl.perks.map((k) => (
                <li key={k} className="flex items-start gap-[10rem]">
                  <svg viewBox="0 0 20 20" aria-hidden className="mt-[0.12em] h-[1em] w-[1em] shrink-0"><circle cx="10" cy="10" r="10" fill="#150734" /><path d="M5.5 10.2l3 3 6-6.4" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  {k}
                </li>
              ))}
            </ul>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

function Fee() {
  return (
    <div className="mt-[90rem] md:mt-[140rem] lg:mt-[230rem]">
      <Head n="(02)" title={o.fee.title} />
      <div className="mt-[24rem] grid gap-[24rem] md:mt-[40rem] lg:mt-[60rem] lg:grid-cols-[5fr_7fr] lg:gap-[40rem]">
        <Reveal className="flex flex-col">
          <p className="display text-[96rem] leading-[0.8] text-lime md:text-[150rem] lg:text-[230rem]">{o.fee.amount}</p>
          <ul className="mt-[24rem] flex flex-col gap-[12rem] text-[15rem] leading-[1.35] text-white md:mt-[32rem] md:text-[20rem] lg:mt-[48rem] lg:gap-[18rem] lg:text-[24rem]">
            {o.fee.notes.map((n) => (
              <li key={n} className="flex gap-[12rem] lg:gap-[16rem]"><span aria-hidden className="mt-[0.42em] h-[8rem] w-[8rem] shrink-0 rounded-full bg-lime lg:h-[12rem] lg:w-[12rem]" />{n}</li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.1} className="rounded-[36rem] bg-lilac p-[18rem] text-ink md:p-[36rem] lg:p-[50rem]">
          <p className="mb-[12rem] px-[4rem] text-[13rem] font-bold uppercase tracking-[0.06em] md:mb-[18rem] md:text-[16rem] lg:mb-[24rem] lg:text-[18rem]">{o.fee.cardTitle}</p>
          <BankRows />
          <Reference className="mt-[12rem] lg:mt-[16rem]" />
          {o.fee.qr && (
            <div className="mt-[12rem] flex items-center gap-[16rem] rounded-[22rem] bg-white p-[14rem] lg:mt-[16rem] lg:rounded-[28rem] lg:p-[20rem]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={o.fee.qr} alt={o.fee.qrLabel} className="block aspect-square w-[120rem] lg:w-[200rem]" />
              <p className="text-[14rem] font-bold md:text-[18rem] lg:text-[22rem]">{o.fee.qrLabel}</p>
            </div>
          )}
        </Reveal>
      </div>
    </div>
  );
}

// Organizer logo inside a slowly turning ring of text, stretched to the exact circumference.
function RingLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`relative aspect-square shrink-0 ${className}`}>
      <svg viewBox="0 0 200 200" aria-hidden className="absolute inset-0 h-full w-full animate-[spin_24s_linear_infinite]">
        <defs><path id="org-ring" d="M100 100m-84 0a84 84 0 1 1 168 0a84 84 0 1 1-168 0" /></defs>
        <text fontSize="15" fontWeight="700" fill="currentColor" style={{ fontFamily: "var(--font-sans)" }}>
          <textPath href="#org-ring" textLength={527} lengthAdjust="spacing">{o.organizer.ring}</textPath>
        </text>
      </svg>
      <LogoDisc className="absolute inset-[24%] !p-[3%]" />
    </div>
  );
}

function Sponsors() {
  return (
    <div className="mt-[90rem] md:mt-[140rem] lg:mt-[230rem]">
      <Head n="(03)" title={o.sponsors.title} />
      <div className="mt-[24rem] grid gap-[14rem] md:mt-[40rem] md:gap-[20rem] lg:mt-[60rem] lg:grid-cols-[7fr_5fr] lg:gap-[30rem]">
        {o.sponsors.list.map((s) => (
          <Reveal key={s.name} className="flex flex-col gap-[20rem] rounded-[36rem] border-[2rem] border-lilac/15 bg-white/[.04] p-[20rem] md:flex-row md:items-center md:gap-[36rem] md:p-[36rem] lg:gap-[50rem] lg:p-[50rem]">
            <div className="flex aspect-square w-[130rem] shrink-0 items-center justify-center rounded-[28rem] bg-white p-[16rem] md:w-[200rem] lg:w-[280rem] lg:p-[34rem]">
              <SponsorLogo src={s.logo} name={s.name} />
            </div>
            <div>
              <p className="text-[12rem] font-bold uppercase tracking-[0.06em] text-lime md:text-[15rem] lg:text-[17rem]">{o.sponsors.label}</p>
              <h4 style={fitSpacing()} className="display mt-[10rem] text-[40rem] leading-[0.85] text-white md:text-[60rem] lg:mt-[16rem] lg:text-[84rem]">{s.name}</h4>
              <p className="mt-[12rem] text-[14rem] leading-[1.45] md:text-[18rem] lg:mt-[22rem] lg:text-[21rem]">{s.text}</p>
            </div>
          </Reveal>
        ))}
        <Reveal delay={0.1} className="flex flex-col items-center justify-center gap-[18rem] rounded-[36rem] bg-pink p-[24rem] text-center text-white md:flex-row md:justify-start md:gap-[36rem] md:p-[36rem] md:text-left lg:flex-col lg:justify-center lg:gap-[30rem] lg:p-[50rem] lg:text-center">
          <RingLogo className="w-[190rem] md:w-[220rem] lg:w-[300rem]" />
          <div>
            <p className="text-[12rem] font-bold uppercase tracking-[0.06em] text-ink md:text-[15rem] lg:text-[17rem]">{o.organizer.label}</p>
            <h4 style={fitSpacing()} className="display mt-[10rem] text-[40rem] leading-[0.85] md:text-[48rem] lg:mt-[14rem] lg:text-[72rem]">{o.organizer.name}</h4>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

function Faq() {
  const [open, setOpen] = useState(-1);
  const fb = brand.socials.find((x) => x.label === "Facebook")!;
  return (
    <div className="mt-[90rem] md:mt-[140rem] lg:mt-[230rem]">
      <Head n="(04)" title={o.faq.title} />
      <ul className="mt-[6rem] md:mt-[12rem] lg:mt-[20rem]">
        {o.faq.items.map((it, i) => {
          const on = open === i;
          return (
            <li key={it.q} className="border-b-[2rem] border-lilac/15">
              <h4>
                <button type="button" aria-expanded={on} aria-controls={`faq-${i}`} onClick={() => setOpen(on ? -1 : i)} data-cursor="pointer"
                  className="flex w-full items-center justify-between gap-[16rem] py-[18rem] text-left text-[17rem] font-bold leading-[1.2] text-white md:py-[26rem] md:text-[26rem] lg:py-[36rem] lg:text-[40rem] lg:tracking-[-0.02em]">
                  <span>{it.q}</span>
                  <span aria-hidden className={`flex h-[34rem] w-[34rem] shrink-0 items-center justify-center rounded-full transition-[transform,background-color] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] md:h-[48rem] md:w-[48rem] lg:h-[64rem] lg:w-[64rem] ${on ? "rotate-45 bg-pink" : "bg-lime"}`}>
                    <svg viewBox="0 0 24 24" className="h-1/2 w-1/2"><path d="M12 4v16M4 12h16" stroke={on ? "#fff" : "#150734"} strokeWidth="3" strokeLinecap="round" /></svg>
                  </span>
                </button>
              </h4>
              <div id={`faq-${i}`} role="region" aria-hidden={!on}
                className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.3,0.9,0.4,1)] ${on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className="min-h-0 overflow-hidden">
                  <p className="max-w-[1100rem] pb-[20rem] text-[14rem] leading-[1.45] md:pb-[28rem] md:text-[19rem] lg:pb-[40rem] lg:text-[24rem]">
                    {it.a || (<>{o.faq.pending}{" "}
                      <a href={fb.href} target="_blank" rel="noopener noreferrer" tabIndex={on ? 0 : -1} data-cursor="pointer" className="font-bold text-lime underline underline-offset-[0.15em]">{fb.label} ↗</a>
                    </>)}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 33 33" aria-hidden className={`block animate-[spin_8s_linear_infinite] ${className}`}>
      <path d="M16.5 0c1.2 8.6 4.6 13.4 16.5 16.5-11.9 3.1-15.3 7.9-16.5 16.5C15.3 24.4 11.9 19.6 0 16.5 11.9 13.4 15.3 8.6 16.5 0z" fill="currentColor" />
    </svg>
  );
}

function Cta() {
  const [ref, p] = useReveal<HTMLHeadingElement>();
  return (
    <div className="relative mt-[120rem] md:mt-[170rem] lg:mt-[280rem]">
      <Wave fill="#c2ec40" />
      <div className="relative overflow-hidden bg-lime px-[16rem] pb-[80rem] pt-[40rem] text-center text-ink md:pb-[120rem] md:pt-[60rem] lg:pb-[200rem] lg:pt-[80rem]">
        <Sparkle className="absolute bottom-[16%] left-[9%] w-[34rem] text-ink md:w-[60rem] lg:left-[14%] lg:w-[110rem]" />
        <Sparkle className="absolute bottom-[30%] right-[9%] w-[28rem] text-pink md:w-[50rem] lg:right-[15%] lg:w-[90rem]" />
        <h3 ref={ref} style={fitSpacing()} className="display relative mx-auto max-w-[1700rem] text-[56rem] leading-[0.85] md:text-[110rem] lg:text-[180rem]">
          <Frag p={p} d={0.92} off={0.3} className="block">{o.cta.title}</Frag>
        </h3>
        <ArrowButton onClick={openRegister}
          className="relative mx-auto mt-[28rem] w-max gap-[3rem] text-[16rem] font-bold lowercase leading-[1.2] [--arrow-size:49rem] md:mt-[44rem] md:text-[20rem] md:[--arrow-size:60rem] lg:mt-[64rem] lg:text-[19rem] lg:[--arrow-size:70.8rem]"
          pillClass="rounded-[210rem] bg-ink px-[28rem] py-[14.9rem] text-lime md:px-[34rem] md:py-[18rem] lg:px-[31rem] lg:py-[24rem]"
          arrowClass="bg-pink text-white">
          {o.cta.button}
        </ArrowButton>
      </div>
      <Wave fill="#150734" />
      <div className="h-[50rem] md:h-[90rem] lg:h-[140rem]" />
    </div>
  );
}

export default function Olympiad() {
  return (
    <section id="olympiad" className="relative overflow-x-clip bg-ink text-lilac">
      <div className="relative mx-auto max-w-[1920rem] px-[16rem] pt-[110rem] md:px-[24rem] md:pt-[150rem] lg:px-[80rem] lg:pt-[220rem]">
        <Intro />
        <Goal />
        <Prizes />
        <Fee />
        <Sponsors />
        <Faq />
      </div>
      <Cta />
    </section>
  );
}

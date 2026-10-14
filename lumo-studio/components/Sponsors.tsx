"use client";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { brand, sponsors } from "@/lib/olympiad";
import { outQuint } from "@/lib/ease";
import { Frag, useInViewToggle, useLineProgress } from "./ui/LineReveal";
import { fitSpacing } from "./ui/GlyphText";

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div className={className} initial={reduce ? false : { opacity: 0, y: "60rem" }} whileInView={{ opacity: 1, y: "0rem" }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }} transition={{ duration: 0.9, delay, ease: outQuint }}>
      {children}
    </motion.div>
  );
}

function SponsorLogo({ src, name }: { src: string; name: string }) {
  const img = useRef<HTMLImageElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => { const el = img.current; if (el?.complete && el.naturalWidth === 0) setFailed(true); }, []);
  if (failed) return <span className="display text-center text-[30rem] leading-[0.9] text-ink md:text-[40rem] lg:text-[54rem]">{name}</span>;
  // eslint-disable-next-line @next/next/no-img-element
  return <img ref={img} src={src} alt={name} onError={() => setFailed(true)} className="block max-h-full max-w-full object-contain" />;
}

function RingLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`relative aspect-square shrink-0 ${className}`}>
      <svg viewBox="0 0 200 200" aria-hidden className="absolute inset-0 h-full w-full animate-[spin_24s_linear_infinite]">
        <defs><path id="org-ring" d="M100 100m-84 0a84 84 0 1 1 168 0a84 84 0 1 1-168 0" /></defs>
        <text fontSize="15" fontWeight="700" fill="currentColor" style={{ fontFamily: "var(--font-sans)" }}>
          <textPath href="#org-ring" textLength={527} lengthAdjust="spacing">{sponsors.organizer.ring}</textPath>
        </text>
      </svg>
      <span className="absolute inset-[24%] block rounded-full bg-white p-[3%]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={brand.logo} alt={sponsors.organizer.name} width={160} height={160} className="block h-full w-full rounded-full" />
      </span>
    </div>
  );
}

export default function Sponsors() {
  const title = useRef<HTMLHeadingElement>(null);
  const p = useLineProgress(useInViewToggle(title), 0);
  return (
    <section id="sponsors" className="relative bg-ink pb-[110rem] pt-[40rem] text-lilac md:pb-[150rem] md:pt-[60rem] lg:pb-[220rem] lg:pt-[80rem]">
      <div className="relative mx-auto max-w-[1920rem] px-[16rem] md:px-[24rem] lg:px-[80rem]">
        <h2 ref={title} style={fitSpacing()} className="display text-center text-[54rem] leading-[0.85] md:text-[100rem] lg:text-[160rem]">
          <Frag p={p} d={0.92} off={0.3} className="block">{sponsors.title}</Frag>
        </h2>
        <div className="mt-[36rem] grid gap-[14rem] md:mt-[60rem] md:gap-[20rem] lg:mt-[100rem] lg:grid-cols-[7fr_5fr] lg:gap-[30rem]">
          {sponsors.list.map((s) => (
            <Reveal key={s.name} className="flex flex-col gap-[20rem] rounded-[36rem] border-[2rem] border-lilac/15 bg-white/[.04] p-[20rem] md:flex-row md:items-center md:gap-[36rem] md:p-[36rem] lg:gap-[50rem] lg:p-[50rem]">
              <div className="flex aspect-square w-[130rem] shrink-0 items-center justify-center rounded-[28rem] bg-white p-[16rem] md:w-[200rem] lg:w-[280rem] lg:p-[34rem]">
                <SponsorLogo src={s.logo} name={s.name} />
              </div>
              <div>
                <p className="text-[12rem] font-bold uppercase tracking-[0.06em] text-lime md:text-[15rem] lg:text-[17rem]">{sponsors.label}</p>
                <h3 style={fitSpacing()} className="display mt-[10rem] text-[40rem] leading-[0.85] text-white md:text-[60rem] lg:mt-[16rem] lg:text-[84rem]">{s.name}</h3>
                <p className="mt-[12rem] text-[14rem] leading-[1.45] md:text-[18rem] lg:mt-[22rem] lg:text-[21rem]">{s.text}</p>
              </div>
            </Reveal>
          ))}
          <Reveal delay={0.1} className="flex flex-col items-center justify-center gap-[18rem] rounded-[36rem] bg-pink p-[24rem] text-center text-white md:flex-row md:justify-start md:gap-[36rem] md:p-[36rem] md:text-left lg:flex-col lg:justify-center lg:gap-[30rem] lg:p-[50rem] lg:text-center">
            <RingLogo className="w-[190rem] md:w-[220rem] lg:w-[300rem]" />
            <div>
              <p className="text-[12rem] font-bold uppercase tracking-[0.06em] text-ink md:text-[15rem] lg:text-[17rem]">{sponsors.organizer.label}</p>
              <h3 style={fitSpacing()} className="display mt-[10rem] text-[40rem] leading-[0.85] md:text-[48rem] lg:mt-[14rem] lg:text-[72rem]">{sponsors.organizer.name}</h3>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

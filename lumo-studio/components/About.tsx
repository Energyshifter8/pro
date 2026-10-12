"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Reveal } from "./Reveal";
import { aboutMetrics } from "@/lib/content";

const words = ["We build brands", "people love", "and websites", "that win clients.", "Clean in form.", "Sharp in function."];

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["5%", "-45%"]);

  return (
    <section id="about" className="relative bg-lav text-ink">
      <div className="mx-auto max-w-[1440px] px-4 pb-20 pt-16 md:px-10 md:pt-24">
        <Reveal><p className="mb-6 text-sm font-bold tracking-[.3em]">ABOUT US</p></Reveal>
        <Reveal><h2 className="h-display max-w-5xl !leading-[1] text-[12vw] md:text-[7.5vw] xl:text-[110px]">
          We craft brands and digital <span className="my-1 inline-block rounded-[0.2em] bg-ink px-3 pt-1 text-lime">products</span> that scale
        </h2></Reveal>
        <div className="mt-12 grid gap-10 md:grid-cols-[1fr_1.4fr] md:items-end">
          <Reveal><p className="max-w-sm text-lg font-semibold">Clean in form. Sharp in function. Across our client projects:</p></Reveal>
          <div className="grid grid-cols-3 gap-3">
            {aboutMetrics.map((m, i) => (
              <Reveal key={m.label} delay={i * 0.1}>
                <div className="rounded-3xl bg-ink p-5 text-cream md:p-8">
                  <div className="h-display text-4xl text-lime md:text-7xl">{m.value}</div>
                  <div className="mt-2 text-xs md:text-sm">{m.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* scroll-driven giant statement */}
      <div ref={ref} className="overflow-hidden border-y-2 border-ink py-8">
        <motion.div style={{ x }} className="h-display flex gap-10 whitespace-nowrap text-[18vw] md:text-[11vw]">
          {words.map((w, i) => (
            <span key={w} className={i % 2 ? "text-transparent [-webkit-text-stroke:2px_#1B0B3F]" : ""}>{w}</span>
          ))}
        </motion.div>
      </div>

      <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-6 px-4 py-16 md:flex-row md:items-center md:px-10">
        <Reveal><h3 className="h-display text-5xl md:text-7xl">Trust comes from design,<br />not explanation.</h3></Reveal>
        <Reveal delay={0.2}><a href="#contact" className="pill bg-ink text-lime">design trust ↗</a></Reveal>
      </div>
    </section>
  );
}

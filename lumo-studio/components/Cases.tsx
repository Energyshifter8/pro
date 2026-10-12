"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { Reveal } from "./Reveal";
import { cases, testimonials } from "@/lib/content";

function Mock({ color, name }: { color: string; name: string }) {
  // Placeholder "screenshot" — replace with <Image src=...> of your real project.
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-ink">
      <div className="absolute inset-x-6 top-6 flex gap-1.5">{[0, 1, 2].map((d) => <span key={d} className="h-2.5 w-2.5 rounded-full bg-lav/30" />)}</div>
      <div className="absolute inset-x-6 bottom-6 top-14 rounded-2xl p-5" style={{ background: color }}>
        <div className="h-display text-4xl text-ink md:text-5xl">{name}</div>
        <div className="mt-3 h-2 w-1/2 rounded bg-ink/30" /><div className="mt-2 h-2 w-1/3 rounded bg-ink/20" />
        <div className="absolute bottom-5 right-5 h-16 w-16 rounded-full border-4 border-ink" />
      </div>
    </div>
  );
}

export default function Cases() {
  const [i, setI] = useState(0);
  const t = testimonials[i];
  const n = testimonials.length;

  return (
    <section id="cases" className="bg-lav text-ink">
      <div className="mx-auto max-w-[1440px] px-4 py-20 md:px-10">
        <div className="flex items-end justify-between">
          <Reveal><h2 className="h-display text-[18vw] md:text-[12vw] xl:text-[180px]">Cases</h2></Reveal>
          <a href="#cases" className="pill mb-4 bg-ink text-lime">view all cases ↗</a>
        </div>

        <ul className="mt-8 border-t-2 border-ink">
          {cases.map((c) => (
            <motion.li key={c.name} initial="rest" whileHover="hover" animate="rest"
              className="group relative flex items-center justify-between border-b-2 border-ink py-4 md:py-5">
              <motion.span variants={{ rest: { x: 0 }, hover: { x: 24 } }} className="h-display text-4xl md:text-6xl">{c.name}</motion.span>
              <span className="text-sm font-bold">{c.tag}</span>
              <motion.div variants={{ rest: { opacity: 0, scale: .8, rotate: -6 }, hover: { opacity: 1, scale: 1, rotate: -3 } }}
                className="pointer-events-none absolute right-40 top-1/2 z-10 hidden w-72 -translate-y-1/2 md:block">
                <Mock color={c.color} name={c.name} />
              </motion.div>
            </motion.li>
          ))}
        </ul>

        {/* testimonial slider */}
        <div className="mt-20 grid gap-6 md:grid-cols-[1.1fr_1fr]">
          <motion.div key={i} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} className="rounded-[36px] bg-ink p-8 text-cream md:p-12">
            <div className="flex justify-between text-sm font-bold text-lav">
              <span>{String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}</span>
              <span className="text-lime">★ {t.rating}</span>
            </div>
            <p className="h-display mt-8 text-4xl leading-[1] md:text-5xl">“{t.quote}”</p>
            <div className="mt-10 flex items-center justify-between">
              <div><div className="font-extrabold">{t.client}</div><div className="text-sm text-lav/70">{t.type}</div></div>
              <div className="flex gap-2">
                <button onClick={() => setI((i - 1 + n) % n)} className="h-12 w-12 rounded-full border border-lav/40 text-xl hover:bg-lime hover:text-ink" aria-label="Previous">←</button>
                <button onClick={() => setI((i + 1) % n)} className="h-12 w-12 rounded-full bg-lime text-xl text-ink" aria-label="Next">→</button>
              </div>
            </div>
          </motion.div>
          <Mock color={cases[i % cases.length].color} name={cases[i % cases.length].name} />
        </div>
      </div>
    </section>
  );
}

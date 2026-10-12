"use client";
import { motion } from "framer-motion";
import { Reveal } from "./Reveal";
import { auditTags } from "@/lib/content";

export default function Audit() {
  return (
    <section className="bg-lav px-4 pb-20 md:px-10">
      <div className="relative mx-auto max-w-[1440px] overflow-hidden rounded-[48px] bg-lime p-8 text-ink md:p-16">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full border-[40px] border-ink/10" />
        <Reveal><h2 className="h-display text-[13vw] md:text-[8vw] xl:text-[120px]">Get a free<br />audit of your<br />website</h2></Reveal>
        <div className="mt-10 flex flex-wrap gap-3">
          {auditTags.map((t, i) => (
            <motion.span key={t} initial={{ opacity: 0, scale: .6 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              transition={{ delay: i * .08, type: "spring" }}
              className="rounded-full border-2 border-ink px-5 py-2 text-lg font-bold" style={{ rotate: `${(i % 2 ? 1 : -1) * 3}deg` }}>
              {t}
            </motion.span>
          ))}
        </div>
        <a href="#contact" className="pill mt-10 bg-ink text-lime">get my free audit ↗</a>
      </div>
    </section>
  );
}

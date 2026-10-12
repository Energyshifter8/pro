"use client";
import { motion } from "framer-motion";
import { Letters } from "./Reveal";
import { stats } from "@/lib/content";
import Wave from "./Wave";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink pt-32 md:pt-40">
      {/* glow blobs */}
      <div className="pointer-events-none absolute -left-40 top-20 h-[480px] w-[480px] rounded-full bg-ink2 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-60 h-[380px] w-[380px] rounded-full bg-[#3b1f8a] opacity-60 blur-3xl" />

      <div className="relative mx-auto max-w-[1440px] px-4 md:px-10">
        <h1 className="h-display text-[17vw] text-lav md:text-[12.5vw] xl:text-[180px]">
          <span className="block overflow-hidden"><Letters text="Websites" /></span>
          <span className="block overflow-hidden">
            <Letters text="people " delay={0.25} />
            <Letters text="trust." className="text-lime" delay={0.45} />
          </span>
          <span className="block overflow-hidden"><Letters text="Designed" delay={0.6} /></span>
          <span className="block overflow-hidden">
            <Letters text="to " delay={0.85} />
            <Letters text="sell." className="text-sun" delay={0.95} />
          </span>
        </h1>

        <motion.div initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: -12 }} transition={{ delay: 1.3, type: "spring" }}
          className="absolute right-6 top-6 hidden rounded-full bg-tomato px-6 py-3 text-lg font-extrabold text-cream md:right-16 md:top-24 md:block">
          get more clients ↗
        </motion.div>

        <div className="mt-14 grid grid-cols-2 gap-3 pb-24 md:mt-20 md:grid-cols-6 md:gap-4">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 + i * 0.08 }}
              className="rounded-3xl border border-lav/15 bg-white/[0.04] p-5 backdrop-blur">
              <div className="h-display text-4xl text-lime md:text-5xl">{s.value}</div>
              <div className="mt-2 text-sm text-lav/80">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
      <Wave fill="#D9CCFF" />
    </section>
  );
}

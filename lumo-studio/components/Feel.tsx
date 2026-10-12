"use client";
import { motion } from "framer-motion";
import Sticker from "./Sticker";
import Wave from "./Wave";
import { moods } from "@/lib/content";

export default function Feel() {
  return (
    <section className="bg-lav">
      <div className="bg-lav pb-24 pt-20 text-center text-ink">
        <h2 className="h-display relative mx-auto inline-block px-4 text-[14vw] md:text-[9vw] xl:text-[140px]">
          So… how do<br />we make you feel?
          <motion.span animate={{ x: [0, 12, 0], y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 3 }}
            className="absolute -right-2 top-1/2 hidden items-center gap-1 md:flex">
            <svg width="26" height="26" viewBox="0 0 24 24"><path d="M3 2l18 9-8 2-2 8z" fill="#C8F53C" stroke="#1B0B3F" strokeWidth="1.5" /></svg>
            <span className="rounded-full bg-lime px-3 py-1 font-sans text-base font-bold normal-case">You</span>
          </motion.span>
        </h2>
        <p className="mt-6 text-sm font-semibold">Choose your vibe, we&apos;re listening.</p>
        <div className="mt-14 flex flex-wrap justify-center gap-4 px-4 md:gap-10">
          {moods.map((m, i) => (
            <motion.div key={m.label} initial={{ y: 80, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}
              transition={{ delay: i * .12, type: "spring", stiffness: 120 }}>
              <a href="#contact"><Sticker label={m.label} face={m.face} color={m.color} size={170} /></a>
            </motion.div>
          ))}
        </div>
      </div>
      <Wave fill="#1B0B3F" />
    </section>
  );
}

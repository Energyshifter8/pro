"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { nav } from "@/lib/content";

const budgets = ["$1k–3k", "$3k–7k", "$7k–15k", "$15k+"];
const kinds = ["UI/UX design", "Web development", "Branding", "Custom project"];

export default function FloatingNav() {
  const [menu, setMenu] = useState(false);
  const [form, setForm] = useState(false);
  const [budget, setBudget] = useState(budgets[1]);
  const [picked, setPicked] = useState<string[]>([]);

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 bottom-5 z-50 flex justify-center px-3">
      <motion.div initial={{ y: 100 }} animate={{ y: 0 }} transition={{ delay: 1.5, type: "spring" }}
        className="pointer-events-auto flex items-center gap-1 rounded-full bg-ink/80 p-1.5 text-sm text-lav shadow-2xl ring-1 ring-lav/20 backdrop-blur-xl">
        <button onClick={() => setMenu(true)} className="flex items-center gap-2 rounded-full px-4 py-2.5 hover:bg-white/10">
          <span className="h-2 w-2 rounded-full bg-lime" /><span className="opacity-60">Open:</span> <b>Menu</b>
        </button>
        <button onClick={() => setForm(true)} className="rounded-full bg-lav px-5 py-2.5 font-bold lowercase text-ink hover:bg-lime">get my website</button>
        <a href="#cases" className="hidden items-center gap-2 rounded-full px-4 py-2.5 hover:bg-white/10 sm:flex">
          <span className="h-2 w-2 rounded-full bg-lime" /><span className="opacity-60">View:</span> <b>Cases</b>
        </a>
      </motion.div>
      </div>

      <AnimatePresence>
        {menu && (
          <motion.div initial={{ clipPath: "circle(0% at 50% 100%)" }} animate={{ clipPath: "circle(150% at 50% 100%)" }}
            exit={{ clipPath: "circle(0% at 50% 100%)" }} transition={{ duration: .6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[60] flex flex-col justify-center bg-lime px-6 text-ink">
            <button onClick={() => setMenu(false)} className="absolute right-6 top-6 h-14 w-14 rounded-full bg-ink text-2xl text-lime" aria-label="Close">✕</button>
            {nav.map((n, i) => (
              <motion.a key={n.href} href={n.href} onClick={() => setMenu(false)}
                initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: .2 + i * .07 }}
                className="h-display text-[16vw] hover:italic md:text-[9vw]">{n.label}</motion.a>
            ))}
          </motion.div>
        )}
        {form && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/70 p-3 backdrop-blur md:items-center" onClick={() => setForm(false)}>
            <motion.form initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }} onClick={(e) => e.stopPropagation()}
              onSubmit={(e) => { e.preventDefault(); alert("Connect this form to your backend / email service."); }}
              className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[36px] bg-lav p-7 text-ink md:p-10">
              <div className="flex items-start justify-between"><h3 className="h-display text-6xl">Let&apos;s discuss</h3>
                <button type="button" onClick={() => setForm(false)} className="text-2xl" aria-label="Close">✕</button></div>
              <p className="mt-6 text-sm font-bold">What do you need?</p>
              <div className="mt-2 flex flex-wrap gap-2">{kinds.map((k) => (
                <button type="button" key={k} onClick={() => setPicked(p => p.includes(k) ? p.filter(x => x !== k) : [...p, k])}
                  className={`rounded-full border-2 border-ink px-4 py-2 text-sm font-semibold ${picked.includes(k) ? "bg-ink text-lime" : ""}`}>{k}</button>))}</div>
              <p className="mt-6 text-sm font-bold">Budget</p>
              <div className="mt-2 flex flex-wrap gap-2">{budgets.map((b) => (
                <button type="button" key={b} onClick={() => setBudget(b)}
                  className={`rounded-full border-2 border-ink px-4 py-2 text-sm font-semibold ${budget === b ? "bg-ink text-lime" : ""}`}>{b}</button>))}</div>
              <input required placeholder="Your name" className="mt-6 w-full border-b-2 border-ink bg-transparent py-3 outline-none placeholder:text-ink/50" />
              <input required type="email" placeholder="Email" className="mt-3 w-full border-b-2 border-ink bg-transparent py-3 outline-none placeholder:text-ink/50" />
              <textarea placeholder="Tell us about your project" rows={3} className="mt-3 w-full border-b-2 border-ink bg-transparent py-3 outline-none placeholder:text-ink/50" />
              <button className="pill mt-6 bg-ink text-lime">send request ↗</button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

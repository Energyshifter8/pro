"use client";
import { motion } from "framer-motion";

export function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

// Splits text into letters that pop in one by one (hero-style).
export function Letters({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) {
  return (
    <span className={className} aria-label={text}>
      {text.split("").map((c, i) => (
        <motion.span key={i} aria-hidden className="inline-block"
          initial={{ y: "110%", rotate: 8, opacity: 0 }} animate={{ y: 0, rotate: 0, opacity: 1 }}
          transition={{ delay: delay + i * 0.035, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
          {c === " " ? " " : c}
        </motion.span>
      ))}
    </span>
  );
}

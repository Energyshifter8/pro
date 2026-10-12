"use client";
import { motion } from "framer-motion";
import { Reveal } from "./Reveal";
import Wave from "./Wave";
import { services } from "@/lib/content";

export default function Services() {
  return (
    <section id="services" className="bg-lav">
      <Wave fill="#1B0B3F" />
      <div className="bg-ink">
        <div className="mx-auto max-w-[1440px] px-4 py-20 md:px-10 md:py-28">
          <Reveal><h2 className="h-display text-[13vw] text-lav md:text-[8vw] xl:text-[120px]">
            What are we<br />building <span className="text-lime">for you?</span>
          </h2></Reveal>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {services.map((s, i) => (
              <Reveal key={s.cta} delay={i * 0.12} className="min-w-0">
                <motion.div whileHover={{ y: -10, rotate: i === 1 ? 0 : i === 0 ? -1.5 : 1.5 }}
                  className={`${s.color} flex min-h-[460px] flex-col justify-between rounded-[36px] p-8 text-ink`}>
                  <div className="flex items-start justify-between">
                    <h3 className="h-display text-5xl lg:text-7xl">{s.title[0]}<br />{s.title[1]}</h3>
                    <span className="h-display text-2xl">0{i + 1}</span>
                  </div>
                  <div>
                    <p className="mb-8 text-base font-medium">{s.text}</p>
                    <a href="#contact" className="pill bg-ink text-cream">{s.cta} ↗</a>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
      <Wave fill="#1B0B3F" flip />
    </section>
  );
}

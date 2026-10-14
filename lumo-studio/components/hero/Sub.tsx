"use client";
import { motion } from "framer-motion";
import { hero } from "@/lib/olympiad";
import { INTRO, INTRO_ADAPTIVE, reducedMotion, useIntroReady } from "@/lib/intro";
import { power2Out } from "@/lib/ease";
import { useDesktop } from "@/lib/useMedia";
import Countdown from "./Countdown";

// Tagline and countdown. Desktop: beside the year on the last headline line; below 992px:
// under the stacked title. Rises in once the headline lines have landed.
export default function Sub() {
  const ready = useIntroReady();
  const desktop = useDesktop();
  return (
    <motion.div key={desktop ? "d" : "m"}
      className="relative z-[4] mt-[26rem] flex flex-col items-start gap-[14rem] px-[16rem] md:mt-[28rem] md:px-[24rem] lg:absolute lg:left-[700rem] lg:top-[478rem] lg:mt-0 lg:max-w-[640rem] lg:gap-[22rem] lg:px-0"
      initial={{ opacity: 0, y: "30rem" }}
      animate={ready ? { opacity: 1, y: "0rem" } : undefined}
      transition={ready && reducedMotion() ? { duration: 0 } : { delay: desktop ? INTRO.sub : INTRO_ADAPTIVE.sub, duration: 0.6, ease: power2Out }}>
      <p className="text-[15rem] font-medium leading-[1.3] text-white md:text-[22rem] lg:text-[30rem]">{hero.sub}</p>
      <Countdown />
    </motion.div>
  );
}

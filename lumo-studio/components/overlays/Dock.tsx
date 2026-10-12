"use client";
import { motion } from "framer-motion";
import { INTRO, INTRO_ADAPTIVE, useIntroReady } from "@/lib/intro";
import { useDesktop, useMedia } from "@/lib/useMedia";
import { ui } from "@/lib/store";
import Bubble from "../ui/Bubble";
import Roll from "../ui/Roll";

// Floating glass dock: "Open: Menu" · get my website · "View: Cases". Docks in from
// scale 0.5 (0.5s ease-in-out) at +5s on desktop, right away below 744px.
const btn = "roll-host group flex h-[33rem] items-center gap-x-[5rem] text-[11rem] md:h-[62rem] md:gap-[8rem] md:text-[21rem] lg:text-[19rem]";
const label = "inline-flex items-center gap-[10rem] text-lilac transition-colors duration-[250ms] group-hover:text-white md:gap-[16rem] before:block before:h-[6rem] before:w-[6rem] before:rounded-full before:bg-lime before:transition-transform before:duration-[350ms] before:ease-[cubic-bezier(0.34,1.86,0.64,1)] group-hover:before:scale-150 md:before:h-[10rem] md:before:w-[10rem]";
const line = <span aria-hidden className="h-[43rem] w-[1rem] shrink-0 bg-[rgba(201,228,219,0.21)]" />;

export default function Dock() {
  const ready = useIntroReady();
  const desktop = useDesktop();
  const centred = useMedia("(min-width: 744px)");
  const delay = desktop ? INTRO.bottomNav : INTRO_ADAPTIVE.bottomNav;
  return (
    <motion.div
      className="fixed bottom-[16rem] left-[16rem] right-[16rem] z-[90] flex items-center justify-between gap-x-[11rem] rounded-[580rem] border-[2rem] border-[rgba(201,228,219,0.41)] bg-[rgba(17,20,25,0.4)] p-[12rem] backdrop-blur-[58rem] md:bottom-[70rem] md:left-1/2 md:right-auto md:justify-start md:gap-[22rem] md:px-[25rem] md:py-[19.5rem] lg:px-[27rem] lg:py-[15rem]"
      style={{ x: centred ? "-50%" : 0 }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={ready ? { opacity: 1, scale: 1 } : undefined}
      transition={{ delay, duration: 0.5, ease: [0.42, 0, 0.58, 1] }}>
      <button type="button" onClick={() => ui.set({ menu: true })} className={btn} data-cursor="pointer">
        <span className={label}>Open:</span>
        <span className="font-bold text-white"><Roll>Menu</Roll></span>
      </button>
      {line}
      <Bubble onClick={() => ui.set({ contact: true })}
        className="inline-flex h-[33rem] items-center whitespace-nowrap rounded-[90rem] bg-lilac px-[16rem] text-[11rem] font-bold lowercase text-ink md:h-[62rem] md:px-[31rem] md:text-[20rem] lg:h-auto lg:px-[30rem] lg:py-[14rem] lg:text-[15rem] lg:leading-[1.52]">
        get my website
      </Bubble>
      {line}
      <a href="#cases" className={btn} data-cursor="pointer">
        <span className={label}>View:</span>
        <span className="font-bold text-white"><Roll>Cases</Roll></span>
      </a>
    </motion.div>
  );
}

"use client";
import { motion } from "framer-motion";
import { brand, nav } from "@/lib/content";
import { INTRO, INTRO_ADAPTIVE, useIntroReady } from "@/lib/intro";
import { backOut, power2Out } from "@/lib/ease";
import { useDesktop } from "@/lib/useMedia";
import { ui } from "@/lib/store";
import Bubble from "./ui/Bubble";
import Roll from "./ui/Roll";

// Tag-shaped translucent backdrop behind the nav (original shape).
function TagBg() {
  return (
    <span aria-hidden className="absolute inset-x-0 top-1/2 z-[-1] flex -translate-y-1/2 max-lg:bottom-0 max-lg:top-0 max-lg:translate-y-0">
      <svg viewBox="0 0 538 52" preserveAspectRatio="none" className="block w-full max-lg:h-full">
        <path d="M9 .73h486.5c2.3 0 4.4 1 5.8 2.8l34 21c.9.9.9 2.1 0 3l-34 21a7.4 7.4 0 01-5.8 2.74H9A8.27 8.27 0 01.73 43V9A8.27 8.27 0 019 .73z"
          fill="#D3C5F6" stroke="#fff" strokeWidth="1.46" opacity=".12" />
      </svg>
    </span>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`display inline-flex h-[41rem] w-[76rem] items-center justify-center text-[37rem] leading-none tracking-[-0.01em] text-lime ${className}`}>
      {brand.name}<span className="text-lilac">.</span>
    </span>
  );
}

export default function Header() {
  const ready = useIntroReady();
  const desktop = useDesktop();
  // desktop: 0.45s power2.out from 0.5 at +2.67s; below 992px: back.out pop from 0 at +0.61s
  const enter = {
    initial: { scale: desktop ? 0.5 : 0, opacity: 0 },
    animate: ready ? { scale: 1, opacity: 1 } : undefined,
    transition: desktop
      ? { delay: INTRO.header, duration: 0.45, ease: power2Out }
      : { delay: INTRO_ADAPTIVE.header, duration: 0.4, ease: (t: number) => backOut(t) },
  };
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-[1] pt-[55rem] text-white md:pt-[51rem] lg:pt-[37rem]">
      <div className="relative mx-auto flex w-[359rem] items-center justify-center md:w-[706rem] md:gap-x-[14rem] lg:w-auto lg:max-w-[1920rem] lg:gap-[6rem] lg:px-[80rem]">
        <motion.nav key={desktop ? "d" : "m"} {...enter} aria-label="Main"
          className="pointer-events-auto relative flex h-[52rem] w-full flex-row-reverse items-center justify-between py-[10rem] pl-[13rem] pr-[44rem] md:w-auto md:flex-1 md:flex-row md:justify-start md:gap-[40rem] md:px-[16rem] md:py-[8rem] lg:h-auto lg:min-w-[536rem] lg:flex-none lg:items-stretch lg:py-[10rem] lg:pl-[13rem] lg:pr-[65rem]">
          <TagBg />
          <a href="#" aria-label={`${brand.full} — home`} className="flex md:[&>span]:w-[66rem] lg:[&>span]:w-[76rem]" data-cursor="pointer">
            <Logo />
          </a>
          <ul className="hidden gap-[55rem] text-[13rem] leading-[1.5] md:flex lg:text-[15rem]">
            {nav.map((n) => (
              <li key={n.href} className="flex">
                <a href={n.href} className="roll-host flex items-center lowercase" data-cursor="pointer"><Roll>{n.label}</Roll></a>
              </li>
            ))}
          </ul>
          <button type="button" aria-label="Open menu" onClick={() => ui.set({ menu: true })}
            className="grid h-[32rem] w-[32rem] grid-cols-[repeat(2,12.5rem)] place-content-center gap-[3rem] md:hidden" data-cursor="pointer">
            {[0, 1, 2, 3].map((i) => <i key={i} className="block h-[12.5rem] w-[12.5rem] rounded-[5rem] bg-pink shadow-[0_0_0_3.5rem_#fff]" />)}
          </button>
        </motion.nav>
        <motion.div key={desktop ? "bd" : "bm"} {...enter} className="pointer-events-auto hidden md:block">
          <Bubble onClick={() => ui.set({ contact: true })}
            className="inline-flex h-[52rem] items-center whitespace-nowrap rounded-[40rem] bg-lilac px-[26rem] text-[14rem] font-bold lowercase leading-[1.52] text-ink lg:h-auto lg:rounded-[90rem] lg:px-[30rem] lg:py-[14rem] lg:text-[15rem]">
            let&apos;s talk
          </Bubble>
        </motion.div>
      </div>
    </header>
  );
}

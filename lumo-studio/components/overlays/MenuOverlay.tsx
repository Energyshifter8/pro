"use client";
import { useCallback } from "react";
import { nav, ui as copy } from "@/lib/olympiad";
import { ui, useUI } from "@/lib/store";
import { usePresence } from "@/lib/usePresence";
import Bubble from "../ui/Bubble";

function Badge({ id, label, href, delay, exit, disc, ink, text, className = "" }: {
  id: string; label: string; href: string; delay: number; exit: 1 | -1; disc: string; ink: string; text: string; className?: string;
}) {
  const arrow = (d: number) => (
    <path transform={`translate(${d} ${d}) rotate(${exit < 0 ? -90 : 90} 148 148) translate(148 148) scale(1.4) translate(-148 -148)`} d="M116 112h64v64h-14v-40l-54 54-10-10 54-54h-40z" className={ink} />
  );
  return (
    <a href={href} data-cursor="pointer" aria-label={label} onClick={() => ui.set({ menu: false })}
      className={`mnu-badge ${exit < 0 ? "l" : "r"} block shrink-0 ${className}`} style={{ "--d": `${delay}s` } as React.CSSProperties}>
      <svg viewBox="0 0 296 296" className="block aspect-square w-[104rem] md:w-[112rem] lg:w-[296rem]">
        <defs>
          <clipPath id={`${id}-c`}><circle cx="148" cy="148" r="70" /></clipPath>
          <path id={`${id}-t`} d="M36 148a112 112 0 0 0 224 0" />
        </defs>
        <rect width="296" height="296" rx="148" className={disc} />
        <g clipPath={`url(#${id}-c)`}><g className="arrows">{arrow(0)}{arrow(-104 * exit)}</g></g>
        <text fontSize="27" fontWeight="700" letterSpacing="0.8" textAnchor="middle" className={text} style={{ fontFamily: "var(--font-sans)" }}>
          <textPath href={`#${id}-t`} startOffset="50%" dominantBaseline="hanging">{label}</textPath>
        </text>
      </svg>
    </a>
  );
}

function Cross({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 76 76" aria-hidden className={`arrow-icon block aspect-square shrink-0 rounded-full bg-lime ${className}`}>
      <path d="M27 27l22 22M49 27L27 49" stroke="#111419" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

export default function MenuOverlay() {
  const open = useUI((s) => s.menu);
  const close = useCallback(() => ui.set({ menu: false }), []);
  const { mounted, on } = usePresence(open, 1600, close);
  if (!mounted) return null;

  const stacked = typeof window !== "undefined" && window.innerWidth < 992;
  const [left, right] = copy.menuBadges;

  return (
    <div id="menu" className={`mnu ${on ? "on" : ""}`} role="dialog" aria-modal="true" aria-label={copy.menuLabel}>
      <div className="mnu-backdrop" onClick={close} />
      <div aria-hidden className="mnu-row pointer-events-none">
        <div className="mnu-ball w" /><div className="mnu-ball w" /><div className="mnu-ball w" />
      </div>
      <div aria-hidden className="mnu-row pointer-events-none">
        <div className="mnu-ball c bg-pink bg-[repeating-linear-gradient(45deg,transparent_0_28rem,rgba(255,255,255,0.12)_28rem_56rem)]" />
        <div className="mnu-ball c bg-lime" />
        <div className="mnu-ball c bg-blue" />
      </div>
      <div data-lenis-prevent className="absolute inset-0 flex max-h-[100svh] flex-col items-center justify-start overflow-y-auto py-[20rem] [scrollbar-width:none] md:py-[16rem] lg:max-h-none lg:flex-row lg:justify-between lg:overflow-visible lg:px-[42rem] lg:py-0">
        <Badge id="b-left" label={left.label} href={left.href} delay={1.25} exit={-1} disc="fill-ink" ink="fill-pink" text="fill-white" className="max-lg:hidden" />
        <Badge id="b-left-s" label={left.label} href={left.href} delay={1.15} exit={1} disc="fill-white" ink="fill-ink" text="fill-ink" className="mb-[34rem] mt-auto md:mb-[28rem] lg:hidden" />
        <nav className="relative flex w-full flex-col items-center lg:w-auto">
          <ul className="flex flex-col items-center gap-y-[20rem] md:gap-y-[12rem] lg:gap-[20rem]">
            {nav.map((it, i) => (
              <li key={it.href} className="mnu-pop flex"
                style={{ "--d": `${1.2 + (stacked ? 0.09 : 0.08) * i}s` } as React.CSSProperties}>
                <Bubble href={it.href} onClick={close} circle="bg-ink"
                  className="rounded-[80rem] bg-white px-[40rem] py-[19rem] text-[20.3rem] font-bold lowercase leading-[0.69] text-ink hover:text-lime md:px-[66rem] md:py-[21rem] md:text-[55rem] lg:py-[35rem]">
                  {it.label}
                </Bubble>
              </li>
            ))}
          </ul>
          <button type="button" onClick={close} data-cursor="pointer"
            className="mnu-pop mnu-close arrow-btn mt-[40rem] flex min-h-[56.5rem] items-center gap-[20rem] rounded-[120rem] bg-ink py-[6rem] pl-[31rem] pr-[8rem] text-[25rem] font-bold lowercase leading-[1.3] text-lime [--arrow-size:44rem] md:mt-[28rem] md:min-h-[88rem] md:text-[50rem] md:[--arrow-size:76rem] lg:absolute lg:bottom-[-130rem] lg:left-1/2 lg:mt-0 lg:px-[8rem]"
            style={{ "--d": stacked ? "1.78s" : "1.7s" } as React.CSSProperties}>
            <Cross className="max-lg:!hidden" />
            <span>{copy.close}</span>
            <Cross />
          </button>
        </nav>
        <Badge id="b-right" label={right.label} href={right.href} delay={stacked ? 1.9 : 1.4} exit={1} disc="fill-white max-lg:fill-violet" ink="fill-violet max-lg:fill-white" text="fill-violet max-lg:fill-white" className="max-lg:mb-auto max-lg:mt-[34rem] md:max-lg:mt-[28rem]" />
      </div>
    </div>
  );
}

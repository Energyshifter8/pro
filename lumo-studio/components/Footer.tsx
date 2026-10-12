"use client";
import { useEffect, useRef } from "react";
import { brand, nav } from "@/lib/content";
import { ui } from "@/lib/store";
import { Frag, useInViewToggle, useLineProgress } from "./ui/LineReveal";
import { Fit } from "./ui/GlyphText";
import Roll from "./ui/Roll";

const SPEED = 118; // rem per second, leftward

function Mark() {
  return (
    <svg viewBox="0 0 191 191" className="block h-auto w-full" aria-hidden>
      <g fill="#4C3487">{Array.from({ length: 8 }, (_, i) => <rect key={i} x="84" y="6" width="23" height="62" rx="11.5" transform={`rotate(${i * 45} 95.5 95.5)`} />)}</g>
    </svg>
  );
}

function Social({ label, href, d }: { label: string; href: string; d: string }) {
  const icon = (cls: string) => <svg viewBox="0 0 64 64" className={`block h-full w-full ${cls}`} aria-hidden><circle cx="32" cy="32" r="32" fill="#150734" /><path d={d} fill="currentColor" /></svg>;
  return (
    <a href={href} aria-label={label} data-cursor="pointer" className="group relative block h-[34rem] w-[34rem] overflow-hidden rounded-full md:h-[64rem] md:w-[64rem]">
      {icon("text-lilac")}
      <span className="absolute inset-0 rounded-full bg-lime text-ink transition-[clip-path] duration-[250ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] [clip-path:inset(100%_0_0)] group-hover:[clip-path:inset(0)]">
        <svg viewBox="0 0 64 64" className="block h-full w-full scale-[1.06]" aria-hidden><path d={d} fill="currentColor" /></svg>
      </span>
    </a>
  );
}

const IG = "M24 18h16a6 6 0 016 6v16a6 6 0 01-6 6H24a6 6 0 01-6-6V24a6 6 0 016-6zm0 3.5a2.5 2.5 0 00-2.5 2.5v16a2.5 2.5 0 002.5 2.5h16a2.5 2.5 0 002.5-2.5V24a2.5 2.5 0 00-2.5-2.5zM32 25a7 7 0 110 14 7 7 0 010-14zm0 3.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7zM40.5 22a1.75 1.75 0 110 3.5 1.75 1.75 0 010-3.5z";
const IN = "M21 27h4.6v15H21zm2.3-7.4a2.7 2.7 0 110 5.4 2.7 2.7 0 010-5.4zM28.6 27H33v2c.7-1.3 2.4-2.4 4.8-2.4 4.7 0 5.6 3 5.6 7v8.4h-4.6v-7.4c0-1.8 0-4-2.5-4s-2.9 1.9-2.9 3.9V42h-4.6z";

// Purple band with the brand name drifting left (118rem/s, seamless loop), then contacts.
export default function Footer() {
  const inner = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const emailRef = useRef<HTMLAnchorElement>(null);
  const t1 = useLineProgress(useInViewToggle(titleRef), 0);
  const t2 = useLineProgress(useInViewToggle(emailRef), 0);

  useEffect(() => {
    let raf = 0, x = 0, last = performance.now();
    const tick = (now: number) => {
      const el = inner.current;
      if (el) {
        const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
        const block = el.firstElementChild as HTMLElement;
        const loop = block.offsetWidth + parseFloat(getComputedStyle(el).columnGap || "0");
        x -= (SPEED * rem * (now - last)) / 1000;
        if (loop > 0 && -x >= loop) x += loop;
        el.style.transform = `translate3d(${x}px,0,0)`;
      }
      last = now;
      raf = requestAnimationFrame(tick);
    };
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const links = [{ label: "Home", href: "#" }, ...nav, { label: "Contact us", href: "#contact" }];
  return (
    <footer id="contact" className="bg-lilac pb-[90rem] text-ink md:pb-[140rem] lg:pb-[220rem]">
      <div aria-hidden className="relative h-[130rem] overflow-hidden bg-[#b380ff] text-[100rem] uppercase leading-none text-[#4c3487] md:h-[264rem] md:text-[200rem] lg:h-[308rem] lg:text-[300rem]">
        <div className="flex h-full">
          <div ref={inner} className="flex gap-[36rem] lg:gap-[56rem]">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="flex h-full w-max shrink-0 items-center gap-[36rem]">
                <p className="display pt-[0.24em]" style={{ letterSpacing: 0 }}><Fit t={brand.name} /></p>
                <div className="w-[0.696em] shrink-0 lg:w-[191rem]"><Mark /></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative mx-auto mt-[60rem] max-w-[1920rem] px-[16rem] md:px-[80rem]">
        <div className="flex flex-col gap-[44rem] md:gap-[90rem] lg:flex-row lg:justify-between lg:gap-0">
          <div className="flex flex-col items-start">
            <h2 ref={titleRef} className="text-[28rem] font-bold leading-[0.92] tracking-[-0.03em] md:text-[49rem] lg:text-[65rem]">
              <Frag p={t1} d={1.0615} off={0.3} className="block">Want one that sells?</Frag>
            </h2>
            <p className="mt-[44rem] text-[28rem] font-semibold leading-none md:mt-[50rem] md:leading-[1.3]">Explore</p>
            <nav className="mt-[17rem] w-full" aria-label="Footer">
              <ul className="flex flex-col items-start gap-0 md:gap-[8rem]">
                {links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} onClick={l.href === "#contact" ? (e) => { e.preventDefault(); ui.set({ contact: true }); } : undefined}
                      className="roll-host inline-block text-[13rem] md:py-[5rem] md:text-[22rem] md:leading-[34rem]" data-cursor="pointer"><Roll>{l.label}</Roll></a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="flex flex-col items-start">
            <address className="not-italic">
              <a ref={emailRef} href={`mailto:${brand.email}`} data-cursor="pointer"
                className="relative inline-block text-[24rem] font-bold leading-[0.92] after:absolute after:inset-x-0 after:bottom-[-0.092em] after:h-[0.077em] after:bg-current md:text-[49rem] lg:text-[65rem]">
                <Frag p={t2} d={1.0615} off={0.3} className="block">{brand.email}</Frag>
              </a>
            </address>
            <ul className="mt-[50rem] flex gap-[9rem] md:gap-[20rem]">
              <li><Social label="Instagram" href="#" d={IG} /></li>
              <li><Social label="LinkedIn" href="#" d={IN} /></li>
            </ul>
            <div className="mt-[44rem] text-[17rem] md:text-[22rem] lg:mt-auto">
              <a href="#" className="roll-host inline-block py-[5rem] leading-[34rem]" data-cursor="pointer"><Roll>Privacy Policy</Roll></a>
              <p className="mt-[12rem]">© {brand.since}–{new Date().getFullYear()} {brand.full}. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

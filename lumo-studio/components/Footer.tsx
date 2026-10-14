"use client";
import { useEffect, useRef } from "react";
import { brand, footer, nav } from "@/lib/olympiad";
import { Frag, useInViewToggle, useLineProgress } from "./ui/LineReveal";
import { GlyphText } from "./ui/GlyphText";
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
  // icon + name; the icon fills lime from below on hover
  const icon = (cls: string) => <svg viewBox="0 0 64 64" className={`block h-full w-full ${cls}`} aria-hidden><circle cx="32" cy="32" r="32" fill="#150734" /><path d={d} fill="currentColor" fillRule="evenodd" /></svg>;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" data-cursor="pointer" className="group flex items-center gap-[10rem] md:gap-[14rem]">
      <span className="relative block h-[34rem] w-[34rem] shrink-0 overflow-hidden rounded-full md:h-[48rem] md:w-[48rem]">
        {icon("text-lilac")}
        <span className="absolute inset-0 rounded-full bg-lime text-ink transition-[clip-path] duration-[250ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] [clip-path:inset(100%_0_0)] group-hover:[clip-path:inset(0)]">
          <svg viewBox="0 0 64 64" className="block h-full w-full scale-[1.06]" aria-hidden><path d={d} fill="currentColor" fillRule="evenodd" /></svg>
        </span>
      </span>
      {label}
    </a>
  );
}

const IG = "M24 18h16a6 6 0 016 6v16a6 6 0 01-6 6H24a6 6 0 01-6-6V24a6 6 0 016-6zm0 3.5a2.5 2.5 0 00-2.5 2.5v16a2.5 2.5 0 002.5 2.5h16a2.5 2.5 0 002.5-2.5V24a2.5 2.5 0 00-2.5-2.5zM32 25a7 7 0 110 14 7 7 0 010-14zm0 3.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7zM40.5 22a1.75 1.75 0 110 3.5 1.75 1.75 0 010-3.5z";
const FB = "M36.2 47V33.6h4.5l.7-5.2h-5.2v-3.3c0-1.5.4-2.5 2.6-2.5h2.8v-4.7c-.5-.1-2.1-.2-4-.2-4 0-6.7 2.4-6.7 6.9v3.8h-4.5v5.2h4.5V47z";
const YT = "M44.6 24.4c1.4.4 2.4 1.5 2.8 2.8.6 2.4.6 4.8.6 4.8s0 2.4-.6 4.8c-.4 1.4-1.4 2.4-2.8 2.8-2.4.6-12.6.6-12.6.6s-10.2 0-12.6-.6c-1.4-.4-2.4-1.4-2.8-2.8C16 34.4 16 32 16 32s0-2.4.6-4.8c.4-1.3 1.4-2.4 2.8-2.8 2.4-.6 12.6-.6 12.6-.6s10.2 0 12.6.6zM29 27.2v9.6l8.4-4.8z";
const ICON: Record<string, string> = { Facebook: FB, Instagram: IG, YouTube: YT };

// Purple band with the brand name drifting left (118rem/s, seamless loop), then the contact
// heading with the big email / phone links, and the menu · social · address columns.
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

  return (
    <footer id="contact" className="bg-lilac pb-[90rem] text-ink md:pb-[140rem] lg:pb-[220rem]">
      <div aria-hidden className="relative h-[130rem] overflow-hidden bg-[#b380ff] text-[100rem] uppercase leading-none text-[#4c3487] md:h-[264rem] md:text-[200rem] lg:h-[308rem] lg:text-[300rem]">
        <div className="flex h-full">
          <div ref={inner} className="flex gap-[36rem] lg:gap-[56rem]">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="flex h-full w-max shrink-0 items-center gap-[36rem]">
                <p className="display pt-[0.24em]" style={{ letterSpacing: 0 }}>{brand.name}</p>
                <div className="w-[0.696em] shrink-0 lg:w-[191rem]"><Mark /></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative mx-auto mt-[60rem] max-w-[1920rem] px-[16rem] md:px-[80rem] lg:mt-[100rem]">
        <div className="flex flex-col gap-[36rem] lg:flex-row lg:items-end lg:justify-between lg:gap-[60rem]">
          <div className="max-w-[860rem]">
            <h2 ref={titleRef} className="text-[34rem] font-bold leading-[0.92] tracking-[-0.03em] md:text-[60rem] lg:text-[90rem]">
              <Frag p={t1} d={1.0615} off={0.3} className="block"><GlyphText text={footer.title} mark="highlight" /></Frag>
            </h2>
            <p className="mt-[18rem] text-[15rem] leading-[1.4] md:text-[20rem] lg:mt-[28rem] lg:text-[24rem]">{footer.text}</p>
          </div>
          <address className="flex flex-col items-start gap-[16rem] not-italic md:gap-[22rem] lg:items-end">
            <a ref={emailRef} href={`mailto:${brand.email}`} data-cursor="pointer"
              className="relative inline-block text-[24rem] font-bold leading-[0.92] after:absolute after:inset-x-0 after:bottom-[-0.092em] after:h-[0.077em] after:bg-current md:text-[44rem] lg:text-[60rem]">
              <Frag p={t2} d={1.0615} off={0.3} className="block">{brand.email}</Frag>
            </a>
            <a href={`tel:${brand.phone.replace(/\s/g, "")}`} data-cursor="pointer"
              className="relative inline-block text-[24rem] font-bold leading-[0.92] after:absolute after:inset-x-0 after:bottom-[-0.092em] after:h-[0.077em] after:bg-current md:text-[44rem] lg:text-[60rem]">
              <Frag p={t2} d={1.0615} off={0.3} className="block">{brand.phone}</Frag>
            </a>
          </address>
        </div>
        <div className="mt-[50rem] grid grid-cols-2 gap-x-[16rem] gap-y-[36rem] border-t-[2rem] border-ink/15 pt-[30rem] text-[15rem] md:mt-[80rem] md:grid-cols-4 md:pt-[40rem] md:text-[20rem] lg:mt-[120rem] lg:pt-[56rem] lg:text-[22rem]">
          <nav aria-label={footer.menu}>
            <h3 className="text-[13rem] font-bold uppercase tracking-[0.06em] text-ink/60 md:text-[15rem] lg:text-[17rem]">{footer.menu}</h3>
            <ul className="mt-[12rem] flex flex-col items-start md:mt-[18rem] md:gap-[4rem]">
              {nav.map((l) => (
                <li key={l.href}><a href={l.href} className="roll-host inline-block py-[3rem] leading-[1.4]" data-cursor="pointer"><Roll>{l.label}</Roll></a></li>
              ))}
            </ul>
          </nav>
          <div>
            <h3 className="text-[13rem] font-bold uppercase tracking-[0.06em] text-ink/60 md:text-[15rem] lg:text-[17rem]">{footer.social}</h3>
            <ul className="mt-[12rem] flex flex-col items-start gap-[10rem] font-semibold md:mt-[18rem] md:gap-[14rem]">
              {brand.socials.map((x) => <li key={x.label}><Social label={x.label} href={x.href} d={ICON[x.label]} /></li>)}
            </ul>
          </div>
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-[13rem] font-bold uppercase tracking-[0.06em] text-ink/60 md:text-[15rem] lg:text-[17rem]">{footer.address}</h3>
            <p className="mt-[12rem] leading-[1.4] md:mt-[18rem]">{brand.address}</p>
          </div>
          <div className="col-span-2 flex items-center gap-[12rem] md:col-span-1 md:flex-col md:items-end md:justify-end md:text-right">
            <span className="block h-[44rem] w-[44rem] shrink-0 rounded-full bg-white p-[3rem] md:h-[72rem] md:w-[72rem] lg:h-[88rem] lg:w-[88rem]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={brand.logo} alt="" width={176} height={176} className="block h-full w-full rounded-full" />
            </span>
            <p className="leading-[1.35]">© {brand.since}–{new Date().getFullYear()} {brand.full}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

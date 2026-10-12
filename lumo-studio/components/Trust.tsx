"use client";
import { useEffect, useRef } from "react";
import { trust } from "@/lib/content";
import { ui } from "@/lib/store";
import { Frag, useInViewToggle, useLineProgress } from "./ui/LineReveal";
import ArrowButton from "./ui/ArrowButton";
import Mascot from "./trust/Mascot";

// Desktop: 110svh wrapper, sticky stage. While the wrapper's top travels from mid-viewport
// to the top, the mascot scales 0→1 and the title / button slide out from the centre by half
// the mascot column (linear scrub; vertical when stacked below 992px). The mascot column also
// follows the pointer (±25rem).
function line(text: string) {
  return text.split(/(\[[^\]]+\])/).map((part, i) =>
    part.startsWith("[") ? <span key={i} className="highlight">{part.slice(1, -1)}</span> : part,
  );
}

export default function Trust() {
  const wrap = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const titleBox = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLDivElement>(null);
  const mascot = useRef<HTMLDivElement>(null);
  const follow = useRef<HTMLDivElement>(null);
  const seen = useInViewToggle(title);
  const lines = [useLineProgress(seen, 0), useLineProgress(seen, 0.3), useLineProgress(seen, 0.6)];

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 992px)");
    const mouse = { x: 0.5, y: 0.5 }, pos = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => { mouse.x = e.clientX / window.innerWidth; mouse.y = e.clientY / window.innerHeight; };
    window.addEventListener("pointermove", onMove, { passive: true });
    let raf = 0, last = performance.now(), pS = NaN;
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000); last = now;
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
      const top = wrap.current!.getBoundingClientRect().top;
      const p = Math.min(1, Math.max(0, 1 - top / (window.innerHeight / 2)));
      pS = Number.isNaN(pS) ? p : pS + (p - pS) * (1 - Math.exp(-dt / 0.15));
      const q = 1 - pS;
      const t = titleBox.current!, b = button.current!, m = mascot.current!;
      if (desktop.matches) {
        // spread horizontally by half the mascot column
        const half = (m.offsetWidth / 2) * q;
        t.style.transform = q ? `translate3d(${half}px,0,0)` : "";
        b.style.transform = q ? `translate3d(${-half}px,0,0)` : "";
      } else {
        // stacked: title and button meet in the middle of the gap the mascot fills
        const half = ((b.offsetTop - (t.offsetTop + t.offsetHeight)) / 2) * q;
        t.style.transform = q ? `translate3d(0,${half}px,0)` : "";
        b.style.transform = q ? `translate3d(0,${-half}px,0)` : "";
      }
      m.style.transform = `scale(${pS})`;
      const k = 1 - Math.exp(-dt / 0.1);
      pos.x += ((mouse.x - 0.5) * 50 * rem - pos.x) * k;
      pos.y += ((mouse.y - 0.5) * 50 * rem - pos.y) * k;
      if (follow.current) follow.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("pointermove", onMove); };
  }, []);

  return (
    <div ref={wrap} className="relative bg-lilac lg:h-[110svh]">
      <section className="sticky top-0 flex flex-col justify-center overflow-hidden bg-lilac pb-[80rem] pt-[70rem] text-ink md:pb-[90rem] md:pt-[80rem] lg:block lg:min-h-[max(1200rem,100svh)] lg:pb-[155rem] lg:pt-[223rem]">
        <div className="relative mx-auto w-full max-w-[1920rem] px-[16rem] md:px-[24rem] lg:px-[80rem]">
          <div className="flex flex-col items-center justify-center gap-[26rem] md:gap-[48rem] lg:flex-row lg:justify-start lg:gap-0">
            <div ref={titleBox} className="relative z-[1] max-w-[358rem] md:max-w-[640rem] lg:max-w-none lg:flex-[0_0_33%]">
              <h2 ref={title} aria-label={trust.title.join(" ").replace(/[[\]]/g, "")}
                className="text-center text-[44rem] font-bold leading-[0.92] tracking-[-0.03em] md:text-[60rem] lg:text-[65rem]">
                {trust.title.map((t, i) => (
                  <Frag key={i} p={lines[i]} d={1.0615} off={0.3} className="block" aria-hidden>{line(t)}</Frag>
                ))}
              </h2>
            </div>
            <div ref={mascot} className="relative z-[1] w-[300rem] shrink-0 md:w-[400rem] lg:w-auto lg:flex-[0_0_33%]" style={{ transform: "scale(0)" }}>
              <div ref={follow}>
                <Mascot className="inline h-auto w-full align-baseline" />
              </div>
            </div>
            <div ref={button} className="flex shrink-0 justify-center lg:flex-[0_0_33%] lg:justify-start">
              <ArrowButton onClick={() => ui.set({ contact: true })}
                className="text-[22rem] font-bold leading-[0.92] tracking-[-0.03em] [--arrow-size:59.4rem] md:text-[40rem] md:[--arrow-size:108rem] lg:text-[65rem] lg:[--arrow-size:125.5rem]"
                pillClass="rounded-[210rem] bg-lime px-[32rem] py-[22rem] leading-[0.7] md:px-[54rem] md:py-[40rem]"
                arrowClass="bg-ink text-lilac">
                {trust.cta}
              </ArrowButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

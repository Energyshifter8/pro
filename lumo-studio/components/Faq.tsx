"use client";
import { useRef, useState } from "react";
import { brand, faq } from "@/lib/olympiad";
import { Frag, useInViewToggle, useLineProgress } from "./ui/LineReveal";
import { fitSpacing } from "./ui/GlyphText";

// FAQ accordion on lilac. One answer open at a time; it unfolds by animating its grid row
// (0fr → 1fr) while the lime plus turns into a pink cross. Empty answers show `faq.pending`
// with a link to the club's Facebook page.
export default function Faq() {
  const [open, setOpen] = useState(-1);
  const title = useRef<HTMLHeadingElement>(null);
  const p = useLineProgress(useInViewToggle(title), 0);
  const fb = brand.socials.find((x) => x.label === "Facebook")!;
  return (
    <section id="faq" className="relative bg-lilac pb-[90rem] pt-[20rem] text-ink md:pb-[130rem] md:pt-[40rem] lg:pb-[200rem] lg:pt-[60rem]">
      <div className="relative mx-auto max-w-[1920rem] px-[16rem] md:px-[24rem] lg:px-[80rem]">
        <h2 ref={title} style={fitSpacing()} className="display max-w-[8em] text-[50rem] leading-[0.85] md:text-[96rem] lg:text-[150rem]">
          <Frag p={p} d={0.92} off={0.3} className="block">{faq.title}</Frag>
        </h2>
        <ul className="mt-[24rem] border-t-[2rem] border-ink/15 md:mt-[40rem] lg:mt-[70rem]">
          {faq.items.map((it, i) => {
            const on = open === i;
            return (
              <li key={it.q} className="border-b-[2rem] border-ink/15">
                <h3>
                  <button type="button" aria-expanded={on} aria-controls={`faq-${i}`} onClick={() => setOpen(on ? -1 : i)} data-cursor="pointer"
                    className="flex w-full items-center justify-between gap-[16rem] py-[18rem] text-left text-[17rem] font-bold leading-[1.2] md:py-[26rem] md:text-[26rem] lg:py-[36rem] lg:text-[40rem] lg:tracking-[-0.02em]">
                    <span>{it.q}</span>
                    <span aria-hidden className={`flex h-[34rem] w-[34rem] shrink-0 items-center justify-center rounded-full border-[2rem] border-ink transition-[transform,background-color] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] md:h-[48rem] md:w-[48rem] lg:h-[64rem] lg:w-[64rem] ${on ? "rotate-45 bg-pink" : "bg-lime"}`}>
                      <svg viewBox="0 0 24 24" className="h-1/2 w-1/2"><path d="M12 4v16M4 12h16" stroke={on ? "#fff" : "#150734"} strokeWidth="3" strokeLinecap="round" /></svg>
                    </span>
                  </button>
                </h3>
                <div id={`faq-${i}`} role="region" aria-hidden={!on}
                  className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.3,0.9,0.4,1)] ${on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <div className="min-h-0 overflow-hidden">
                    <p className="max-w-[1100rem] pb-[20rem] text-[14rem] leading-[1.45] md:pb-[28rem] md:text-[19rem] lg:pb-[40rem] lg:text-[24rem]">
                      {it.a || (<>{faq.pending}{" "}
                        <a href={fb.href} target="_blank" rel="noopener noreferrer" tabIndex={on ? 0 : -1} data-cursor="pointer" className="font-bold text-violet underline underline-offset-[0.15em]">{fb.label} ↗</a>
                      </>)}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

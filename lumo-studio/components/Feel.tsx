"use client";
import { useRef, useState } from "react";
import { feel, moods } from "@/lib/content";
import { ui } from "@/lib/store";
import { Frag, useInViewToggle, useLineProgress } from "./ui/LineReveal";
import { GlyphText, capMarkGap, fitSpacing, type GlyphSlot } from "./ui/GlyphText";
import ArrowButton from "./ui/ArrowButton";
import Sticker from "./Sticker";

const GLYPHS: Record<string, GlyphSlot> = { "а": { k: "a", adv: 0.83, ix: 0.011, asc: 0.741, iw: 0.81, ih: 0.752 } };
const WAVE =
  "M0 6C83.3 16.2 166.7 25.7 250 36.5C333.3 47.3 416.7 60.3 500 71C550 77.5 600 83.2 650 89C683.3 92.9 716.7 97 750 100.4C816.7 107.1 883.3 113.8 950 118C983.3 120.1 1016.7 121.8 1050 121.8C1083.3 121.8 1116.7 118 1150 114.7C1200 109.8 1250 102.5 1300 95.7C1333.3 91.2 1366.7 86.1 1400 81.2C1450 73.8 1500 66 1550 58.5C1583.3 53.5 1616.7 48.4 1650 43.5C1683.3 38.6 1716.7 33.5 1750 29.1C1800 22.5 1850 15.7 1900 11C1933.3 7.9 1966.7 6.1 2000 4.4C2033.3 2.7 2066.7 1.6 2100 0.9C2133.3 0.2 2166.7 0.2 2200 0.2C2238.3 0.2 2276.7 1.1 2315 1.6V160H0Z";

// Mood picker: three badges with radio boxes (the middle one preselected). A checked box
// fills with ink and a yellow star scales in (0.5s ease-in-out).
export default function Feel() {
  const title = useRef<HTMLHeadingElement>(null);
  const seen = useInViewToggle(title);
  const lines = [useLineProgress(seen, 0), useLineProgress(seen, 0.3), useLineProgress(seen, 0.6)];
  const [mood, setMood] = useState(1);

  return (
    <section id="feel" className="relative bg-lilac pb-[110rem] pt-[130rem] text-ink md:pb-[140rem] md:pt-[180rem] lg:pb-[200rem] lg:pt-[256rem]">
      <div aria-hidden className="absolute inset-x-0 top-0 z-0 bg-[linear-gradient(180deg,#150734,#150734_95%,#d3c5f6_95%)] leading-[0]">
        <svg viewBox="0 0 2315 160" className="block h-auto w-full"><path d={WAVE} fill="#d3c5f6" /></svg>
      </div>
      <div className="relative mx-auto flex max-w-[1920rem] flex-col items-center justify-center px-[16rem] md:px-[24rem] lg:min-h-[max(1200rem,100svh)] lg:px-[80rem]">
        <h2 ref={title} aria-label={feel.title.join(" ").replace(/[{}]/g, "")} style={fitSpacing()}
          className="display text-center text-[77rem] leading-[0.8] md:text-[145rem] lg:text-[250rem]">
          {feel.title.map((l, i) => (
            <Frag key={i} p={lines[i]} d={0.92} off={0.3} className={`block ${capMarkGap(l, i)}`}><GlyphText text={l} glyphs={GLYPHS} lh={0.8} fit /></Frag>
          ))}
        </h2>
        <p className="text-[13rem] md:mt-[32rem] md:text-[18rem] lg:text-[19rem]">{feel.text}</p>
        <form className="mt-[40rem] flex flex-col items-center md:mt-[87rem]" onSubmit={(e) => { e.preventDefault(); ui.set({ contact: true }); }}>
          <fieldset>
            <legend className="sr-only">{feel.legend}</legend>
            <ul className="flex max-w-[358rem] flex-wrap justify-center gap-[17rem] md:max-w-none md:flex-nowrap md:gap-[48rem] lg:gap-[87rem]">
              {moods.map((m, i) => (
                <li key={m.label}>
                  <label className="flex cursor-pointer flex-col items-center gap-[23rem]" data-cursor="pointer">
                    <input type="radio" name="mood" className="sr-only" checked={mood === i} onChange={() => setMood(i)} />
                    <span className="flex aspect-square w-[108rem] items-center md:w-[180rem] lg:aspect-[180/244] lg:w-[240rem]">
                      <Sticker label={m.label} face={m.face} color={m.color} className="block h-auto w-full" />
                    </span>
                    <span className={`relative flex h-[30rem] w-[30rem] items-center justify-center rounded-[8rem] border-[2rem] border-ink transition-colors duration-500 ease-in-out md:h-[50rem] md:w-[50rem] md:rounded-[12rem] ${mood === i ? "bg-ink" : "bg-ink/[.12]"}`}>
                      <svg viewBox="0 0 33 33" aria-hidden className={`absolute left-1/2 top-1/2 h-[66%] w-[66%] -translate-x-1/2 -translate-y-1/2 transition-[transform,opacity] duration-500 ease-in-out ${mood === i ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}>
                        <path d="M16.5 1l3.6 9.3 9.4-3.8-3.8 9.4 9.3 3.6-9.3 3.6 3.8 9.4-9.4-3.8-3.6 9.3-3.6-9.3-9.4 3.8 3.8-9.4L-1 19.5l9.3-3.6-3.8-9.4 9.4 3.8z" fill="#FBD402" transform="translate(0 -3) scale(1 1.06)" />
                      </svg>
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </fieldset>
          <ArrowButton type="submit"
            className="mt-[40rem] gap-[3rem] text-[16rem] font-bold lowercase leading-[1.2] [--arrow-size:55.2rem] md:mt-[57rem] md:text-[20rem] md:[--arrow-size:60rem] lg:mt-[96rem] lg:text-[19rem] lg:[--arrow-size:70.8rem]"
            pillClass="rounded-[210rem] bg-white px-[28rem] py-[18rem] text-ink md:px-[34rem] lg:px-[31rem] lg:py-[24rem]"
            arrowClass="bg-lime text-ink">
            {feel.cta}
          </ArrowButton>
        </form>
      </div>
    </section>
  );
}

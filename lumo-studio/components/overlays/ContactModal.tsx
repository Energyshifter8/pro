"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { contact } from "@/lib/content";
import { ui, useUI } from "@/lib/store";
import { usePresence } from "@/lib/usePresence";
import { GlyphText, fitSpacing, type GlyphSlot } from "../ui/GlyphText";
import Bubble from "../ui/Bubble";

// "Let's discuss" modal. Opening: backdrop blurs (0.4s), the card scales 0.82→1 with a
// soft overshoot while the white and lime layers fan out to +4.6° / −5.24°, then the title
// (0.17s), fields (0.22–0.42s) and close button (0.38s) rise in. Closing is quicker (~0.25s).
const GLYPHS: Record<string, GlyphSlot> = { e: { k: "e", adv: 0.814, ix: 0.011, asc: 0.741, iw: 0.795, ih: 0.752 } };

// Original card silhouette: a rounded panel with a tab on top and one below.
const WIDE = "M60 120H230C270 120 290 0 340 0H800C850 0 870 120 910 120H1698Q1758 120 1758 180V740Q1758 800 1698 800H1350C1310 800 1290 919 1240 919H860C810 919 790 800 750 800H60Q0 800 0 740V180Q0 120 60 120Z";
const TALL = "M40 90H110C140 90 155 0 190 0H520C555 0 570 90 600 90H746Q786 90 786 130V1270Q786 1310 746 1310H660C630 1310 615 1400 580 1400H330C295 1400 280 1310 250 1310H40Q0 1310 0 1270V130Q0 90 40 90Z";

function Face({ fill, className = "", style }: { fill: string; className?: string; style?: React.CSSProperties }) {
  return (
    <div aria-hidden className={`absolute inset-0 ${className}`} style={style}>
      <svg viewBox="0 0 1758 919" preserveAspectRatio="none" className="absolute inset-0 hidden h-full w-full lg:block"><path d={WIDE} fill={fill} /></svg>
      <svg viewBox="0 0 786 1400" preserveAspectRatio="none" className="absolute inset-0 h-full w-full lg:hidden"><path d={TALL} fill={fill} /></svg>
    </div>
  );
}

const field = "h-[44rem] w-full rounded-[900rem] bg-white px-[18rem] text-[13rem] font-bold leading-[1.2] text-ink outline-none placeholder:text-ink/[.32] focus-visible:shadow-[0_0_0_3rem_#c2ec40] md:h-[84rem] md:px-[57rem] md:text-[19rem]";

function Select({ placeholder, options, value, onChange }: { placeholder: string; options: readonly string[]; value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const off = (e: PointerEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    window.addEventListener("pointerdown", off);
    return () => window.removeEventListener("pointerdown", off);
  }, []);
  return (
    <div ref={ref} className={`relative flex min-w-0 ${open ? "z-30" : "z-[5]"}`}>
      <button type="button" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((v) => !v)} data-cursor="pointer"
        className={`${field} flex items-center justify-between gap-[6rem] text-left md:gap-[12rem] ${value ? "" : "text-ink/[.32]"}`}>
        <span className="min-w-0 flex-1 truncate">{value || placeholder}</span>
        <svg viewBox="0 0 19 11" aria-hidden className={`h-[11rem] w-[19rem] shrink-0 transition-transform duration-200 ease-in-out ${open ? "rotate-180" : ""}`}><path d="M0 0h19L9.5 11z" fill="#150734" /></svg>
      </button>
      <div className={`absolute inset-x-0 top-[calc(100%+10rem)] z-20 grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.3,0.9,0.4,1)] ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <ul role="listbox" className={`min-h-0 overflow-hidden rounded-[28rem] bg-white px-[12rem] transition-shadow duration-[220ms] ${open ? "shadow-[0_24rem_60rem_rgba(21,7,52,0.28)]" : ""}`}>
          {options.map((o, i) => (
            <li key={o} role="option" aria-selected={value === o}
              onClick={() => { onChange(o); setOpen(false); }} data-cursor="pointer"
              className={`cursor-pointer rounded-[16rem] px-[22rem] py-[15rem] text-[19rem] font-bold transition-colors duration-[120ms] ease-in-out hover:bg-pink hover:text-white ${value === o ? "text-pink" : "text-ink"} ${i === 0 ? "mt-[12rem]" : ""} ${i === options.length - 1 ? "mb-[12rem]" : ""}`}>
              {o}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function ContactModal() {
  const open = useUI((s) => s.contact);
  const close = useCallback(() => ui.set({ contact: false }), []);
  const { mounted, on } = usePresence(open, 300, close);
  const [budget, setBudget] = useState("");
  const [kind, setKind] = useState("");
  const [sent, setSent] = useState(false);
  useEffect(() => { if (!open) setSent(false); }, [open]);
  if (!mounted) return null;

  const d = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;
  return (
    <div className={`dsc fixed inset-0 z-[200] flex flex-col items-center overflow-y-auto overscroll-contain py-[24rem] md:py-[40rem] lg:block lg:overflow-visible lg:py-0 ${on ? "on" : ""}`}
      role="dialog" aria-modal="true" aria-labelledby="dsc-title">
      <div className="dsc-backdrop" onClick={close} />
      <div className="dsc-card relative mx-auto my-auto w-[340rem] px-[14rem] pb-[44rem] pt-[40rem] md:w-[624rem] md:px-[18rem] md:pb-[138rem] md:pt-[94rem] lg:absolute lg:left-1/2 lg:top-1/2 lg:m-0 lg:h-[919rem] lg:w-[1758rem] lg:-translate-x-1/2 lg:-translate-y-1/2 lg:p-0">
        <Face fill="#fff" className="dsc-layer white z-[-1] max-lg:-inset-x-[44rem] md:max-lg:-inset-x-[81rem] lg:z-auto" />
        <Face fill="#c2ec40" className="dsc-layer lime z-[-1] max-lg:-inset-x-[44rem] md:max-lg:-inset-x-[81rem] lg:z-auto" />
        <Face fill="#f04c8a" className="z-[-1] [filter:drop-shadow(0_24rem_48rem_rgba(21,7,52,0.28))] max-lg:-inset-x-[44rem] md:max-lg:-inset-x-[81rem] lg:z-auto" />

        <button type="button" onClick={close} aria-label="Close" data-cursor="pointer"
          className="dsc-close absolute right-[12rem] top-[12rem] z-10 flex h-[52rem] w-[52rem] items-center justify-center rounded-full bg-ink md:right-[18rem] md:top-[18rem] md:h-[64rem] md:w-[64rem] lg:right-[127rem] lg:top-[165rem] lg:h-[150rem] lg:w-[150rem]">
          <svg viewBox="0 0 88 88" aria-hidden className="block h-[60%] w-[60%]"><path d="M22 22l44 44M66 22L22 66" stroke="#c2ec40" strokeWidth="12" strokeLinecap="round" /></svg>
        </button>

        <h2 id="dsc-title" aria-label={contact.title.replace(/[{}]/g, "")} style={fitSpacing(800)}
          className="dsc-title display mt-[36rem] w-full whitespace-normal text-center text-[44rem] leading-[0.8] text-white md:mt-0 md:text-[155rem] lg:absolute lg:left-[146rem] lg:top-[150rem] lg:w-auto lg:whitespace-nowrap lg:text-left lg:text-[250rem]">
          <GlyphText text={contact.title} glyphs={GLYPHS} lh={0.8} fit wt={800} />
        </h2>

        {sent ? (
          <p className="dsc-in mt-[40rem] text-center text-[22rem] font-bold leading-[1.3] text-white lg:absolute lg:left-[146rem] lg:top-[450rem] lg:mt-0 lg:max-w-[675rem] lg:text-left lg:text-[30rem]" style={d(0)}>
            {contact.thanks}
          </p>
        ) : (
          <form className="mt-[18rem] flex flex-col gap-[10rem] md:mt-[55rem] lg:absolute lg:left-[146rem] lg:top-[408rem] lg:mt-0 lg:w-[1463rem] lg:gap-[13rem]"
            onSubmit={(e) => { e.preventDefault(); setSent(true); /* TODO: send to your backend / email service */ }}>
            <div className="flex flex-col gap-[10rem] lg:grid lg:grid-cols-3">
              <input required name="name" placeholder={contact.fields.name} className={`dsc-in ${field}`} style={d(0.22)} />
              <input required type="email" name="email" placeholder={contact.fields.email} className={`dsc-in ${field}`} style={d(0.26)} />
              <input name="website" placeholder={contact.fields.website} className={`dsc-in ${field}`} style={d(0.3)} />
            </div>
            <div className="flex flex-col gap-[10rem] lg:grid lg:grid-cols-3 lg:grid-rows-[84rem_105rem] lg:gap-x-[10rem] lg:gap-y-[21rem]">
              <div className="dsc-in flex lg:row-span-2" style={d(0.3)}>
                <textarea name="message" placeholder={contact.fields.message} className={`${field} h-auto min-h-[110rem] resize-none !rounded-[21rem] py-[16rem] !leading-[1.4] md:min-h-[210rem] md:!rounded-[40rem] md:py-[35rem] lg:h-full`} />
              </div>
              <div className="dsc-in" style={d(0.34)}><Select placeholder={contact.fields.budget} options={contact.budgets} value={budget} onChange={setBudget} /></div>
              <div className="dsc-in" style={d(0.38)}><Select placeholder={contact.fields.kind} options={contact.kinds} value={kind} onChange={setKind} /></div>
              <div className="dsc-in mt-[20rem] flex md:mt-[46rem] lg:col-span-2 lg:col-start-2 lg:mt-0" style={d(0.42)}>
                <Bubble type="submit" circle="bg-ink" className="h-[60rem] w-full rounded-[210rem] bg-lime text-[19rem] font-bold text-ink hover:text-white md:h-[115rem] lg:h-[105rem]">
                  {contact.submit}
                </Bubble>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

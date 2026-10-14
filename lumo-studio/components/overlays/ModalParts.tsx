"use client";
import { useEffect, useRef, useState } from "react";

// Pieces of the register modal: card silhouette, field style, custom select.

// Original card silhouette: a rounded panel with a tab on top and one below.
const WIDE = "M60 120H230C270 120 290 0 340 0H800C850 0 870 120 910 120H1698Q1758 120 1758 180V740Q1758 800 1698 800H1350C1310 800 1290 919 1240 919H860C810 919 790 800 750 800H60Q0 800 0 740V180Q0 120 60 120Z";
const TALL = "M40 90H110C140 90 155 0 190 0H520C555 0 570 90 600 90H746Q786 90 786 130V1270Q786 1310 746 1310H660C630 1310 615 1400 580 1400H330C295 1400 280 1310 250 1310H40Q0 1310 0 1270V130Q0 90 40 90Z";

export function Face({ fill, className = "", style }: { fill: string; className?: string; style?: React.CSSProperties }) {
  return (
    <div aria-hidden className={`absolute inset-0 ${className}`} style={style}>
      <svg viewBox="0 0 1758 919" preserveAspectRatio="none" className="absolute inset-0 hidden h-full w-full lg:block"><path d={WIDE} fill={fill} /></svg>
      <svg viewBox="0 0 786 1400" preserveAspectRatio="none" className="absolute inset-0 h-full w-full lg:hidden"><path d={TALL} fill={fill} /></svg>
    </div>
  );
}

export const field = "h-[44rem] w-full rounded-[900rem] bg-white px-[18rem] text-[13rem] font-bold leading-[1.2] text-ink outline-none placeholder:text-ink/[.32] focus-visible:shadow-[0_0_0_3rem_#c2ec40] md:h-[84rem] md:px-[57rem] md:text-[19rem]";

// Small field name shown inside a pill, before its value.
export const fieldLabel = "shrink-0 text-ink/45";

// `invalid` rings the closed select in red (used for required selects left empty); `label`
// prefixes the value with the field's name.
export function Select({ placeholder, options, value, onChange, invalid = false, label }: { placeholder: string; options: readonly string[]; value: string; onChange: (v: string) => void; invalid?: boolean; label?: string }) {
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
        aria-invalid={invalid || undefined}
        className={`${field} flex items-center justify-between gap-[6rem] text-left md:gap-[12rem] ${value ? "" : "text-ink/[.32]"} ${invalid ? "shadow-[0_0_0_3rem_#ea3323]" : ""}`}>
        {label && <span className={`${fieldLabel} mr-[4rem]`}>{label}</span>}
        <span className={`min-w-0 flex-1 truncate ${value ? "text-ink" : ""}`}>{value || placeholder}</span>
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


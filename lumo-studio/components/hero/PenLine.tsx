"use client";
import { useEffect, useRef } from "react";
import { INTRO, reducedMotion, useIntroReady } from "@/lib/intro";

// Original bezier "pen" line drawn across the headline on load. Coordinates are 1/1000 em
// of the headline font, relative to the h1 box, so it scales with the type. The curve runs
// through the same eight anchor regions as the reference, with its own shape in between.
const PATH = "M-7600 -550C-6467 -167 -5261 576 -4200 600C-3279 621 -2311 -164 -1600 -150C-1100 -140 -721 154 -330 270C0 367 255 391 590 510C1020 663 1635 901 2020 1160C2334 1372 2693 1627 2780 1880C2846 2073 2807 2349 2690 2480C2563 2622 2208 2733 2000 2660C1738 2568 1380 2116 1320 1750C1246 1301 1545 439 1850 120C2078 -119 2453 -188 2750 -220C3026 -250 3267 -206 3570 -100C4008 54 4970 476 5070 780C5128 956 4948 1289 4840 1320C4749 1346 4491 1148 4500 1080C4510 1005 4801 899 4980 900C5207 901 5512 1043 5750 1200C6017 1377 6416 1708 6480 1950C6525 2120 6466 2326 6350 2450C6202 2609 5837 2690 5550 2720C5232 2753 4874 2762 4520 2600C4006 2366 3447 1620 2910 1130";
const ANCHORS: [number, number][] = [[590,510],[2020,1160],[2690,2480],[3570,-100],[5070,780],[6350,2450],[4520,2600],[2910,1130]];

const SPEED = (1300 / 240) * 1000; // 1300rem/s at a 240rem font, in path units per second
const DECEL = 1.5; // seconds of ease-out at the end of the stroke
const ENTER = 0.65; // seconds until the stroke enters the viewport's left edge
const EDGE_X = -333; // viewport left edge (container padding 80rem / 240rem)

export default function PenLine() {
  const path = useRef<SVGPathElement>(null);
  const pen = useRef<SVGGElement>(null);
  const dots = useRef<(SVGCircleElement | null)[]>([]);
  const ready = useIntroReady();

  useEffect(() => {
    const p = path.current!;
    const L = p.getTotalLength();
    p.style.strokeDasharray = `${L}`;
    // arc length where each anchor lies, and where the curve crosses the viewport edge
    const N = 400, samples: [number, number, number][] = [];
    for (let i = 0; i <= N; i++) { const s = (L * i) / N; const q = p.getPointAtLength(s); samples.push([s, q.x, q.y]); }
    const at = ANCHORS.map(([x, y]) => samples.reduce((b, c) => (Math.hypot(c[1] - x, c[2] - y) < Math.hypot(b[1] - x, b[2] - y) ? c : b))[0]);
    const cross = samples.find((c) => c[1] >= EDGE_X)![0];
    const s0 = Math.max(0, cross - SPEED * ENTER);
    const R = L - s0, Dd = (SPEED * DECEL) / 2, T1 = (R - Dd) / SPEED;
    const popped = ANCHORS.map(() => false);

    const place = (s: number) => {
      p.style.strokeDashoffset = `${L - s}`;
      const a = p.getPointAtLength(Math.max(0, s - 1)), b = p.getPointAtLength(Math.min(L, s + 1));
      const ang = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI + 90;
      const q = p.getPointAtLength(s);
      pen.current?.setAttribute("transform", `translate(${q.x} ${q.y}) rotate(${ang})`);
      at.forEach((len, i) => {
        if (!popped[i] && s >= len) { popped[i] = true; dots.current[i]?.animate([{ transform: "scale(0)" }, { transform: "scale(1)" }], { duration: 90, easing: "ease-out", fill: "forwards" }); }
      });
    };

    if (!ready) { p.style.strokeDashoffset = `${L}`; return; }
    if (reducedMotion()) { place(L); pen.current?.style.setProperty("opacity", "1"); return; }
    let raf = 0;
    const start = performance.now() + INTRO.pen * 1000;
    const tick = (now: number) => {
      const t = (now - start) / 1000;
      if (t < 0) { raf = requestAnimationFrame(tick); return; }
      let s: number;
      if (t < T1) s = s0 + SPEED * t;
      else { const u = Math.min(DECEL, t - T1); s = s0 + (R - Dd) + SPEED * u - (SPEED / (2 * DECEL)) * u * u; }
      pen.current?.style.setProperty("opacity", "1");
      place(Math.min(L, s));
      if (t < T1 + DECEL) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ready]);

  return (
    <svg aria-hidden viewBox="-8500 -600 15500 3800" className="pointer-events-none absolute left-[-8.5em] top-[-0.6em] z-0 h-[3.8em] w-[15.5em] overflow-visible">
      <path ref={path} d={PATH} fill="none" stroke="#c2ec40" strokeWidth={25} />
      {ANCHORS.map(([x, y], i) => (
        <circle key={i} ref={(n) => { dots.current[i] = n; }} cx={x} cy={y} r={31.25} fill="#150734" stroke="#c2ec40" strokeWidth={12.5}
          style={{ transform: "scale(0)", transformBox: "fill-box", transformOrigin: "center" }} />
      ))}
      <g ref={pen} style={{ opacity: 0 }}>
        {/* fountain-pen nib, tip at the origin, body along +x */}
        <g fill="#150734" stroke="#c2ec40" strokeWidth={12.5} strokeLinejoin="round">
          <path d="M0 0L92-40H172V40H92Z" />
          <path d="M0 0H82" fill="none" />
          <circle cx="104" cy="0" r="13" />
          <rect x="172" y="-50" width="36" height="100" rx="8" />
          <rect x="208" y="-42" width="92" height="84" rx="14" />
        </g>
      </g>
    </svg>
  );
}

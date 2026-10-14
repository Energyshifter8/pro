"use client";
import { useEffect, useRef, useState } from "react";
import { ui as copy } from "@/lib/content";

type Mode = "default" | "pointer" | "drag";

// Custom cursor: arrow + label pill. Follows the pointer with a 0.12s power3.out tween
// toward each new position (snapping to it when the cursor first appears); swaps to "Click" over [data-cursor=pointer] targets and
// "Drag" over [data-cursor=drag] areas (0.2s cross-fade).
export default function Cursor() {
  const block = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("default");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    document.documentElement.classList.add("has-cursor");
    const pos = { x: -100, y: -100 };
    let from = { ...pos }, to = { ...pos }, start = 0, last = 0, raf = 0, shown = false;
    const D = 120;
    const place = () => { if (block.current) block.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`; };
    const tick = (now: number) => {
      // a new target's tween starts one frame back (as a GSAP tween does): timing it from the
      // event put t at ~0 (or below, rAF time precedes the event) every frame, stalling the cursor
      if (start < 0) start = last || now - 1000 / 60;
      const t = Math.min(1, (now - start) / D);
      const e = 1 - Math.pow(1 - t, 3);
      pos.x = from.x + (to.x - from.x) * e;
      pos.y = from.y + (to.y - from.y) * e;
      place();
      last = t < 1 ? now : 0;
      raf = t < 1 ? requestAnimationFrame(tick) : 0;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      to = { x: e.clientX, y: e.clientY };
      if (shown) {
        from = { ...pos }; start = -1;
        if (!raf) raf = requestAnimationFrame(tick);
      } else {
        // appear under the pointer instead of sliding in from the corner / the last exit point
        cancelAnimationFrame(raf); raf = 0; last = 0;
        pos.x = to.x; pos.y = to.y; place();
        shown = true;
      }
      setVisible(true);
      const el = e.target as HTMLElement;
      // the innermost of an explicit [data-cursor] or an interactive element decides the label
      const tagged = el.closest?.("[data-cursor]");
      const interactive = el.closest?.("a[href], button, label, select, [role=button], [role=option]");
      let m = tagged?.getAttribute("data-cursor") ?? null;
      if (interactive && (!tagged || (tagged !== interactive && tagged.contains(interactive)))) m = "pointer";
      setMode(m === "drag" ? "drag" : m === "pointer" ? "pointer" : "default");
    };
    const onLeave = () => { shown = false; setVisible(false); };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  const label = "absolute left-[18.7rem] top-[37rem] whitespace-nowrap rounded-[30rem] border border-solid px-[20rem] py-[12rem] text-[26rem] font-bold leading-[0.73]";
  return (
    <div aria-hidden className={`pointer-events-none fixed inset-0 z-[9999] transition-opacity duration-200 ${visible ? "opacity-100" : "opacity-0"}`}>
      <div ref={block} className="absolute left-0 top-0">
        <div className={`transition-opacity duration-200 ease-in-out ${mode === "default" ? "opacity-100 delay-[125ms]" : "opacity-0"}`}>
          <Arrow fill="#c2ec40" />
          <p className={`${label} border-ink bg-lime text-ink`}>{copy.cursor.idle}</p>
        </div>
        <div className={`absolute left-0 top-0 transition-opacity duration-200 ease-in-out ${mode === "pointer" ? "opacity-100" : "opacity-0"}`}>
          <Tap />
          <p className={`${label} border-white bg-pink text-white`}>{copy.cursor.click}</p>
        </div>
        <div className={`absolute left-0 top-0 transition-opacity duration-200 ease-in-out ${mode === "drag" ? "opacity-100" : "opacity-0"}`}>
          <Arrow fill="#3d71ff" stroke="#fff" />
          <p className={`${label} border-white bg-blue text-white`}>{copy.cursor.drag}</p>
        </div>
      </div>
    </div>
  );
}

function Arrow({ fill, stroke = "#150734" }: { fill: string; stroke?: string }) {
  return (
    <svg className="absolute left-0 top-0 h-[41rem] w-[35rem]" viewBox="0 0 35 41" fill="none">
      <path d="M2 2l30 15.5-13.2 3.6L12.6 38z" fill={fill} stroke={stroke} strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function Tap() {
  return (
    <svg className="absolute left-0 top-0 h-[35rem] w-[35rem]" viewBox="0 0 35 35" fill="none">
      <circle cx="9" cy="9" r="7" stroke="#f04c8a" strokeWidth="1.6" />
      <path d="M9 7.5l20 10-8.6 2.4L16.4 31z" fill="#f04c8a" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

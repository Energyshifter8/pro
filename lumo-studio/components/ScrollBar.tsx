"use client";
import { useEffect, useRef } from "react";

// Overlay scrollbar (the native one is hidden): 10px gutter with 2px padding, a 6px lime
// thumb sized to the viewport ratio, fading out 1.3s after the last scroll.
export default function ScrollBar() {
  const bar = useRef<HTMLDivElement>(null);
  const thumb = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let hide = 0;
    let drag: { y: number; scroll: number } | null = null;
    const metrics = () => {
      const doc = document.documentElement;
      const track = window.innerHeight - 4;
      const h = Math.max(30, (window.innerHeight / doc.scrollHeight) * track);
      return { track, h, max: doc.scrollHeight - window.innerHeight };
    };
    const show = () => {
      bar.current?.classList.remove("opacity-0");
      clearTimeout(hide);
      hide = window.setTimeout(() => { if (!drag) bar.current?.classList.add("opacity-0"); }, 1300);
    };
    const update = () => {
      const { track, h, max } = metrics();
      if (!thumb.current) return;
      thumb.current.style.height = `${h}px`;
      thumb.current.style.transform = `translateY(${max > 0 ? (window.scrollY / max) * (track - h) : 0}px)`;
    };
    const onScroll = () => { update(); show(); };
    const onMove = (e: PointerEvent) => {
      if (!drag) return;
      const { track, h, max } = metrics();
      window.scrollTo(0, drag.scroll + ((e.clientY - drag.y) / (track - h)) * max);
    };
    const onUp = () => { drag = null; show(); };
    const onDown = (e: PointerEvent) => { e.preventDefault(); drag = { y: e.clientY, scroll: window.scrollY }; };
    const t = thumb.current!;
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    t.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    const ro = new ResizeObserver(update);
    ro.observe(document.body);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      t.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      ro.disconnect();
      clearTimeout(hide);
    };
  }, []);

  return (
    <div ref={bar} aria-hidden className="fixed bottom-0 right-0 top-0 z-[95] w-[10px] p-[2px] opacity-0 transition-opacity duration-150 max-md:hidden">
      <div ref={thumb} className="w-[6px] rounded-[10px] bg-lime" />
    </div>
  );
}

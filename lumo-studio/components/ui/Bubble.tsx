"use client";
import { useRef } from "react";

type Props = {
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  circle?: string; // fill colour class of the rising ellipse
  children: React.ReactNode;
  type?: "button" | "submit";
};

// Pill button with the rising-ellipse hover fill. On leave the ellipse exits upward
// (0.4s) and then resets below without a transition, like the reference.
export default function Bubble({ href, onClick, className = "", circle = "bg-lime", children, type = "button" }: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const timer = useRef(0);
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.classList.add("is-out");
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      el.classList.add("is-reset");
      el.classList.remove("is-out");
      requestAnimationFrame(() => requestAnimationFrame(() => el.classList.remove("is-reset")));
    }, 400);
  };
  const onEnter = () => {
    const el = ref.current;
    clearTimeout(timer.current);
    el?.classList.remove("is-out", "is-reset");
  };
  const inner = (
    <>
      <span className="relative">{children}</span>
      <span aria-hidden className={`bubble-circle ${circle}`} />
    </>
  );
  const cls = `bubble ${className}`;
  if (href)
    return (
      <a ref={(n) => { ref.current = n; }} href={href} onClick={onClick} onMouseEnter={onEnter} onMouseLeave={onLeave} className={cls} data-cursor="pointer">
        {inner}
      </a>
    );
  return (
    <button ref={(n) => { ref.current = n; }} type={type} onClick={onClick} onMouseEnter={onEnter} onMouseLeave={onLeave} className={cls} data-cursor="pointer">
      {inner}
    </button>
  );
}

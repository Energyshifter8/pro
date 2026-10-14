"use client";
import { useEffect, useRef, useState } from "react";
import { fee } from "@/lib/olympiad";
import Bubble from "../ui/Bubble";

function CopyButton({ value }: { value: string }) {
  const [done, setDone] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = value; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove();
    }
    setDone(true);
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setDone(false), 1600);
  };
  return (
    <Bubble onClick={copy} circle="bg-pink"
      className={`shrink-0 rounded-full px-[14rem] py-[9rem] text-[12rem] font-bold lowercase leading-none transition-colors md:px-[20rem] md:py-[12rem] md:text-[15rem] lg:px-[24rem] lg:py-[14rem] lg:text-[17rem] ${done ? "bg-lime text-ink" : "bg-ink text-lilac hover:text-white"}`}>
      <span aria-live="polite">{done ? fee.copied : fee.copy}</span>
    </Bubble>
  );
}

export function BankRows({ compact = false }: { compact?: boolean }) {
  return (
    <dl className={`flex flex-col gap-[8rem] ${compact ? "lg:gap-[8rem]" : "lg:gap-[12rem]"}`}>
      {fee.rows.map((r) => (
        <div key={r.label} className={`flex items-center justify-between gap-[12rem] rounded-[22rem] bg-white px-[16rem] py-[11rem] text-ink md:px-[24rem] md:py-[16rem] lg:rounded-[28rem] lg:px-[30rem] ${compact ? "lg:py-[11rem]" : "lg:py-[18rem]"}`}>
          <div className="min-w-0">
            <dt className="text-[11rem] font-semibold uppercase tracking-[0.06em] text-ink/50 md:text-[13rem] lg:text-[15rem]">{r.label}</dt>
            <dd className={`mt-[3rem] text-[16rem] font-bold leading-[1.2] [overflow-wrap:anywhere] md:text-[22rem] lg:mt-[5rem] ${compact ? "lg:text-[22rem]" : "lg:text-[26rem]"} ${"mono" in r ? "font-mono tracking-[-0.02em]" : ""}`}>
              {"mono" in r ? r.value.replace(/(.{4})(?=.)/g, "$1 ") : r.value}
            </dd>
          </div>
          <CopyButton value={r.value} />
        </div>
      ))}
    </dl>
  );
}

export function Reference({ className = "" }: { className?: string }) {
  return <p className={`rounded-[22rem] bg-[#FBD402] p-[16rem] text-[14rem] font-bold leading-[1.35] text-ink md:p-[24rem] md:text-[18rem] lg:rounded-[28rem] lg:px-[30rem] lg:text-[22rem] ${className}`}>{fee.reference}</p>;
}

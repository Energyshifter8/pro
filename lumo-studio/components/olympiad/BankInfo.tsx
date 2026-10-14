"use client";
import { useEffect, useRef, useState } from "react";
import { olympiad as o } from "@/lib/olympiad";
import Bubble from "../ui/Bubble";

// Bank transfer details with per-row copy buttons, plus the yellow payment-reference box.
// Shared by the olympiad fee card and the register modal's confirmation.

function CopyButton({ value }: { value: string }) {
  const [done, setDone] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // older browsers / insecure origins
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
      <span aria-live="polite">{done ? o.fee.copied : o.fee.copy}</span>
    </Bubble>
  );
}

export function BankRows() {
  const rows = [
    { label: o.fee.labels.bank, value: o.fee.bank },
    // shown in groups of four for reading; the copy button still copies the raw number
    { label: o.fee.labels.account, value: o.fee.account, shown: o.fee.account.replace(/(.{4})(?=.)/g, "$1 ") },
    { label: o.fee.labels.holder, value: o.fee.holder },
  ];
  return (
    <dl className="flex flex-col gap-[8rem] lg:gap-[12rem]">
      {rows.map((r) => (
        <div key={r.label} className="flex items-center justify-between gap-[12rem] rounded-[22rem] bg-white px-[16rem] py-[11rem] text-ink md:px-[24rem] md:py-[16rem] lg:rounded-[28rem] lg:px-[30rem] lg:py-[20rem]">
          <div className="min-w-0">
            <dt className="text-[11rem] font-semibold uppercase tracking-[0.06em] text-ink/50 md:text-[13rem] lg:text-[15rem]">{r.label}</dt>
            <dd className="mt-[3rem] text-[16rem] [overflow-wrap:anywhere] font-bold leading-[1.2] [font-variant-numeric:tabular-nums] md:text-[22rem] lg:mt-[5rem] lg:text-[28rem]">{"shown" in r ? r.shown : r.value}</dd>
          </div>
          <CopyButton value={r.value} />
        </div>
      ))}
    </dl>
  );
}

export function Reference({ className = "" }: { className?: string }) {
  return <p className={`rounded-[22rem] bg-[#FBD402] p-[16rem] text-[14rem] font-bold leading-[1.35] text-ink md:p-[24rem] md:text-[18rem] lg:rounded-[28rem] lg:px-[30rem] lg:text-[22rem] ${className}`}>{o.fee.reference}</p>;
}

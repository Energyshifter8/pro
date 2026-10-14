"use client";
import { useEffect, useState } from "react";
import { hero } from "@/lib/olympiad";

// Days / hours / minutes / seconds to `hero.startsAt`; a "date coming soon" pill while it is
// null. Ticks only on the client, so the server markup shows dashes.
export default function Countdown({ className = "" }: { className?: string }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    if (!hero.startsAt) return;
    setNow(Date.now());
    const iv = window.setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(iv);
  }, []);
  const pill = `inline-flex min-h-[44rem] items-center gap-[10rem] rounded-full border-[2rem] border-lilac/25 bg-white/[.06] px-[18rem] py-[10rem] text-[13rem] font-bold text-white backdrop-blur-[8rem] md:min-h-[58rem] md:px-[24rem] md:text-[17rem] lg:min-h-[76rem] lg:gap-[14rem] lg:px-[30rem] lg:text-[19rem] ${className}`;
  const dot = <span aria-hidden className="h-[8rem] w-[8rem] shrink-0 animate-pulse rounded-full bg-lime lg:h-[11rem] lg:w-[11rem]" />;
  if (!hero.startsAt) return <p className={pill}>{dot}{hero.dateSoon}</p>;
  const left = now === null ? null : Math.max(0, new Date(hero.startsAt).getTime() - now);
  if (left === 0) return <p className={pill}>{dot}{hero.started}</p>;
  const parts = left === null ? null : [Math.floor(left / 864e5), Math.floor(left / 36e5) % 24, Math.floor(left / 6e4) % 60, Math.floor(left / 1e3) % 60];
  return (
    <p className={`${pill} gap-[14rem] lg:gap-[22rem]`} role="timer">
      {hero.units.map((u, i) => (
        <span key={u} className="inline-flex items-baseline gap-[5rem]">
          <b className="display text-[1.5em] leading-none text-lime [font-variant-numeric:tabular-nums]">{parts ? String(parts[i]).padStart(2, "0") : "--"}</b>{u}
        </span>
      ))}
    </p>
  );
}

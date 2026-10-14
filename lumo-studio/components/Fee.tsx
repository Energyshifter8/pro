"use client";
import { motion, useReducedMotion } from "framer-motion";
import { fee } from "@/lib/olympiad";
import { openRegister } from "@/lib/store";
import { outQuint } from "@/lib/ease";
import { Frag, useInViewToggle, useLineProgress } from "./ui/LineReveal";
import { GlyphText, capMarkGap, fitSpacing, plain } from "./ui/GlyphText";
import { useRef } from "react";
import ArrowButton from "./ui/ArrowButton";
import Wave from "./Wave";
import { BankRows, Reference } from "./olympiad/BankInfo";

export default function Fee() {
  const title = useRef<HTMLHeadingElement>(null);
  const seen = useInViewToggle(title);
  const lines = [useLineProgress(seen, 0), useLineProgress(seen, 0.3)];
  const reduce = useReducedMotion();
  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: "60rem" },
    whileInView: { opacity: 1, y: "0rem" },
    viewport: { once: true, margin: "0px 0px -10% 0px" },
    transition: { duration: 0.9, delay, ease: outQuint },
  });

  return (
    <>
      <Wave fill="#c2ec40" />
      <section id="fee" className="relative bg-lime pb-[70rem] pt-[50rem] text-ink md:pb-[110rem] md:pt-[80rem] lg:pb-[170rem] lg:pt-[110rem]">
        <div className="relative mx-auto flex max-w-[1920rem] flex-col items-center px-[16rem] md:px-[24rem] lg:px-[80rem]">
          <h2 ref={title} aria-label={fee.title.map(plain).join(" ")} style={fitSpacing()}
            className="display text-center text-[70rem] leading-[0.8] md:text-[138rem] lg:text-[250rem]">
            {fee.title.map((l, i) => (
              <Frag key={i} p={lines[i]} d={0.92} off={0.3} className={`block ${capMarkGap(l, i)}`}>
                <GlyphText text={l} lh={0.8} mark="inline-block rounded-full bg-ink px-[0.14em] text-lime" />
              </Frag>
            ))}
          </h2>
          <motion.ul {...rise(0)} className="mt-[28rem] flex flex-col items-center gap-[10rem] md:mt-[40rem] md:gap-[14rem] lg:mt-[64rem] lg:flex-row lg:gap-[40rem]">
            {fee.tiers.map((t) => (
              <li key={t.who} className="flex items-center gap-[14rem] rounded-full bg-ink px-[28rem] py-[12rem] md:gap-[20rem] md:px-[40rem] md:py-[16rem] lg:gap-[26rem] lg:px-[56rem] lg:py-[22rem]">
                <span className="text-[15rem] font-bold text-lilac md:text-[22rem] lg:text-[28rem]">{t.who}</span>
                <span className="display text-[44rem] leading-none text-lime md:text-[64rem] lg:text-[100rem]">{t.amount}</span>
              </li>
            ))}
          </motion.ul>
          <div className="mt-[40rem] grid w-full max-w-[1520rem] gap-[24rem] md:mt-[64rem] lg:mt-[110rem] lg:grid-cols-[5fr_7fr] lg:items-center lg:gap-[60rem]">
            <motion.ul {...rise(0)} className="flex flex-col gap-[12rem] text-[16rem] font-semibold leading-[1.35] md:text-[21rem] lg:gap-[20rem] lg:text-[28rem]">
              {fee.notes.map((n) => (
                <li key={n} className="flex gap-[12rem] lg:gap-[18rem]"><span aria-hidden className="mt-[0.42em] h-[9rem] w-[9rem] shrink-0 rounded-full bg-ink lg:h-[13rem] lg:w-[13rem]" />{n}</li>
              ))}
            </motion.ul>
            <motion.div {...rise(0.1)} className="rounded-[36rem] bg-ink p-[14rem] md:p-[28rem] lg:p-[40rem]">
              <p className="mb-[12rem] px-[6rem] text-[13rem] font-bold uppercase tracking-[0.06em] text-lilac md:mb-[18rem] md:text-[16rem] lg:mb-[22rem] lg:text-[18rem]">{fee.cardTitle}</p>
              <BankRows />
              <Reference className="mt-[8rem] lg:mt-[12rem]" />
              {fee.qr && (
                <div className="mt-[8rem] flex items-center gap-[16rem] rounded-[22rem] bg-white p-[14rem] lg:mt-[12rem] lg:rounded-[28rem] lg:p-[20rem]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={fee.qr} alt={fee.qrLabel} className="block aspect-square w-[120rem] lg:w-[200rem]" />
                  <p className="text-[14rem] font-bold md:text-[18rem] lg:text-[22rem]">{fee.qrLabel}</p>
                </div>
              )}
            </motion.div>
          </div>
          <ArrowButton onClick={openRegister}
            className="mt-[40rem] gap-[3rem] text-[16rem] font-bold lowercase leading-[1.2] [--arrow-size:49rem] md:mt-[64rem] md:text-[20rem] md:[--arrow-size:60rem] lg:mt-[96rem] lg:text-[19rem] lg:[--arrow-size:70.8rem]"
            pillClass="rounded-[210rem] bg-ink px-[28rem] py-[14.9rem] text-lime md:px-[34rem] md:py-[18rem] lg:px-[31rem] lg:py-[24rem]"
            arrowClass="bg-pink text-white">
            {fee.cta}
          </ArrowButton>
        </div>
      </section>
      <Wave fill="#150734" />
      <div aria-hidden className="h-[50rem] bg-ink md:h-[90rem] lg:h-[140rem]" />
    </>
  );
}

"use client";
import { useCallback, useEffect, useState } from "react";
import { register as r, ui as copy } from "@/lib/olympiad";
import { REGISTER_EVENT, ui, useUI } from "@/lib/store";
import { usePresence } from "@/lib/usePresence";
import { fitSpacing } from "../ui/GlyphText";
import Bubble from "../ui/Bubble";
import { BankRows, Reference } from "../olympiad/BankInfo";
import { Face, Select, field, fieldLabel } from "./ModalParts";

// Registration modal, opened by the window event REGISTER_EVENT ("open-register"). Opening:
// backdrop blurs, the violet card scales in with a soft overshoot while the white and lime
// layers fan out, then the title, fields and close button rise in. Two columns on desktop.
// With `register.endpoint` set the form is POSTed as JSON; without one, submitting goes
// straight to the success screen (fee + bank details + payment reference).
type Status = "form" | "sending" | "done" | "error";
type Key = keyof typeof r.fields;
const EMPTY: Record<Key, string> = { lastName: "", firstName: "", email: "", studentCode: "", phone: "" };
// Keep the 8 local digits, also when a number is pasted as "+976 8909-9473".
const phoneDigits = (s: string) => {
  const d = s.replace(/\D/g, "");
  return (d.length > 8 && d.startsWith("976") ? d.slice(3) : d).slice(0, 8);
};
const INPUT: Record<Key, React.InputHTMLAttributes<HTMLInputElement>> = {
  lastName: { autoComplete: "family-name" },
  firstName: { autoComplete: "given-name" },
  email: { type: "email", autoComplete: "email" },
  studentCode: { autoComplete: "off" },
  phone: { type: "tel", inputMode: "numeric", autoComplete: "tel-national", pattern: "\\d{8}", title: r.phoneHint },
};

export default function RegisterModal() {
  const open = useUI((s) => s.register);
  const close = useCallback(() => ui.set({ register: false }), []);
  const { mounted, on } = usePresence(open, 300, close);
  const [values, setValues] = useState(EMPTY);
  const [course, setCourse] = useState("");
  const [major, setMajor] = useState("");
  const [tried, setTried] = useState(false);
  const [status, setStatus] = useState<Status>("form");

  useEffect(() => {
    const show = () => ui.set({ register: true, menu: false });
    window.addEventListener(REGISTER_EVENT, show);
    return () => window.removeEventListener(REGISTER_EVENT, show);
  }, []);
  // after a finished registration, reopening starts a fresh form
  useEffect(() => {
    if (open || status !== "done") return;
    setStatus("form"); setTried(false); setValues(EMPTY); setCourse(""); setMajor("");
  }, [open, status]);
  if (!mounted) return null;

  const d = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    setTried(true);
    if (!course || !major) return;
    if (!r.endpoint) { setStatus("done"); return; }
    setStatus("sending");
    try {
      const res = await fetch(r.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, course, major, submittedAt: new Date().toISOString() }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  };
  const input = (k: Key, delay: number) => (
    <label className={`dsc-in ${field} flex items-center gap-[10rem] focus-within:shadow-[0_0_0_3rem_#c2ec40] md:gap-[16rem] lg:h-[76rem]`} style={d(delay)}>
      <span className={fieldLabel}>{r.fields[k].label}</span>
      <input required name={k} placeholder={r.fields[k].placeholder} value={values[k]} {...INPUT[k]}
        onChange={(e) => { const v = e.target.value; setValues((x) => ({ ...x, [k]: k === "phone" ? phoneDigits(v) : v })); }}
        className="h-full min-w-0 flex-1 bg-transparent outline-none placeholder:text-ink/[.32]" />
    </label>
  );
  const missing = tried && (!course || !major);

  return (
    <div className={`dsc fixed inset-0 z-[200] flex flex-col items-center overflow-y-auto overscroll-contain py-[24rem] md:py-[40rem] lg:block lg:overflow-visible lg:py-0 ${on ? "on" : ""}`}
      role="dialog" aria-modal="true" aria-labelledby="reg-title">
      <div className="dsc-backdrop" onClick={close} />
      <div className="dsc-card relative mx-auto my-auto w-[340rem] px-[14rem] pb-[44rem] pt-[40rem] md:w-[624rem] md:px-[18rem] md:pb-[138rem] md:pt-[94rem] lg:absolute lg:left-1/2 lg:top-1/2 lg:m-0 lg:h-[919rem] lg:w-[1758rem] lg:-translate-x-1/2 lg:-translate-y-1/2 lg:p-0">
        <Face fill="#fff" className="dsc-layer white z-[-1] max-lg:-inset-x-[44rem] md:max-lg:-inset-x-[81rem] lg:z-auto" />
        <Face fill="#c2ec40" className="dsc-layer lime z-[-1] max-lg:-inset-x-[44rem] md:max-lg:-inset-x-[81rem] lg:z-auto" />
        <Face fill="#4e00ff" className="z-[-1] [filter:drop-shadow(0_24rem_48rem_rgba(21,7,52,0.28))] max-lg:-inset-x-[44rem] md:max-lg:-inset-x-[81rem] lg:z-auto" />

        <button type="button" onClick={close} aria-label={copy.close} data-cursor="pointer"
          className="dsc-close absolute right-[12rem] top-[12rem] z-10 flex h-[52rem] w-[52rem] items-center justify-center rounded-full bg-ink md:right-[18rem] md:top-[18rem] md:h-[64rem] md:w-[64rem] lg:right-[127rem] lg:top-[165rem] lg:h-[150rem] lg:w-[150rem]">
          <svg viewBox="0 0 88 88" aria-hidden className="block h-[60%] w-[60%]"><path d="M22 22l44 44M66 22L22 66" stroke="#c2ec40" strokeWidth="12" strokeLinecap="round" /></svg>
        </button>

        <h2 id="reg-title" style={fitSpacing()}
          className="dsc-title display mt-[36rem] w-full text-center text-[50rem] leading-[0.8] text-white md:mt-0 md:text-[130rem] lg:absolute lg:left-[146rem] lg:top-[150rem] lg:w-auto lg:whitespace-nowrap lg:text-left lg:text-[200rem]">
          {r.title}
        </h2>

        {status === "done" ? (
          <div className="dsc-in mt-[24rem] flex flex-col gap-[16rem] text-white md:mt-[48rem] lg:absolute lg:left-[146rem] lg:top-[330rem] lg:mt-0 lg:grid lg:w-[1463rem] lg:grid-cols-[5fr_7fr] lg:gap-[40rem]" style={d(0)}>
            <div>
              <p className="text-[24rem] font-bold leading-[1.15] md:text-[34rem] lg:text-[48rem]">{r.success}</p>
              <p className="mt-[12rem] text-[14rem] leading-[1.4] text-lilac md:text-[19rem] lg:mt-[20rem] lg:text-[22rem]">{r.successNote}</p>
            </div>
            <div>
              <BankRows compact />
              <Reference className="mt-[8rem]" />
            </div>
          </div>
        ) : (
          <>
            <p className="dsc-in mt-[14rem] text-center text-[14rem] leading-[1.35] text-lilac md:mt-[28rem] md:text-[20rem] lg:absolute lg:left-[150rem] lg:top-[332rem] lg:mt-0 lg:text-left lg:text-[24rem]" style={d(0.18)}>{r.intro}</p>
            <form onSubmit={submit}
              className="mt-[18rem] flex flex-col gap-[10rem] md:mt-[40rem] lg:absolute lg:left-[146rem] lg:top-[392rem] lg:mt-0 lg:grid lg:w-[1463rem] lg:grid-cols-2 lg:gap-[12rem]">
              {input("lastName", 0.22)}
              <div className="dsc-in" style={d(0.24)}><Select placeholder={r.course.placeholder} options={r.course.options} value={course} onChange={setCourse} invalid={tried && !course} /></div>
              {input("firstName", 0.26)}
              <div className="dsc-in" style={d(0.28)}><Select label={r.major.label} placeholder={r.major.placeholder} options={r.major.options} value={major} onChange={setMajor} invalid={tried && !major} /></div>
              {input("email", 0.3)}
              {input("studentCode", 0.32)}
              {input("phone", 0.34)}
              <div className="dsc-in mt-[10rem] flex md:mt-[30rem] lg:mt-0" style={d(0.38)}>
                <Bubble type="submit" circle="bg-ink" className="h-[60rem] w-full rounded-[210rem] bg-lime text-[19rem] font-bold text-ink hover:text-white md:h-[96rem] lg:h-[76rem]">
                  {status === "sending" ? r.sending : r.button}
                </Bubble>
              </div>
              {(missing || status === "error") && (
                <p role="alert" className="text-center text-[13rem] font-bold text-[#ffd2cc] md:text-[17rem] lg:col-span-2 lg:text-left lg:text-[19rem]">
                  {status === "error" ? r.error : r.selectHint}
                </p>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  );
}

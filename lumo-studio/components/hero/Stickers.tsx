"use client";
import { motion } from "framer-motion";
import { hero } from "@/lib/olympiad";
import { INTRO, INTRO_ADAPTIVE, reducedMotion, useIntroReady } from "@/lib/intro";
import { backOut, power2Out, sineInOut } from "@/lib/ease";
import { useDesktop } from "@/lib/useMedia";

type Id = (typeof hero.badges)[number]["id"];
const stat = (id: Id) => hero.badges.find((s) => s.id === id)!;

// Star/scallop polygon in a 100×100 box; stroke + round joins soften the tips.
function star(n: number, inner: number, r = 44) {
  const pts: string[] = [];
  for (let i = 0; i < n * 2; i++) {
    const a = (Math.PI * i) / n - Math.PI / 2;
    const rr = i % 2 ? r * inner : r;
    pts.push(`${(50 + rr * Math.cos(a)).toFixed(2)},${(50 + rr * Math.sin(a)).toFixed(2)}`);
  }
  return pts.join(" ");
}

function Shape({ n, inner, stroke, className, spin }: { n: number; inner: number; stroke: number; className: string; spin: number }) {
  return (
    <svg viewBox="0 0 100 100" className={`block w-full ${className}`} aria-hidden
      style={{ animation: `spin ${Math.abs(spin)}s linear infinite ${spin < 0 ? "reverse" : ""}` }}>
      <polygon points={star(n, inner)} fill="currentColor" stroke="currentColor" strokeWidth={stroke} strokeLinejoin="round" />
    </svg>
  );
}

const label = "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-center font-semibold leading-[1.35] text-[9.5rem] md:text-[10.5rem] lg:text-[14rem]";
const num = "block leading-[1.15] text-[15rem] md:text-[16.5rem] lg:text-[22rem]";

type Def = {
  id: Id;
  box: string; // position + size per breakpoint
  float: [number, number, number]; // drift x, y (rem) and duration (s)
  rock?: [number, number, number]; // rotate from, to (deg), half-period (s)
  origin?: string;
  body: React.ReactNode;
};

const defs: Def[] = [
  {
    id: "participants", float: [19.5, 7.2, 10],
    box: "w-[82rem] left-[8rem] top-[133rem] md:w-[100rem] md:left-[560rem] md:top-[130rem] lg:w-[136rem] lg:left-[202.6rem] lg:top-[-103.9rem]",
    body: (<><Shape n={14} inner={0.74} stroke={7} spin={30} className="text-pink" />
      <p className={`${label} text-white opacity-80`}><span className={num}>{stat("participants").value}</span>{stat("participants").label}</p></>),
  },
  {
    id: "itpark", float: [5.4, 0.4, 8.4], rock: [-7, -14, 1],
    box: "h-[37rem] w-[107rem] left-[261rem] top-[227rem] md:h-[38.5rem] md:w-[131rem] md:left-[514rem] md:top-[268rem] lg:h-[53rem] lg:w-[178rem] lg:left-[1063.1rem] lg:top-[150.6rem]",
    body: (<><div className="h-full w-full rounded-[120rem] bg-lime" />
      <p className={`${label} text-ink`}>{stat("itpark").value} {stat("itpark").label}</p></>),
  },
  {
    id: "fee", float: [-20, -15.3, 8.3],
    box: "w-[59rem] left-[10rem] top-[262rem] md:w-[71.5rem] md:left-[429rem] md:top-[347rem] lg:w-[98rem] lg:left-auto lg:right-[95rem] lg:top-[157rem]",
    body: (<><Shape n={12} inner={0.88} stroke={9} spin={10} className="text-red" />
      <p className={`${label} !whitespace-normal text-white opacity-80`}>{stat("fee").label} {stat("fee").value}</p></>),
  },
  {
    id: "club", float: [20.8, 24.3, 7.8], rock: [8, 0, 0.8], origin: "100% 100%",
    box: "h-[37rem] w-[107rem] left-[17rem] top-[369.5rem] md:h-[38.5rem] md:w-[131rem] md:left-[64rem] md:top-[439rem] lg:h-[53rem] lg:w-[178rem] lg:left-[204.6rem] lg:top-[350rem]",
    body: (<><div className="h-full w-full rounded-bl-[120rem] rounded-tr-[120rem] bg-blue" />
      <p className={`${label} text-white opacity-80`}>{stat("club").value}<br />{stat("club").label}</p></>),
  },
  {
    id: "fund", float: [4.4, 21.9, 12.8],
    box: "w-[82rem] left-[118rem] top-[392rem] md:w-[100rem] md:left-[265rem] md:top-[526rem] lg:w-[136rem] lg:left-[464.2rem] lg:top-[598.8rem]",
    body: (<><Shape n={20} inner={0.87} stroke={5} spin={-25} className="text-white" />
      <p className={`${label} !whitespace-normal text-ink`}>{stat("fund").label}<span className={num}>{stat("fund").value}</span></p></>),
  },
  {
    id: "first", float: [-2.6, -0.1, 11], rock: [8, 8, 1],
    box: "w-[100rem] left-[268rem] top-[124rem] md:w-[122rem] md:left-[574rem] md:top-[672rem] lg:w-[167rem] lg:left-[1468.2rem] lg:top-[627.6rem]",
    body: (<><svg viewBox="0 0 167 74" className="block w-full text-violet" aria-hidden>
        <path fill="currentColor" d="M5 15C22 3 40 4 57 12s35 9 53 1 37-8 52 2l2 44c-15-10-34-11-52-2s-36 9-53 1-35-9-53 3z" />
      </svg>
      <p className={`${label} text-white opacity-80`}>{stat("first").label}<br />{stat("first").value}</p></>),
  },
];

export default function Stickers() {
  const ready = useIntroReady();
  const desktop = useDesktop();
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[3] lg:z-[1]">
      {defs.map((d) => {
        const rm = ready && reducedMotion();
        const rest = d.rock ? d.rock[0] : 0;
        return (
          <motion.div key={d.id + (desktop ? "d" : "m")} className={`absolute ${d.box}`} style={{ transformOrigin: d.origin ?? "50% 50%", rotate: rest }}
            initial={{ scale: desktop ? 0.5 : 0, opacity: 0 }}
            animate={ready ? { scale: 1, opacity: 1 } : undefined}
            transition={rm ? { duration: 0 } : desktop
              ? { delay: INTRO.stickers[d.id], duration: 0.45, ease: power2Out }
              : { delay: INTRO_ADAPTIVE.stickers[d.id], duration: 0.4, ease: (t: number) => backOut(t) }}>
            <motion.div className="relative h-full w-full"
              animate={ready && !rm ? { x: [0, `${d.float[0]}rem`], y: [0, `${d.float[1]}rem`] } : undefined}
              transition={{ duration: d.float[2], ease: sineInOut, repeat: Infinity, repeatType: "mirror" }}>
              <motion.div className="relative h-full w-full"
                animate={ready && !rm && d.rock && d.rock[0] !== d.rock[1] ? { rotate: [0, d.rock[1] - d.rock[0]] } : undefined}
                transition={{ duration: d.rock?.[2], ease: sineInOut, repeat: Infinity, repeatType: "mirror" }}
                style={{ transformOrigin: d.origin ?? "50% 50%" }}>
                {d.body}
              </motion.div>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}

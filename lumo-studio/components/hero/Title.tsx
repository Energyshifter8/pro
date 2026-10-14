"use client";
import { InlineGlyph } from "../Glyph";
import { INTRO, INTRO_ADAPTIVE, useIntroReady } from "@/lib/intro";
import { Frag, useLineProgress } from "../ui/LineReveal";
import PenLine from "./PenLine";

const TITLE = "Итгэл төрүүлж, ашиг авчирдаг вэбсайт.";

// Decorative glyph slots (Cyrillic Т / А / В drawn as stretched Plex T / a / B), measured
// at line-height 1 — see InlineGlyph.
const G = {
  t: { k: "T", adv: 0.648, ix: 0.052, asc: 0.735, iw: 0.592, ih: 0.724 },
  a: { k: "a", adv: 0.83, ix: 0.014, asc: 0.761, iw: 0.8, ih: 0.763 },
  b: { k: "B", adv: 0.62, ix: 0.03, asc: 0.735, iw: 0.56, ih: 0.724 },
} as const;
// Desktop layout (≥992px): three lines absolutely placed in em of the 240rem headline at the
// reference line tops (the last one 0.1em lower so the breve of Й clears the line above);
// the middle line hangs from the right edge. Each line rises through the same skewed mask
// as before, and the pen line is drawn over them.
const LINE_TOP = [0.0833, 1.06, 2.02];
const LH = 0.78;
const LINES = [
  <>И<InlineGlyph {...G.t} lh={LH} />ГЭЛ ТӨРҮҮЛЖ,</>,
  <><InlineGlyph {...G.a} lh={LH} />ШИГ АВЧИРДАГ</>,
  <><InlineGlyph {...G.b} lh={LH} />ЭБСАЙТ.</>,
];

function DesktopTitle({ ready }: { ready: boolean }) {
  const lines = [useLineProgress(ready, INTRO.heroLines[0]), useLineProgress(ready, INTRO.heroLines[1]), useLineProgress(ready, INTRO.heroLines[2])];
  return (
    <h1 aria-label={TITLE} className="display relative hidden pt-[20rem] text-[240rem] leading-[0.78] text-lilac lg:block">
      {LINES.map((content, i) => (
        <Frag key={i} p={lines[i]} d={1.01} off={0} className={`absolute z-[1] whitespace-pre ${i === 1 ? "right-0" : "left-0"}`} style={{ top: `${LINE_TOP[i]}em` }}>
          {content}
        </Frag>
      ))}
      <PenLine />
    </h1>
  );
}

// Below 992px: five stacked lines with inline glyphs (slots measured at lh 1).
function AdaptiveTitle({ ready }: { ready: boolean }) {
  const ps = INTRO_ADAPTIVE.heroLines.map((d) => useLineProgress(ready, d)); // fixed-length list
  const rows: { cls: string; content: React.ReactNode }[] = [
    { cls: "md:inline-block md:ml-[24rem] ml-[16rem]", content: <>И<InlineGlyph {...G.t} />ГЭЛ</> },
    { cls: "md:inline-block md:ml-[30rem] md:mt-0 ml-[16rem] mt-[-13.5rem]", content: <>ТӨРҮҮЛЖ,</> },
    { cls: "text-right md:mr-[24rem] md:mt-[21rem] mr-[16rem] mt-[-6rem]", content: <><InlineGlyph {...G.a} />ШИГ</> },
    { cls: "md:ml-[24rem] md:mt-[21rem] ml-[16rem] mt-[-14.5rem]", content: <>АВЧИРДАГ</> },
    { cls: "text-right md:mr-[23rem] md:mt-[13rem] mr-[16rem] mt-[-4rem]", content: <><InlineGlyph {...G.b} />ЭБСАЙТ.</> },
  ];
  return (
    <h1 aria-label={TITLE} className="display relative z-[2] m-0 text-[76rem] leading-none tracking-[-0.017em] text-lilac md:text-[108rem] lg:hidden">
      {rows.map((r, i) => (
        <Frag key={i} p={ps[i]} d={1.165} off={0.3} className={`block whitespace-nowrap ${r.cls}`}>{r.content}</Frag>
      ))}
    </h1>
  );
}

export default function Title() {
  const ready = useIntroReady();
  return (
    <>
      <DesktopTitle ready={ready} />
      <div className="pt-[190rem] md:pt-[201rem] lg:hidden">
        <AdaptiveTitle ready={ready} />
      </div>
    </>
  );
}

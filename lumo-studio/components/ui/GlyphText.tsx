import { FIT } from "@/lib/thunder";
import type { GlyphKey } from "@/lib/glyphs";
import { InlineGlyph } from "../Glyph";

export type GlyphSlot = { k: GlyphKey; adv: number; ix: number; asc: number; iw: number; ih: number };

// Gives a display word the reference face's advance width: an inline-block of that width
// with the text scaled horizontally inside. Words missing from the table render as-is.
export function Fit({ t, wt = 700 }: { t: string; wt?: 700 | 800 }) {
  const row = FIT[t.toUpperCase()];
  if (!row) return <>{t}</>;
  const target = wt === 800 ? row[1] : row[0];
  return (
    <span className="inline-block whitespace-pre text-left" style={{ width: `${target}em` }}>
      <span className="inline-block origin-left" style={{ transform: `scaleX(${(target / row[2]).toFixed(4)})` }}>{t}</span>
    </span>
  );
}

// Word spacing that turns our space (0.1915em) into the reference's (0.170em at 700, 0.165em at 800).
export const fitSpacing = (wt: 700 | 800 = 700): React.CSSProperties => ({ letterSpacing: 0, wordSpacing: wt === 800 ? "-0.0265em" : "-0.0215em" });

// Display lines set at 0.8–0.85 leading leave ~0.1em between lines, but the breve of Й (and
// the dots of Ё) rise ~0.24em above cap height. A heading line after the first that holds
// one gets this extra top margin so the mark clears the line above.
export const capMarkGap = (line: string, i: number) => (i > 0 && /[ЙйЁё]/.test(line) ? "mt-[0.14em]" : "");

// Copy with {x} markers rendered as stretched glyphs. A word holding a glyph never breaks
// around it. With `fit`, plain word parts get reference advances (display face only).
export function GlyphText({ text, glyphs = {}, lh = 1, extra = 0, fit = false, wt = 700 }: { text: string; glyphs?: Record<string, GlyphSlot>; lh?: number; extra?: number; fit?: boolean; wt?: 700 | 800 }) {
  const words = text.split(" ");
  const part = (s: string, key: number) => (fit && s ? <Fit key={key} t={s} wt={wt} /> : s);
  return (
    <>
      {words.map((w, wi) => {
        const sep = wi < words.length - 1 ? " " : "";
        if (!/\{.\}/.test(w)) return <span key={wi}>{part(w, 0)}{sep}</span>;
        return (
          <span key={wi}>
            <span className="whitespace-nowrap">
              {w.split(/(\{.\})/).map((p, i) => {
                const m = p.match(/^\{(.)\}$/);
                return m ? <InlineGlyph key={i} {...glyphs[m[1]]} lh={lh} extra={extra} /> : part(p, i);
              })}
            </span>
            {sep}
          </span>
        );
      })}
    </>
  );
}

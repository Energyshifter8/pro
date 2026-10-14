import type { GlyphKey } from "@/lib/glyphs";
import { InlineGlyph } from "../Glyph";

export type GlyphSlot = { k: GlyphKey; adv: number; ix: number; asc: number; iw: number; ih: number };

// Tighter word spacing for display headings.
export const fitSpacing = (): React.CSSProperties => ({ wordSpacing: "-0.0215em" });

// Display lines set at 0.8–0.85 leading leave ~0.1em between lines, but the breve of Й (and
// the dots of Ё) rise ~0.24em above cap height. A heading line after the first that holds
// one gets this extra top margin so the mark clears the line above.
export const capMarkGap = (line: string, i: number) => (i > 0 && /[ЙйЁё]/.test(line) ? "mt-[0.14em]" : "");

// Copy with {x} markers drawn as stretched glyphs; a word holding a glyph never breaks around
// it. [..] wraps a phrase in `mark` (a class: the lime pill or marker, or just a colour).
export function GlyphText({ text, glyphs = {}, lh = 1, extra = 0, mark = "pill-mark" }: { text: string; glyphs?: Record<string, GlyphSlot>; lh?: number; extra?: number; mark?: string }) {
  const words = (s: string) => s.split(" ").map((w, wi, all) => {
    const sep = wi < all.length - 1 ? " " : "";
    if (!/\{.\}/.test(w)) return <span key={wi}>{w}{sep}</span>;
    return (
      <span key={wi}>
        <span className="whitespace-nowrap">
          {w.split(/(\{.\})/).map((p, i) => {
            const m = p.match(/^\{(.)\}$/);
            return m ? <InlineGlyph key={i} {...glyphs[m[1]]} lh={lh} extra={extra} /> : p;
          })}
        </span>
        {sep}
      </span>
    );
  });
  return (
    <>
      {text.split(/(\[[^\]]+\])/).map((seg, i) =>
        seg.startsWith("[") ? <span key={i} className={mark}>{words(seg.slice(1, -1))}</span> : <span key={i}>{words(seg)}</span>,
      )}
    </>
  );
}

// Plain text of a line: markers removed.
export const plain = (t: string) => t.replace(/[{}[\]]/g, "");

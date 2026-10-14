import type { GlyphKey } from "@/lib/glyphs";
import { InlineGlyph } from "../Glyph";

export type GlyphSlot = { k: GlyphKey; adv: number; ix: number; asc: number; iw: number; ih: number };

export const fitSpacing = (): React.CSSProperties => ({ wordSpacing: "-0.0215em" });

export const capMarkGap = (line: string, i: number) => (i > 0 && /[ЙйЁё]/.test(line) ? "mt-[0.14em]" : "");

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

export const plain = (t: string) => t.replace(/[{}[\]]/g, "");

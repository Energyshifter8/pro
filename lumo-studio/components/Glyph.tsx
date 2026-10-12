import { GLYPHS, type GlyphKey } from "@/lib/glyphs";

// A Plex outline stretched to fill its box — the decorative "swap" letters in headlines.
export function Glyph({ k, className = "", style }: { k: GlyphKey; className?: string; style?: React.CSSProperties }) {
  const g = GLYPHS[k];
  return (
    <svg aria-hidden viewBox={g.vb} preserveAspectRatio="none" fill="currentColor" className={className} style={style}>
      <path d={g.d} />
    </svg>
  );
}

// Inline variant: reserves `adv` em of advance in a line of height `lh` em and draws the
// glyph into an ink box whose top sits `asc` em above the baseline of the fitted display
// face (baseline = lh/2 + 0.261em). Values come from measuring the reference's slots.
export function InlineGlyph({ k, adv, ix, asc, iw, ih, lh = 1 }: { k: GlyphKey; adv: number; ix: number; asc: number; iw: number; ih: number; lh?: number }) {
  return (
    <span aria-hidden className="relative inline-block align-top" style={{ width: `${adv}em`, height: `${lh}em` }}>
      <Glyph k={k} className="absolute" style={{ left: `${ix}em`, top: `${lh / 2 + 0.261 - asc}em`, width: `${iw}em`, height: `${ih}em` }} />
    </span>
  );
}

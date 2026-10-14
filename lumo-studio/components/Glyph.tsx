import { GLYPHS, type GlyphKey } from "@/lib/glyphs";

export function Glyph({ k, className = "", style }: { k: GlyphKey; className?: string; style?: React.CSSProperties }) {
  const g = GLYPHS[k];
  return (
    <svg aria-hidden viewBox={g.vb} preserveAspectRatio="none" fill="currentColor" className={className} style={style}>
      <path d={g.d} />
    </svg>
  );
}

export function InlineGlyph({ k, adv, ix, asc, iw, ih, lh = 1, extra = 0 }: { k: GlyphKey; adv: number; ix: number; asc: number; iw: number; ih: number; lh?: number; extra?: number }) {
  return (
    <span aria-hidden className="relative inline-block align-top" style={{ width: `${adv}em`, height: `${lh}em`, marginBottom: extra ? `${extra}em` : undefined }}>
      <Glyph k={k} className="absolute" style={{ left: `${ix}em`, top: `${lh / 2 + 0.261 - asc}em`, width: `${iw}em`, height: `${ih}em` }} />
    </span>
  );
}

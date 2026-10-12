// Original tile artwork: a coloured shape with an ink outline and two alternating icons.
const INK = "#150734";

export type Shape = "square" | "circle" | "tag";

export function TileShape({ shape, color }: { shape: Shape; color: string }) {
  const common = { fill: color, stroke: INK, strokeWidth: 4.1 };
  if (shape === "circle") return <circle cx="170" cy="170" r="167.9" {...common} />;
  if (shape === "tag")
    return <path {...common} strokeLinejoin="round" d="M32 2.05h228c10.6 0 20.4 5.6 25.8 14.7l76.4 129.6a40 40 0 010 41.2l-76.4 135.7c-5.4 9.1-15.2 14.7-25.8 14.7H32A30 30 0 012.05 308V32A30 30 0 0132 2.05z" />;
  return <rect x="2.05" y="2.05" width="335.9" height="335.9" rx="34" {...common} />;
}

// Icons are drawn on a 340×340 canvas (the tag tile shifts them left within its 370 width).
export const ICONS: Record<string, React.ReactNode> = {
  cursor: <path d="M118 78v186l46-44 32 66 32-15-32-65h64z" fill={INK} stroke={INK} strokeWidth="14" strokeLinejoin="round" />,
  heart: <path d="M170 262c-60-42-96-76-96-118 0-30 23-52 52-52 19 0 34 10 44 25 10-15 25-25 44-25 29 0 52 22 52 52 0 42-36 76-96 118z" fill={INK} />,
  chart: <g fill={INK}><rect x="96" y="186" width="42" height="72" rx="14" /><rect x="149" y="138" width="42" height="120" rx="14" /><rect x="202" y="86" width="42" height="172" rx="14" /></g>,
  crown: <g fill={INK}><path d="M84 116l46 40 40-66 40 66 46-40-14 106H98z" stroke={INK} strokeWidth="12" strokeLinejoin="round" /><rect x="96" y="236" width="148" height="28" rx="14" /></g>,
  bolt: <path d="M196 70l-92 116h56l-20 86 96-122h-58z" fill={INK} stroke={INK} strokeWidth="10" strokeLinejoin="round" />,
  star: <path d="M170 82l26 56 61 7-45 41 12 60-54-30-54 30 12-60-45-41 61-7z" fill={INK} stroke={INK} strokeWidth="10" strokeLinejoin="round" />,
  smile: <g fill="none" stroke={INK} strokeWidth="22" strokeLinecap="round"><path d="M126 138v18M214 138v18" /><path d="M114 196c30 44 82 44 112 0" /></g>,
  eye: <g><path d="M74 170c26-46 62-68 96-68s70 22 96 68c-26 46-62 68-96 68s-70-22-96-68z" fill={INK} /><circle cx="170" cy="170" r="30" fill="#fff" /><circle cx="170" cy="170" r="13" fill={INK} /></g>,
  spark: <path d="M170 74c8 54 28 74 82 82v28c-54 8-74 28-82 82h-28c-8-54-28-74-82-82v-28c54-8 74-28 82-82z" fill={INK} transform="translate(14 0)" />,
  note: <g fill={INK}><path d="M150 96l94-22v136h-26V112l-42 10v108h-26z" /><ellipse cx="118" cy="232" rx="34" ry="26" /><ellipse cx="206" cy="210" rx="34" ry="26" /></g>,
};

// Original mascot: a scalloped lime body with rubber-hose limbs, waving.
const INK = "#150734";

function scallop(cx: number, cy: number, R: number, n: number) {
  const pt = (a: number) => [cx + R * Math.cos(a), cy + R * Math.sin(a)];
  const r = R * Math.sin(Math.PI / n) * 1.18;
  let d = "";
  for (let i = 0; i <= n; i++) {
    const [x, y] = pt((2 * Math.PI * i) / n - Math.PI / 2);
    d += i === 0 ? `M${x.toFixed(1)} ${y.toFixed(1)}` : `A${r.toFixed(1)} ${r.toFixed(1)} 0 0 1 ${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d + "Z";
}
const BODY = scallop(290, 330, 178, 12);

export default function Mascot({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 580 706" className={className} aria-hidden fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* limbs behind the body */}
      <g stroke={INK} strokeWidth="26">
        <path d="M232 470c-6 60-24 104-58 142" />
        <path d="M352 470c10 58 34 100 72 134" />
        <path d="M136 372c-46 8-78 34-96 76" />
        <path d="M446 300c40-30 58-74 56-128" />
      </g>
      {/* shoes */}
      <g stroke={INK} strokeWidth="9">
        <path d="M108 640c4-34 36-52 70-44 30 7 42 30 36 54-30 8-74 8-106-10z" fill="#fff" />
        <path d="M404 596c30-12 66 0 76 32 6 20-2 34-14 40-34 4-68-8-86-34 2-18 10-32 24-38z" fill="#fff" />
        <path d="M110 642c34 16 74 16 104 8M382 632c18 24 50 36 84 34" stroke={INK} strokeWidth="14" />
      </g>
      {/* body */}
      <path d={BODY} fill="#c2ec40" stroke={INK} strokeWidth="10" />
      {/* face */}
      <g stroke={INK} strokeWidth="8">
        <ellipse cx="242" cy="298" rx="34" ry="46" fill="#fff" />
        <ellipse cx="330" cy="292" rx="34" ry="46" fill="#fff" />
        <path d="M216 236c14-12 34-14 50-6M308 228c16-10 36-8 50 4" />
      </g>
      <circle cx="254" cy="290" r="16" fill={INK} />
      <circle cx="342" cy="284" r="16" fill={INK} />
      <path d="M228 372c22 44 96 48 124-6-40 14-84 16-124 6z" fill={INK} stroke={INK} strokeWidth="8" />
      <path d="M262 398c12-12 34-14 50-2-14 12-36 14-50 2z" fill="#f04c8a" />
      {/* gloves */}
      <g stroke={INK} strokeWidth="9" fill="#fff">
        <path d="M18 470c-8-30 14-56 40-54 24 2 40 22 36 46-4 26-30 40-52 34-10-3-20-12-24-26z" />
        <path d="M60 418l-6-26c-2-12 14-16 18-4l8 24" />
        <path d="M470 176c-6-26 2-56 26-62l2-36c1-14 20-14 21 0l2 34 4-40c1-14 20-13 20 1l-2 42 10-30c4-12 22-8 19 6l-12 46c10 24 2 52-22 62-30 12-62 2-68-23z" />
      </g>
    </svg>
  );
}

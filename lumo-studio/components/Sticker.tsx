// Round mood badge (original artwork): a coloured disc with a text ring and a starburst face.
type Face = "angry" | "happy" | "curious";
const INK = "#150734";

function starPath(cx: number, cy: number, n: number, r1: number, r2: number) {
  let d = "";
  for (let i = 0; i < n * 2; i++) {
    const a = (Math.PI * i) / n - Math.PI / 2, r = i % 2 ? r2 : r1;
    d += `${i ? "L" : "M"}${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`;
  }
  return d + "Z";
}

function FaceArt({ face }: { face: Face }) {
  return (
    <g>
      <path d={starPath(100, 100, 14, 52, 40)} fill="#fff" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      {face === "angry" && (<>
        <path d="M78 86l16 7M122 86l-16 7" stroke={INK} strokeWidth="4.5" strokeLinecap="round" />
        <circle cx="88" cy="101" r="5.5" fill={INK} /><circle cx="112" cy="101" r="5.5" fill={INK} />
        <path d="M86 125q14-10 28 0" stroke={INK} strokeWidth="4.5" fill="none" strokeLinecap="round" />
      </>)}
      {face === "happy" && (<>
        <path d="M80 98q8-10 16 0M104 98q8-10 16 0" stroke={INK} strokeWidth="4.5" fill="none" strokeLinecap="round" />
        <path d="M82 112q18 22 36 0z" fill={INK} />
      </>)}
      {face === "curious" && (<>
        <circle cx="87" cy="99" r="11" fill="#fff" stroke={INK} strokeWidth="3" /><circle cx="113" cy="99" r="11" fill="#fff" stroke={INK} strokeWidth="3" />
        <circle cx="89" cy="101" r="5" fill={INK} /><circle cx="115" cy="101" r="5" fill={INK} />
        <circle cx="100" cy="123" r="5" fill={INK} />
      </>)}
    </g>
  );
}

export default function Sticker({ label, face, color, className = "" }: { label: string; face: Face; color: string; className?: string }) {
  const id = `ring-${face}`;
  // two repeats spaced to exactly the ring circumference (2π·79), so every label closes the circle
  const text = `${label.toUpperCase()} • ${label.toUpperCase()} • `;
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <circle cx="100" cy="100" r="96" fill={color} stroke={INK} strokeWidth="4" />
      <defs><path id={id} d="M100 100m-79 0a79 79 0 1 1 158 0a79 79 0 1 1-158 0" /></defs>
      <text fontSize="14.5" fontWeight="700" fill={INK} letterSpacing="1.5" style={{ fontFamily: "var(--font-sans)" }}>
        <textPath href={`#${id}`} textLength={496} lengthAdjust="spacing">{text}</textPath>
      </text>
      <FaceArt face={face} />
    </svg>
  );
}

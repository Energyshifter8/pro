// Prize visual (original artwork): the place colour with faint rays, an ink medal carrying
// the place number, the place label and the amount. Fills its box (slice) from the centre.
function medal(n: number, r1: number, r2: number) {
  let d = "";
  for (let i = 0; i < n * 2; i++) {
    const a = (Math.PI * i) / n - Math.PI / 2, r = i % 2 ? r2 : r1;
    d += `${i ? "L" : "M"}${(207 + r * Math.cos(a)).toFixed(1)} ${(250 + r * Math.sin(a)).toFixed(1)}`;
  }
  return d + "Z";
}

export default function PrizeArt({ n, place, amount, color, className = "" }: { n: number; place: string; amount: string; color: string; className?: string }) {
  return (
    <svg viewBox="0 0 414 564" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden>
      <rect width="414" height="564" fill={color} />
      <g fill="#150734" opacity=".07">
        {Array.from({ length: 12 }, (_, i) => <rect key={i} x="197" y="-60" width="20" height="620" rx="10" transform={`rotate(${i * 15} 207 250)`} />)}
      </g>
      <path d="M160 330l-30 120 42-22 30 38 18-130zM254 330l30 120-42-22-30 38-18-130z" fill="#150734" />
      <path d={medal(14, 128, 108)} fill="#150734" />
      <circle cx="207" cy="250" r="86" fill="none" stroke={color} strokeWidth="6" />
      <text x="207" y="300" textAnchor="middle" fill={color} style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 150 }}>{n}</text>
      <text x="30" y="66" fill="#150734" style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 32, letterSpacing: "0.02em" }}>{place.toUpperCase()}</text>
      <text x="207" y="530" textAnchor="middle" fill="#150734" style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 64 }}>{amount}</text>
    </svg>
  );
}

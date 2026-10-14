import { casesCopy } from "@/lib/content";

// Placeholder case visual (original artwork): a coloured panel with a browser mock showing
// the project name. Replace with real project screenshots via next/image when available.
export default function CaseArt({ name, tag, color, className = "" }: { name: string; tag: string; color: string; className?: string }) {
  const id = name.replace(/\W/g, "");
  return (
    <svg viewBox="0 0 414 564" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden>
      <defs>
        <clipPath id={`scr-${id}`}><rect x="44" y="190" width="326" height="214" rx="10" /></clipPath>
      </defs>
      <rect width="414" height="564" fill="#4e00ff" />
      <g fill={color}>
        {Array.from({ length: 12 }, (_, i) => <rect key={i} x="197" y="-60" width="20" height="560" rx="10" transform={`rotate(${i * 15} 207 280)`} opacity=".9" />)}
      </g>
      <circle cx="207" cy="280" r="120" fill="#150734" />
      <text x="30" y="70" fill="#fff" style={{ fontFamily: "var(--font-display)", fontSize: 30, letterSpacing: "0.02em" }}>{tag.toUpperCase()} · {casesCopy.web.toUpperCase()}</text>
      <circle cx="368" cy="58" r="20" fill={color} stroke="#150734" strokeWidth="4" />
      {/* laptop */}
      <rect x="34" y="180" width="346" height="234" rx="16" fill="#150734" />
      <g clipPath={`url(#scr-${id})`}>
        <rect x="44" y="190" width="326" height="214" fill="#f7f3ff" />
        <rect x="44" y="190" width="326" height="26" fill="#150734" opacity=".08" />
        <circle cx="58" cy="203" r="4" fill="#150734" opacity=".35" /><circle cx="72" cy="203" r="4" fill="#150734" opacity=".35" />
        <text x="62" y="282" fill="#150734" style={{ fontFamily: "var(--font-display)", fontSize: 44 }}>{name}</text>
        <rect x="62" y="300" width="150" height="10" rx="5" fill="#150734" opacity=".25" />
        <rect x="62" y="318" width="110" height="10" rx="5" fill="#150734" opacity=".15" />
        <rect x="62" y="346" width="96" height="30" rx="15" fill={color} />
        <circle cx="318" cy="330" r="46" fill={color} />
      </g>
      <path d="M14 414h386l-22 26H36z" fill="#150734" />
      <g fill="#fff" stroke="#150734" strokeWidth="4">
        {[0, 1, 2, 3].map((i) => <rect key={i} x={58 + i * 78} y="474" width="56" height="56" rx="12" fill={i % 2 ? color : "#fff"} />)}
      </g>
    </svg>
  );
}

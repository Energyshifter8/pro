"use client";
import { motion } from "framer-motion";

type Face = "angry" | "happy" | "curious";

function FaceSvg({ face }: { face: Face }) {
  const ink = "#1B0B3F";
  return (
    <g>
      {/* spiky star body */}
      <path fill="#fff" stroke={ink} strokeWidth="3"
        d="M100 38l9 14 16-6 2 17 17 3-6 16 14 10-14 10 6 16-17 3-2 17-16-6-9 14-9-14-16 6-2-17-17-3 6-16-14-10 14-10-6-16 17-3 2-17 16 6z" />
      {face === "angry" && (<>
        <path d="M78 88l16 6M122 88l-16 6" stroke={ink} strokeWidth="4" strokeLinecap="round" />
        <circle cx="88" cy="102" r="5" fill={ink} /><circle cx="112" cy="102" r="5" fill={ink} />
        <path d="M86 126q14-10 28 0" stroke={ink} strokeWidth="4" fill="none" strokeLinecap="round" />
      </>)}
      {face === "happy" && (<>
        <path d="M80 98q8-10 16 0M104 98q8-10 16 0" stroke={ink} strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M82 112q18 22 36 0z" fill={ink} />
      </>)}
      {face === "curious" && (<>
        <circle cx="86" cy="100" r="11" fill="#fff" stroke={ink} strokeWidth="3" /><circle cx="114" cy="100" r="11" fill="#fff" stroke={ink} strokeWidth="3" />
        <circle cx="88" cy="102" r="5" fill={ink} /><circle cx="116" cy="102" r="5" fill={ink} />
        <circle cx="100" cy="124" r="5" fill={ink} />
      </>)}
    </g>
  );
}

export default function Sticker({ label, face, color, size = 200 }: { label: string; face: Face; color: string; size?: number }) {
  const id = `p-${face}`;
  const text = `${label.toUpperCase()} • ${label.toUpperCase()} • `;
  return (
    <motion.button whileHover={{ scale: 1.08, rotate: -6 }} whileTap={{ scale: 0.95 }}
      className="relative shrink-0 rounded-full" style={{ width: size, height: size }} aria-label={label}>
      <svg viewBox="0 0 200 200" className="h-full w-full drop-shadow-[0_8px_0_rgba(27,11,63,.35)]">
        <circle cx="100" cy="100" r="96" fill={color} stroke="#1B0B3F" strokeWidth="4" />
        <FaceSvg face={face} />
      </svg>
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full animate-spin-slow">
        <defs><path id={id} d="M100 100m-80 0a80 80 0 1 1 160 0a80 80 0 1 1-160 0" /></defs>
        <text fontSize="15" fontWeight="800" fill="#1B0B3F" letterSpacing="2">
          <textPath href={`#${id}`}>{text}</textPath>
        </text>
      </svg>
    </motion.button>
  );
}

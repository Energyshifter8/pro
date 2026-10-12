// Wavy section divider. `fill` = color of the section the wave belongs to.
export default function Wave({ fill, flip = false, className = "" }: { fill: string; flip?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden
      className={`block h-[50px] w-full md:h-[90px] ${flip ? "rotate-180" : ""} ${className}`}>
      <path d="M0 90V40C180 0 360 0 540 30S900 90 1080 60 1340 10 1440 30V90Z" fill={fill} />
    </svg>
  );
}

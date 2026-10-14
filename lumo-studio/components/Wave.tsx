const D =
  "M0 6C83.3 16.2 166.7 25.7 250 36.5C333.3 47.3 416.7 60.3 500 71C550 77.5 600 83.2 650 89C683.3 92.9 716.7 97 750 100.4C816.7 107.1 883.3 113.8 950 118C983.3 120.1 1016.7 121.8 1050 121.8C1083.3 121.8 1116.7 118 1150 114.7C1200 109.8 1250 102.5 1300 95.7C1333.3 91.2 1366.7 86.1 1400 81.2C1450 73.8 1500 66 1550 58.5C1583.3 53.5 1616.7 48.4 1650 43.5C1683.3 38.6 1716.7 33.5 1750 29.1C1800 22.5 1850 15.7 1900 11C1933.3 7.9 1966.7 6.1 2000 4.4C2033.3 2.7 2066.7 1.6 2100 0.9C2133.3 0.2 2166.7 0.2 2200 0.2C2238.3 0.2 2276.7 1.1 2315 1.6V160H0Z";

export default function Wave({ fill, className = "" }: { fill: string; className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none relative z-[1] h-0 leading-none ${className}`}>
      <svg viewBox="0 0 2315 160" className="block h-auto w-full -translate-y-[96%] lg:-translate-y-[99.4%]">
        <path d={D} fill={fill} />
      </svg>
    </div>
  );
}

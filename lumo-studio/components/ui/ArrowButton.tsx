// Pill + round arrow button. On hover the trailing arrow shrinks away (rotating to 90°)
// while a leading arrow grows in from -90° (0.5s, cubic-bezier(.645,.045,.355,1)).
// Size the arrows with the `--arrow-size` custom property on the button.
// `straight` draws a horizontal arrow (the leading icon), otherwise a diagonal one.
export function ArrowIcon({ className = "", straight = false }: { className?: string; straight?: boolean }) {
  return (
    <svg viewBox="0 0 70 70" aria-hidden className={`arrow-icon block aspect-square shrink-0 rounded-full ${className}`}>
      {straight
        ? <path d="M17 32.3h27.4l-9.5-9.5 3.8-3.8L54.7 35 38.7 51l-3.8-3.8 9.5-9.5H17z" fill="currentColor" />
        : <path d="M26 21.5h22.5V44h-5.3V30.6L24.8 49 21 45.2l18.4-18.4H26z" fill="currentColor" />}
    </svg>
  );
}

export default function ArrowButton({ href, onClick, children, className = "", pillClass = "", arrowClass = "", type = "button" }: {
  href?: string; onClick?: () => void; children: React.ReactNode; className?: string; pillClass?: string; arrowClass?: string; type?: "button" | "submit";
}) {
  const inner = (
    <>
      <ArrowIcon className={arrowClass} straight />
      <span className={`block ${pillClass}`}>{children}</span>
      <ArrowIcon className={arrowClass} />
    </>
  );
  const cls = `arrow-btn flex items-center whitespace-nowrap ${className}`;
  return href ? (
    <a href={href} onClick={onClick} className={cls} data-cursor="pointer">{inner}</a>
  ) : (
    <button type={type} onClick={onClick} className={cls} data-cursor="pointer">{inner}</button>
  );
}

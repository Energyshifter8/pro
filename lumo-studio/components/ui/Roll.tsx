// Text that rolls up to a duplicate of itself when its `.roll-host` ancestor is hovered.
export default function Roll({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`roll ${className}`}>
      <span className="roll-stack">
        <span className="roll-line">{children}</span>
        <span className="roll-line" aria-hidden>{children}</span>
      </span>
    </span>
  );
}

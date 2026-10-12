import { brand, nav } from "@/lib/content";

export default function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-5 md:px-10">
        <a href="#" className="h-display text-3xl text-lime">{brand.name}<span className="text-lav">.</span></a>
        <nav className="hidden items-center gap-8 text-sm font-semibold text-lav md:flex">
          {nav.map((n) => <a key={n.href} href={n.href} className="hover:text-lime">{n.label}</a>)}
        </nav>
        <a href="#contact" className="pill bg-lime text-ink">let&apos;s talk</a>
      </div>
    </header>
  );
}

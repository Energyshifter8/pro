import { brand, nav } from "@/lib/content";

export default function Footer() {
  return (
    <footer id="contact" className="bg-ink pb-36 pt-16 text-lav">
      <div className="mx-auto max-w-[1440px] px-4 md:px-10">
        <h2 className="h-display text-[16vw] md:text-[11vw] xl:text-[170px]">Want one<br /><span className="text-lime">that sells?</span></h2>
        <a href={`mailto:${brand.email}`} className="mt-8 inline-block text-2xl font-bold underline decoration-lime underline-offset-8 md:text-4xl">{brand.email}</a>
        <div className="mt-16 grid gap-10 border-t border-lav/20 pt-10 md:grid-cols-3">
          <div><div className="mb-4 text-xs font-bold tracking-[.3em] text-lav/60">EXPLORE</div>
            <ul className="space-y-2 font-semibold">{nav.map((n) => <li key={n.href}><a href={n.href} className="hover:text-lime">{n.label}</a></li>)}</ul></div>
          <div><div className="mb-4 text-xs font-bold tracking-[.3em] text-lav/60">SOCIAL</div>
            <ul className="space-y-2 font-semibold"><li><a href="#" className="hover:text-lime">Instagram</a></li><li><a href="#" className="hover:text-lime">LinkedIn</a></li></ul></div>
          <div className="md:text-right"><div className="h-display text-6xl text-lime">{brand.name}.</div>
            <div className="mt-3 text-sm text-lav/60">© {brand.since}–{new Date().getFullYear()} {brand.full} · <a href="#" className="underline">Privacy Policy</a></div></div>
        </div>
      </div>
    </footer>
  );
}

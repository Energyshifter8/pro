# Программчлалын олимпиад — Sys&CoTech клуб

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion · Lenis (зөөлөн scroll)

## Ажиллуулах
```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start   # production
```

## Агуулга засах
Бүх текст, тоо, холбоос, жагсаалт **`lib/olympiad.ts`** нэг файлд байна:
- `year` — олимпиадын он (гарчиг, meta, hero бүгд үүнийг ашиглана)
- `hero.startsAt` — эхлэх огноо (ISO, жишээ нь `"2026-11-21T09:00:00+08:00"`); `null` үед "Огноо удахгүй зарлагдана" гарна
- `register.endpoint` — бүртгэлийн формыг JSON-оор POST хийх URL; `null` үед зөвхөн амжилттай дэлгэц гарна (мэдээлэл хаана ч хадгалагдахгүй)
- `register.major.options` — мэргэжлийн жагсаалт
- `faq.items[].a` — асуултын хариулт (хоосон бол "Удахгүй мэдэгдэнэ…")
- `fee.qr` — QR зургийн зам (`null` үед QR хэсэг харагдахгүй)

Лого: `public/logos/syscotech.png`, `public/logos/nasha-tech.png`.

## Бүтэц
- `Hero` — гарчиг, үзгийн шугамын анимаци, хөвөгч стикерүүд, тоолуур
- `About` — олимпиадын тухай, scroll-оор хөдлөх үгс
- `Trust`, `Goals` — тэмцээний зорилго (3 карт)
- `Prizes` — шагналын сан (эргэдэг ном)
- `Sponsors`, `Fee` (дансны мэдээлэл, хуулах товч), `Feel`, `Faq`, `Footer`
- `overlays/RegisterModal` — бүртгэлийн форм (`open-register` window event-ээр нээгдэнэ)

Фонт: Fira Sans Extra Condensed 900 (гарчиг), Manrope (үндсэн текст) — @fontsource, локалаар.

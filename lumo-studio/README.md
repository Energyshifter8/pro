# Lumo Studio: агентлагийн вэбсайтын загвар

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion · Lenis (зөөлөн scroll)

## Ажиллуулах
```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start   # production
```

## Бүтэц
- `lib/content.ts`: бүх текст, тоо, кейс, сэтгэгдэл энд байна. Брэндийн нэр, имэйл, статистикийг энд солино.
- `tailwind.config.ts`: өнгөнүүд (ink, lav, lime, tomato, sun)
- `components/`
  - `Hero`: том үсгийн анимаци, статистик
  - `About`: метрик, scroll-оор хөдлөх том текст
  - `Services`: 3 үйлчилгээний карт
  - `Cases`: hover хийхэд preview гарах жагсаалт, сэтгэгдлийн slider
  - `Audit`: үнэгүй аудитын CTA
  - `Feel`: эргэдэг стикерүүд
  - `FloatingNav`: доод хөвөгч цэс, бүтэн дэлгэцийн menu, "Let's discuss" форм
  - `Footer`, `Wave` (долгионтой хуваагч), `Sticker`, `Reveal`

## Launch хийхээс өмнө
- `content.ts` доторх статистик болон **SAMPLE** сэтгэгдлүүдийг жинхэнэ, баталгаатай мэдээллээр соль.
- `Cases.tsx` доторх `Mock`-ийг өөрийн төслийн зургаар (`next/image`) соль.
- Формыг (`FloatingNav.tsx` → onSubmit) backend эсвэл Resend/Formspree зэрэг үйлчилгээтэй холбо.
- Фонт: Anton + Manrope (@fontsource, локалаар). Өөр фонт хэрэгтэй бол `app/layout.tsx`, `globals.css`-д соль.

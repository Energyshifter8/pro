export const year = 2026;

export const site = {
  title: `Программчлалын олимпиад ${year} | Sys&CoTech клуб`,
  description: "Программчлалын олимпиадад бүртгүүлж, авьяасаа дэлгэрүүлээрэй.",
};

export const brand = {
  name: "SYS&COTECH",
  full: "Sys&CoTech клуб",
  logo: "/logos/syscotech.png",
  since: 2009,
  email: "sysandcotechc@gmail.com",
  phone: "+976 89099473",
  address: "ШУТИС-МХТС (VI байр), 400 тоот",
  socials: [
    { label: "Facebook", href: "https://facebook.com/SysAndCoTech" },
    { label: "Instagram", href: "https://instagram.com/syscotechclub_" },
    { label: "YouTube", href: "https://youtube.com/@syscotechclub6784" },
  ],
};

export const nav = [
  { label: "Тухай", href: "#about" },
  { label: "Шагнал", href: "#prizes" },
  { label: "Хураамж", href: "#fee" },
  { label: "Ивээн тэтгэгч", href: "#sponsors" },
  { label: "Асуулт", href: "#faq" },
  { label: "Холбоо барих", href: "#contact" },
];

export const ui = {
  register: "бүртгүүлэх",
  home: "Нүүр",
  open: "Нээх:",
  menu: "Цэс",
  view: "Харах:",
  viewTarget: { label: "Шагнал", href: "#prizes" },
  close: "Хаах",
  menuLabel: "Үндсэн цэс",
  openMenu: "Цэс нээх",
  menuBadges: [
    { label: "Шагнал харах", href: "#prizes" },
    { label: "Асуулт харах", href: "#faq" },
  ],
  cursor: { idle: "Та", click: "Дарах", drag: "Чирэх" },
};

const zeroGlyph = (y: number) => String(y).replace("0", "{0}");

export const hero = {
  label: `Программчлалын олимпиад ${year}`,
  lines: ["Программчлалын", "{о}лимпиад", zeroGlyph(year)],
  mobileLines: ["Программ-", "члалын", "{о}лимпиад", zeroGlyph(year)],
  sub: "Авьяасаа дэлгэрүүлж, мэдлэгээ бататгах боломж.",
  startsAt: null as string | null,
  dateSoon: "Огноо : 11.14",
  started: "Олимпиад эхэллээ!",
  units: ["өдөр", "цаг", "мин", "сек"],
  badges: [
    { id: "participants", value: "1000+", label: "оролцогч" },
    { id: "fund", value: "1,130,000₮", label: "Шагналын сан" },
    { id: "first", value: "300'000₮", label: "1-р байр" },
    { id: "fee", value: "5–15,000₮", label: "Бүртгэл" },
    { id: "itpark", value: "IT Park", label: "сургалтын эрх" },
    { id: "club", value: "Sys&CoTech", label: "клуб" },
  ],
} as const;

export const about = {
  label: "Олимпиадын тухай",
  title: ["Оюутан залуусын", "[программчлалын] тэмцээн"],
  text: "Программчлалын олимпиад нь Sys&CoTech клубээс жил бүр уламжлал болгон зохион байгуулагддаг үйл ажиллагаануудын нэг юм.",
  metrics: [
    { value: "1000+", label: "оролцогч" },
    { value: "3", label: "шагналт байр" },
    { value: "5,000–15,000₮", label: "бүртгэлийн хураамж" },
  ],
  sentence: [
    ["К{о}дло.", "slot"],
    ["slot", "Сэтгэ."],
    ["Өрсөлд.", "slot"],
    ["Ял.", "slot", "slot"],
  ],
};

export const trust = {
  title: ["Мэдлэг", "[өрсөлдөөнөөр]", "батлагдана."],
  cta: "бүртгүүлэх",
};

export const goals = {
  label: "Тэмцээний зорилго",
  title: ["Яагаад", "[оролцох вэ?]"],
  cards: [
    { title: ["Чөлөөт цаг", "үр дүнтэй"], text: "Оюутан залуусын чөлөөт цагийг зөв боловсон, үр дүнтэй өнгөрүүлэх.", color: "purple" },
    { title: ["Бүтээлч", "сэтгэлгээ"], text: "Мэдлэг боловсрол, бүтээлч сэтгэлгээг хөгжүүлж, программчлалын мэдлэгийг дээшлүүлэх.", color: "red" },
    { title: ["Өрсөлдөөн", "оролцоо"], text: "Хоорондын өрсөлдөөнийг бий болгож, идэвх сонирхол, оролцоог нэмэгдүүлэх.", color: "yellow" },
  ],
  full: "Программчлалын олимпиад нь оюутан залуусын чөлөөт цагийг зөв боловсон үр дүнтэй өнгөрүүлэх, мэдлэг боловсрол бүтээлч сэтгэлгээг хөгжүүлэх, программчлалын мэдлэгийг дээшлүүлэн, хоорондын өрсөлдөөнийг бий болгож, идэвх сонирхол, оролцоог нэмэгдүүлэх зорилготойгоор зохион байгуулагдаж байна.",
} as const;

const perks = ["Мөнгөн шагнал", "IT Park-ын сургалтын эрх", "The Software Engineer's Guidebook ном"];

export const prizes = {
  title: "Шагналын сан",
  label: "Шагнал",
  cta: "бүртгүүлэх",
  places: [
    { place: "1-р байр", amount: "300'000₮", color: "#FFD23F", perks },
    { place: "2-р байр", amount: "200'000₮", color: "#D9CCFF", perks },
    { place: "3-р байр", amount: "100'000₮", color: "#FF8A3D", perks },
  ],
};

export const sponsors = {
  title: "Ивээн тэтгэгч",
  label: "Ивээн тэтгэгч",
  list: [
    {
      name: "Nasha Tech",
      logo: "/logos/nasha-tech.png",
      text: "Internet болон E-Commerce нь улс үндэстэн болон байршлаас үл хамааран бүгдэд адил боломжийг олгодог бөгөөд энэ боломжоо алдалгүй ашиглахад бид танд тусална.",
    },
  ],
  organizer: {
    label: "Зохион байгуулагч",
    name: "Sys&CoTech клуб",
    ring: "ЗОХИОН БАЙГУУЛАГЧ • SYS&COTECH КЛУБ • ",
  },
};

export const fee = {
  title: ["Бүртгэлийн", "хураамж"],
  tiers: [
    { who: "1–2-р курс", amount: "5,000₮" },
    { who: "3–4-р курс", amount: "15,000₮" },
  ],
  notes: [
    "Төлбөрийг дансаар шилжүүлсний дараа бүртгэл баталгаажна.",
    "Гүйлгээ хийхдээ зөв мэдээллээ оруулна уу.",
  ],
  cardTitle: "Дансны мэдээлэл",
  rows: [
    { label: "Банк", value: "Хаан банк" },
    { label: "Дансны дугаар", value: "MN070005005920847579", mono: true },
    { label: "Данс эзэмшигч", value: "Бямбасүрэн Авирмэд" },
    { label: "Дүн · 1–2-р курс", value: "5,000₮" },
    { label: "Дүн · 3–4-р курс", value: "15,000₮" },
  ],
  reference: "Гүйлгээний утга: Овог, нэр, оюутны код, утасны дугаар",
  qr: null as string | null,
  qrLabel: "QR кодоор төлөх",
  copy: "хуулах",
  copied: "хуулсан!",
  cta: "бүртгүүлэх",
};

export const faq = {
  title: "Түгээмэл асуулт хариулт",
  pending: "Удахгүй мэдэгдэнэ. Клубийн Facebook хуудсаар мэдээлэл авна уу.",
  items: [
    { q: "Программчлалын олимпиад хэзээ болох вэ?", a: "" },
    { q: "Олимпиад хэр удаан үргэлжлэх вэ?", a: "" },
    { q: "Олимпиадын өдөр ирэхдээ юу авчрах шаардлагатай вэ?", a: "" },
    { q: "Техникийн зөвлөгөөн хэзээ, хаана болох вэ?", a: "" },
  ],
};

export const footer = {
  title: "Бидэнтэй [холбогдох]",
  text: "Асуудал эсвэл санал хүсэлт байвал бидэнд дамжуулаарай. Хүндэтгэсэн Sys&CoTech клуб <3",
  menu: "Цэс",
  social: "Сошиал",
  address: "Хаяг",
};

export const register = {
  title: "Бүртгүүлэх",
  intro: "Олимпиадад оролцохын тулд доорх мэдээллийг бөглөнө үү. ;3",
  fields: {
    lastName: { label: "Овог", placeholder: "" },
    firstName: { label: "Нэр", placeholder: "" },
    email: { label: "Мэйл", placeholder: "example@email.com" },
    studentCode: { label: "Оюутны код", placeholder: "" },
    phone: { label: "Утасны дугаар", placeholder: "XXXXXXXX" },
  },
  course: { placeholder: "Курс сонгох", options: ["1-р курс", "2-р курс", "3-р курс", "4-р курс", "5-р курс"] },
  major: { label: "Мэргэжил", placeholder: "— Сонгох —", options: ["Программ хангамж", "Компьютерийн ухаан", "Мэдээллийн технологи", "Мэдээллийн систем", "Холбооны технологи", "Бусад"] },
  phoneHint: "8 оронтой дугаар оруулна уу",
  selectHint: "Сонголтоо хийнэ үү",
  button: "ИЛГЭЭХ",
  sending: "Илгээж байна…",
  success: "Мэдээлэл хүлээн авлаа!",
  successNote: "Бүртгэлийн хураамжаа (1–2-р курс 5,000₮, 3–4-р курс 15,000₮) доорх дансанд шилжүүлснээр бүртгэл баталгаажна.",
  error: "Илгээж чадсангүй. Дахин оролдоно уу.",
};

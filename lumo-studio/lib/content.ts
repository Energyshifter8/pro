// All site copy lives here. Replace placeholder values with your own real data.
// Olympiad copy lives in lib/olympiad.ts.

export const brand = {
  name: "SYS&COTECH",
  full: "Sys&CoTech клуб",
  logo: "/logos/syscotech.png",
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
  { label: "Бидний тухай", href: "#about" },
  { label: "Үйлчилгээ", href: "#services" },
  { label: "Төслүүд", href: "#cases" },
  { label: "Олимпиад", href: "#olympiad" },
];

// Labels for the header, floating dock, menu overlay and cursor.
export const ui = {
  home: "Нүүр хуудас",
  talk: "холбогдох",
  open: "Нээх:",
  menu: "Цэс",
  view: "Үзэх:",
  viewCasesShort: "Төслүүд",
  register: "бүртгүүлэх",
  order: "вэбсайт захиалах",
  close: "Хаах",
  menuLabel: "Үндсэн цэс",
  openMenu: "Цэс нээх",
  viewBlogs: "Блог үзэх",
  viewCases: "Төсөл үзэх",
  cursor: { idle: "Та", click: "Дарах", drag: "Чирэх" },
};

// Placeholder metrics: replace with your real, verifiable numbers.
// `id` ties each stat to its hero sticker (shape/colour/position).
export const stats = [
  { id: "rating", value: "4.9/5", label: "үнэлгээ" },
  { id: "response", value: "1 цагт", label: "хариу өгнө" },
  { id: "audit", value: "Үнэгүй", label: "вэб аудит" },
  { id: "support", value: "24/7", label: "техникийн дэмжлэг" },
  { id: "built", value: "120+", label: "бүтээсэн вэбсайт" },
  { id: "years", value: "6 жилийн", label: "туршлага" },
] as const;

export const about = {
  label: "Бидний тухай",
  // {x} marks a letter drawn as a decorative stretched glyph.
  title: ["Бид өсөх брэнд, дижитал", "бү{т}ээгдэхүүн бүтээдэг"],
  lead: "Дизайн нь цэвэр. Ажиллагаа нь хурц.",
  statsIntro: "Манай төслүүдийн үр дүн:",
  // The pinned statement the icon tiles fly into. `slot` marks where a tile lands.
  sentence: [
    ["Хүмүүст т{а}алагдах", "slot", "брэнд,"],
    ["үйлчлүүлэгч татах", "slot", "сайт."],
    ["Диз{а}йн нь цэвэр.", "slot"],
    ["Ажиллагаа нь", "slot", "slot", "хурц."],
  ],
};

export const trust = {
  // [..] marks the highlighted phrase
  title: ["Итгэлийг", "[дизайн] төрүүлдэг,", "тайлбар биш."],
  cta: "итгэл бүтээх",
};

export const aboutMetrics = [
  { value: "+42%", label: "хэрэглэгчийн давтан хандалт" },
  { value: "−67%", label: "шууд гаралт" },
  { value: "4×", label: "илүү хурдан нээлт" },
];

export const servicesTitle = ["Бид танд", "юу бүтээж", "өгөх вэ?"];

// `variant` picks the card colourway (green / pink / violet).
export const services = [
  {
    title: ["UI/UX", "дизайн"],
    text: "Үр дүнд хүргэх дизайн. Дараагийн алхмыг ойлгомжтой болгодог тодорхой интерфэйс. Эргэлзээ бага, ахиц их.",
    cta: "дизайн захиалах",
    variant: "green",
  },
  {
    title: ["Вэб", "хөгжүүлэлт"],
    text: "Мэдрэгдэхүйц хурд: хурдан ачаалал, жигд анимэйшн, SEO-г анхнаас нь шингээсэн. Таны вэбсайт саадгүй ажиллаж, итгэлийг аажмаар бий болгоно.",
    cta: "вэбсайт хийлгэх",
    variant: "pink",
  },
  {
    title: ["Тусгай", "төсөл үү?"],
    text: "Загварт багтахгүй ажлууд — вэб эсвэл мобайл апп, платформ, маркетплэйс — бид нарийн төвөгтэйг ойлгомжтой болгоно.",
    cta: "төслөө ярилцах",
    variant: "violet",
  },
] as const;

// Sample case names (fictional). Swap in your real projects.
export const cases = [
  { name: "NORTHWIND", tag: "Брэндинг", color: "#C8F53C" },
  { name: "ORBITA", tag: "Вэб", color: "#C4B2FF" },
  { name: "KAMI TEA", tag: "Цахим дэлгүүр", color: "#FFD23F" },
  { name: "STEPPE CO", tag: "Вэб", color: "#F2452E" },
  { name: "PAPERPLANE", tag: "UI/UX", color: "#C8F53C" },
  { name: "MOUNTAIN LAB", tag: "Платформ", color: "#C4B2FF" },
  { name: "BLUE YURT", tag: "Брэндинг", color: "#FFD23F" },
  { name: "FERRO", tag: "Вэб", color: "#F2452E" },
  { name: "LUMEN", tag: "Вэб", color: "#C8F53C" },
  { name: "ARCTICA", tag: "UI/UX", color: "#C4B2FF" },
];

export const casesCopy = {
  title: "Төслүүд",
  reviews: "Үйлчлүүлэгчдийн сэтгэгдэл",
  viewCase: "төсөл үзэх",
  web: "Вэб",
};

export const viewAll = [
  { label: "бүх {т}өслүүд", href: "#cases" },
  { label: "бүх блог", href: "#blog" },
];
export const viewAllLabel = "Бүгдийг үзэх";

// SAMPLE testimonials — placeholders only. Replace with real client reviews before launch.
export const testimonials = [
  { quote: "Жишээ сэтгэгдэл: баг маань хүсэлтийг маань цэгцэлж, хугацаанд нь хүлээлгэж өгсөн.", client: "Үйлчлүүлэгчийн нэр", type: "Хөгжүүлэлт", rating: "5.0" },
  { quote: "Жишээ сэтгэгдэл: эцсийн бүтээгдэхүүн болон ажлын явцад сэтгэл хангалуун байсан.", client: "Үйлчлүүлэгчийн нэр", type: "UI/UX", rating: "5.0" },
  { quote: "Жишээ сэтгэгдэл: хурдан, хичээнгүй, юу хийж байгаагаа сайн мэддэг баг.", client: "Үйлчлүүлэгчийн нэр", type: "Брэндинг", rating: "5.0" },
  { quote: "Жишээ сэтгэгдэл: орчин үеийн хэв маяг, нарийн мэдрэмжтэй ажилладаг.", client: "Үйлчлүүлэгчийн нэр", type: "Хөгжүүлэлт", rating: "5.0" },
];

export const audit = {
  title: ["Үнэгүй", "{в}эб {а}удит", "аваарай"],
  cta: "үнэгүй аудит авах",
  // Example scores shown on the floating cards.
  scores: [
    { label: "Хурд", value: 99 },
    { label: "SEO", value: 100 },
    { label: "Анимэйшн", value: 89 },
    { label: "Дизайн", value: 76 },
    { label: "Хөрвүүлэлт", value: 82 },
  ],
};

export const feel = {
  title: ["За… бид танд", "ям{а}р мэдрэмж", "төрүүлэв?"],
  text: "Сэтгэгдлээ сонгоорой, бид сонсож байна.",
  cta: "вэбсайт захиалах",
  legend: "Та юу хүсэж байна?",
};

export const moods = [
  { label: "Дараа нь хүснэ", face: "angry", color: "#EA3323" },
  { label: "Вэбсайт хүсэж байна", face: "happy", color: "#C2EC40" },
  { label: "Үнэгүй аудит хүснэ", face: "curious", color: "#FBD402" },
] as const;

export const contact = {
  title: "Ярилцъя",
  fields: {
    name: "Таны нэр",
    email: "Таны и-мэйл",
    website: "Байгууллагын вэбсайт",
    message: "Төслийнхөө талаар бичнэ үү",
    budget: "Төсөв сонгох",
    kind: "Танд юу хэрэгтэй вэ?",
  },
  budgets: ["$1k–3k", "$3k–7k", "$7k–15k", "$15k+"],
  kinds: ["UI/UX дизайн", "Вэб хөгжүүлэлт", "Брэндинг", "Тусгай төсөл"],
  submit: "хүсэлт илгээх",
  thanks: "Баярлалаа! Таны хүсэлтийг хүлээн авлаа, нэг цагийн дотор хариу өгнө.",
} as const;

export const footer = {
  title: "Бидэнтэй холбогдох",
  text: "Асуудал эсвэл санал хүсэлт байвал бидэнд дамжуулаарай. Хүндэтгэсэн Sys&CoTech клуб <3",
  explore: "Цэс",
  contact: "Холбоо барих",
  privacy: "Нууцлалын бодлого",
  rights: "Бүх эрх хуулиар хамгаалагдсан.",
};

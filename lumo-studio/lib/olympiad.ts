// All Programming Olympiad content lives here. Edit values in place — components/Olympiad.tsx
// and components/overlays/RegisterModal.tsx only read from this file.

const perks = ["Мөнгөн шагнал", "IT Park-ын сургалтын эрх", "The Software Engineer's Guidebook ном"];

export const olympiad = {
  title: "Программчлалын олимпиад",
  year: 2025,
  tagline: "Авьяасаа дэлгэрүүлж, мэдлэгээ батлах боломж.",
  participants: "1000+",
  participantsLabel: "оролцогч",
  organizerPill: "SYS&COTECH КЛУБ ЗОХИОН БАЙГУУЛНА",
  // Start time as an ISO date, e.g. "2025-11-22T09:00:00+08:00". While null the countdown is
  // replaced by `dateSoon`.
  startsAt: null as string | null,
  dateSoon: "Огноо удахгүй зарлагдана",
  started: "Олимпиад эхэллээ!",
  units: ["өдөр", "цаг", "мин", "сек"],
  registerButton: "бүртгүүлэх",

  intro: "Программчлалын олимпиад нь Sys&CoTech клубээс жил бүр уламжлал болгон зохион байгуулагддаг үйл ажиллагаануудын нэг юм.",
  goal: {
    title: "Тэмцээний зорилго",
    text: "Программчлалын олимпиад нь оюутан залуусын чөлөөт цагийг зөв боловсон үр дүнтэй өнгөрүүлэх, мэдлэг боловсрол бүтээлч сэтгэлгээг хөгжүүлэх, программчлалын мэдлэгийг дээшлүүлэн, хоорондын өрсөлдөөнийг бий болгож, идэвх сонирхол, оролцоог нэмэгдүүлэх зорилготойгоор зохион байгуулагдаж байна.",
  },

  prizes: {
    title: "Шагналын сан",
    places: [
      { place: "1-р байр", amount: "300'000₮", color: "#FFD23F", perks },
      { place: "2-р байр", amount: "200'000₮", color: "#D9CCFF", perks },
      { place: "3-р байр", amount: "100'000₮", color: "#FF8A3D", perks },
    ],
  },

  fee: {
    title: "Хураамж",
    amount: "8,000₮",
    notes: [
      "Бүртгэлийн хураамж: 8,000₮",
      "Төлбөрийг дансаар шилжүүлсний дараа бүртгэл баталгаажна.",
      "Гүйлгээ хийхдээ зөв мэдээллээ оруулна уу.",
    ],
    cardTitle: "Дансны мэдээлэл",
    bank: "Төрийн банк",
    account: "MN170034220700072362",
    holder: "Мөнхтулга Элбэгсайхан",
    reference: "Гүйлгээний утга: Овог, нэр, оюутны код, утасны дугаар",
    // Path to a QR image under /public (e.g. "/logos/fee-qr.png"); the QR block shows only when set.
    qr: null as string | null,
    qrLabel: "QR кодоор төлөх",
    labels: { bank: "Банк", account: "Дансны дугаар", holder: "Хүлээн авагч" },
    copy: "хуулах",
    copied: "хуулсан!",
  },

  sponsors: {
    title: "Ивээн тэтгэгч",
    label: "Ивээн тэтгэгч",
    list: [
      {
        name: "Nasha Tech",
        logo: "/logos/nasha-tech.png",
        text: "Internet болон E-Commerce нь улс үндэстэн болон байршлаас үл хамааран бүгдэд адил боломжийг олгодог бөгөөд энэ боломжоо алдалгүй ашиглахад бид танд тусална.",
      },
    ],
  },

  organizer: {
    label: "Зохион байгуулагч",
    name: "Sys&CoTech клуб",
    logo: "/logos/syscotech.png",
    ring: "ЗОХИОН БАЙГУУЛАГЧ • SYS&COTECH КЛУБ • ",
  },

  faq: {
    title: "Түгээмэл асуулт",
    // Shown for every question whose answer is still empty.
    pending: "Удахгүй мэдэгдэнэ. Клубийн Facebook хуудсаар мэдээлэл авна уу.",
    items: [
      { q: "Программчлалын олимпиад хэзээ болох вэ?", a: "" },
      { q: "Олимпиад хэр удаан үргэлжлэх вэ?", a: "" },
      { q: "Олимпиадын өдөр ирэхдээ юу авчрах шаардлагатай вэ?", a: "" },
      { q: "Техникийн зөвлөгөөн хэзээ, хаана болох вэ?", a: "" },
    ],
  },

  cta: { title: "Оролцоход бэлэн үү?", button: "одоо бүртгүүлэх" },

  register: {
    title: "Бүртгүүлэх",
    intro: "Олимпиадад оролцохын тулд доорх мэдээллийг бөглөнө үү. ;3",
    // URL that receives the form as a JSON POST. While null the form explains that online
    // registration is not open yet instead of pretending to submit.
    endpoint: null as string | null,
    fields: {
      lastName: "Овог",
      firstName: "Нэр",
      email: "Мэйл",
      phone: "Утасны дугаар",
      course: "Курс сонгох",
      major: "— Сонгох —",
      studentCode: "Оюутны код",
    },
    courses: ["1-р курс", "2-р курс", "3-р курс", "4-р курс", "5-р курс"],
    // Placeholder list — replace with the real majors.
    majors: ["Программ хангамж", "Компьютерийн ухаан", "Мэдээллийн технологи", "Мэдээллийн систем", "Холбооны технологи", "Бусад"],
    phoneHint: "8 оронтой дугаар оруулна уу",
    selectHint: "Сонголтоо хийнэ үү",
    button: "Илгээх",
    sending: "Илгээж байна…",
    success: "Амжилттай илгээлээ!",
    successNote: "Бүртгэл баталгаажихын тулд 8,000₮ хураамжаа доорх дансанд шилжүүлнэ үү.",
    error: "Илгээж чадсангүй. Дахин оролдоно уу.",
    closed: "Онлайн бүртгэл удахгүй нээгдэнэ. Клубийн Facebook хуудсаар мэдээлэл авна уу.",
    facebook: "Facebook хуудас",
  },
};

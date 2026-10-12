// All site copy lives here. Replace placeholder values with your own real data.

export const brand = {
  name: "LUMO",
  full: "Lumo Studio",
  email: "hello@lumo.studio",
  since: 2017,
};

export const nav = [
  { label: "About us", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Cases", href: "#cases" },
  { label: "Blog", href: "#blog" },
];

// Placeholder metrics: replace with your real, verifiable numbers.
// `id` ties each stat to its hero sticker (shape/colour/position).
export const stats = [
  { id: "rating", value: "4.9/5", label: "client rating" },
  { id: "response", value: "1h", label: "response time" },
  { id: "audit", value: "Free", label: "website audit" },
  { id: "support", value: "24/7", label: "post-launch support" },
  { id: "built", value: "120+", label: "websites built" },
  { id: "years", value: "6 years", label: "of experience" },
] as const;

export const about = {
  label: "About us",
  // {x} marks a letter drawn as a decorative stretched glyph.
  title: ["We craft b{r}ands and digital", "products that {s}cale"],
  lead: "Clean in form. Sharp in function.",
  statsIntro: "Across our client projects:",
  // The pinned statement the icon tiles fly into. `slot` marks where a tile lands.
  sentence: [
    ["We {b}uild brands", "slot", "people love"],
    ["and websites", "slot", "that win clients."],
    ["Cle{a}n in form.", "slot"],
    ["Sharp in", "slot", "slot", "function."],
  ],
};

export const trust = {
  // [..] marks the highlighted phrase
  title: ["Trust comes", "[from design,] not", "explanation."],
  cta: "design trust",
};

export const aboutMetrics = [
  { value: "+42%", label: "retention" },
  { value: "−67%", label: "bounce rate" },
  { value: "4×", label: "faster launches" },
];

export const servicesTitle = ["What are we", "building for", "you?"];

// `variant` picks the card colourway (green / pink / violet).
export const services = [
  {
    title: ["UI/UX", "Design"],
    text: "Design that converts. Clear, intentional interfaces that make the next step obvious. Less hesitation, more forward movement.",
    cta: "design my product",
    variant: "green",
  },
  {
    title: ["Web", "Development"],
    text: "Speed you can feel: fast loading, smooth animation, SEO built in. Your website just works and quietly earns trust.",
    cta: "build my website",
    variant: "pink",
  },
  {
    title: ["Custom", "project?"],
    text: "When things don't fit templates — web or mobile app, platform or marketplace — we turn complexity into clarity.",
    cta: "discuss my project",
    variant: "violet",
  },
] as const;

// Sample case names (fictional). Swap in your real projects.
export const cases = [
  { name: "NORTHWIND", tag: "Branding", color: "#C8F53C" },
  { name: "ORBITA", tag: "Web", color: "#C4B2FF" },
  { name: "KAMI TEA", tag: "E-commerce", color: "#FFD23F" },
  { name: "STEPPE CO", tag: "Web", color: "#F2452E" },
  { name: "PAPERPLANE", tag: "UI/UX", color: "#C8F53C" },
  { name: "MOUNTAIN LAB", tag: "Platform", color: "#C4B2FF" },
  { name: "BLUE YURT", tag: "Branding", color: "#FFD23F" },
  { name: "FERRO", tag: "Web", color: "#F2452E" },
  { name: "LUMEN", tag: "Web", color: "#C8F53C" },
  { name: "ARCTICA", tag: "UI/UX", color: "#C4B2FF" },
];

export const viewAll = [
  { label: "view all ca{s}es", href: "#cases" },
  { label: "view all blogs", href: "#blog" },
];

// SAMPLE testimonials — placeholders only. Replace with real client reviews before launch.
export const testimonials = [
  { quote: "Sample review: the team structured our request and shipped on time.", client: "Client name", type: "Development", rating: "5.0" },
  { quote: "Sample review: we were happy with the final product and the process.", client: "Client name", type: "UI/UX", rating: "5.0" },
  { quote: "Sample review: fast, diligent, and they know what they are doing.", client: "Client name", type: "Branding", rating: "5.0" },
  { quote: "Sample review: a modern style and good taste in every detail.", client: "Client name", type: "Development", rating: "5.0" },
];

export const audit = {
  title: ["{g}et a free", "audit of your", "websit{e}"],
  cta: "get my free audit",
  // Example scores shown on the floating cards.
  scores: [
    { label: "Speed", value: 99 },
    { label: "SEO", value: 100 },
    { label: "Animation", value: 89 },
    { label: "Design", value: 76 },
    { label: "Conversion", value: 82 },
  ],
};

export const feel = {
  title: ["So… how {d}o", "we make you feel?"],
  text: "Choose your vibe, we're listening.",
  cta: "get my website",
};

export const moods = [
  { label: "I want but not now", face: "angry", color: "#EA3323" },
  { label: "I want a website", face: "happy", color: "#C2EC40" },
  { label: "I want a free audit", face: "curious", color: "#FBD402" },
] as const;

export const contact = {
  title: "L{e}t's discuss",
  fields: {
    name: "Your name",
    email: "Your email",
    website: "Company website",
    message: "Tell us about your project",
    budget: "Choose a budget",
    kind: "What do you need?",
  },
  budgets: ["$1k–3k", "$3k–7k", "$7k–15k", "$15k+"],
  kinds: ["UI/UX design", "Web development", "Branding", "Custom project"],
  submit: "send request",
  thanks: "Thanks! We got your request and will reply within an hour.",
} as const;

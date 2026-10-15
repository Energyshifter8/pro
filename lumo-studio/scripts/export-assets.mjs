import { chromium } from "playwright-core";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const fontkit = require("fontkit");
const wawoff2 = require("wawoff2");

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");
const OUT = path.join(ROOT, "design-assets");
const ZIP = path.join(ROOT, "design-assets.zip");
const URL_ = process.env.ASSETS_URL || "http://localhost:3000";
const WIDTH = 1440;
const PNG_MIN = 48;
const PNG_MAX = 1200;

const NAMES = {
  "#150734": "ink", "#D3C5F6": "lilac", "#C2EC40": "lime", "#097140": "brandgreen", "#F04C8A": "pink",
  "#EA3323": "red", "#3D71FF": "blue", "#4E00FF": "violet", "#11B04C": "green", "#FFFFFF": "white",
  "#FBD402": "sun", "#104EFF": "cobalt", "#E1611C": "orange", "#FFD23F": "gold", "#D9CCFF": "lavender",
  "#FF8A3D": "tangerine", "#4C3487": "plum", "#111419": "graphite", "#000000": "black", "#222222": "charcoal",
  "#052717": "forest (mascot outline)", "#FFE3B9": "skin (mascot)", "#FEFEFE": "off-white (mascot)",
};
const colorName = (hex) => NAMES[hex?.toUpperCase()] || hex?.replace("#", "").toLowerCase();

const C = {
  stickers: "components/hero/Stickers.tsx", pen: "components/hero/PenLine.tsx", glyph: "components/Glyph.tsx + lib/glyphs.ts",
  wave: "components/Wave.tsx, components/Goals.tsx", tiles: "components/about/TileArt.tsx (About.tsx)",
  trust: "components/Trust.tsx (public/illustrations/green.svg)", goals: "components/Goals.tsx", arrow: "components/ui/ArrowButton.tsx",
  prizes: "components/Prizes.tsx", prizeArt: "components/prizes/PrizeArt.tsx", sponsors: "components/Sponsors.tsx", faq: "components/Faq.tsx",
  footer: "components/Footer.tsx", header: "components/Header.tsx", cursor: "components/Cursor.tsx", menu: "components/overlays/MenuOverlay.tsx",
  modal: "components/overlays/ModalParts.tsx, RegisterModal.tsx",
};

const STICKERS = [
  ["badge-it-park-training", "сургалтын эрх", "pill-lime", "html"],
  ["badge-registration-fee", "Бүртгэл", "starburst-red", "svg"],
  ["badge-syscotech-club", "клуб", "leaf-blue", "html"],
  ["badge-prize-fund-600k", "Шагналын сан", "scallop-white", "svg"],
  ["badge-1st-place-300k", "1-р байр", "flag-violet", "svg"],
];
const TILES = [
  ["pink", "square", "cursor", "star"], ["lime", "square", "heart", "smile"], ["blue", "circle", "chart", "eye"],
  ["orange", "tag", "crown", "spark"], ["red", "circle", "bolt", "note"],
];

function assetSpecs() {
  const S = [];
  const add = (o) => S.push({ state: "page", opts: {}, ...o });
  STICKERS.forEach(([name, label, part, partKind]) => {
    add({ name, kind: "html", usedIn: "Hero — floating badge", component: C.stickers, parts: [part], find: `() => X.sticker(${JSON.stringify(label)}).root`, rotation: `() => X.sticker(${JSON.stringify(label)}).rot` });
    add({ name: part, kind: partKind, usedIn: "Hero — floating badge (shape only)", component: C.stickers, partOf: name, find: `() => X.sticker(${JSON.stringify(label)}).shape` });
  });
  const line = `() => X.svgs("-8500 -600 15500 3800")[0]`;
  add({ name: "hero-line", kind: "svg", usedIn: "Hero — lime line drawn behind the title, with dots and pen", component: C.pen, parts: ["hero-line-path", "pen-icon"], find: line, opts: { fit: true } });
  add({ name: "hero-line-path", kind: "svg", usedIn: "Hero — the line and its dots (no pen)", component: C.pen, partOf: "hero-line", find: line, opts: { fit: true, remove: ":scope > g" } });
  add({ name: "pen-icon", kind: "svg", usedIn: "Hero — pen nib at the end of the line (shown upright here)", component: C.pen, partOf: "hero-line", find: line, opts: { fit: true, keepOnly: ":scope > g", clearTransform: ":scope > g" } });
  add({ name: "hero-glyph-o-wide", kind: "svg", usedIn: "Hero title — stretched decorative «о» in «олимпиад»", component: C.glyph, find: `() => X.visible(X.svgs("47 -528 466 540"))[0]` });
  add({ name: "hero-glyph-zero", kind: "svg", usedIn: "Hero title — the «0» of the year", component: C.glyph, find: `() => X.visible(X.svgs("47 -528 466 540"))[1]` });
  for (const [c, where] of [["#D3C5F6", "hero→about, fee→faq"], ["#C2EC40", "top of the fee section"], ["#150734", "below the fee section, goals background"]])
    add({ name: `wave-divider-${colorName(c)}`, kind: "svg", usedIn: `Section divider — ${where}`, component: C.wave, find: `() => X.svgs("0 0 2315 160").find((s) => X.hex(getComputedStyle(s.querySelector("path")).fill).v === "${c}")` });
  TILES.forEach(([color, shape, a, b], i) => {
    const tile = `X.tiles()[${i}]`;
    add({ name: `tile-${color}-${a}`, kind: "html", usedIn: "About — icon tile (state 1)", component: C.tiles, parts: [`tile-shape-${color}-${shape}`, `icon-${a}`], find: `() => ${tile}` });
    add({ name: `tile-${color}-${b}`, kind: "html", usedIn: "About — icon tile (state 2, icons swap every 3s)", component: C.tiles, parts: [`tile-shape-${color}-${shape}`, `icon-${b}`], find: `() => ${tile}`, prep: `() => X.swapTile(${tile})` });
    add({ name: `tile-shape-${color}-${shape}`, kind: "svg", usedIn: "About — tile shape", component: C.tiles, partOf: `tile-${color}-${a}`, find: `() => ${tile}.querySelector(":scope > svg")` });
    add({ name: `icon-${a}`, kind: "svg", usedIn: "About — tile icon", component: C.tiles, partOf: `tile-${color}-${a}`, find: `() => ${tile}.querySelectorAll(":scope > span svg")[0]`, opts: { fit: true } });
    add({ name: `icon-${b}`, kind: "svg", usedIn: "About — tile icon", component: C.tiles, partOf: `tile-${color}-${b}`, find: `() => ${tile}.querySelectorAll(":scope > span svg")[1]`, prep: `() => X.swapTile(${tile})`, opts: { fit: true } });
  });
  add({ name: "mascot-green", kind: "file", src: "public/illustrations/green.svg", usedIn: "Trust — mascot («Мэдлэг өрсөлдөөнөөр батлагдана»)", component: C.trust, find: `() => document.querySelector('img[src*="green.svg"]')` });
  ["burst", "flower", "rings"].forEach((n, i) => add({ name: `goal-icon-${n}`, kind: "svg", usedIn: `Goals — card ${i + 1} icon`, component: C.goals, find: `() => X.svgs("0 0 256 256")[${i}]` }));
  add({ name: "arrow-buttons", kind: "many", usedIn: "Arrow buttons (Trust, Fee)", component: C.arrow, find: `() => X.arrows()` });
  add({ name: "prize-starburst-blue", kind: "svg", usedIn: "Prizes — big star behind the book", component: C.prizes, find: `() => X.svgs("0 0 1372 1372")[0]` });
  ["1st", "2nd", "3rd"].forEach((n, i) => add({ name: `prize-card-${n}-${[300, 200, 100][i]}k`, kind: "svg", usedIn: "Prizes — book page artwork", component: C.prizeArt, find: `() => X.visible(X.svgs("0 0 414 564")).find((s) => s.querySelector("text")?.textContent.trim() === "${i + 1}")` }));
  add({ name: "check-icons", kind: "many", usedIn: "Prizes — perk check marks", component: C.prizes, find: `() => X.checks()` });
  const ring = `() => X.svgs("0 0 200 200")[0]`;
  add({ name: "organizer-ring-logo", kind: "html", usedIn: "Sponsors — organizer logo in a turning text ring", component: C.sponsors, parts: ["organizer-ring-text"], find: `() => X.svgs("0 0 200 200")[0].parentElement`, note: "Contains the Sys&CoTech logo (embedded unaltered, see logos/)." });
  add({ name: "organizer-ring-text", kind: "svg", usedIn: "Sponsors — turning text ring (24s per turn)", component: C.sponsors, partOf: "organizer-ring-logo", find: ring });
  add({ name: "faq-toggle-plus", kind: "html", usedIn: "FAQ — closed question toggle", component: C.faq, find: `() => X.svgs("0 0 24 24")[0].parentElement` });
  add({ name: "footer-burst-plum", kind: "svg", usedIn: "Footer — burst in the scrolling brand band", component: C.footer, find: `() => X.svgs("0 0 191 191")[0]` });
  add({ name: "social-icons", kind: "many", usedIn: "Footer — social links", component: C.footer, find: `() => X.socials()` });
  add({ name: "nav-tag-shape", kind: "svg", usedIn: "Header — translucent tag behind the nav (12% opacity)", component: C.header, find: `() => X.svgs("0 0 538 52")[0]` });
  add({ name: "cursor-icons", kind: "many", usedIn: "Custom cursor", component: C.cursor, find: `() => X.cursors()` });
  add({ name: "faq-toggle-open", kind: "html", state: "faq", usedIn: "FAQ — open question toggle (rotated 45°)", component: C.faq, find: `() => X.svgs("0 0 24 24")[0].parentElement`, opts: { keepRootTransform: true } });
  add({ name: "menu-badge-left", kind: "svg", state: "menu", usedIn: "Menu overlay — round link badge (left)", component: C.menu, find: `() => X.visible([...document.querySelectorAll(".mnu-badge.l svg")])[0]` });
  add({ name: "menu-badge-right", kind: "svg", state: "menu", usedIn: "Menu overlay — round link badge (right)", component: C.menu, find: `() => X.visible([...document.querySelectorAll(".mnu-badge.r svg")])[0]` });
  add({ name: "menu-close-cross", kind: "svg", state: "menu", usedIn: "Menu overlay — close button", component: C.menu, find: `() => X.visible([...document.querySelectorAll(".mnu-close svg")])[0]` });
  ["pink-striped", "lime", "blue"].forEach((n, i) => {
    add({ name: `menu-ball-${n}`, kind: "html", state: "menu", usedIn: "Menu overlay — rolling ball", component: C.menu, partOf: `menu-ball-${n}-ringed`, find: `() => document.querySelectorAll(".mnu-ball.c")[${i}]` });
    add({ name: `menu-ball-${n}-ringed`, kind: "ring", state: "menu", usedIn: "Menu overlay — rolling ball on its white ball (as on screen)", component: C.menu, parts: [`menu-ball-${n}`], find: `() => document.querySelectorAll(".mnu-ball.c")[${i}]`, white: `() => document.querySelectorAll(".mnu-ball.w")[${i}]` });
  });
  add({ name: "register-card-stack", kind: "html", state: "modal", usedIn: "Register modal — violet card on fanned white + lime layers", component: C.modal, parts: ["register-card-shape-wide"], find: `() => X.modalCard()`, opts: { include: "(el) => !!el.querySelector('svg[viewBox=\"0 0 1758 919\"]')" } });
  add({ name: "register-card-shape-wide", kind: "svg", state: "modal", usedIn: "Register modal — card silhouette (desktop)", component: C.modal, partOf: "register-card-stack", find: `() => X.svgs("0 0 1758 919").find((s) => X.hex(getComputedStyle(s.querySelector("path")).fill).v === "#4E00FF")` });
  add({ name: "register-card-shape-tall", kind: "svg", state: "modal", usedIn: "Register modal — card silhouette (mobile)", component: C.modal, find: `() => X.svgs("0 0 786 1400").find((s) => X.hex(getComputedStyle(s.querySelector("path")).fill).v === "#4E00FF")`, opts: { size: [393, 700] } });
  add({ name: "register-close-x", kind: "html", state: "modal", usedIn: "Register modal — close button", component: C.modal, find: `() => document.querySelector(".dsc-close")` });
  add({ name: "select-caret", kind: "svg", state: "modal", usedIn: "Register modal — dropdown caret", component: C.modal, find: `() => X.svgs("0 0 19 11")[0]` });
  return S;
}

function installLib() {
  const NS = "http://www.w3.org/2000/svg", XL = "http://www.w3.org/1999/xlink";
  const r2 = (n) => Math.round(n * 100) / 100;
  const X = (window.X = {});
  X.hex = (c) => {
    if (!c || c === "none") return { v: "none", a: 1 };
    if (c.startsWith("url(")) return { v: c.replace(/url\("?[^#]*(#[^")]+)"?\)/, "url($1)"), a: 1 };
    const m = c.match(/rgba?\(([^)]+)\)/);
    if (!m) return { v: c, a: 1 };
    const p = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
    return { v: "#" + p.slice(0, 3).map((n) => Math.round(n).toString(16).padStart(2, "0")).join("").toUpperCase(), a: p.length > 3 ? p[3] : 1 };
  };
  X.svgs = (vb) => [...document.querySelectorAll(`svg[viewBox="${vb}"]`)];
  X.size = (el) => { const r = el.getBoundingClientRect(); return r.width * r.height; };
  X.visible = (els) => els.filter((e) => getComputedStyle(e).display !== "none" && X.size(e) > 0);
  const fontName = (ff) => (/__display|Fira/i.test(ff) ? "Fira Sans Extra Condensed" : /Plex/i.test(ff) ? "IBM Plex Sans" : "Manrope");
  const fontKey = (ff) => (/__display|Fira/i.test(ff) ? "display" : "sans");
  const fontStack = (ff) => (fontKey(ff) === "display" ? "'Fira Sans Extra Condensed', Manrope, sans-serif" : "Manrope, sans-serif");
  const ctx = document.createElement("canvas").getContext("2d");
  const metrics = (st, size) => { ctx.font = `${st.fontStyle} ${st.fontWeight} ${size}px ${st.fontFamily}`; return ctx.measureText("H"); };
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  const TPROPS = ["transform", "rotate", "scale", "translate"];
  const strip = (el) => { const saved = TPROPS.map((p) => [p, el.style.getPropertyValue(p), el.style.getPropertyPriority(p)]); TPROPS.forEach((p) => el.style.setProperty(p, "none", "important")); return () => saved.forEach(([p, v, pr]) => (v ? el.style.setProperty(p, v, pr) : el.style.removeProperty(p))); };
  const stripChain = (el) => { const undo = []; for (let n = el; n && n.nodeType === 1; n = n.parentElement) undo.push(strip(n)); return () => undo.reverse().forEach((u) => u()); };
  const cssMatrix = (st, box) => {
    let m = new DOMMatrix();
    const pct = (v, len) => (v.endsWith("%") ? (parseFloat(v) / 100) * len : parseFloat(v));
    if (st.translate && st.translate !== "none") { const [tx = "0px", ty = "0px"] = st.translate.split(" "); m = m.translate(pct(tx, box.w), pct(ty, box.h)); }
    if (st.rotate && st.rotate !== "none") m = m.rotate(parseFloat(st.rotate.split(" ").pop()));
    if (st.scale && st.scale !== "none") { const s = st.scale.split(" ").map(Number); m = m.scale(s[0], s[1] ?? s[0]); }
    if (st.transform && st.transform !== "none") m = m.multiply(new DOMMatrix(st.transform));
    if (m.isIdentity) return null;
    const [ox, oy] = st.transformOrigin.split(" ").map(parseFloat);
    const cx = box.x + ox, cy = box.y + oy;
    return new DOMMatrix().translate(cx, cy).multiply(new DOMMatrix([m.a, m.b, m.c, m.d, m.e, m.f])).translate(-cx, -cy);
  };
  const mstr = (m) => `matrix(${[m.a, m.b, m.c, m.d, m.e, m.f].map((n) => r2(n)).join(" ")})`;

  const radii = (st, w, h) => {
    const one = (v, len) => { const p = v.split(" ")[0]; return p.endsWith("%") ? (parseFloat(p) / 100) * len : parseFloat(p) || 0; };
    let r = [one(st.borderTopLeftRadius, w), one(st.borderTopRightRadius, w), one(st.borderBottomRightRadius, w), one(st.borderBottomLeftRadius, w)];
    const f = Math.min(1, w / (r[0] + r[1] || 1e-9), w / (r[3] + r[2] || 1e-9), h / (r[0] + r[3] || 1e-9), h / (r[1] + r[2] || 1e-9));
    return r.map((v) => v * f);
  };
  const rrect = (x, y, w, h, [tl, tr, br, bl]) =>
    `M${r2(x + tl)} ${r2(y)}H${r2(x + w - tr)}${tr ? `A${r2(tr)} ${r2(tr)} 0 0 1 ${r2(x + w)} ${r2(y + tr)}` : ""}V${r2(y + h - br)}${br ? `A${r2(br)} ${r2(br)} 0 0 1 ${r2(x + w - br)} ${r2(y + h)}` : ""}H${r2(x + bl)}${bl ? `A${r2(bl)} ${r2(bl)} 0 0 1 ${r2(x)} ${r2(y + h - bl)}` : ""}V${r2(y + tl)}${tl ? `A${r2(tl)} ${r2(tl)} 0 0 1 ${r2(x + tl)} ${r2(y)}` : ""}Z`;
  let uid = 0;
  const id = (p) => `${p}${++uid}`;
  const gradientPattern = (bgImage, box, defs) => {
    const m = bgImage.match(/repeating-linear-gradient\((-?[\d.]+)deg,(.*)\)$/);
    if (!m) return null;
    const ang = parseFloat(m[1]);
    const stops = [...m[2].matchAll(/(rgba?\([^)]+\))\s+([\d.]+)px/g)].map((s) => [X.hex(s[1]), parseFloat(s[2])]);
    const period = stops[stops.length - 1][1];
    const th = (ang * Math.PI) / 180, dir = [Math.sin(th), -Math.cos(th)];
    const L = Math.abs(box.w * Math.sin(th)) + Math.abs(box.h * Math.cos(th));
    const sx = box.x + box.w / 2 - (dir[0] * L) / 2, sy = box.y + box.h / 2 - (dir[1] * L) / 2;
    const pid = id("stripes");
    let rects = "";
    for (let i = 0; i < stops.length - 1; i++) {
      const [c, p0] = stops[i], [c2, p1] = stops[i + 1];
      if (p1 > p0 && c.a > 0 && c.v === c2.v) rects += `<rect x="${r2(p0)}" y="0" width="${r2(p1 - p0)}" height="${r2(period)}" fill="${c.v}"${c.a < 1 ? ` fill-opacity="${r2(c.a)}"` : ""}/>`;
    }
    defs.push(`<pattern id="${pid}" patternUnits="userSpaceOnUse" width="${r2(period)}" height="${r2(period)}" patternTransform="translate(${r2(sx)} ${r2(sy)}) rotate(${r2(ang - 90)})">${rects}</pattern>`);
    return `url(#${pid})`;
  };
  const dropShadow = (filter, defs) => {
    const m = filter.match(/drop-shadow\((rgba?\([^)]+\))\s+(-?[\d.]+)px\s+(-?[\d.]+)px\s+([\d.]+)px\)/);
    if (!m) return null;
    const c = X.hex(m[1]), fid = id("shadow");
    X.shadowReach = Math.max(X.shadowReach || 0, Math.max(Math.abs(+m[2]), Math.abs(+m[3])) + 1.5 * +m[4]);
    defs.push(`<filter id="${fid}" x="-25%" y="-25%" width="150%" height="160%"><feDropShadow dx="${r2(+m[2])}" dy="${r2(+m[3])}" stdDeviation="${r2(+m[4] / 2)}" flood-color="${c.v}" flood-opacity="${r2(c.a)}"/></filter>`);
    return `url(#${fid})`;
  };

  const svgTextRun = (o, runs) => {
    const st = getComputedStyle(o);
    const tp = o.querySelector("textPath");
    const dbl = getComputedStyle(tp || o).dominantBaseline;
    const size = parseFloat(st.fontSize);
    const m = metrics(st, size);
    const shift = dbl === "hanging" ? m.hangingBaseline : dbl === "central" || dbl === "middle" ? (m.fontBoundingBoxAscent - m.fontBoundingBoxDescent) / 2 : 0;
    const text = o.textContent.replace(/[\n\t\r]/g, " ").replace(/ +/g, " ").trim();
    const n = o.getNumberOfChars();
    const chars = [];
    for (let i = 0; i < n; i++) {
      const ch = text[i];
      if (!ch || ch === " ") continue;
      const p = o.getStartPositionOfChar(i);
      chars.push({ ch, x: p.x, y: p.y, rot: o.getRotationOfChar(i) });
    }
    const run = { id: runs.length, family: fontName(st.fontFamily), key: fontKey(st.fontFamily), weight: parseInt(st.fontWeight), size, shift, chars, text };
    runs.push(run);
    return run;
  };

  X.serializeSvg = (o, opts = {}, runs = []) => {
    const undo = opts.noStrip ? () => {} : stripChain(o);
    try {
      const c = o.cloneNode(true);
      const os = [o, ...o.querySelectorAll("*")], cl = [c, ...c.querySelectorAll("*")];
      const SHAPES = ["path", "rect", "circle", "ellipse", "polygon", "polyline", "line", "text", "g", "use", "tspan", "textPath"];
      const drop = [];
      os.forEach((oe, i) => {
        const ce = cl[i], tag = oe.tagName.toLowerCase(), st = getComputedStyle(oe);
        for (const a of [...ce.attributes]) if (/^(class|style|tabindex|focusable|role)$|^(data-|aria-)/.test(a.name)) ce.removeAttribute(a.name);
        const inDefs = !!oe.closest("defs,clipPath,mask,pattern,symbol,linearGradient,radialGradient,marker,filter");
        if (inDefs || oe === o) return;
        if (st.display === "none" || st.visibility === "hidden") { drop.push(ce); return; }
        ce.removeAttribute("visibility"); ce.removeAttribute("display");
        if (!SHAPES.includes(tag)) return;
        const paint = (prop, v, op) => {
          const h = X.hex(v);
          if (prop === "stroke" && h.v === "none") { ce.removeAttribute("stroke"); return false; }
          ce.setAttribute(prop, h.v);
          const a = h.a * parseFloat(op);
          if (a < 1) ce.setAttribute(`${prop}-opacity`, r2(a)); else ce.removeAttribute(`${prop}-opacity`);
          return true;
        };
        if (tag === "g") { if (parseFloat(st.opacity) < 1) ce.setAttribute("opacity", r2(parseFloat(st.opacity))); return; }
        paint("fill", st.fill, st.fillOpacity);
        if (!oe.hasAttribute("fill") && st.stroke !== "none" && X.hex(st.fill).v === "#000000" && oe.isPointInFill) {
          const bb = oe.getBBox();
          let inside = false;
          for (let i = 0; i <= 10 && !inside; i++) for (let j = 0; j <= 10 && !inside; j++) inside = oe.isPointInFill(new DOMPoint(bb.x + (bb.width * (i + 0.37)) / 11, bb.y + (bb.height * (j + 0.61)) / 11));
          if (!inside) ce.setAttribute("fill", "none");
        }
        if (paint("stroke", st.stroke, st.strokeOpacity)) {
          ce.setAttribute("stroke-width", r2(parseFloat(st.strokeWidth)));
          if (st.strokeLinecap !== "butt") ce.setAttribute("stroke-linecap", st.strokeLinecap);
          if (st.strokeLinejoin !== "miter") ce.setAttribute("stroke-linejoin", st.strokeLinejoin);
          const dash = st.strokeDasharray, off = parseFloat(st.strokeDashoffset) || 0;
          const len = tag === "path" ? oe.getTotalLength() : 0;
          if (dash !== "none" && !(Math.abs(off) < 0.5 && parseFloat(dash) >= len - 1)) { ce.setAttribute("stroke-dasharray", dash.replace(/px/g, "")); ce.setAttribute("stroke-dashoffset", r2(off)); }
          else { ce.removeAttribute("stroke-dasharray"); ce.removeAttribute("stroke-dashoffset"); }
        }
        if (st.fillRule !== "nonzero") ce.setAttribute("fill-rule", st.fillRule);
        if (parseFloat(st.opacity) < 1) ce.setAttribute("opacity", r2(parseFloat(st.opacity))); else ce.removeAttribute("opacity");
        if (tag === "text" || tag === "textPath" || tag === "tspan") {
          if (tag === "text") {
            ce.setAttribute("font-family", fontStack(st.fontFamily));
            ce.setAttribute("font-size", r2(parseFloat(st.fontSize)));
            ce.setAttribute("font-weight", st.fontWeight);
            if (st.letterSpacing !== "normal" && parseFloat(st.letterSpacing)) ce.setAttribute("letter-spacing", r2(parseFloat(st.letterSpacing)));
            ce.setAttribute("data-run", svgTextRun(oe, runs).id);
          }
          if (st.textAnchor !== "start") ce.setAttribute("text-anchor", st.textAnchor);
          if (st.dominantBaseline !== "auto") ce.setAttribute("dominant-baseline", st.dominantBaseline);
          if (ce.hasAttribute("href")) ce.setAttributeNS(XL, "xlink:href", ce.getAttribute("href"));
        }
        if (!oe.hasAttribute("transform") && st.transform !== "none") {
          const m = new DOMMatrix(st.transform);
          if (!m.isIdentity) {
            const bb = st.transformBox === "fill-box" ? oe.getBBox() : { x: 0, y: 0 };
            const [ox, oy] = st.transformOrigin.split(" ").map(parseFloat);
            ce.setAttribute("transform", mstr(new DOMMatrix().translate(bb.x + ox, bb.y + oy).multiply(m).translate(-(bb.x + ox), -(bb.y + oy))));
          }
        }
      });
      drop.forEach((d) => d.remove());
      if (opts.remove) c.querySelectorAll(opts.remove).forEach((e) => e.remove());
      if (opts.keepOnly) { const keep = new Set(c.querySelectorAll(opts.keepOnly)); [...c.children].forEach((e) => { if (!keep.has(e) && e.tagName !== "defs") e.remove(); }); }
      if (opts.clearTransform) c.querySelectorAll(opts.clearTransform).forEach((e) => e.removeAttribute("transform"));
      const st = getComputedStyle(o), r = o.getBoundingClientRect();
      let vb = (o.getAttribute("viewBox") || `0 0 ${r.width} ${r.height}`).split(/[\s,]+/).map(Number);
      let w = r.width, h = r.height;
      if (!(w > 0 && h > 0)) [w, h] = opts.size || [vb[2], vb[3]];
      const pxPerUnit = w / vb[2];
      if (opts.fit) {
        const tmp = c.cloneNode(true);
        tmp.setAttribute("style", "position:fixed;left:0;top:0;visibility:hidden");
        document.body.appendChild(tmp);
        const bb = tmp.getBBox();
        let sw = 0; tmp.querySelectorAll("[stroke-width]").forEach((e) => (sw = Math.max(sw, +e.getAttribute("stroke-width"))));
        tmp.remove();
        const pad = sw / 2 + Math.max(bb.width, bb.height) * 0.01;
        vb = [bb.x - pad, bb.y - pad, bb.width + 2 * pad, bb.height + 2 * pad];
        w = vb[2] * pxPerUnit; h = vb[3] * pxPerUnit;
        c.setAttribute("preserveAspectRatio", "xMidYMid meet");
      }
      c.setAttribute("viewBox", vb.map(r2).join(" "));
      c.setAttribute("width", r2(w)); c.setAttribute("height", r2(h));
      c.removeAttribute("overflow");
      const defs = [], pre = [];
      const k = vb[2] / w;
      const rad = radii(st, w, h).map((v) => v * k);
      const bg = X.hex(st.backgroundColor);
      const clipNeeded = rad.some((v) => v > 0);
      let clipId = null;
      if (clipNeeded) { clipId = id("clip"); defs.push(`<clipPath id="${clipId}"><path d="${rrect(vb[0], vb[1], vb[2], vb[3], rad)}"/></clipPath>`); }
      if (bg.v !== "none" && bg.a > 0) pre.push(`<path d="${rrect(vb[0], vb[1], vb[2], vb[3], rad)}" fill="${bg.v}"${bg.a < 1 ? ` fill-opacity="${r2(bg.a)}"` : ""}/>`);
      let inner = [...c.childNodes].map((n) => new XMLSerializer().serializeToString(n)).join("").replace(/ xmlns="http:\/\/www\.w3\.org\/2000\/svg"/g, "");
      inner = pre.join("") + (clipId ? `<g clip-path="url(#${clipId})">${inner}</g>` : inner);
      const attrs = [...c.attributes].filter((a) => !/^xmlns/.test(a.name)).map((a) => `${a.name}="${esc(a.value)}"`).join(" ");
      const markup = `<svg xmlns="${NS}" xmlns:xlink="${XL}" ${attrs}>${defs.length ? `<defs>${defs.join("")}</defs>` : ""}${inner}</svg>`;
      return { markup, runs, w: r2(w), h: r2(h), viewBox: vb.map(r2).join(" ") };
    } finally { undo(); }
  };

  X.serializeHtml = async (root, opts = {}) => {
    const undo = stripChain(root);
    const runs = [], defs = [], undos = [];
    X.shadowReach = 0;
    const include = opts.include ? (0, eval)(opts.include) : null;
    try {
      const R = root.getBoundingClientRect();
      const rel = (r) => ({ x: r.left - R.left, y: r.top - R.top, w: r.width, h: r.height });
      const toData = async (src) => { const b = await (await fetch(src)).blob(); return await new Promise((res) => { const f = new FileReader(); f.onload = () => res(f.result); f.readAsDataURL(b); }); };
      const box = (st, b) => {
        let out = "";
        const rad = radii(st, b.w, b.h);
        const bg = X.hex(st.backgroundColor);
        if (bg.v !== "none" && bg.a > 0) out += `<path d="${rrect(b.x, b.y, b.w, b.h, rad)}" fill="${bg.v}"${bg.a < 1 ? ` fill-opacity="${r2(bg.a)}"` : ""}/>`;
        if (st.backgroundImage && st.backgroundImage !== "none") {
          const fill = gradientPattern(st.backgroundImage, b, defs);
          if (fill) out += `<path d="${rrect(b.x, b.y, b.w, b.h, rad)}" fill="${fill}"/>`;
        }
        const bw = parseFloat(st.borderTopWidth), bc = X.hex(st.borderTopColor);
        if (bw > 0 && st.borderTopStyle === "solid" && bc.v !== "none" && bc.a > 0)
          out += `<path d="${rrect(b.x + bw / 2, b.y + bw / 2, b.w - bw, b.h - bw, rad.map((v) => Math.max(0, v - bw / 2)))}" fill="none" stroke="${bc.v}" stroke-width="${r2(bw)}"${bc.a < 1 ? ` stroke-opacity="${r2(bc.a)}"` : ""}/>`;
        return out;
      };
      const textNode = (node) => {
        const pe = node.parentElement, st = getComputedStyle(pe);
        const size = parseFloat(st.fontSize), asc = metrics(st, size).fontBoundingBoxAscent;
        const upper = st.textTransform === "uppercase";
        const rg = document.createRange();
        const lines = new Map();
        const s = node.data;
        for (let i = 0; i < s.length; ) {
          const cp = s.codePointAt(i), len = cp > 0xffff ? 2 : 1;
          rg.setStart(node, i); rg.setEnd(node, i + len);
          const rc = rg.getClientRects()[0];
          let ch = String.fromCodePoint(cp);
          i += len;
          if (!rc || (rc.width === 0 && /\s/.test(ch))) continue;
          if (upper) ch = ch.toUpperCase();
          const b = rel(rc), y = b.y + asc, key = Math.round(y * 2);
          if (!lines.has(key)) lines.set(key, []);
          lines.get(key).push({ ch: /\s/.test(ch) ? " " : ch, x: b.x, y });
        }
        const col = X.hex(st.color);
        let out = "";
        for (const chars of lines.values()) {
          const text = chars.map((c) => c.ch).join("").replace(/ +/g, " ");
          if (!text.trim()) continue;
          const first = chars.find((c) => c.ch !== " ");
          const run = { id: runs.length, family: fontName(st.fontFamily), key: fontKey(st.fontFamily), weight: parseInt(st.fontWeight), size, shift: 0, chars: chars.filter((c) => c.ch !== " ").map((c) => ({ ...c, rot: 0 })), text: text.trim() };
          runs.push(run);
          const ls = st.letterSpacing !== "normal" && parseFloat(st.letterSpacing) ? ` letter-spacing="${r2(parseFloat(st.letterSpacing))}"` : "";
          out += `<text data-run="${run.id}" x="${r2(first.x)}" y="${r2(first.y)}" font-family="${fontStack(st.fontFamily)}" font-size="${r2(size)}" font-weight="${st.fontWeight}"${ls} fill="${col.v}"${col.a < 1 ? ` fill-opacity="${r2(col.a)}"` : ""}>${esc(text.trim())}</text>`;
        }
        return out;
      };
      const walk = async (el, isRoot = false) => {
        let out = "";
        const kids = [...el.childNodes].filter((n) => !(isRoot && include && n.nodeType === 1 && !include(n)));
        for (const n of kids) {
          if (n.nodeType === 3) { if (!(isRoot && include)) out += textNode(n); continue; }
          if (n.nodeType !== 1) continue;
          const st = getComputedStyle(n);
          if (st.display === "none" || st.visibility === "hidden" || parseFloat(st.opacity) === 0) continue;
          if (/^inset\(100%/.test(st.clipPath)) continue;
          const preM = n.getBoundingClientRect();
          if (preM.width * preM.height === 0 && n.tagName !== "BR" && st.display !== "inline" && st.display !== "contents") continue;
          const T = { transform: st.transform, rotate: st.rotate, scale: st.scale, translate: st.translate, transformOrigin: st.transformOrigin };
          const un = strip(n);
          const b = rel(n.getBoundingClientRect());
          const m = cssMatrix(T, b);
          let inner = "";
          if (n instanceof SVGSVGElement) {
            const s = X.serializeSvg(n, { noStrip: true }, runs);
            inner = s.markup.replace(/^<svg /, `<svg x="${r2(b.x)}" y="${r2(b.y)}" `).replace(/ width="[^"]*" height="[^"]*"/, ` width="${r2(b.w)}" height="${r2(b.h)}"`);
          } else {
            inner = box(st, b);
            if (n.tagName === "IMG") {
              const rad = radii(st, b.w, b.h), cid = id("img");
              defs.push(`<clipPath id="${cid}"><path d="${rrect(b.x, b.y, b.w, b.h, rad)}"/></clipPath>`);
              const fit = { contain: "xMidYMid meet", cover: "xMidYMid slice", fill: "none" }[st.objectFit] || "none";
              inner += `<image href="${await toData(n.currentSrc || n.src)}" x="${r2(b.x)}" y="${r2(b.y)}" width="${r2(b.w)}" height="${r2(b.h)}" preserveAspectRatio="${fit}" clip-path="url(#${cid})"/>`;
            }
            let kidsOut = await walk(n);
            if (st.overflow === "hidden" && kidsOut) {
              const cid = id("ovf");
              defs.push(`<clipPath id="${cid}"><path d="${rrect(b.x, b.y, b.w, b.h, radii(st, b.w, b.h))}"/></clipPath>`);
              kidsOut = `<g clip-path="url(#${cid})">${kidsOut}</g>`;
            }
            inner += kidsOut;
          }
          un();
          const attrs = [];
          if (m) attrs.push(`transform="${mstr(m)}"`);
          if (parseFloat(st.opacity) < 1) attrs.push(`opacity="${r2(parseFloat(st.opacity))}"`);
          if (st.filter && st.filter !== "none") { const f = dropShadow(st.filter, defs); if (f) attrs.push(`filter="${f}"`); }
          out += attrs.length && inner ? `<g ${attrs.join(" ")}>${inner}</g>` : inner;
        }
        return out;
      };
      const rst = getComputedStyle(root);
      let body = box(rst, { x: 0, y: 0, w: R.width, h: R.height }) + (await walk(root, true));
      let vb = [0, 0, R.width, R.height];
      if (opts.keepRootTransform) {
        undo();
        const stR = getComputedStyle(root);
        const m = cssMatrix(stR, { x: 0, y: 0, w: R.width, h: R.height });
        if (m) {
          body = `<g transform="${mstr(m)}">${body}</g>`;
          const pts = [[0, 0], [R.width, 0], [R.width, R.height], [0, R.height]].map(([x, y]) => m.transformPoint(new DOMPoint(x, y)));
          const xs = pts.map((p) => p.x), ys = pts.map((p) => p.y);
          vb = [Math.min(...xs), Math.min(...ys), Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)];
        }
      }
      const tmp = document.createElementNS(NS, "svg");
      tmp.setAttribute("style", "position:fixed;left:0;top:0;visibility:hidden;overflow:visible");
      tmp.innerHTML = `${defs.length ? `<defs>${defs.join("")}</defs>` : ""}<g>${body}</g>`;
      document.body.appendChild(tmp);
      const bb = tmp.lastElementChild.getBBox();
      tmp.remove();
      const pad = X.shadowReach || 0;
      const x0 = Math.min(vb[0], bb.x - pad), y0 = Math.min(vb[1], bb.y - pad);
      const x1 = Math.max(vb[0] + vb[2], bb.x + bb.width + pad), y1 = Math.max(vb[1] + vb[3], bb.y + bb.height + pad);
      vb = [x0, y0, x1 - x0, y1 - y0];
      const markup = `<svg xmlns="${NS}" xmlns:xlink="${XL}" viewBox="${vb.map(r2).join(" ")}" width="${r2(vb[2])}" height="${r2(vb[3])}">${defs.length ? `<defs>${defs.join("")}</defs>` : ""}${body}</svg>`;
      return { markup, runs, w: r2(vb[2]), h: r2(vb[3]), viewBox: vb.map(r2).join(" ") };
    } finally { undos.forEach((u) => u()); undo(); }
  };

  X.sticker = (label) => {
    const hero = document.querySelector("main section");
    const p = [...hero.querySelectorAll("p")].find((e) => e.textContent.includes(label) && e.className.includes("-translate-x-1/2"));
    const root = p.parentElement.parentElement.parentElement;
    const rot = new DOMMatrix(getComputedStyle(root).transform === "none" ? undefined : getComputedStyle(root).transform);
    return { root, shape: p.parentElement.firstElementChild, rot: Math.round((Math.atan2(rot.b, rot.a) * 180) / Math.PI * 10) / 10 };
  };
  X.layoutBox = (el) => { const undo = stripChain(el); try { return el.getBoundingClientRect(); } finally { undo(); } };
  X.tiles = () => [...document.querySelectorAll("li.will-change-transform")];
  X.swapTile = (tile) => {
    const [a, b] = tile.querySelectorAll(":scope > span");
    const sa = a.style.transform, sb = b.style.transform;
    a.style.transform = "scale(0)"; b.style.transform = "scale(1)";
    return () => { a.style.transform = sa; b.style.transform = sb; };
  };
  X.arrows = () => {
    const seen = new Map();
    for (const s of X.svgs("0 0 70 70")) {
      const btn = s.closest(".arrow-btn"), vis = btn && X.visible([...btn.querySelectorAll(".arrow-icon")])[0];
      const st = getComputedStyle(s), straight = s === btn?.querySelector(".arrow-icon");
      const name = `arrow-${straight ? "straight" : "diagonal"}-${X.cname(X.hex(st.backgroundColor).v)}-${X.cname(X.hex(st.color).v)}`;
      if (!seen.has(name)) seen.set(name, { el: s, size: vis ? [vis.getBoundingClientRect().width, vis.getBoundingClientRect().height] : null, usedIn: straight ? "Arrow button — hover state" : "Arrow button" });
    }
    return [...seen].map(([name, v]) => ({ name, ...v }));
  };
  X.checks = () => {
    const seen = new Map();
    for (const s of X.visible(X.svgs("0 0 20 20"))) {
      const name = `check-icon-${X.cname(X.hex(getComputedStyle(s.querySelector("path")).stroke).v)}`;
      if (!seen.has(name)) seen.set(name, { el: s });
    }
    return [...seen].map(([name, v]) => ({ name, ...v }));
  };
  X.socials = () => X.svgs("0 0 64 64").map((s) => {
    const label = s.closest("a").textContent.trim().toLowerCase();
    const hover = !s.classList.contains("text-lilac");
    return { name: `social-${label}${hover ? "-hover" : ""}`, el: hover ? s.parentElement : s, kind: hover ? "html" : "svg", usedIn: `Footer — ${label} link${hover ? " (hover)" : ""}` };
  });
  X.cursors = () => {
    const seen = new Map();
    for (const s of [...X.svgs("0 0 35 41"), ...X.svgs("0 0 35 35")]) {
      const tap = s.getAttribute("viewBox") === "0 0 35 35";
      const fill = X.hex(getComputedStyle(s.querySelector("path")).fill).v;
      const name = tap ? "cursor-tap" : `cursor-arrow-${X.cname(fill)}`;
      if (!seen.has(name)) seen.set(name, { el: s, size: [35 * 0.75, (tap ? 35 : 41) * 0.75], usedIn: tap ? "Custom cursor — over clickable things" : "Custom cursor — arrow" });
    }
    return [...seen].map(([name, v]) => ({ name, ...v }));
  };
  X.modalCard = () => X.svgs("0 0 1758 919")[0].parentElement.parentElement;
  X.ring = (colored, white) => {
    const c = colored.getBoundingClientRect(), w = white.getBoundingClientRect();
    return { ratio: w.width / c.width, white: X.hex(getComputedStyle(white).backgroundColor).v };
  };

  X.freeze = () => {
    if (!document.getElementById("x-freeze")) {
      const s = document.createElement("style");
      s.id = "x-freeze";
      s.textContent = "*,*::before,*::after{animation-play-state:paused!important;transition:none!important;caret-color:transparent!important}";
      document.head.appendChild(s);
    }
    for (const a of document.getAnimations()) {
      const t = a.effect?.getComputedTiming?.();
      if (t && t.iterations === Infinity) { a.pause(); a.currentTime = 0; }
      else { try { a.finish(); } catch { a.pause(); } }
    }
  };
}

const FONT_DIRS = {
  sans: { dir: "node_modules/@fontsource-variable/manrope/files", re: /^manrope-(latin|latin-ext|cyrillic|cyrillic-ext)-wght-normal\.woff2$/, variable: true },
  display: { dir: "node_modules/@fontsource/fira-sans-extra-condensed/files", re: /^fira-sans-extra-condensed-(latin|latin-ext|cyrillic|cyrillic-ext)-900-normal\.woff2$/ },
};
async function loadFonts() {
  const fonts = {};
  for (const [key, f] of Object.entries(FONT_DIRS)) {
    const dir = path.join(ROOT, f.dir);
    fonts[key] = [];
    for (const n of fs.readdirSync(dir).filter((n) => f.re.test(n)).sort())
      fonts[key].push({ file: n, variable: !!f.variable, font: fontkit.create(Buffer.from(await wawoff2.decompress(fs.readFileSync(path.join(dir, n))))), byWeight: new Map() });
  }
  return fonts;
}
function glyphFor(fonts, key, weight, cp) {
  const chain = key === "display" ? [...fonts.display, ...fonts.sans] : fonts.sans;
  for (const f of chain) {
    if (!f.font.hasGlyphForCodePoint(cp)) continue;
    let font = f.font;
    if (f.variable) {
      const axis = font.variationAxes.wght, w = Math.min(axis.max, Math.max(axis.min, weight));
      if (!f.byWeight.has(w)) f.byWeight.set(w, font.getVariation({ wght: w }));
      font = f.byWeight.get(w);
    }
    return { glyph: font.glyphForCodePoint(cp), upm: font.unitsPerEm, file: f.file };
  }
  return null;
}
const round = (s) => s.replace(/-?\d+\.\d+/g, (n) => String(Math.round(+n * 100) / 100));
function outline(svg, runs, fonts) {
  const missing = [];
  const out = svg.replace(/<text\b([^>]*)data-run="(\d+)"([^>]*)>[\s\S]*?<\/text>/g, (_, a1, rid, a2) => {
    const run = runs[+rid];
    const attrs = (a1 + a2).match(/\s(fill|fill-opacity|opacity|transform|stroke|stroke-width|stroke-opacity)="[^"]*"/g)?.join("") || "";
    const s = run.size;
    const paths = [];
    for (const c of run.chars) {
      const g = glyphFor(fonts, run.key, run.weight, c.ch.codePointAt(0));
      if (!g) { missing.push(c.ch); continue; }
      const k = s / g.upm, th = (c.rot * Math.PI) / 180, cos = Math.cos(th), sin = Math.sin(th);
      const ox = c.x + -sin * run.shift, oy = c.y + cos * run.shift;
      const d = g.glyph.path.transform(k * cos, k * sin, k * sin, -k * cos, ox, oy).toSVG();
      if (d) paths.push(`<path d="${round(d)}"/>`);
    }
    return `<g${attrs} aria-label="${xmlEsc(run.text)}">${paths.join("")}</g>`;
  });
  return { svg: out, missing };
}
const stripRuns = (svg) => svg.replace(/ data-run="\d+"/g, "");
const xmlEsc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

async function main() {
  const fonts = await loadFonts();
  fs.rmSync(OUT, { recursive: true, force: true });
  for (const d of ["svg/editable", "png/@2x", "png/@4x", "logos"]) fs.mkdirSync(path.join(OUT, d), { recursive: true });

  const browser = await chromium.launch({ args: ["--font-render-hinting=none"] });
  const page = await browser.newPage({ viewport: { width: WIDTH, height: 900 }, reducedMotion: "reduce" });
  console.log(`Loading ${URL_} at ${WIDTH}px…`);
  await page.goto(URL_, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += 700) { await page.evaluate((y) => window.scrollTo(0, y), y); await page.waitForTimeout(120); }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.mouse.move(700, 450);
  await page.waitForTimeout(2500);
  await page.evaluate(installLib);
  await page.evaluate((names) => { X.cname = (h) => names[h?.toUpperCase()] || h?.replace("#", "").toLowerCase(); }, NAMES);
  await page.evaluate(() => X.freeze());

  const results = [];
  const capture = async (spec) => {
    const r = await page.evaluate(async (spec) => {
      const el = (0, eval)(spec.find)();
      if (!el) return { error: "element not found" };
      const undo = spec.prep ? (0, eval)(spec.prep)() : null;
      try {
        if (spec.kind === "file") { const b = X.layoutBox(el); return { w: b.width, h: b.height }; }
        const res = spec.kind === "html" ? await X.serializeHtml(el, spec.opts) : X.serializeSvg(el, spec.opts, []);
        if (spec.rotation) res.rotation = (0, eval)(spec.rotation)();
        return res;
      } finally { undo?.(); }
    }, spec);
    return r;
  };
  const record = (spec, r) => {
    if (r.error) { console.warn(`  ✗ ${spec.name}: ${r.error}`); results.push({ ...spec, error: r.error }); return; }
    results.push({ ...spec, ...r });
    console.log(`  ✓ ${spec.name}  ${Math.round(r.w)}×${Math.round(r.h)}${r.runs?.length ? `  (text: ${r.runs.map((x) => x.text).join(" | ")})` : ""}`);
  };

  const specs = assetSpecs();
  const states = {
    page: async () => {},
    faq: async () => { await page.evaluate(() => document.querySelector("#faq button[aria-expanded]").click()); await page.waitForTimeout(800); },
    menu: async () => { await page.getByRole("button", { name: /Цэс/ }).first().click(); await page.waitForTimeout(3000); },
    modal: async () => { await page.keyboard.press("Escape"); await page.waitForTimeout(1500); await page.evaluate(() => window.dispatchEvent(new Event("open-register"))); await page.waitForTimeout(2500); },
  };
  for (const [state, enter] of Object.entries(states)) {
    console.log(`\n[${state}]`);
    await enter();
    await page.evaluate(() => X.freeze());
    for (const spec of specs.filter((s) => s.state === state)) {
      if (spec.kind === "many") {
        const list = await page.evaluate((f) => (0, eval)(f)().map((x, i) => ({ name: x.name, kind: x.kind || "svg", usedIn: x.usedIn, size: x.size, i })), spec.find);
        for (const item of list) {
          const sub = { ...spec, name: item.name, kind: item.kind, usedIn: item.usedIn || spec.usedIn, group: spec.name, find: `() => (${spec.find})()[${item.i}].el`, opts: { ...(spec.opts || {}), ...(item.size ? { size: item.size } : {}) } };
          record(sub, await capture(sub));
        }
      } else if (spec.kind === "ring") {
        const ball = await capture({ ...spec, kind: "html" });
        const ring = await page.evaluate(([a, b]) => X.ring((0, eval)(a)(), (0, eval)(b)()), [spec.find, spec.white]);
        if (ball.error) { record(spec, ball); continue; }
        const W = ball.w * ring.ratio, off = (W - ball.w) / 2;
        const inner = ball.markup.replace(/^<svg [^>]*>/, "").replace(/<\/svg>$/, "");
        ball.markup = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${W.toFixed(2)} ${W.toFixed(2)}" width="${W.toFixed(2)}" height="${W.toFixed(2)}"><circle cx="${(W / 2).toFixed(2)}" cy="${(W / 2).toFixed(2)}" r="${(W / 2).toFixed(2)}" fill="${ring.white}"/><g transform="translate(${off.toFixed(2)} ${off.toFixed(2)})">${inner}</g></svg>`;
        ball.w = ball.h = +W.toFixed(2); ball.viewBox = `0 0 ${W.toFixed(2)} ${W.toFixed(2)}`;
        record(spec, ball);
      } else record(spec, await capture(spec));
    }
  }

  const fontCss = await page.evaluate((origin) => {
    const css = [];
    for (const sh of document.styleSheets) { let rules; try { rules = sh.cssRules; } catch { continue; }
      for (const r of rules) if (r instanceof CSSFontFaceRule) {
        const fam = r.style.getPropertyValue("font-family").replace(/["']/g, "");
        const alias = fam === "Manrope Variable" ? "Manrope" : /__display/.test(fam) && !/Fallback/.test(fam) ? "Fira Sans Extra Condensed" : null;
        if (alias) css.push(r.cssText.replace(/font-family:[^;]+;/, `font-family: "${alias}";`).replace(/url\("?\//g, `url("${origin}/`));
      } }
    return css.join("\n");
  }, new URL(URL_).origin);

  const ok = results.filter((r) => !r.error);
  for (const r of ok) {
    r.file = `svg/${r.name}.svg`;
    if (r.kind === "file") {
      fs.copyFileSync(path.join(ROOT, r.src), path.join(OUT, r.file));
      r.markup = fs.readFileSync(path.join(OUT, r.file), "utf8");
      r.viewBox = r.markup.match(/viewBox="([^"]+)"/)?.[1];
      continue;
    }
    if (r.runs?.length) {
      const { svg, missing } = outline(r.markup, r.runs, fonts);
      r.editable = `svg/editable/${r.name}.svg`;
      fs.writeFileSync(path.join(OUT, r.editable), `<?xml version="1.0" encoding="UTF-8"?>\n${stripRuns(r.markup)}\n`);
      r.markup = svg;
      if (missing.length) r.missingGlyphs = [...new Set(missing)];
    }
    r.markup = stripRuns(r.markup);
    fs.writeFileSync(path.join(OUT, r.file), `<?xml version="1.0" encoding="UTF-8"?>\n${r.markup}\n`);
  }

  for (const dsf of [2, 4]) {
    const p = await browser.newPage({ deviceScaleFactor: dsf });
    for (const r of ok) {
      const longest = Math.max(r.w, r.h);
      const k = longest > PNG_MAX ? PNG_MAX / longest : longest < PNG_MIN ? PNG_MIN / longest : 1;
      const w = Math.max(1, Math.round(r.w * k)), h = Math.max(1, Math.round(r.h * k));
      r.pngBase = [w, h];
      const data = Buffer.from(fs.readFileSync(path.join(OUT, r.file))).toString("base64");
      await p.setViewportSize({ width: w + 20, height: h + 20 });
      await p.setContent(`<!doctype html><style>html,body{margin:0;background:transparent}img{display:block;margin:10px}</style><img width="${w}" height="${h}" src="data:image/svg+xml;base64,${data}">`);
      const file = `png/@${dsf}x/${r.name}.png`;
      try {
        await p.evaluate(() => document.querySelector("img").decode());
        await p.locator("img").screenshot({ path: path.join(OUT, file), omitBackground: true });
        (r.png ||= {})[`@${dsf}x`] = file;
      } catch (e) { (r.pngErrors ||= []).push(`@${dsf}x: ${e.message.split("\n")[0]}`); console.warn(`  ✗ ${r.name} @${dsf}x: ${e.message.split("\n")[0]}`); }
    }
    await p.close();
  }

  for (const n of ["syscotech.png", "nasha-tech.png"]) fs.copyFileSync(path.join(ROOT, "public/logos", n), path.join(OUT, "logos", n));

  const hex6 = (r, g, b) => "#" + [r, g, b].map((n) => (+n).toString(16).padStart(2, "0")).join("").toUpperCase();
  const colorsOf = (svg) => [...new Set([...svg.matchAll(/(?:fill|stroke|flood-color|stop-color)(?:="|:\s*)(?:(#[0-9A-Fa-f]{6})|rgb\((\d+),\s*(\d+),\s*(\d+)\))/g)].map((m) => (m[1] ? m[1].toUpperCase() : hex6(m[2], m[3], m[4]))))];
  for (const r of ok) r.colors = colorsOf(r.kind === "file" ? r.markup : r.markup);
  const fontsOf = (r) => (r.runs?.length ? [...new Set(r.runs.map((x) => `${x.family} ${x.weight}`))] : null);
  const manifest = ok.map((r) => ({
    name: r.name,
    file: r.file,
    ...(r.editable ? { editable: r.editable } : {}),
    png: r.png,
    size: { width: r.w, height: r.h, unit: "css px at 1440px viewport" },
    viewBox: r.viewBox,
    colors: r.colors.map((hex) => ({ hex, name: colorName(hex) })),
    font: fontsOf(r) ? { families: fontsOf(r), outlined: true, text: r.runs.map((x) => x.text) } : null,
    usedIn: r.usedIn,
    component: r.component,
    ...(r.parts ? { parts: r.parts } : {}),
    ...(r.partOf ? { partOf: r.partOf } : {}),
    ...(r.rotation ? { rotationOnPage: `${r.rotation}°` } : {}),
    ...(r.note ? { note: r.note } : {}),
    ...(r.missingGlyphs ? { missingGlyphs: r.missingGlyphs } : {}),
  }));
  fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");

  const tw = fs.readFileSync(path.join(ROOT, "tailwind.config.ts"), "utf8");
  const palette = [...tw.matchAll(/^\s+(\w+): "(#[0-9a-fA-F]{6})",?(?:\s*\/\/\s*(.*))?$/gm)].map((m) => [m[1], m[2].toUpperCase(), m[3] || ""]);
  const usage = new Map();
  for (const r of ok) for (const c of r.colors) usage.set(c, [...(usage.get(c) || []), r.name]);
  const inPalette = new Set(palette.map((p) => p[1]));
  const extra = [...usage.keys()].filter((h) => !inPalette.has(h)).sort();
  const md = [
    "# Colours & fonts — Programming Olympiad 2026 (Sys&CoTech)",
    "",
    "Swatches: open index.html (every asset shows its colours).",
    "",
    "## Palette (tailwind.config.ts)",
    "",
    "| Name | Hex | Used by exported assets |",
    "| --- | --- | --- |",
    ...palette.map(([n, h, c]) => `| \`${n}\`${c ? ` — ${c}` : ""} | \`${h}\` | ${(usage.get(h) || []).length} |`),
    "",
    "## Other colours used in the artwork",
    "",
    "| Name | Hex | Assets |",
    "| --- | --- | --- |",
    ...extra.map((h) => `| ${colorName(h)} | \`${h}\` | ${usage.get(h).slice(0, 6).join(", ")}${usage.get(h).length > 6 ? ` +${usage.get(h).length - 6}` : ""} |`),
    "",
    "Translucent tints used on the site: `ink` at 12% / 15% / 50% / 60% (borders, labels), white at 4–12% (cards, stripes), `lilac` 12% with a white stroke (nav tag).",
    "",
    "## Fonts",
    "",
    "| Role | Font | Weights | Source |",
    "| --- | --- | --- | --- |",
    "| Display (headlines, prize cards, numbers) | **Fira Sans Extra Condensed** Black, uppercase, letter-spacing −0.022em | 900 | Google Fonts / @fontsource/fira-sans-extra-condensed |",
    "| Body, labels, badges, text rings | **Manrope** (variable) | 200–800 (site uses 500–800) | Google Fonts / @fontsource-variable/manrope |",
    "| Stretched decorative letters (hero «о», «0») | **IBM Plex Sans** Regular outlines (already paths) | 400 | SIL OFL 1.1 |",
    "",
    "The display face has no `₮`; the site falls back to Manrope for that glyph (the outlined SVGs do the same).",
    "All text in `svg/` is converted to outlines. `svg/editable/` keeps live `<text>` (install the fonts above to edit).",
    "",
  ].join("\n");
  fs.writeFileSync(path.join(OUT, "colors.md"), md);

  fs.writeFileSync(path.join(OUT, "index.html"), contactSheet(manifest));

  const qa = await verify(browser, ok, fontCss);
  fs.writeFileSync(path.join(OUT, "qa.json"), JSON.stringify(qa, null, 2) + "\n");
  await browser.close();

  fs.rmSync(ZIP, { force: true });
  try { execFileSync("zip", ["-qr", ZIP, path.basename(OUT)], { cwd: ROOT }); } catch (e) { console.warn("zip failed:", e.message); }

  const count = (d) => fs.readdirSync(d, { withFileTypes: true }).reduce((n, e) => n + (e.isDirectory() ? count(path.join(d, e.name)) : 1), 0);
  console.log(`\n${ok.length} assets exported (${results.length - ok.length} failed), ${count(OUT)} files in ${OUT}`);
  console.log(`QA: ${qa.problems.length ? qa.problems.length + " problem(s):\n  " + qa.problems.join("\n  ") : "no problems"}`);
  console.log(`Zip: ${ZIP} (${(fs.statSync(ZIP).size / 1024 / 1024).toFixed(1)} MB)`);
}

async function verify(browser, ok, fontCss) {
  const problems = [], report = {};
  const p = await browser.newPage({ deviceScaleFactor: 1 });
  await p.route(`${URL_}/__qa`, (route) => route.fulfill({ contentType: "text/html", body: "<!doctype html><html><head><meta charset=utf-8></head><body></body></html>" }));
  await p.goto(`${URL_}/__qa`);
  await p.addStyleTag({ content: fontCss + "html,body{margin:0;background:transparent}" });
  const fontsOk = await p.evaluate(async () => {
    const want = ["500 20px Manrope", "600 20px Manrope", "700 20px Manrope", "800 20px Manrope", "900 20px 'Fira Sans Extra Condensed'"];
    await Promise.all(want.map((f) => document.fonts.load(f, "АБВӨҮabc₮")));
    return want.filter((f) => !document.fonts.check(f, "АБВ"));
  });
  if (fontsOk.length) problems.push(`QA could not load site fonts: ${fontsOk.join(", ")} (outline comparison unreliable)`);
  for (const r of ok) {
    const rep = (report[r.name] = {});
    const svg = fs.readFileSync(path.join(OUT, r.file), "utf8");
    rep.svgValid = await p.evaluate((s) => !new DOMParser().parseFromString(s, "image/svg+xml").querySelector("parsererror"), svg);
    if (!rep.svgValid) problems.push(`${r.name}: SVG does not parse`);
    for (const e of r.pngErrors || []) problems.push(`${r.name}: PNG ${e}`);
    for (const [k, file] of Object.entries(r.png || {})) {
      const b64 = fs.readFileSync(path.join(OUT, file)).toString("base64");
      const s = await p.evaluate(async (b64) => {
        const img = new Image(); img.src = "data:image/png;base64," + b64; await img.decode();
        const c = document.createElement("canvas"); c.width = img.width; c.height = img.height;
        const g = c.getContext("2d"); g.drawImage(img, 0, 0);
        const d = g.getImageData(0, 0, c.width, c.height).data;
        let ink = 0, clear = 0;
        for (let i = 3; i < d.length; i += 4) d[i] > 8 ? ink++ : d[i] === 0 && clear++;
        const corner = [0, c.width - 1, (c.height - 1) * c.width, c.height * c.width - 1].map((i) => d[i * 4 + 3]);
        return { w: c.width, h: c.height, inkPct: Math.round((ink / (d.length / 4)) * 1000) / 10, clearPct: Math.round((clear / (d.length / 4)) * 1000) / 10, corner };
      }, b64);
      rep[k] = s;
      if (s.inkPct === 0) problems.push(`${r.name} ${k}: blank PNG`);
    }
    if (r.editable) {
      const k = Math.min(2, 700 / Math.max(r.w, r.h));
      const shot = async (markup) => {
        await p.evaluate(([m, w, h]) => {
          document.body.innerHTML = `<div id="qa" style="position:fixed;left:0;top:0;width:${w}px;height:${h}px">${m}</div>`;
          const s = document.querySelector("#qa svg"); s.setAttribute("width", w); s.setAttribute("height", h);
          return document.fonts.ready;
        }, [markup.replace(/^<\?xml[^>]*>\s*/, ""), Math.round(r.w * k), Math.round(r.h * k)]);
        await p.waitForTimeout(150);
        return (await p.locator("#qa").screenshot({ omitBackground: true })).toString("base64");
      };
      const a = await shot(fs.readFileSync(path.join(OUT, r.editable), "utf8")), b = await shot(svg);
      rep.outlineMismatchPct = await p.evaluate(async ([a, b]) => {
        const load = async (s) => { const i = new Image(); i.src = "data:image/png;base64," + s; await i.decode(); const c = document.createElement("canvas"); c.width = i.width; c.height = i.height; const g = c.getContext("2d"); g.drawImage(i, 0, 0); return g.getImageData(0, 0, c.width, c.height).data; };
        const A = await load(a), B = await load(b);
        let painted = 0, diff = 0;
        for (let i = 0; i < A.length; i += 4) {
          if (A[i + 3] < 16 && B[i + 3] < 16) continue;
          painted++;
          const d = Math.abs(A[i] - B[i]) + Math.abs(A[i + 1] - B[i + 1]) + Math.abs(A[i + 2] - B[i + 2]) + Math.abs(A[i + 3] - B[i + 3]);
          if (d > 160) diff++;
        }
        return Math.round((diff / Math.max(1, painted)) * 1000) / 10;
      }, [a, b]);
      if (rep.outlineMismatchPct > 2) problems.push(`${r.name}: outlined text differs from live text by ${rep.outlineMismatchPct}% of painted pixels`);
    }
  }
  await p.close();
  let rsvg = true;
  try { execFileSync("rsvg-convert", ["--version"], { stdio: "ignore" }); } catch { rsvg = false; }
  if (rsvg) for (const r of ok) {
    try { execFileSync("rsvg-convert", [path.join(OUT, r.file)], { stdio: ["ignore", "ignore", "pipe"] }); report[r.name].librsvg = "ok"; }
    catch (e) { report[r.name].librsvg = "failed"; problems.push(`${r.name}: librsvg cannot render it (${String(e.stderr || e.message).trim().split("\n")[0]})`); }
  }
  return { problems, report };
}

function contactSheet(manifest) {
  const groups = new Map();
  for (const a of manifest) { const g = a.usedIn.split(" — ")[0]; groups.set(g, [...(groups.get(g) || []), a]); }
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const card = (a) => `
      <figure class="card" id="${a.name}">
        <div class="swatches">
          <div class="sw light"><img src="${a.file}" alt="${a.name}"></div>
          <div class="sw dark"><img src="${a.file}" alt=""></div>
        </div>
        <figcaption>
          <b>${a.name}</b>
          <span class="meta">${Math.round(a.size.width)}×${Math.round(a.size.height)} · ${a.colors.map((c) => `<i style="background:${c.hex}" title="${c.name} ${c.hex}"></i>`).join("")}${a.font ? " · text outlined" : ""}${a.partOf ? ` · part of <a href="#${a.partOf}">${a.partOf}</a>` : ""}</span>
          <span class="meta">${esc(a.usedIn)}</span>
          <span class="links"><a href="${a.file}">svg</a>${a.editable ? ` <a href="${a.editable}">editable svg</a>` : ""} ${Object.entries(a.png || {}).map(([k, f]) => `<a href="${f}">png ${k}</a>`).join(" ")}</span>
        </figcaption>
      </figure>`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Design Assets</title>
<style>
  :root { --bg: #f6f3fb; --fg: #150734; --muted: #6b6280; --card: #fff; --line: #e6e0f0; --light: #ffffff; --dark: #3b364a; }
  @media (prefers-color-scheme: dark) { :root { --bg: #0e0524; --fg: #ece6fa; --muted: #a49bbb; --card: #1a0f38; --line: #2c2150; } }
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--bg); color: var(--fg); font: 14px/1.4 system-ui, sans-serif; }
  header { padding: 32px 16px 8px; max-width: 1400px; margin: 0 auto; }
  h1 { margin: 0 0 6px; font-size: 28px; }
  header p { margin: 0; color: var(--muted); }
  section { max-width: 1400px; margin: 0 auto; padding: 16px; }
  h2 { font-size: 16px; text-transform: uppercase; letter-spacing: .06em; color: var(--muted); border-bottom: 1px solid var(--line); padding-bottom: 6px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 14px; }
  .card { margin: 0; background: var(--card); border: 1px solid var(--line); border-radius: 12px; overflow: hidden; }
  .swatches { display: grid; grid-template-columns: 1fr 1fr; }
  .sw { height: 150px; display: flex; align-items: center; justify-content: center; padding: 14px; }
  .sw.light { background: var(--light) repeating-conic-gradient(#f1eef6 0 25%, #fff 0 50%) 0 0 / 16px 16px; }
  .sw.dark { background: var(--dark); }
  .sw img { max-width: 100%; max-height: 100%; object-fit: contain; }
  figcaption { padding: 10px 12px 12px; display: flex; flex-direction: column; gap: 3px; }
  figcaption b { font-size: 13px; word-break: break-all; }
  .meta { color: var(--muted); font-size: 12px; }
  .meta i { display: inline-block; width: 10px; height: 10px; border-radius: 3px; margin-right: 2px; vertical-align: -1px; border: 1px solid rgba(128,128,128,.4); }
  .links a { font-size: 12px; margin-right: 8px; color: inherit; }
  a { color: inherit; }
</style>
</head>
<body>
<header>
  <h1>Design assets — Programming Olympiad 2026</h1>
  <p>${manifest.length} assets · each shown on light and dark · SVG text is outlined (editable copies in <code>svg/editable/</code>) · colours &amp; fonts in <a href="colors.md">colors.md</a> · logos in <code>logos/</code> (do not alter).</p>
</header>
${[...groups].map(([g, list]) => `<section><h2>${esc(g)} <small>(${list.length})</small></h2><div class="grid">${list.map(card).join("")}</div></section>`).join("\n")}
</body>
</html>
`;
}

export { installLib, loadFonts, outline, NAMES };
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch((e) => { console.error(e); process.exit(1); });

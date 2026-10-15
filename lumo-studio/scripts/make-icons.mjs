// Generates the site favicons from the club logo. Run: `npm run icons` (from scripts/).
import sharp from "sharp";
import pngToIco from "png-to-ico";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");
const SRC = path.join(ROOT, "public/illustrations/image.png");
const CLEAR = { r: 0, g: 0, b: 0, alpha: 0 };

const { width: w, height: h } = await sharp(SRC).metadata();
console.log(`source ${path.relative(ROOT, SRC)}: ${w}×${h}, ${fs.statSync(SRC).size} bytes`);

// pad (never stretch or crop) to a transparent square
const side = Math.max(w, h);
const left = Math.floor((side - w) / 2), top = Math.floor((side - h) / 2);
const square = await sharp(SRC)
  .extend({ left, right: side - w - left, top, bottom: side - h - top, background: CLEAR })
  .png().toBuffer();

const png = (size, bg) => {
  let img = sharp(square).resize(size, size, { kernel: "lanczos3" });
  if (bg) img = img.flatten({ background: bg });
  // the upscaled sizes are ~6× smaller quantized, with no visible difference
  return img.png({ compressionLevel: 9, palette: size > 48, quality: 95 }).toBuffer();
};

const out = {
  "app/icon.png": await png(512),
  "app/apple-icon.png": await png(180, "#ffffff"), // iOS renders transparency as black
  "public/favicon-32x32.png": await png(32),
  "public/favicon-16x16.png": await png(16),
  "app/favicon.ico": await pngToIco(await Promise.all([16, 32, 48].map((s) => png(s)))),
};
for (const [file, buf] of Object.entries(out)) {
  fs.writeFileSync(path.join(ROOT, file), buf);
  console.log(`wrote ${file} (${buf.length} bytes)`);
}

import sharp from "sharp";
import { readFileSync, writeFileSync } from "fs";

const input = "public/sosapropiedades.webp";
const output = "public/logo.png";

const image = sharp(input);
const { width, height } = await image.metadata();

// Get raw RGBA data
const raw = await image.ensureAlpha().raw().toBuffer();
const data = new Uint8Array(raw);

// Sample background color from top-left corner (5px in to avoid edge artifacts)
const idx = (5 * width + 5) * 4;
const bgR = data[idx];
const bgG = data[idx + 1];
const bgB = data[idx + 2];
console.log(`Background color: rgb(${bgR}, ${bgG}, ${bgB})`);

// Remove pixels close to background color (tolerance accounts for anti-aliasing)
const TOLERANCE = 35;
for (let i = 0; i < data.length; i += 4) {
  const dr = Math.abs(data[i] - bgR);
  const dg = Math.abs(data[i + 1] - bgG);
  const db = Math.abs(data[i + 2] - bgB);
  if (dr < TOLERANCE && dg < TOLERANCE && db < TOLERANCE) {
    data[i + 3] = 0; // transparent
  }
}

// Reconstruct image
const result = await sharp(Buffer.from(data), {
  raw: { width, height, channels: 4 },
})
  .png({ compressionLevel: 9 })
  .toBuffer();

writeFileSync(output, result);
console.log(`Saved: ${output} (${width}x${height})`);

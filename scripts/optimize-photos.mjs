import sharp from "sharp";
import { promises as fs } from "fs";
import path from "path";

const DIR = "public/images/edmonton";
const TARGETS = [
  "art-southgate-boots.jpg",
  "art-vaulted-willow.jpg",
  "art-mosaic-park.jpg",
  "discover-park-skyline.jpg",
];

for (const name of TARGETS) {
  const inPath = path.join(DIR, name);
  const outPath = inPath + ".tmp";
  try {
    const sizeBefore = (await fs.stat(inPath)).size;
    await sharp(inPath)
      .rotate()
      .resize({ width: 1920, withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(outPath);
    const sizeAfter = (await fs.stat(outPath)).size;
    await fs.rename(outPath, inPath);
    const kbBefore = (sizeBefore / 1024).toFixed(0);
    const kbAfter = (sizeAfter / 1024).toFixed(0);
    const pct = (((sizeBefore - sizeAfter) / sizeBefore) * 100).toFixed(0);
    console.log(`${name}: ${kbBefore}KB → ${kbAfter}KB (-${pct}%)`);
  } catch (e) {
    console.error(`FAIL ${name}:`, e.message);
  }
}

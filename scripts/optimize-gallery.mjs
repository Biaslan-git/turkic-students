// Готовит фото галереи: крупную версию ужимает до 1600px (чтобы фото с телефона на 8 МБ
// не попали на сайт как есть) и рядом кладёт лёгкую миниатюру в thumbs/ (320px, WebP).
// Запуск: npm run gallery:optimize — после того как положили фото в public/gallery/<вуз>/.
import { readdir, mkdir, stat, rename } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "gallery");
const IMAGE_EXT = /\.(jpe?g|png|webp|avif)$/i;
const FULL_MAX = 1600;
const THUMB_WIDTH = 320; // плитка в ленте 128–160px, ×2 для ретины

let processed = 0;
for (const entry of await readdir(root, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const dir = path.join(root, entry.name);
  const thumbsDir = path.join(dir, "thumbs");
  await mkdir(thumbsDir, { recursive: true });

  for (const file of await readdir(dir)) {
    if (!IMAGE_EXT.test(file)) continue;
    const source = path.join(dir, file);
    const thumb = path.join(thumbsDir, `${path.parse(file).name}.webp`);

    // Миниатюра есть и она новее оригинала — пропускаем, чтобы повторный запуск был быстрым.
    const sourceStat = await stat(source);
    const thumbStat = await stat(thumb).catch(() => null);
    if (thumbStat && thumbStat.mtimeMs >= sourceStat.mtimeMs) continue;

    const image = sharp(source).rotate(); // rotate() учитывает ориентацию из EXIF
    const { width = 0 } = await image.metadata();

    await image.clone().resize({ width: THUMB_WIDTH, withoutEnlargement: true }).webp({ quality: 68 }).toFile(thumb);

    if (width > FULL_MAX) {
      const tmp = `${source}.tmp`;
      await image.clone().resize({ width: FULL_MAX }).toFormat(path.extname(file).toLowerCase() === ".png" ? "png" : "jpeg", { quality: 82 }).toFile(tmp);
      await rename(tmp, source);
    }
    processed++;
  }
}
console.log(`Готово: обработано фото — ${processed}`);

// Готовит фото галереи из исходников в gallery-src/<вуз>/ (в Docker-образ они не попадают):
//   public/gallery/<вуз>/NN.webp         — крупная версия для просмотра, 1280px
//   public/gallery/<вуз>/m/NN.webp       — для телефонов, 800px
//   public/gallery/<вуз>/thumbs/NN.webp  — плитка в ленте, 320px
// Запуск: npm run gallery:optimize — после того как положили фото в gallery-src/<вуз>/.
import { readdir, mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(root, "gallery-src");
const OUT = path.join(root, "public", "gallery");
const IMAGE_EXT = /\.(jpe?g|png|webp|avif)$/i;
const VARIANTS = [
  { dir: "", width: 1280, quality: 72 },
  { dir: "m", width: 800, quality: 70 },
  { dir: "thumbs", width: 320, quality: 68 }, // плитка 128–160px, ×2 для ретины
];

let processed = 0;
for (const entry of await readdir(SRC, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;

  for (const file of await readdir(path.join(SRC, entry.name))) {
    if (!IMAGE_EXT.test(file)) continue;
    const source = path.join(SRC, entry.name, file);
    const sourceStat = await stat(source);
    const name = `${path.parse(file).name}.webp`;

    for (const { dir, width, quality } of VARIANTS) {
      const target = path.join(OUT, entry.name, dir, name);
      // Результат новее исходника — пропускаем, чтобы повторный запуск был быстрым.
      const targetStat = await stat(target).catch(() => null);
      if (targetStat && targetStat.mtimeMs >= sourceStat.mtimeMs) continue;

      await mkdir(path.dirname(target), { recursive: true });
      // rotate() учитывает ориентацию из EXIF
      await sharp(source).rotate().resize({ width, withoutEnlargement: true }).webp({ quality }).toFile(target);
      processed++;
    }
  }
}
console.log(`Готово: создано файлов — ${processed}`);

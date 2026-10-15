import { readdir } from "node:fs/promises";
import path from "node:path";

const GALLERY_DIR = path.join(process.cwd(), "public", "gallery");
const IMAGE_EXT = /\.(jpe?g|png|webp|avif)$/i;

export type GalleryPhoto = { thumb: string; full: string };

// Фото лежат в public/gallery/<папка-вуза>/*, миниатюры — в <папка-вуза>/thumbs/*.webp
// (делает npm run gallery:optimize; пока миниатюры нет, берётся сама картинка). Общая лента
// собирается по кругу (по одному кадру с каждого вуза), чтобы ни один вуз не оказался
// "в хвосте" и никого не обделить — разбивки по странам и вузам на странице намеренно нет.
export async function listGalleryPhotos(): Promise<GalleryPhoto[]> {
  let folders: string[];
  try {
    const entries = await readdir(GALLERY_DIR, { withFileTypes: true });
    folders = entries.filter((e) => e.isDirectory()).map((e) => e.name).sort();
  } catch {
    return [];
  }

  const perFolder = await Promise.all(
    folders.map(async (folder) => {
      const files = (await readdir(path.join(GALLERY_DIR, folder))).filter((f) => IMAGE_EXT.test(f)).sort();
      const thumbs = new Set(await readdir(path.join(GALLERY_DIR, folder, "thumbs")).catch(() => [] as string[]));
      const url = (...parts: string[]) => `/gallery/${[folder, ...parts].map(encodeURIComponent).join("/")}`;

      return files.map((file): GalleryPhoto => {
        const thumbName = `${path.parse(file).name}.webp`;
        return { full: url(file), thumb: thumbs.has(thumbName) ? url("thumbs", thumbName) : url(file) };
      });
    }),
  );

  const rounds = Math.max(0, ...perFolder.map((photos) => photos.length));
  const interleaved: GalleryPhoto[] = [];
  for (let i = 0; i < rounds; i++) {
    for (const photos of perFolder) {
      if (photos[i]) interleaved.push(photos[i]);
    }
  }
  return interleaved;
}

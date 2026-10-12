import { readdir } from "node:fs/promises";
import path from "node:path";

const GALLERY_DIR = path.join(process.cwd(), "public", "gallery");
const IMAGE_EXT = /\.(jpe?g|png|webp|avif)$/i;

// Фото лежат в public/gallery/<папка-вуза>/*. Общая лента собирается по кругу
// (по одному кадру с каждого вуза), чтобы ни один вуз не оказался "в хвосте" и
// никого не обделить — разбивки по странам и вузам на странице намеренно нет.
export async function listGalleryPhotos(): Promise<string[]> {
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
      return files.map((file) => `/gallery/${encodeURIComponent(folder)}/${encodeURIComponent(file)}`);
    }),
  );

  const rounds = Math.max(0, ...perFolder.map((photos) => photos.length));
  const interleaved: string[] = [];
  for (let i = 0; i < rounds; i++) {
    for (const photos of perFolder) {
      if (photos[i]) interleaved.push(photos[i]);
    }
  }
  return interleaved;
}

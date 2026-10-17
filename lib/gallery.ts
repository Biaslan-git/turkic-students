import { readdir, stat } from "node:fs/promises";
import path from "node:path";

const GALLERY_DIR = path.join(process.cwd(), "public", "gallery");

export type GalleryPhoto = { thumb: string; medium: string; large: string };

// Файлы готовит npm run gallery:optimize из gallery-src/<папка-вуза>/: крупная версия лежит в
// public/gallery/<папка-вуза>/NN.webp, для телефонов — m/NN.webp, плитка ленты — thumbs/NN.webp.
// Общая лента собирается по кругу (по одному кадру с каждого вуза), чтобы ни один вуз не оказался
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
      const files = (await readdir(path.join(GALLERY_DIR, folder))).filter((f) => f.endsWith(".webp")).sort();
      const thumbs = new Set(await readdir(path.join(GALLERY_DIR, folder, "thumbs")).catch(() => [] as string[]));
      const medium = new Set(await readdir(path.join(GALLERY_DIR, folder, "m")).catch(() => [] as string[]));

      // ?v=<mtime> меняется при замене файла, поэтому картинки можно кэшировать навсегда
      // (см. headers() в next.config.ts), не боясь отдать устаревшее фото.
      const url = async (...parts: string[]) => {
        const version = Math.floor((await stat(path.join(GALLERY_DIR, folder, ...parts))).mtimeMs / 1000);
        return `/gallery/${[folder, ...parts].map(encodeURIComponent).join("/")}?v=${version}`;
      };

      return Promise.all(
        files.map(async (file): Promise<GalleryPhoto> => {
          const large = await url(file);
          return {
            large,
            medium: medium.has(file) ? await url("m", file) : large,
            thumb: thumbs.has(file) ? await url("thumbs", file) : large,
          };
        }),
      );
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

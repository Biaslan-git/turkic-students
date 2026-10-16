import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  output: "standalone",
  // Без этого Next отдаёт файлы из public/ с max-age=0 — браузер заново запрашивает каждое
  // фото ленты при каждом заходе, а с высокой задержкой до сервера это и есть "долго грузится".
  async headers() {
    return [
      // Галерея: в URL есть ?v=<mtime> (lib/gallery.ts), поэтому кэшируем навсегда.
      {
        source: "/gallery/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      // Картинки блоков без версии в URL — кэшируем на сутки и обновляем в фоне.
      {
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      },
    ];
  },
  images: {
    // The Dokploy server can't reliably reach external CDNs to re-optimize images
    // on the fly (upstream image response timed out), and all photos are now local
    // files in public/ that are already resized, so serve them as is.
    unoptimized: true,
  },
};

export default withNextIntl(nextConfig);

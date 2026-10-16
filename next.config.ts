import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    // The Dokploy server can't reliably reach external CDNs to re-optimize images
    // on the fly (upstream image response timed out), and all photos are now local
    // files in public/ that are already resized, so serve them as is.
    unoptimized: true,
  },
};

export default withNextIntl(nextConfig);

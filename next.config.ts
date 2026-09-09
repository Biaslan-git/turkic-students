import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "tatar-congress.org",
      },
      {
        protocol: "https",
        hostname: "im2.kommersant.ru",
      },
      {
        protocol: "https",
        hostname: "roza.kg",
      },
      {
        protocol: "https",
        hostname: "static.yk-news.kz",
      },
    ],
    // Unsplash URLs already request the right size/quality via query params
    // (w=, q=), and the Dokploy server can't reliably reach images.unsplash.com
    // itself to re-optimize server-side (upstream image response timed out).
    // Let visitors' browsers fetch directly from Unsplash's CDN instead.
    unoptimized: true,
  },
};

export default withNextIntl(nextConfig);

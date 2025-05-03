// next.config.mjs
import nextPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "img.flawlessfiles.com" },
      { protocol: "https", hostname: "m.gettywallpapers.com" },
      { protocol: "https", hostname: "c4.wallpaperflare.com" },
      { protocol: "https", hostname: "image.tmdb.org" },
      { protocol: "https", hostname: "i2.wp.com" },
      { protocol: "https", hostname: "jumpg-assets.tokyo-cdn.com" },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/media/**",
      },
      { protocol: "https", hostname: "uploads.mangadex.org" },
      { protocol: "https", hostname: "manganow.to" },
    ],
  },
};

const withPWA = nextPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
});

export default withPWA(nextConfig);

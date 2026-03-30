import path from "path";
import { fileURLToPath } from "url";
import type { NextConfig } from "next";

const turbopackRoot = path.dirname(fileURLToPath(import.meta.url));

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  ...(process.env.ENABLE_HSTS === "1"
    ? ([
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ] as const)
    : []),
];

/** Доп. хосты для next/image (Make, CDN). Через запятую/пробел, без схемы: cdn.example.com */
function imageRemotePatternsFromEnv(): { protocol: "https"; hostname: string; pathname: string }[] {
  const raw = process.env.NEXT_PUBLIC_IMAGE_REMOTE_HOSTS?.trim();
  if (!raw) return [];
  return raw
    .split(/[,;\s]+/)
    .map((s) => s.trim().replace(/^https?:\/\//i, "").split("/")[0] ?? "")
    .filter((h) => /^[a-z0-9*.\\-]+$/i.test(h))
    .map((hostname) => ({ protocol: "https" as const, hostname, pathname: "/**" }));
}

const nextConfig: NextConfig = {
  turbopack: {
    root: turbopackRoot,
  },
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  async headers() {
    return [{ source: "/:path*", headers: [...securityHeaders] }];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86_400,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      { protocol: "https", hostname: "storage.bunnycdn.com", pathname: "/**" },
      { protocol: "https", hostname: "*.b-cdn.net", pathname: "/**" },
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
      { protocol: "https", hostname: "*.amazonaws.com", pathname: "/**" },
      /** Генерация обложек (Make / MCP) */
      { protocol: "https", hostname: "mcp-kv.ru", pathname: "/**" },
      /** Превью с YouTube (обложка после «Заполнить из YouTube») */
      { protocol: "https", hostname: "i.ytimg.com", pathname: "/**" },
      { protocol: "https", hostname: "img.youtube.com", pathname: "/**" },
      ...imageRemotePatternsFromEnv(),
    ],
  },
};

export default nextConfig;

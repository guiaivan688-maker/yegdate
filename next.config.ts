import type { NextConfig } from "next";

const securityHeaders = [
  // Force HTTPS (2 ans) — bloque tout accès non chiffré.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Empêche le navigateur de "deviner" le type d'un fichier (anti-XSS).
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Empêche d'afficher le site dans une iframe (anti-clickjacking).
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Limite les infos envoyées en quittant le site.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Désactive les fonctions navigateur non utilisées.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;

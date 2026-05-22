import Script from "next/script";

/**
 * Privacy-friendly analytics (Plausible). Inert until you set the env var:
 *   NEXT_PUBLIC_PLAUSIBLE_DOMAIN=yegdate.vercel.app   (in .env.local / Vercel)
 * Create a free account at https://plausible.io and add your domain.
 */
export default function Analytics() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  if (!domain) return null;
  return (
    <Script
      defer
      data-domain={domain}
      src="https://plausible.io/js/script.js"
      strategy="afterInteractive"
    />
  );
}

import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import ClientShell from "@/components/ClientShell";
import Analytics from "@/components/Analytics";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://yegdate.vercel.app"),
  title: "YEG Date — L'agenda intelligent d'Edmonton | Activités, sorties, réservations",
  description:
    "Trouvez quoi faire à Edmonton ce week-end. Couples, famille, amis, business — planifiez votre sortie en 3 minutes et réservez en 1 clic.",
  keywords: ["Edmonton", "activités Edmonton", "date ideas Edmonton", "sorties Edmonton", "team building Edmonton", "weekend Edmonton"],
  openGraph: {
    title: "YEG Date — L'agenda intelligent d'Edmonton",
    description: "Trouvez quoi faire à Edmonton ce week-end. Planifiez en 3 minutes, réservez en 1 clic.",
    locale: "fr_CA",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "YEG Date",
  description: "L'agenda intelligent d'Edmonton — activités, sorties et réservations pour couples, familles, amis et entreprises.",
  address: { "@type": "PostalAddress", addressLocality: "Edmonton", addressRegion: "AB", addressCountry: "CA" },
  email: "hello@yegdate.ca",
  areaServed: "Edmonton, Alberta",
  url: "https://yegdate.vercel.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${dmSans.variable} ${playfair.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col"
        style={{ fontFamily: "var(--font-dm-sans), system-ui, sans-serif" }}
      >
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Analytics />
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}

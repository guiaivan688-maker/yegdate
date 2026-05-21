import type { Metadata } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";
import ClientShell from "@/components/ClientShell";

const montserrat = Montserrat({
  variable: "--font-montserrat",
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
  title: "YEG Date — Edmonton, sublimé par vous",
  description:
    "Découvrez les plus beaux endroits d'Edmonton, planifiez des expériences inoubliables et transformez chaque sortie en souvenir. Services de photographie, décoration et conciergerie.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${montserrat.variable} ${playfair.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col"
        style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif" }}
      >
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}

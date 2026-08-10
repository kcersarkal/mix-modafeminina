import type { Metadata } from "next";
import { Cormorant_Garamond, Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { siteUrl } from "@/lib/site";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

// Verificação do Google Search Console (o código atual do site é o fallback)
const GOOGLE_SITE_VERIFICATION =
  process.env.GOOGLE_SITE_VERIFICATION || "66Qnvhu32m6lppzAI7LmNOqASpj01jMTJm0TyNZCs4M";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "Moda Feminina: Vestidos, Bolsas, Calçados e Ofertas | MIXDM",
    template: "%s | MIXDM Moda Feminina",
  },
  description:
    "Curadoria de moda feminina com vestidos, calçados, bolsas e acessórios. Ofertas selecionadas em um só lugar.",
  applicationName: "MIXDM Moda Feminina",
  icons: {
    icon: "/favicon.ico",
    apple: "/logo_moda_feminina.jpg",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "MIXDM Moda Feminina",
    title: "MIXDM Moda Feminina — Curadoria de Moda",
    description:
      "Curadoria de moda feminina com vestidos, calçados, bolsas e acessórios. Ofertas selecionadas em um só lugar.",
    url: "/",
    images: [
      {
        url: "/logo_moda_feminina.jpg",
        width: 1200,
        height: 630,
        alt: "MIXDM Moda Feminina",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MIXDM Moda Feminina — Curadoria de Moda",
    description:
      "Curadoria de moda feminina com vestidos, calçados, bolsas e acessórios. Ofertas selecionadas em um só lugar.",
    images: ["/logo_moda_feminina.jpg"],
  },
  verification: {
    google: GOOGLE_SITE_VERIFICATION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const revalidate = 300;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${cormorant.variable} ${poppins.variable}`}>
      <body>
        <a href="#app" className="skip-link">
          Pular para o conteúdo
        </a>
        <Header />
        <main id="app">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

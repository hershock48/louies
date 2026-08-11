import type { Metadata } from "next";
import { Archivo, Newsreader } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import StructuredData from "@/components/StructuredData";
import MobileActionBar from "@/components/MobileActionBar";
import { site, fullAddress } from "@/data/site";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Donuts and nut rolls in Marshall, Michigan since 1952`,
    template: `%s | ${site.name}`,
  },
  description:
    "Family owned since 1952. Nut rolls, fried cakes, pies and bread, baked overnight and out front by 5:30am, Tuesday through Saturday at 144 W. Michigan Ave in Marshall.",
  keywords: [
    "Louie's Bakery",
    "bakery Marshall Michigan",
    "donuts Marshall MI",
    "nut roll",
    "fried cakes",
    "Calhoun County bakery",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: site.url,
    siteName: site.name,
    title: `${site.name} | A Marshall tradition since 1952`,
    description:
      "Nut rolls, fried cakes and pies, baked overnight and out front by 5:30 in the morning. Same family, same recipes, since 1952.",
    images: [{ url: "/photos/storefront-night.jpg", width: 1600, height: 1200, alt: `${site.name} on W. Michigan Ave` }],
  },
  alternates: { canonical: "/" },
  other: { "geo.placename": fullAddress },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${newsreader.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-night focus:px-5 focus:py-3 focus:text-paper"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <MobileActionBar />
        <StructuredData />
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Archivo, Newsreader } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import StructuredData from "@/components/StructuredData";
import MobileActionBar from "@/components/MobileActionBar";
import { site, fullAddress } from "@/data/site";

/*
  Only the weights the site actually sets.

  Fonts were 154KB on every page, more than the whole rest of the menu page put
  together. Grepping the source: Archivo uses 400, 600, 700 and 800, and Newsreader is
  set once, at its default weight, for the prose on the story page. 500, 300 and the
  entire italic family were being shipped to every visitor and used by nothing.
*/
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  weight: ["400"],
  display: "swap",
});

/*
  Where absolute URLs in the metadata point.

  This was hardcoded to site.url, the bakery's own domain, so every link preview of the
  spec build asked louies-bakery.com for an image it does not have. On Vercel this now
  resolves to wherever it is actually deployed; site.url is the fallback and becomes
  correct on the day the site is theirs.
*/
const origin = process.env.NEXT_PUBLIC_SITE_URL
  ? process.env.NEXT_PUBLIC_SITE_URL
  : process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : site.url;

export const viewport: Viewport = {
  // Paints the browser chrome on a phone to match the header instead of leaving a
  // white bar above a black site.
  themeColor: "#0b0705",
};

export const metadata: Metadata = {
  metadataBase: new URL(origin),
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
    url: origin,
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

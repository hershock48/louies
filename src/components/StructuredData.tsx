import { site, fullAddress } from "@/data/site";
import { week } from "@/data/hours";

/**
 * Bakery schema. The old site had none of this, which is part of why a search for
 * "louies bakery marshall" is a coin toss between them and a bakery in another state
 * that owns the unhyphenated domain.
 *
 * Hours come from the same array the site computes open and closed from, so the
 * markup cannot drift away from what the page says.
 */
export default function StructuredData() {
  const openingHours = week
    .filter((d) => d.open !== null && d.close !== null)
    .map((d) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][d.day]}`,
      opens: toIso(d.open as number),
      closes: toIso(d.close as number),
    }));

  const data = {
    "@context": "https://schema.org",
    "@type": "Bakery",
    name: site.name,
    description: site.blurb,
    foundingDate: String(site.established),
    url: site.url,
    telephone: site.phone,
    image: `${site.url}/photos/storefront-night.jpg`,
    priceRange: "$",
    servesCuisine: "Bakery",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.state,
      postalCode: site.address.zip,
      addressCountry: "US",
    },
    openingHoursSpecification: openingHours,
    sameAs: [site.social.facebook, site.social.goldbelly, site.social.yelp, site.social.tripadvisor],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: site.reviews.rating,
      reviewCount: site.reviews.count,
    },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

function toIso(minutes: number) {
  const h = String(Math.floor(minutes / 60)).padStart(2, "0");
  const m = String(minutes % 60).padStart(2, "0");
  return `${h}:${m}`;
}

/**
 * SITE FACTS
 *
 * One place for everything about the business. Sourced from louies-bakery.com,
 * their Goldbelly listing, the WWMT feature, and the Choose Marshall directory.
 *
 * Anything marked PLACEHOLDER is a real question for the bakery, not a guess we
 * should quietly ship. Every one is on the checklist in the README.
 */

export const site = {
  name: "Louie's Bakery",
  shortName: "Louie's",
  tagline: "A Marshall tradition since 1952.",
  blurb:
    "Fried cakes, nut rolls and pies, out front by 5:30 in the morning. Same family, same recipes, same block of Michigan Avenue since 1952.",
  established: 1952,

  /** Their current domain. The hyphen is painted on the window. See the README. */
  url: "https://www.louies-bakery.com",

  phone: "(269) 781-3542",
  phoneHref: "tel:+12697813542",

  address: {
    street: "144 W. Michigan Ave",
    city: "Marshall",
    state: "MI",
    zip: "49068",
  },

  social: {
    facebook: "https://www.facebook.com/louiesbakery/",
    goldbelly: "https://www.goldbelly.com/restaurants/louies-bakery",
    yelp: "https://www.yelp.com/biz/louies-bakery-marshall",
    tripadvisor:
      "https://www.tripadvisor.com/Restaurant_Review-g42442-d3265967-Reviews-Louie_s_Bakery-Marshall_Calhoun_County_Michigan.html",
  },

  /** Tripadvisor, August 2026. #3 of 34 restaurants in Marshall, #1 bakery. */
  reviews: { rating: 4.4, count: 99 },

  /** From Jason, to WWMT: "We make around 1,000 a day, and we sell them." */
  nutRollsPerDay: 1000,

  people: {
    founder: "Louis Bagi",
    /** Third generation. Louie's grandson. */
    baker: "Jason LaForge",
    bakerRole: "Executive Baker",
  },

  /**
   * They ship UPS and the truck goes on Tuesdays. Framed as freshness rather
   * than as a limitation, because that is what it actually is.
   */
  shipping: {
    day: "Tuesday",
    carrier: "UPS",
  },
} as const;

export const fullAddress = `${site.address.street}, ${site.address.city}, ${site.address.state} ${site.address.zip}`;

export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${site.name}, ${fullAddress}`,
)}`;

export const mapsEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
  fullAddress,
)}&t=&z=16&ie=UTF8&iwloc=&output=embed`;

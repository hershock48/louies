/**
 * WHAT GOES IN A BOX, AND WHAT IT COSTS HERE
 *
 * These are the bakery's own boxes, sold from the bakery's own site. The prices are
 * their prices, not a marketplace's, and the site does not name a marketplace anywhere
 * on this page. It sells its own goods, the way a shop does.
 *
 * WHERE THE NUMBERS CAME FROM. They are what these exact boxes already sell for,
 * shipping included, which is the strongest evidence anybody has about what the market
 * will pay for a box of Louie's. Selling at the same number from their own site is the
 * whole argument: the customer pays what they always paid, and the share that used to
 * leave stays in Marshall.
 *
 * PLACEHOLDER: every figure needs Jason's sign-off before launch, together with what
 * the freight actually costs him, because the price includes the shipping and the
 * margin lives in the difference.
 *
 * The product photographs are the bakery's own, used with permission (Kevin, August
 * 2026), and are not in the repo yet. Add them to `photo` and the cards render them.
 */
export type Box = {
  /** Stable key for the cart cookie. Never change one of these casually: a live cart
   *  holding an old slug simply drops the line. */
  slug: string;
  name: string;
  /** Pack size as the listing states it. "1 Dozen", "6 Pack". */
  size: string;
  /** What it is, in the bakery's own terms. */
  body: string;
  /** How it survives a truck. The honest reason to buy this one and not another. */
  travels: string;
  /** Cents, shipping included. PLACEHOLDER until Jason confirms. */
  price?: number;
  /** Public path, once the product photography is in the repo. */
  photo?: string;
  /** On the listing but not yet buyable. Renders as a heads-up rather than a button,
   *  and is enforced in lib/cart.ts so a cookie cannot buy one either. */
  comingSoon?: boolean;
  /** When it comes back, in the bakery's words. Shown wherever comingSoon is. */
  backWhen?: string;
};

export const boxes: Box[] = [
  {
    slug: "nut-rolls",
    name: "Classic Nut Rolls",
    size: "1 dozen",
    body: "The one people drive here for. A cinnamon roll, fried, iced, and rolled in peanuts we roast in the back.",
    travels:
      "Baked the night before and on a truck the next morning, which is as close to fresh as a fried roll gets four states away.",
    price: 7595,
  },
  {
    slug: "signature-tin",
    name: "Signature Tin",
    size: "6 pieces",
    body: "The tin with the bakery's own script on the lid, packed with what we are known for.",
    travels: "Sent in a tin because a tin is the only box that arrives the shape it left.",
    price: 7995,
  },
  {
    slug: "fritters",
    name: "Apple & Raisin Fritters",
    size: "6 pack",
    body: "Fried heavy and rough edged, apple and raisin through the whole of it.",
    travels: "Sturdy for something fried. They keep their edges.",
    price: 7995,
  },
  {
    slug: "cookie-tin",
    name: "Signature Cookie Tin",
    size: "2 dozen",
    body: "Two dozen of the case's cookies, packed into the same tin.",
    travels:
      "The one customers write about. “Not one cookie broke” is a review, not a promise we wrote.",
    price: 7995,
  },
  {
    slug: "pumpkin-tin",
    name: "Pumpkin-Shaped Sugar Cookie Gift Tin",
    size: "16 cookies",
    body: "The autumn tin. Cut, baked and iced as pumpkins, sixteen to a lid.",
    travels: "Iced flat and packed tight, which is what makes a decorated cookie shippable at all.",
    price: 8595,
    comingSoon: true,
    backWhen: "Back in the fall",
  },
];

/** Lookup for the cart, which stores slugs and nothing else. */
export const boxBySlug = (slug: string) => boxes.find((b) => b.slug === slug);

/**
 * Verbatim verified-purchase reviews from customers who had a box shipped, August 2026.
 * Both are the same customer in Tucson, which is the point: somebody 1,700 miles away
 * bought twice. A shipping page needs a review about shipping, and "not one cookie
 * broke" is the only sentence on that subject a stranger will believe.
 */
export const shippedReviews = [
  { quote: "Not one cookie broke! They taste great, love them, will buy more!", who: "Virginia F.", where: "Tucson, AZ" },
  { quote: "These rolls are amazing!", who: "Virginia F.", where: "Tucson, AZ" },
];

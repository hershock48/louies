/**
 * WHAT GOES IN A BOX
 *
 * Phase three on the roadmap, and the page that earns the most money per pixel on any
 * bakery site, because it is the only page that sells to somebody who cannot drive
 * over. Louie's already ships two ways: boxes they pack and send themselves, and their
 * Goldbelly listing. Neither of them is described anywhere on their own website.
 *
 * SOURCE. The boxes, the pack sizes and the marketplace prices below are Louie's own
 * Goldbelly listing, read from it in August 2026. Their listing sells five things and
 * every one of them ships free, which on a marketplace means the freight is inside the
 * price rather than absent from it.
 *
 * TWO DIFFERENT PRICES, AND THEY MUST NOT BE CONFUSED. `marketplacePrice` is what a
 * customer pays Goldbelly today. `price` is what the bakery would charge on its own
 * site, and it does not exist yet, because it is not a smaller version of the first
 * number. A marketplace price carries the freight and the marketplace's share inside
 * it; a direct price carries the freight and nothing else, and only the bakery can
 * decide how much of that difference it keeps and how much it hands back to the
 * customer. Setting it for them would be inventing a number, so the field is empty and
 * the page says why.
 *
 * The product photographs on that listing are the bakery's own, used with permission
 * (Kevin, August 2026). They are not in the repo yet: the listing's image URLs are
 * generated, so they have to be lifted from the product pages themselves. Add them to
 * `photo` and the cards render them.
 */

export type Box = {
  name: string;
  /** Pack size as the listing states it. "1 Dozen", "6 Pack". */
  size: string;
  /** What it is, in the bakery's own terms. */
  body: string;
  /** How it survives a truck. The honest reason to buy this one and not another. */
  travels: string;
  /** Cents. What Goldbelly charges today, shipping included. */
  marketplacePrice?: number;
  /** Cents. What the bakery charges on its own site. Set with Jason, against a real
   *  UPS rate. Deliberately absent: see the note at the top of this file. */
  price?: number;
  /** Public path, once the product photography is in the repo. */
  photo?: string;
  /** On the listing but not yet buyable. Renders as a heads-up rather than a button. */
  comingSoon?: boolean;
};

export const boxes: Box[] = [
  {
    name: "Classic Nut Rolls",
    size: "1 dozen",
    body: "The one people drive here for. A cinnamon roll, fried, iced, and rolled in peanuts we roast in the back.",
    travels:
      "Baked the night before and on a truck the next morning, which is as close to fresh as a fried roll gets four states away.",
    marketplacePrice: 7595,
  },
  {
    name: "Signature Tin",
    size: "6 pieces",
    body: "The tin with the bakery's own script on the lid, packed with what we are known for.",
    travels: "Sent in a tin because a tin is the only box that arrives the shape it left.",
    marketplacePrice: 7995,
  },
  {
    name: "Apple & Raisin Fritters",
    size: "6 pack",
    body: "Fried heavy and rough edged, apple and raisin through the whole of it.",
    travels: "Sturdy for something fried. They keep their edges.",
    marketplacePrice: 7995,
  },
  {
    name: "Signature Cookie Tin",
    size: "2 dozen",
    body: "Two dozen of the case's cookies, packed into the same tin.",
    travels:
      "The one customers write about. “Not one cookie broke” is a review, not a promise we wrote.",
    marketplacePrice: 7995,
  },
  {
    name: "Pumpkin-Shaped Sugar Cookie Gift Tin",
    size: "16 cookies",
    body: "The autumn tin. Cut, baked and iced as pumpkins, sixteen to a lid.",
    travels: "Iced flat and packed tight, which is what makes a decorated cookie shippable at all.",
    marketplacePrice: 8595,
    comingSoon: true,
  },
];

/**
 * Verbatim from the listing's verified-purchase reviews, August 2026. Both are from
 * the same customer in Tucson, which is the point: somebody 1,700 miles away bought
 * twice. Kept because a shipping page needs a review about shipping, and "not one
 * cookie broke" is the only sentence on this subject that a customer will believe.
 */
export const shippedReviews = [
  { quote: "Not one cookie broke! They taste great, love them, will buy more!", who: "Virginia F.", where: "Tucson, AZ" },
  { quote: "These rolls are amazing!", who: "Virginia F.", where: "Tucson, AZ" },
];

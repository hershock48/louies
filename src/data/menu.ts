/**
 * THE CASE
 *
 * Transcribed from the price list on louies-bakery.com, August 2026, including their
 * own spellings and their own names for things. "LouWhip" is theirs. So is "Hobo
 * Bread" and "Buzz Bomb". None of it gets sanded off into generic bakery language.
 *
 * ONE PRICE PER LINE, AND THAT IS THE CHANGE. Their published menu prints two numbers
 * on every row, a card price and a lower cash price. Kevin, who has been in the shop:
 * the bakery has moved to Square and THERE IS NO CASH DISCOUNT ANY MORE. So the two
 * price system on their own website is not just unexplained, it is describing a way of
 * charging people that the bakery stopped doing.
 *
 * What is here is the card price from their published list, carried across as the
 * single price, because it is the number closest to what a customer pays today. That
 * is an assumption and it is marked as one: see the PLACEHOLDER at the foot of this
 * file. Jason's current Square price list replaces all of it, and until it arrives no
 * figure on this site should be treated as confirmed.
 *
 * Amounts are in cents.
 *
 * AVAILABILITY IS DATA, NOT PARENTHESES. Their old menu carried the rules as asides:
 * "(Wednesday only)", "Lemon on Saturday", "(Fall-Winter-Early Spring only)". Those are
 * `availability` objects now, and src/lib/availability.ts resolves them. See that file.
 *
 * DESCRIPTIONS NEED THE BAKERY'S SIGN OFF. Where a description states a fact about how
 * something is made, it came from the WWMT feature or their own copy. Where it is only
 * a sentence of warmth, it is marked below and Jason should read it before launch.
 */

import type { Availability } from "@/lib/availability";

/** Re-exported so server code can keep importing it from here. */
export { money } from "@/lib/money";

export type MenuItem = {
  name: string;
  description?: string;
  /** Cents. 189 = $1.89 */
  price?: number;
  availability?: Availability;
  /** Shows a marker. Answers "what is good here" without making anyone ask. */
  popular?: boolean;
};

export type MenuSection = {
  id: string;
  title: string;
  blurb?: string;
  items: MenuItem[];
};

/* The four items that carry the business. Used on the homepage. */
export const signatures: MenuItem[] = [
  {
    name: "Nut Roll",
    description:
      "The one people drive here for. A cinnamon fried roll under icing and a heavy coat of peanuts we roast ourselves. About a thousand a day, and we still sell out.",
    price: 189,
    popular: true,
  },
  {
    name: "Pecan Crisp",
    description:
      "Our original recipe from 1952, still made the way Louie wrote it down.",
    price: 210,
    popular: true,
  },
  {
    name: "Long John, Cream Filled",
    description: "Plain, custard, cream or cream glazed. The glazed is the one to get.",
    price: 189,
    popular: true,
  },
  {
    name: "Old Pan Toffee",
    description:
      "Made in the pan, broken by hand, and the thing most likely to survive a trip home in a suitcase.",
    price: 474,
    popular: true,
  },
];

export const sections: MenuSection[] = [
  {
    id: "donuts",
    title: "Donuts and Rolls",
    blurb: "Fried before dawn and out front by half past five.",
    items: [
      {
        name: "Nut Roll",
        description: "Cinnamon roll, fried, iced, and covered in peanuts we roast ourselves.",
        price: 189,
        popular: true,
      },
      { name: "Caramel Roll", price: 189 },
      {
        name: "Fried Cakes",
        description: "Plain, chocolate, cinnamon, powdered or glazed.",
        price: 189,
        popular: true,
      },
      { name: "Apple Fritter", price: 189 },
      { name: "Fried Cinnamon Roll", price: 189 },
      { name: "Twists", description: "Sugar or glazed.", price: 189 },
      {
        name: "Jelly Rolls",
        description: "Strawberry, raspberry, blueberry or custard.",
        price: 189,
      },
      {
        name: "Lemon Jelly Roll",
        description: "Saturdays. It goes early.",
        price: 189,
        availability: { days: [6] },
      },
      {
        name: "Long Johns",
        description: "Plain, custard, cream or cream glazed.",
        price: 189,
        popular: true,
      },
      { name: "Butterfly", price: 189 },
      { name: "Baked Cinnamon Roll", price: 189 },
      { name: "Yeast Raised", price: 189 },
    ],
  },

  {
    id: "holes",
    title: "Donut Holes",
    items: [
      { name: "Glazed, Cinnamon, Powdered or Plain", price: 63 },
      { name: "Chocolate", price: 79 },
    ],
  },

  {
    id: "pastries",
    title: "Pastries and Danish",
    items: [
      { name: "Small Pecan Roll", price: 210 },
      { name: "Large Pecan Roll", price: 210 },
      {
        name: "Pecan Crisp",
        description: "The 1952 recipe.",
        price: 210,
        popular: true,
      },
    ],
  },

  {
    id: "specials",
    title: "Specials",
    blurb: "Not every day. That is rather the point of them.",
    items: [
      {
        name: "Cream Horn",
        description: "Wednesdays, or ring ahead and we will make them.",
        price: 289,
        availability: { days: [3], byOrder: true },
      },
      {
        name: "Eclair",
        description: "Fall through early spring.",
        price: 394,
        availability: { season: "fall-winter" },
      },
      {
        name: "Buzz Bomb",
        description: "Our name, our pastry. Fall through early spring.",
        price: 394,
        availability: { season: "fall-winter" },
      },
      {
        name: "Bacon Donut",
        description: "Turns up now and then.",
        price: 263,
        availability: { occasional: true },
      },
      { name: "Nutella Roll", price: 263 },
    ],
  },

  {
    id: "cookies",
    title: "Cookies",
    items: [
      {
        name: "Photo Cookies",
        description:
          "Any photo or logo printed on the cookie, at no extra charge. Give us two days.",
        price: 368,
        availability: { leadDays: 2 },
        popular: true,
      },
      {
        name: "Cutout Cookies",
        description: "Pumpkin, shamrock, Pac-Man, unicorn, Christmas and Easter.",
        price: 158,
      },
      {
        name: "Chocolate Drops",
        description: "Wednesdays only.",
        price: 131,
        availability: { days: [3] },
      },
      {
        name: "The Regulars",
        description:
          "White chocolate chunk, chocolate chip, peanut butter, molasses plain and with jelly, oatmeal raisin, ice box, fruit bar, M&M, sugar and snickerdoodle.",
        price: 131,
      },
      { name: "Double Chocolate Chip or Double M&M", price: 158 },
      { name: "Louie's Macaroons", price: 210 },
    ],
  },

  {
    id: "pies",
    title: "Pies",
    blurb: "Whole pies, made here. Order ahead for a holiday and save yourself the worry.",
    items: [
      {
        name: "Fruit Pies",
        description:
          "Blueberry, apple, Dutch apple, cherry, peach, strawberry rhubarb and fruit of the forest.",
        price: 2100,
      },
      {
        name: "Cream Pies",
        description:
          "Lemon, coconut, banana, chocolate, butterscotch and peanut butter. Meringue or LouWhip.",
        price: 2100,
      },
      {
        name: "Raspberry Cream",
        description: "LouWhip only.",
        price: 2100,
      },
      {
        name: "Pumpkin",
        description: "LouWhip. Fall and winter.",
        price: 2100,
        availability: { season: "fall-winter" },
      },
      {
        name: "Egg Custard",
        description: "Fall and winter.",
        price: 2100,
        availability: { season: "fall-winter" },
      },
      {
        name: "Pecan Pie",
        description: "Fall and winter.",
        price: 2310,
        availability: { season: "fall-winter" },
      },
      { name: "Pecan Tart", price: 289 },
    ],
  },

  {
    id: "bread",
    title: "Bread, Rolls and Buns",
    items: [
      { name: "Hamburg and Hot Dog Buns", price: 79 },
      { name: "Party Size Hamburg Buns", description: "Per dozen.", price: 735 },
      { name: "Butter Flake, Swedish and Parker House Rolls", price: 79 },
      { name: "White, Butter Crust, Hobo and Wheat Bread", price: 420 },
      { name: "Cinnamon and Cinnamon Raisin Bread", price: 420 },
      { name: "Cream Bread and Cream Nut Bread", price: 420 },
      { name: "Vienna Bread", description: "Plain, sesame or poppy.", price: 473 },
      { name: "Corn Bread", price: 525 },
      { name: "English Muffins", price: 499 },
      { name: "Garlic Toast", price: 394 },
      { name: "Seasonal Bread", description: "Whatever the season calls for.", price: 525 },
    ],
  },

  {
    id: "cupcakes",
    title: "Cupcakes and Squares",
    items: [
      { name: "Plain Cupcake", price: 158 },
      { name: "Filled Cupcake", price: 315 },
      { name: "Limoncello Cupcake", price: 315 },
      { name: "Squares", price: 289 },
      { name: "Brownies", price: 420 },
    ],
  },

  {
    id: "toffee",
    title: "Old Pan Toffee",
    blurb: "Keeps well, travels well, and disappears faster than either of those suggests.",
    items: [
      { name: "Small", price: 474 },
      { name: "Large", price: 1050, popular: true },
    ],
  },

  {
    id: "drinks",
    title: "Coffee and Drinks",
    /* Kevin, from the shop: the coffee is Starbucks, brewed here. Worth saying out
       loud rather than leaving as three price lines, because "a donut and a coffee"
       is the whole visit for most people and the coffee being real is a reason to
       stay rather than take the bag to the car. */
    blurb: "The coffee is Starbucks, brewed here, in three sizes.",
    items: [
      { name: "Starbucks Coffee, Short", price: 242 },
      { name: "Starbucks Coffee, Tall", price: 289 },
      { name: "Starbucks Coffee, Grande", price: 315 },
      { name: "Pepsi Fountain, Small", price: 184 },
      { name: "Pepsi Fountain, Medium or Large", price: 210 },
    ],
  },

  {
    id: "merch",
    title: "Take Something Home",
    items: [
      { name: "Louie's T-Shirt, S to L", price: 2100 },
      { name: "Louie's T-Shirt, XL to 3XL", price: 2625 },
      {
        name: "Coffee Mug, Rocks Glass, Insulated Mug or Canteen",
        price: 1260,
      },
    ],
  },
];

/**
 * PLACEHOLDER: five unconfirmed facts, all flagged for Jason before launch and
 * all on the checklist in the README.
 *
 * 0. EVERY PRICE ON THIS PAGE. The figures are the card prices from their published
 *    list, which was written for a cash-discount system the bakery no longer runs.
 *    Square is the register now. The current price of a nut roll is whatever Square
 *    says it is this morning, and that list has to come from Jason before launch. This
 *    is the biggest unconfirmed thing on the site and it is deliberately at the top.
 * 1. The old menu printed "PASTRIES / DANISH ROLLS $2.10 cash discount $0.60". The 60
 *    cents is the donut hole price from the row above. Moot now that the second number
 *    is gone, but it tells you how carefully that list was kept.
 * 2. Their window reads COFFEE, DONUTS, ICE CREAM, SODA. Ice cream appears nowhere on
 *    the price list. Still sold, or long gone?
 * 3. A recent review says birthday cakes were dropped. The old site still lists cakes.
 * 4. Small and large pecan rolls carry the same price on the old menu. Probably a typo.
 */

/**
 * The photo cookie price, exported because /cookies is a whole page about one menu row
 * and was printing 368 twice in its own markup. A price that exists in two files is a
 * price that will be right in one of them.
 */
export const photoCookiePrice =
  sections.flatMap((s) => s.items).find((i) => i.name === "Photo Cookies")?.price ?? 368;

/**
 * THE CASE
 *
 * Transcribed from the price list on louies-bakery.com, August 2026, including their
 * own spellings and their own names for things. "LouWhip" is theirs. So is "Hobo
 * Bread" and "Buzz Bomb". None of it gets sanded off into generic bakery language.
 *
 * TWO PRICES ON EVERY LINE. Louie's charges less for cash. Their old menu printed both
 * numbers on every row with no explanation anywhere on the site, which reads as a
 * mistake rather than a discount. Here the pair is a property of the item and the site
 * explains the policy once, in plain words, on the menu page.
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
  /** Cents, cash price. */
  cash?: number;
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
      "The one people drive here for. A cinnamon fried roll under icing and a heavy coat of peanuts, roasted in the shop. They make about a thousand a day and still sell out.",
    price: 189,
    cash: 180,
    popular: true,
  },
  {
    name: "Pecan Crisp",
    description:
      "An original recipe from 1952, still made the way Louie wrote it down.",
    price: 210,
    cash: 200,
    popular: true,
  },
  {
    name: "Long John, Cream Filled",
    description: "Plain, custard, cream or cream glazed. The glazed is the one to get.",
    price: 189,
    cash: 180,
    popular: true,
  },
  {
    name: "Old Pan Toffee",
    description:
      "Made in the pan, broken by hand, and the thing most likely to survive a trip home in a suitcase.",
    price: 474,
    cash: 450,
    popular: true,
  },
];

export const sections: MenuSection[] = [
  {
    id: "donuts",
    title: "Donuts and Rolls",
    blurb: "Fried through the night and out front by half past five.",
    items: [
      {
        name: "Nut Roll",
        description: "Cinnamon roll, fried, iced, and covered in peanuts they roast themselves.",
        price: 189,
        cash: 180,
        popular: true,
      },
      { name: "Caramel Roll", price: 189, cash: 180 },
      {
        name: "Fried Cakes",
        description: "Plain, chocolate, cinnamon, powdered or glazed.",
        price: 189,
        cash: 180,
        popular: true,
      },
      { name: "Apple Fritter", price: 189, cash: 180 },
      { name: "Fried Cinnamon Roll", price: 189, cash: 180 },
      { name: "Twists", description: "Sugar or glazed.", price: 189, cash: 180 },
      {
        name: "Jelly Rolls",
        description: "Strawberry, raspberry, blueberry or custard.",
        price: 189,
        cash: 180,
      },
      {
        name: "Lemon Jelly Roll",
        description: "Saturdays. It goes early.",
        price: 189,
        cash: 180,
        availability: { days: [6] },
      },
      {
        name: "Long Johns",
        description: "Plain, custard, cream or cream glazed.",
        price: 189,
        cash: 180,
        popular: true,
      },
      { name: "Butterfly", price: 189, cash: 180 },
      { name: "Baked Cinnamon Roll", price: 189, cash: 180 },
      { name: "Yeast Raised", price: 189, cash: 180 },
    ],
  },

  {
    id: "holes",
    title: "Donut Holes",
    items: [
      { name: "Glazed, Cinnamon, Powdered or Plain", price: 63, cash: 60 },
      { name: "Chocolate", price: 79, cash: 75 },
    ],
  },

  {
    id: "pastries",
    title: "Pastries and Danish",
    items: [
      { name: "Small Pecan Roll", price: 210, cash: 200 },
      { name: "Large Pecan Roll", price: 210, cash: 200 },
      {
        name: "Pecan Crisp",
        description: "The 1952 recipe.",
        price: 210,
        cash: 200,
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
        description: "Wednesdays, or ring ahead and they will make them.",
        price: 289,
        cash: 275,
        availability: { days: [3], byOrder: true },
      },
      {
        name: "Eclair",
        description: "Fall through early spring.",
        price: 394,
        cash: 375,
        availability: { season: "fall-winter" },
      },
      {
        name: "Buzz Bomb",
        description: "Their name, their pastry. Fall through early spring.",
        price: 394,
        cash: 375,
        availability: { season: "fall-winter" },
      },
      {
        name: "Bacon Donut",
        description: "Turns up now and then.",
        price: 263,
        cash: 250,
        availability: { occasional: true },
      },
      { name: "Nutella Roll", price: 263, cash: 250 },
    ],
  },

  {
    id: "cookies",
    title: "Cookies",
    items: [
      {
        name: "Photo Cookies",
        description:
          "Any photo or logo printed on the cookie, at no extra charge. Two days notice.",
        price: 368,
        cash: 350,
        availability: { leadDays: 2 },
        popular: true,
      },
      {
        name: "Cutout Cookies",
        description: "Pumpkin, shamrock, Pac-Man, unicorn, Christmas and Easter.",
        price: 158,
        cash: 150,
      },
      {
        name: "Chocolate Drops",
        description: "Wednesdays only.",
        price: 131,
        cash: 125,
        availability: { days: [3] },
      },
      {
        name: "The Regulars",
        description:
          "White chocolate chunk, chocolate chip, peanut butter, molasses plain and with jelly, oatmeal raisin, ice box, fruit bar, M&M, sugar and snickerdoodle.",
        price: 131,
        cash: 125,
      },
      { name: "Double Chocolate Chip or Double M&M", price: 158, cash: 150 },
      { name: "Louie's Macaroons", price: 210, cash: 200 },
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
        cash: 2000,
      },
      {
        name: "Cream Pies",
        description:
          "Lemon, coconut, banana, chocolate, butterscotch and peanut butter. Meringue or LouWhip.",
        price: 2100,
        cash: 2000,
      },
      {
        name: "Raspberry Cream",
        description: "LouWhip only.",
        price: 2100,
        cash: 2000,
      },
      {
        name: "Pumpkin",
        description: "LouWhip. Fall and winter.",
        price: 2100,
        cash: 2000,
        availability: { season: "fall-winter" },
      },
      {
        name: "Egg Custard",
        description: "Fall and winter.",
        price: 2100,
        cash: 2000,
        availability: { season: "fall-winter" },
      },
      {
        name: "Pecan Pie",
        description: "Fall and winter.",
        price: 2310,
        cash: 2200,
        availability: { season: "fall-winter" },
      },
      { name: "Pecan Tart", price: 289, cash: 275 },
    ],
  },

  {
    id: "bread",
    title: "Bread, Rolls and Buns",
    items: [
      { name: "Hamburg and Hot Dog Buns", price: 79, cash: 75 },
      { name: "Party Size Hamburg Buns", description: "Per dozen.", price: 735, cash: 700 },
      { name: "Butter Flake, Swedish and Parker House Rolls", price: 79, cash: 75 },
      { name: "White, Butter Crust, Hobo and Wheat Bread", price: 420, cash: 400 },
      { name: "Cinnamon and Cinnamon Raisin Bread", price: 420, cash: 400 },
      { name: "Cream Bread and Cream Nut Bread", price: 420, cash: 400 },
      { name: "Vienna Bread", description: "Plain, sesame or poppy.", price: 473, cash: 450 },
      { name: "Corn Bread", price: 525, cash: 500 },
      { name: "English Muffins", price: 499, cash: 475 },
      { name: "Garlic Toast", price: 394, cash: 375 },
      { name: "Seasonal Bread", description: "Whatever the season calls for.", price: 525, cash: 500 },
    ],
  },

  {
    id: "cupcakes",
    title: "Cupcakes and Squares",
    items: [
      { name: "Plain Cupcake", price: 158, cash: 150 },
      { name: "Filled Cupcake", price: 315, cash: 300 },
      { name: "Limoncello Cupcake", price: 315, cash: 300 },
      { name: "Squares", price: 289, cash: 275 },
      { name: "Brownies", price: 420, cash: 400 },
    ],
  },

  {
    id: "toffee",
    title: "Old Pan Toffee",
    blurb: "Keeps well, travels well, and disappears faster than either of those suggests.",
    items: [
      { name: "Small", price: 474, cash: 450 },
      { name: "Large", price: 1050, cash: 1000, popular: true },
    ],
  },

  {
    id: "drinks",
    title: "Coffee and Drinks",
    items: [
      { name: "Starbucks Coffee, Short", price: 242, cash: 230 },
      { name: "Starbucks Coffee, Tall", price: 289, cash: 275 },
      { name: "Starbucks Coffee, Grande", price: 315, cash: 300 },
      { name: "Pepsi Fountain, Small", price: 184, cash: 175 },
      { name: "Pepsi Fountain, Medium or Large", price: 210, cash: 200 },
    ],
  },

  {
    id: "merch",
    title: "Take Something Home",
    items: [
      { name: "Louie's T-Shirt, S to L", price: 2100, cash: 1995 },
      { name: "Louie's T-Shirt, XL to 3XL", price: 2625, cash: 2495 },
      {
        name: "Coffee Mug, Rocks Glass, Insulated Mug or Canteen",
        price: 1260,
        cash: 1200,
      },
    ],
  },
];

/**
 * PLACEHOLDER: four unconfirmed facts, all flagged for Jason before launch and
 * all on the checklist in the README.
 *
 * 1. The old menu printed "PASTRIES / DANISH ROLLS $2.10 cash discount $0.60". The 60
 *    cents is the donut hole price from the row above, so the cash price here is set to
 *    $2.00 to match the pattern every other line follows. Worth checking.
 * 2. Their window reads COFFEE, DONUTS, ICE CREAM, SODA. Ice cream appears nowhere on
 *    the price list. Still sold, or long gone?
 * 3. A recent review says birthday cakes were dropped. The old site still lists cakes.
 * 4. Small and large pecan rolls carry the same price on the old menu. Probably a typo.
 */

export const allItems = sections.flatMap((s) => s.items);

/**
 * WHAT GOES IN A BOX
 *
 * Phase three on the roadmap, and the page that earns the most money per pixel on any
 * bakery site, because it is the only page that sells to somebody who cannot drive
 * over. Louie's already ships two ways: boxes they pack and send themselves, and their
 * Goldbelly listing. Neither of them is described anywhere on their own website.
 *
 * WHAT IS AND IS NOT KNOWN HERE, because this file will be read by somebody deciding
 * what to trust:
 *
 *   Known. That they ship, that it goes UPS, that the truck goes Tuesday, and which
 *   things they make. All of that is on their own site or came from the bakery.
 *
 *   NOT known, and therefore NOT invented: what a shipped box costs, what is in each
 *   box, how many of a thing fits, and which items survive a truck in July. Goldbelly
 *   knows all of it, and their catalogue is rendered in the browser rather than served
 *   as text, so it cannot be read from here. It has to come from Jason or from Kevin
 *   reading the listing on a phone.
 *
 * So every box below carries what it is and how it travels, and no price. A price on
 * this page today would be a number somebody made up, and the one thing a bakery
 * cannot have on its website is a price that is not real. See the note the page
 * renders under the grid, which says exactly that to the client rather than hiding it.
 *
 * When the real catalogue arrives: add `price` (cents) and `contents`, and the grid
 * shows both without another change.
 */

export type Box = {
  name: string;
  /** What it is, in the bakery's own terms. */
  body: string;
  /** How it survives a truck. The honest reason to buy this one and not another. */
  travels: string;
  /** Cents, once the bakery sets it. PLACEHOLDER until then, deliberately absent. */
  price?: number;
  /** Filled from the real catalogue: the actual line items in the box. */
  contents?: string[];
};

export const boxes: Box[] = [
  {
    name: "Nut Rolls",
    body: "The reason most people click. A cinnamon roll, fried, iced, and rolled in peanuts we roast in the back.",
    travels:
      "Baked Monday night and on a truck Tuesday morning, which is as close to fresh as a fried roll gets four states away.",
  },
  {
    name: "Old Pan Toffee",
    body: "Broken by hand off the pan, the way it has been made here since the beginning.",
    travels: "The best traveler we make. Keeps for weeks and arrives exactly as it left.",
  },
  {
    name: "Pecan Crisps",
    body: "The 1952 recipe, still made the way Louie wrote it down.",
    travels: "Sturdy enough for a box, and unlike anything sold where you live.",
  },
];

/**
 * PLACEHOLDER: the real catalogue.
 *
 * Their Goldbelly listing is the fastest source: it already has the boxes priced,
 * photographed and described, and those are the numbers a customer has already been
 * paying. Note that a Goldbelly price is not the price for this page. It carries the
 * marketplace's cut and its shipping inside it, so lifting it onto the bakery's own
 * site would either overcharge the customer or quietly underpay the bakery. What the
 * listing gives us is the shape: what a box holds, what it weighs, what people buy.
 * The price for this page is the bakery's own, set with Jason against a UPS rate.
 */

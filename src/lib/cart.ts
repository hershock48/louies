import { boxBySlug, type Box } from "@/data/shipping";

/**
 * THE CART.
 *
 * A cookie holding slugs and quantities, and nothing else. No database, no session
 * store, no third-party cart service, no client bundle. The whole thing is about eighty
 * lines and it survives a page reload, a shared link and a browser with JavaScript
 * switched off, which the rest of this site already promises and a cart has no business
 * being the exception to.
 *
 * WHY A COOKIE AND NOT localStorage. localStorage is unreadable on the server, so every
 * page holding a cart badge would have to render empty and then flicker, and the
 * checkout would need JavaScript to submit. A cookie arrives with the request, so the
 * header count is right in the first byte of HTML and every mutation is a plain form
 * POST. It is also why the add button works with scripting off.
 *
 * WHAT IS DELIBERATELY NOT IN THE COOKIE: prices. A cart that remembers what something
 * cost is a cart that can be edited by the customer. Slugs go in, and every price is
 * looked up from src/data/shipping.ts at render and again at checkout, so the only
 * price that can ever be charged is the one the bakery published.
 */

export const CART_COOKIE = "lb_cart";

/** One box, and how many of it. */
export type CartEntry = { slug: string; qty: number };

/** An entry resolved against the catalogue, ready to render or charge. */
export type CartLine = { box: Box; qty: number; each: number; total: number };

const MAX_QTY = 20;

/**
 * Cookie format: `slug:qty,slug:qty`. Not JSON, because JSON in a cookie means quoting
 * rules, escaping and a parse that can throw on anything a user pastes in. This parser
 * cannot throw: anything it does not understand is dropped.
 */
export function parseCart(raw: string | undefined): CartEntry[] {
  if (!raw) return [];
  const seen = new Set<string>();
  return raw
    .split(",")
    .map((part) => {
      const [slug, qty] = part.split(":");
      const n = Number(qty);
      if (!slug || !Number.isFinite(n)) return null;
      // A slug that is not on sale is dropped rather than rendered as a blank line
      // with a price of NaN. `sellable` covers both the box that no longer exists and
      // the one that is not for sale yet: the browser disables the pumpkin tin's
      // button, and a disabled button is a suggestion, not a rule.
      if (!sellable(slug)) return null;
      if (seen.has(slug)) return null;
      seen.add(slug);
      return { slug, qty: Math.min(Math.max(Math.round(n), 1), MAX_QTY) };
    })
    .filter((e): e is CartEntry => e !== null)
    .slice(0, 12);
}

export function serializeCart(entries: CartEntry[]): string {
  return entries.map((e) => `${e.slug}:${e.qty}`).join(",");
}

/** On sale today: it exists, it has a price, and it is not still to come. */
function sellable(slug: string) {
  const box = boxBySlug(slug);
  return Boolean(box && box.price !== undefined && !box.comingSoon);
}

/** Add, change or remove in one function, because a route handler should not branch. */
export function applyChange(
  entries: CartEntry[],
  slug: string,
  qty: number,
): CartEntry[] {
  if (!sellable(slug)) return entries;
  const clamped = Math.min(Math.max(Math.round(qty), 0), MAX_QTY);
  const without = entries.filter((e) => e.slug !== slug);
  if (clamped === 0) return without;
  return [...without, { slug, qty: clamped }];
}

export function addToCart(entries: CartEntry[], slug: string, add: number): CartEntry[] {
  const existing = entries.find((e) => e.slug === slug)?.qty ?? 0;
  return applyChange(entries, slug, existing + add);
}

/**
 * Resolved lines, in catalogue order rather than the order things were added, so the
 * cart does not reshuffle itself when somebody changes a quantity.
 */
export function cartLines(entries: CartEntry[]): CartLine[] {
  return entries
    .map((e) => {
      const box = boxBySlug(e.slug);
      if (!box || box.price === undefined || box.comingSoon) return null;
      return { box, qty: e.qty, each: box.price, total: box.price * e.qty };
    })
    .filter((l): l is CartLine => l !== null);
}

export const cartTotal = (lines: CartLine[]) =>
  lines.reduce((n, l) => n + l.total, 0);

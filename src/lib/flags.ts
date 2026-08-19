/**
 * ONE SWITCH FOR THE DIRECT CHECKOUT.
 *
 * The cart, the checkout, the Stripe path and the honest email fallback are all built
 * and all tested. They are not reachable, because the bakery is on a multi-year
 * marketplace contract and taking the shipping money on their own site may well be
 * something that contract forbids. Nobody has read it yet, so the site behaves as
 * though it does.
 *
 * Deleting the code would be the wrong call twice over: the contract has an end date,
 * the same machinery is what pickup preordering runs on, and a checkout that has been
 * built and proven is worth more than a plan to build one. So it sits behind this flag,
 * off by default, and the customer-facing pages send buyers to the listing instead.
 *
 * Set DIRECT_CHECKOUT=1 to turn it back on. Nothing else changes: the cart returns to
 * the nav, /cart stops being a 404 and the box cards go back to being add-to-cart
 * forms.
 */
export const directCheckout = process.env.DIRECT_CHECKOUT === "1";

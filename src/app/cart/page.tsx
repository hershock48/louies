import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { PageHero, ButtonLink } from "@/components/Ui";
import CheckoutDetails from "@/components/CheckoutDetails";
import { CART_COOKIE, cartLines, cartTotal, parseCart } from "@/lib/cart";
import { money } from "@/lib/money";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Your box",
  description: "What you are sending, and where it is going.",
  robots: { index: false },
};

/**
 * The cart, and the address, on one page.
 *
 * One page rather than the usual three-step funnel because there are five products and
 * the person buying is sending a tin to their mother. Every extra step in a checkout is
 * a place to lose them, and there is nothing here that needs a step of its own.
 *
 * Every control is a form. Quantities, removal and checkout all post and redirect, so
 * the page works with JavaScript off, which is the same promise the rest of the site
 * makes and the one a checkout is most often excused from keeping.
 */
export default async function CartPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const entries = parseCart((await cookies()).get(CART_COOKIE)?.value);
  const lines = cartLines(entries);
  const total = cartTotal(lines);
  // Which half of the checkout is live decides several sentences on this page.
  const paying = Boolean(process.env.STRIPE_SECRET_KEY);

  const qtyBtn =
    "flex h-9 w-9 items-center justify-center rounded-card border border-awning/25 text-lg font-bold text-awning hover:border-brick hover:text-brick";

  return (
    <>
      <PageHero
        eyebrow="Nearly there"
        title={lines.length ? "What you are sending." : "Nothing in the box yet."}
        intro={
          lines.length
            ? "Shipping is included in every price. Change anything here before you order."
            : undefined
        }
      />

      <section className="grain relative isolate bg-paper">
        <div className="relative mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
          {error === "cancelled" && (
            <p
              role="alert"
              className="mb-8 rounded-card border border-awning/25 bg-paper-dim px-4 py-3 text-sm text-awning"
            >
              You came back without paying, and nothing was charged. Your box is still
              here.
            </p>
          )}
          {error === "empty" && (
            <p
              role="alert"
              className="mb-8 rounded-card border border-brick/40 bg-brick/10 px-4 py-3 text-sm font-semibold text-brick"
            >
              The box was empty by the time that went through. Pick something and try
              again.
            </p>
          )}

          {lines.length === 0 ? (
            <div className="space-y-6">
              <p className="text-lg leading-relaxed text-awning/85">
                Pick a tin or a dozen and it will show up here. Everything ships for the
                price on the label, baked the night before it goes.
              </p>
              <ButtonLink href="/shop" variant="dark">
                See what we send
              </ButtonLink>
            </div>
          ) : (
            <>
              <ul className="divide-y divide-awning/12 border-y border-awning/12">
                {lines.map((l) => (
                  <li
                    key={l.box.slug}
                    id={l.box.slug}
                    className="flex scroll-mt-[calc(var(--header-h)+1rem)] flex-wrap items-center gap-4 py-5"
                  >
                    <div className="min-w-[12rem] flex-1">
                      <h2 className="font-display text-lg font-bold text-awning">
                        {l.box.name}
                      </h2>
                      <p className="text-sm text-awning/70">
                        {l.box.size} &middot; {money(l.each)} each, shipping included
                      </p>
                    </div>

                    {/* Three tiny forms rather than one with JavaScript. Each posts,
                        each redirects back here. */}
                    <div className="flex items-center gap-2">
                      <form method="post" action="/api/cart">
                        <input type="hidden" name="slug" value={l.box.slug} />
                        <input type="hidden" name="op" value="set" />
                        <input type="hidden" name="qty" value={l.qty - 1} />
                        <input type="hidden" name="back" value={`/cart#${l.box.slug}`} />
                        <button
                          type="submit"
                          className={qtyBtn}
                          /* At one, this button empties the line rather than reducing
                             it, and saying "one fewer" to a screen reader while doing
                             that is simply a wrong label. */
                          aria-label={
                            l.qty === 1
                              ? `Remove ${l.box.name}`
                              : `One fewer ${l.box.name}`
                          }
                        >
                          &minus;
                        </button>
                      </form>

                      <span className="w-8 text-center font-semibold tabular-nums text-awning">
                        {l.qty}
                      </span>

                      <form method="post" action="/api/cart">
                        <input type="hidden" name="slug" value={l.box.slug} />
                        <input type="hidden" name="op" value="set" />
                        <input type="hidden" name="qty" value={l.qty + 1} />
                        <input type="hidden" name="back" value={`/cart#${l.box.slug}`} />
                        <button
                          type="submit"
                          className={qtyBtn}
                          /* Twenty is the clamp in lib/cart.ts. Past it the form posted
                             happily and nothing changed, which reads as a broken
                             button. */
                          disabled={l.qty >= 20}
                          aria-label={
                            l.qty >= 20
                              ? `Twenty is the most we can send in one order`
                              : `One more ${l.box.name}`
                          }
                        >
                          +
                        </button>
                      </form>
                    </div>

                    <p className="w-20 text-right font-semibold tabular-nums text-awning">
                      {money(l.total)}
                    </p>

                    <form method="post" action="/api/cart">
                      <input type="hidden" name="slug" value={l.box.slug} />
                      <input type="hidden" name="op" value="remove" />
                      <input type="hidden" name="back" value={`/cart#${l.box.slug}`} />
                      <button
                        type="submit"
                        className="text-sm text-awning/60 underline underline-offset-2 hover:text-brick"
                        /* Five identical "Remove" buttons is what a screen reader's
                           element list showed before this. */
                        aria-label={`Remove ${l.box.name}`}
                      >
                        Remove
                      </button>
                    </form>
                  </li>
                ))}
              </ul>

              {/*
                Read out after every change. Each quantity press is a form post and a
                fresh page, so there is no client-side update to announce: this line is
                the announcement, and it is also just useful to look at.
              */}
              <p role="status" className="sr-only">
                {lines.length} {lines.length === 1 ? "box" : "boxes"} in your order,{" "}
                {money(total)} including shipping.
              </p>

              <div className="mt-6 flex items-baseline justify-between">
                <p className="font-display text-lg font-bold text-awning">Total</p>
                <p className="font-display text-2xl font-extrabold tabular-nums text-awning">
                  {money(total)}
                </p>
              </div>
              <p className="mt-1 text-right text-sm text-awning/65">
                Shipping included. This is the whole amount.
              </p>

              <div className="mt-4">
                <Link
                  href="/shop"
                  className="text-sm text-awning/70 underline underline-offset-2 hover:text-brick"
                >
                  Add something else
                </Link>
              </div>

              <CheckoutDetails error={error === "missing"} />

              <p className="mt-6 text-sm leading-relaxed text-awning/70">
                Boxes go out {site.shipping.day} morning on the {site.shipping.carrier}{" "}
                truck. Order after it has gone and yours is on the next one.{" "}
                {paying
                  ? "If the week we can send it does not suit you, ring the shop and we will sort it out, refund included."
                  : "We will tell you which week when we ring, before anything is charged."}
              </p>
            </>
          )}
        </div>
      </section>
    </>
  );
}

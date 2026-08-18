import { site } from "@/data/site";

/**
 * The details half of the checkout: where the box goes, and who to reach.
 *
 * A server component rendering a plain form that posts to /api/checkout, so the whole
 * purchase works with JavaScript switched off. What happens on the other side depends
 * on whether the bakery's payment key is set, and the copy under the button says which
 * of the two it is rather than promising a card screen that may not appear. See the
 * long note in src/app/api/checkout/route.ts.
 */
export default function CheckoutDetails({ error }: { error?: boolean }) {
  const field =
    "mt-1 w-full rounded-card border border-awning/20 bg-paper px-3 py-2.5 text-awning placeholder:text-awning/45 focus:border-brick focus:outline-none";
  const label = "block text-sm font-semibold text-awning";
  const paying = Boolean(process.env.STRIPE_SECRET_KEY);

  return (
    <form
      id="details"
      method="post"
      action="/api/checkout"
      className="mt-10 scroll-mt-[calc(var(--header-h)+1rem)] rounded-panel border border-awning/15 bg-paper-dim p-6 sm:p-8"
    >
      <h2 className="font-display text-xl font-bold text-awning">Where it goes</h2>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-card border border-brick/40 bg-brick/10 px-4 py-3 text-sm font-semibold text-brick"
        >
          Please fill in the delivery address and a phone number we can reach you on.
        </p>
      )}

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="to">
            Recipient
          </label>
          <input id="to" name="to" required autoComplete="name" className={field} />
        </div>
        <div>
          <label className={label} htmlFor="arriveBy">
            Arrive by <span className="font-normal text-awning/60">(optional)</span>
          </label>
          <input
            id="arriveBy"
            name="arriveBy"
            placeholder="Her birthday, the 12th"
            className={field}
          />
        </div>
      </div>

      <div className="mt-4">
        <label className={label} htmlFor="address">
          Street address
        </label>
        <input
          id="address"
          name="address"
          required
          autoComplete="street-address"
          className={field}
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-[2fr_1fr_1fr]">
        <div>
          <label className={label} htmlFor="city">
            City
          </label>
          <input id="city" name="city" required autoComplete="address-level2" className={field} />
        </div>
        <div>
          <label className={label} htmlFor="state">
            State
          </label>
          <input
            id="state"
            name="state"
            required
            maxLength={2}
            autoComplete="address-level1"
            className={field}
          />
        </div>
        <div>
          <label className={label} htmlFor="zip">
            ZIP
          </label>
          <input
            id="zip"
            name="zip"
            required
            inputMode="numeric"
            autoComplete="postal-code"
            className={field}
          />
        </div>
      </div>

      <div className="mt-4">
        <label className={label} htmlFor="gift">
          Note to go in the box <span className="font-normal text-awning/60">(optional)</span>
        </label>
        <textarea
          id="gift"
          name="gift"
          rows={2}
          placeholder="Happy birthday from all of us. Eat one for me."
          className={field}
        />
      </div>

      <h3 className="mt-8 font-display text-lg font-bold text-awning">
        {paying ? "Who to reach about the box" : "Who to ring for the card"}
      </h3>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="shipName">
            Your name
          </label>
          <input id="shipName" name="name" required autoComplete="name" className={field} />
        </div>
        <div>
          <label className={label} htmlFor="shipPhone">
            Phone
          </label>
          <input
            id="shipPhone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            className={field}
          />
        </div>
      </div>

      <div className="mt-4">
        <label className={label} htmlFor="shipEmail">
          Email <span className="font-normal text-awning/60">(optional)</span>
        </label>
        <input
          id="shipEmail"
          name="email"
          type="email"
          autoComplete="email"
          className={field}
        />
      </div>

      {/* Honeypot, same as the order form. Hidden from people, irresistible to bots. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="websiteUrl">Website</label>
        <input id="websiteUrl" name="website_url" tabIndex={-1} autoComplete="off" />
      </div>

      <button type="submit" className="btn btn-dark mt-6">
        {paying ? "Pay and send it" : "Send this order to the bakery"}
      </button>

      <p className="mt-4 text-sm leading-relaxed text-awning/70">
        {paying ? (
          <>
            Payment is taken on a secure page hosted by our card processor. Your card
            details never touch this website.
          </>
        ) : (
          <>
            <strong className="font-semibold text-awning">Nothing is charged here.</strong>{" "}
            The order goes to the bakery and we ring you for the card before the box is
            packed, which is how a shipped order has always worked here. Card payment on
            this page is switched on the day the bakery says so.
          </>
        )}{" "}
        Or call the shop on{" "}
        <a href={site.phoneHref} className="font-semibold text-brick underline underline-offset-2">
          {site.phone}
        </a>
        .
      </p>
    </form>
  );
}

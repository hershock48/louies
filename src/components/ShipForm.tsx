import { boxes } from "@/data/shipping";
import { site } from "@/data/site";

/**
 * THE SHIPPING FORM.
 *
 * Until this existed, the demo's shipping page argued that the bakery should sell boxes
 * from its own site and then sent the visitor to Goldbelly to buy one, which is the
 * exact behavior the proposal criticizes. Now the order can be placed here.
 *
 * What it is: a server component rendering a plain form that posts to /api/ship. No
 * "use client", no state, no fetch, so it works with scripting off and adds nothing to
 * the bundle. Same pattern as OrderForm, deliberately, because two forms on one site
 * behaving differently is how one of them ends up broken.
 *
 * WHAT IT DOES NOT DO IS TAKE MONEY, and nothing on the page pretends otherwise. The
 * bakery rings for the card, which is how they take a shipped order today, and the
 * copy says so before anybody fills anything in. A checkout that looks like a checkout
 * and quietly does not charge is the specific dishonesty glaze.md forbids; paid
 * checkout is the store add-on in the proposal and this route is what it replaces.
 *
 * The box can arrive preselected from the card the visitor pressed (/shop?box=...),
 * which is why this takes `selected` rather than reading the query itself.
 */
export default function ShipForm({
  selected,
  error,
}: {
  selected?: string;
  error?: boolean;
}) {
  const field =
    "mt-1 w-full rounded-card border border-awning/20 bg-paper px-3 py-2.5 text-awning placeholder:text-awning/45 focus:border-brick focus:outline-none";
  const label = "block text-sm font-semibold text-awning";

  return (
    <form
      id="ship"
      method="post"
      action="/api/ship"
      className="scroll-mt-[calc(var(--header-h)+1rem)] rounded-panel border border-awning/15 bg-paper-dim p-6 sm:p-8"
    >
      <h2 className="font-display text-xl font-bold text-awning">Send one from here</h2>
      <p className="mt-2 text-awning/80">
        Tell us the box and where it goes. We pack it {site.shipping.day} morning and
        ring you for the card before it leaves, so nothing is charged until a person has
        spoken to you.
      </p>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-card border border-brick/40 bg-brick/10 px-4 py-3 text-sm font-semibold text-brick"
        >
          Please fill in the box, where it is going, and a phone number we can reach you on.
        </p>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-[2fr_1fr]">
        <div>
          <label className={label} htmlFor="box">
            Which box
          </label>
          <select id="box" name="box" required defaultValue={selected ?? ""} className={field}>
            <option value="" disabled>
              Choose one
            </option>
            {boxes.map((b) => (
              <option key={b.name} value={b.name}>
                {b.name}, {b.size}
                {b.comingSoon ? " (back in the fall)" : ""}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={label} htmlFor="quantity">
            How many
          </label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            min={1}
            max={20}
            defaultValue={1}
            required
            className={field}
          />
        </div>
      </div>

      <h3 className="mt-8 font-display text-lg font-bold text-awning">Where it goes</h3>

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

      <h3 className="mt-8 font-display text-lg font-bold text-awning">Who to ring for the card</h3>

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
        <label htmlFor="shipCompany">Company</label>
        <input id="shipCompany" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <button type="submit" className="btn btn-dark mt-6">
        Send it to the bakery
      </button>

      <p className="mt-4 text-sm text-awning/70">
        Nothing is charged here. We ring for the card, and if the box cannot get there in
        time we will say so before you pay anything. Or call the shop on{" "}
        <a href={site.phoneHref} className="font-semibold text-brick underline underline-offset-2">
          {site.phone}
        </a>
        .
      </p>
    </form>
  );
}

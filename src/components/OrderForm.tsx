import { site } from "@/data/site";

/**
 * The order inquiry form.
 *
 * A server component rendering a plain form. No "use client", no state, no fetch: it
 * posts to /api/order the way a form has posted since 1995, which means it works with
 * JavaScript off and adds nothing to the bundle.
 *
 * This is not the box builder. It does not take payment and it does not promise a
 * time. It takes what somebody wants and gets it in front of Jason, which is what the
 * telephone was doing and the telephone is shut sixteen hours a day.
 */
export default function OrderForm({ error }: { error?: boolean }) {
  const field =
    "mt-1 w-full rounded-card border border-awning/20 bg-paper px-3 py-2.5 text-awning placeholder:text-awning/45 focus:border-brick focus:outline-none";
  const label = "block text-sm font-semibold text-awning";

  return (
    <form
      id="form"
      method="post"
      action="/api/order"
      className="scroll-mt-[calc(var(--header-h)+1rem)] rounded-panel border border-awning/15 bg-paper-dim p-6 sm:p-8"
    >
      <h2 className="font-display text-xl font-bold text-awning">Tell them what you want</h2>
      <p className="mt-2 text-awning/80">
        For a dozen, a pie, a party tray or a tin of photo cookies. It goes straight to the
        bakery and someone will ring you back to confirm the time and the price.
      </p>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-card border border-brick/40 bg-brick/10 px-4 py-3 text-sm font-semibold text-brick"
        >
          Please fill in your name, a phone number, and what you are after.
        </p>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="name">
            Your name
          </label>
          <input id="name" name="name" required autoComplete="name" className={field} />
        </div>
        <div>
          <label className={label} htmlFor="phone">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            className={field}
          />
        </div>
      </div>

      <div className="mt-4">
        <label className={label} htmlFor="email">
          Email <span className="font-normal text-awning/60">(optional)</span>
        </label>
        <input id="email" name="email" type="email" autoComplete="email" className={field} />
      </div>

      <div className="mt-4">
        <label className={label} htmlFor="wanted">
          What would you like
        </label>
        <textarea
          id="wanted"
          name="wanted"
          required
          rows={3}
          placeholder="A dozen nut rolls and half a dozen long johns"
          className={field}
        />
      </div>

      <div className="mt-4">
        <label className={label} htmlFor="when">
          When for
        </label>
        <input
          id="when"
          name="when"
          placeholder="Saturday morning, or the 14th"
          className={field}
        />
        <p className="mt-1 text-xs text-awning/65">
          Pies and photo cookies need a couple of days. They bake Tuesday to Saturday.
        </p>
      </div>

      <div className="mt-4">
        <label className={label} htmlFor="notes">
          Anything else <span className="font-normal text-awning/60">(optional)</span>
        </label>
        <textarea id="notes" name="notes" rows={2} className={field} />
      </div>

      {/* Honeypot. Hidden from people, irresistible to bots, costs nothing and needs no
          third-party captcha service. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <button type="submit" className="btn btn-dark mt-6">
        Send it to the bakery
      </button>

      <p className="mt-4 text-sm text-awning/70">
        In a hurry, or want it today? Ring the shop on{" "}
        <a href={site.phoneHref} className="font-semibold text-brick underline underline-offset-2">
          {site.phone}
        </a>
        .
      </p>
    </form>
  );
}

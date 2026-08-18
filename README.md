# Louie's Bakery

A Glazed Web rebuild of [louies-bakery.com](https://www.louies-bakery.com/), the family
bakery at 144 W. Michigan Ave in Marshall, Michigan, open since November 1952.

**Status: spec build, phase one.** The site is complete and deliberately not indexed.
No checkout is wired yet.

## What this is

The old site is a 2019 Mopro template. It has a Team page that is publicly live with
lorem ipsum and three invented employees, a homepage that spent August telling people
the bakery was closed for a vacation that ended in July, a Testimonials page with no
testimonials on it, and a footer that reads 2019. It has two images in total: a
350x144 logo and a five second AI clip of a giant nut roll flying down a city street
that is not Marshall.

This replaces it.

## The idea

**The website is the case, not a price list.**

Louie's already wrote their availability rules down. They are on the old menu page,
trapped in parentheses where nothing can use them: "(Wednesday only)", "Lemon on
Saturday", "(Fall-Winter-Early Spring only)", "2-day advance notice required".

Here those are data (`src/data/menu.ts`), and `src/lib/availability.ts` resolves them
against Marshall time. Everything derives from that one function:

- the daily board on the homepage, computed, never edited
- availability badges on every menu row, so nobody has to hold the rules in their head
- the "coming back" list, which is free marketing for the eclair in September
- open or closed, from `src/data/hours.ts` and its `closures` array

Which means the bug currently costing them walk-ins, a stale closure notice nobody
remembered to take down, cannot happen here. Closing is a date range, not a banner.

## The palette came off their building

Every color token in `src/app/globals.css` was sampled from the night photograph of
the storefront: the sky over the awning, the brick, the gold on the sign band, the lit
tree. Nothing invented.

| Token | Hex | Source |
|---|---|---|
| `night` | `#0b0705` | Sky above the awning |
| `awning` | `#2c1f0f` | The wooden awning |
| `brick` | `#6b3d09` | The facade |
| `sign` | `#8f641f` | The sign band |
| `gold` | `#b28d45` | The lettering |
| `wheat` | `#dccc8a` | The lit tree |
| `paper` | `#faf3e4` | Extended from wheat |

The signature device is the **carousel oven** (`src/components/CarouselOven.tsx`). They
bake on an oven with six revolving shelves and no customer has ever seen it. One turn a
minute, suppressed under `prefers-reduced-motion`.

## Stack

Next.js 16 App Router, React 19, Tailwind v4, TypeScript. No paid third-party services.
Deploys on Vercel.

```bash
npm install
npm run dev
```

## Structure

```
src/data/site.ts       the business, one place
src/data/hours.ts      opening hours and closures
src/data/menu.ts       the full case, with availability rules
src/lib/time.ts        America/Detroit, via Intl, no date library
src/lib/availability.ts  the engine
src/lib/board.ts       what the homepage board shows
src/lib/mail.ts        SMTP, and the honest behavior when it is unconfigured
src/app/api/order      the form endpoint, a plain POST with a 303 back
```

## Still to build

- **Phase two.** Build your dozen: pick twelve, choose a pickup window, pay with Stripe
  hosted Checkout. `/order` describes it and takes phone orders for now.
- **Phase three.** Shipping direct instead of through Goldbelly. `/shop` describes it.
- **Phase four.** Photo cookie uploads, standing orders, and a small passcode-protected
  staff page for sold-out toggles and closures.

## Before this goes live

The first list is `glaze/launch.md`'s definition of done, copied in as the handover
artifact it is meant to be. The second is what is specific to this bakery.

### Done, per launch.md

- [x] Zero accessibility violations from `glaze/scripts/audit.mjs` at 390 and 1440 on
      every route. Also run at 320 and 768: zero.
- [x] Zero console errors, zero 4xx, on every route.
- [x] `grep -rn PLACEHOLDER` returns five hits, all of them on the list below.
- [~] Every form actually submitted and confirmed arriving in a real inbox. **The order
      form exists and was submitted end to end with JavaScript disabled**, landing on
      `/order/received?state=logged` with the full payload in the server log. Delivery
      is unconfirmed because SMTP is unset: set `SMTP_*` and `ORDER_TO` in Vercel and
      send one real test. Until then the confirmation page says plainly that nobody has
      been notified and gives the phone number.
- [x] No remote data source to verify. The site holds no live data.
- [x] Every heading, button and body run measured for contrast, not glanced at.
- [x] Checked at 320, 390, 768 and 1440.
- [x] Reduced motion produces a complete page.
- [x] JavaScript off: every nav link works and the menu still renders all 61 items.
      The search and today filter are not rendered at all rather than rendered dead.
- [x] Keyboard: focus visible on every interactive element, skip link first in tab
      order, mobile drawer traps focus and closes on Escape.
- [x] LCP under 2.5s and CLS under 0.1 on a throttled mobile profile. Measured at 390px
      on Slow 4G with a 4x CPU slowdown, median of three runs:
      `/` **2116ms / 0.000**, `/menu` **828ms / 0.018**, `/story` **796ms / 0.000**.
      The homepage has under 400ms of headroom and its LCP element is the hero
      photograph, so anything added to that image spends the margin.
- [ ] Total JavaScript under 150KB compressed. **180KB on `/`, 184KB on `/menu`,
      181KB on `/order`.** Not reachable on this stack: a stock Next 16.3.0 and React
      19.2.8 app containing one `<h1>` and zero client components was built and
      measured at **168KB compressed**, which is already 18KB over the budget before a
      line of site code exists. This site adds 12 to 16KB on top of that floor. The
      budget appears to predate Next 15; worth raising against `launch.md` rather than
      against this repo.
- [x] Every route has its own title and meta description, including the 404.
- [ ] `og:image` absolute on an origin that serves it. Resolves to the deployment via
      `VERCEL_PROJECT_PRODUCTION_URL`, so it is only correct once deployed. **Fetch it
      on the deployed URL and confirm a 200.**
- [x] Canonical points at louies-bakery.com, never a `.vercel.app` host.
- [x] `Bakery` structured data, a `LocalBusiness` subtype, with hours and address.
- [x] `sitemap.xml` and `robots.txt` present, and this host is `noindex`.
- [ ] HTTPS enforced. Vercel's job, confirm after deploy.
- [x] `npm audit`: 0 vulnerabilities.
- [x] No secret in the repo. `.env.example` is the authority: `SMTP_HOST`, `SMTP_PORT`,
      `SMTP_USER`, `SMTP_PASS` and `ORDER_TO` are what the order form needs, and Kevin
      sets them in the Vercel dashboard.
- [x] Studio credit placed, plate ground computed with `plate.mjs`, wording is
      "Double Dipped by" on Kevin's call, diverging from brand.md's "Concept build by"
      for a spec build. **The bakery has not been told it is there.**
- [x] README written.

### Specific to Louie's

- [ ] **Remove the noindex.** Both halves: `src/app/robots.ts` and the `X-Robots-Tag`
      in `next.config.ts`. They exist because this is a spec build serving a real
      business's content from a hostname that is not theirs.
- [ ] Get the **original logo art**. The only file that exists is a 350x144 PNG.
- [ ] Get the **unframed scan of the Louie photograph**. The copy in `public/photos`
      was shot through glass and has reflections across it.
- [ ] **Photograph the bakery.** Half a morning, and the shot list already exists:
      WWMT's gallery for their feature is exactly the set this site needs, frame for
      frame. Nut rolls close up, the carousel oven with Jason, pecan crisps, the cookie
      printer, the morning customer flow, and Louie's Cardinals cap still hanging on his
      original hook, which belongs at the top of the story page. Reference URLs, for the
      shot list only, NOT for use (they are the station's photographs, not the
      bakery's):
      https://wwmt.com/features/exploring-michigan/exploring-michigan-louies-bakery-has-been-serving-marshall-for-nearly-75-years
      The hero is deliberately capped until this happens: every 2026 source says the
      product is the hero, and the only product photography that exists is not ours to
      ship. Jason gave WWMT that interview, so asking the station to license the stills
      is also worth one email.
- [ ] **PLACEHOLDER** in `src/data/hours.ts`: the real closures for the year.
- [ ] **PLACEHOLDER** in `src/data/menu.ts`, and the first one is the whole price list.
      **Get Jason's current Square prices.** The bakery moved to Square and dropped the
      cash discount (Kevin, from the shop). Every figure on this site is the card price
      from their published list, carried across as the single price, which is the
      closest honest guess and still a guess. Then the four smaller ones: whether ice
      cream is still sold (their window says it is, the menu never did), whether
      birthday cakes are really gone, small and large pecan rolls sharing a price, and
      the pastry row that borrowed the donut hole's sixty cents.
- [ ] **Tell the bakery the review quotes are on the homepage.** Three verbatim public
      Tripadvisor reviews in `src/data/reviews.ts`, attributed to handle and platform,
      which is the normal convention but is still their site and their call.
- [ ] Decide what happens about **louiesbakery.com**, the unhyphenated spelling, which
      belongs to a different bakery and ranks for their name.

## Traps, named

- **`/`, `/menu` and `/visit` are `force-dynamic` on purpose.** Their content depends
  on the time in Marshall. glaze.md: route caching and time do not mix, because ISR
  regeneration is request-triggered and a quiet site's cached page ages indefinitely.
  Putting `revalidate` back will serve somebody "open until 3pm" at nine at night.
- **The copyright year is a client component.** `new Date()` in a server component of
  a static page freezes at build time. The four static routes would show last year.
- **There is one price per item, on purpose.** Their published menu prints a card price
  and a cash price on every line. Square is the register now and the discount is gone,
  so a second number would be describing a way of charging that no longer happens. Do
  not reintroduce `cash` on `MenuItem`.
- **`money()` lives in `src/lib/money.ts`, not with the menu data.** `MenuList` is a
  client component, and importing it from `data/menu.ts` pulls all 61 items into the
  browser bundle where the same data already arrives in the server payload.
- **`OpenPill` sets no display utility.** Callers pass `hidden lg:flex`. Adding
  `inline-flex` inside the component silently beat `hidden` and pushed the hamburger
  off the right edge of a 390px screen.
- **Unavailable menu rows must not use `opacity`.** It multiplies through every child
  and took 60 rows below AA. The badge carries the meaning; the row is tinted instead.
- **The order form is a server component posting to a route handler.** No client
  JavaScript is involved on the way in, which is why it works with scripting off. Do
  not "improve" it into a fetch with a spinner without keeping a working no-JS path.
- **When SMTP is unset the form still succeeds and logs the whole payload**, and the
  confirmation page says nobody was notified. Do not replace that with a generic
  thank-you: a stub that says "we got it" while sending nowhere is the specific thing
  glaze.md forbids.
- **`deviceSizes` stops at 1920 on purpose.** Next's default ladder ends at 3840, and a
  1440px screen at 2x rounds the hero's request up to it, so every retina desktop was
  being sold a quarter of a megabyte of upscaled photograph. Put 3840 back only when a
  source exists that can fill it.
- **The landscape hero rule is deliberately outside `@layer`.** In `@layer base`
  Tailwind's utilities beat it and it did nothing.

## Credits

Photographs from Louie's Bakery's own Goldbelly listing, at the full size the listing
holds: the storefront is 2400x1800 there and the site now uses it rather than the 1400px
copy it started with. That listing carries no product photography, which is why the hero
is still the building and not a nut roll. History from the WWMT feature
"Louie's Bakery has been serving Marshall for nearly 75 years", the Choose Marshall
directory, and the bakery's own copy.

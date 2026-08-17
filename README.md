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
```

## Still to build

- **Phase two.** Build your dozen: pick twelve, choose a pickup window, pay with Stripe
  hosted Checkout. `/order` describes it and takes phone orders for now.
- **Phase three.** Shipping direct instead of through Goldbelly. `/shop` describes it.
- **Phase four.** Photo cookie uploads, standing orders, and a small passcode-protected
  staff page for sold-out toggles and closures.

## Before this goes live

- [ ] **Remove the noindex.** Both halves: the rule in `src/app/robots.ts` and the
      `X-Robots-Tag` header in `next.config.ts`. They exist because this is a spec build
      serving a real business's content from a hostname that is not theirs.
- [ ] Get the **original logo art**. The only file that exists is a 350x144 PNG. Somebody
      has the real one from a shirt order or a sign shop.
- [ ] Get the **unframed scan of the Louie photograph**. The copy in `public/photos` was
      shot through glass and has reflections across it.
- [ ] **Photograph the bakery.** Half a morning: the case at open, the oven turning,
      hands icing nut rolls, the peanut roaster, the line outside in the dark, Jason.
      Two photographs cannot carry this site.
- [ ] Fill in **real closures** for the year in `src/data/hours.ts`.
- [ ] Settle the four **NEEDS CONFIRMATION** items at the foot of `src/data/menu.ts`:
      the pastry cash price, whether ice cream is still sold, whether birthday cakes are
      really gone, and the identical small and large pecan roll prices.
- [ ] Confirm the **studio credit** in the footer with the bakery. It is one element to
      delete if they would rather not have it.
- [ ] Decide what happens about **louiesbakery.com**, the unhyphenated spelling, which
      belongs to a different bakery and ranks for their name.

## Credits

Photographs from Louie's Bakery's own Goldbelly listing. History from the WWMT feature
"Louie's Bakery has been serving Marshall for nearly 75 years", the Choose Marshall
directory, and the bakery's own copy.

# Louie's Bakery: Research Brief

Prepared for Glazed Web. Research only, no build work yet.
Date: August 11, 2026. Target: louies-bakery.com, Marshall MI.

---

## 1. The business

**Louie's Bakery**, 144 W. Michigan Ave, Marshall MI 49068. (269) 781-3542.
Open Tuesday to Saturday, 5:30am to 3:00pm. Closed Sunday and Monday.

Founded November 1952 by **Louis "Louie" Bagi**, who bought an existing bakery and put his name on it. Louie worked into his late eighties and died in 2002. It is now on its **third generation**: Jason LaForge, Louie's grandson, runs it as Executive Baker alongside Louie's children (Ken, Dave, Don, John, Lorraine, Delores).

Things worth building a site around:

- They make **about 1,000 nut rolls a day**. The nut roll is the signature: a cinnamon fried pastry, iced, topped with peanuts they roast in house.
- The **pecan crisp** is an original 1952 recipe, still in the case.
- They bake on a **carousel oven with six revolving shelves**, running multiple shifts of bakers overnight.
- They open at 5:30am and there is frequently a line waiting at the door.
- Goldbelly calls them a **repeat winner of Best Bakery in Michigan**.
- Marshall is a tourism town (historic downtown, National Historic Landmark district), so a real share of traffic is visitors deciding where to go, not just locals.

**Reputation is strong.** TripAdvisor 4.4 across 99 reviews, ranked #3 of 34 restaurants in Marshall and #1 bakery. Restaurantji 4.3 across 212. Yelp has 66 reviews. Their own site claims **772 reviews on Facebook**.

What customers praise: nut rolls (constantly), donuts and Bismarcks, pecan and caramel rolls, the old school feel, the family.
What they complain about: prices creeping up, occasional staff curtness, limited hours, selling out. One recurring theme is worth knowing: a few longtime regulars feel the place has drifted from how Louie ran it, citing outside sourcing, birthday cakes being dropped, and **mail order being prioritized over the local counter**. That is a positioning nerve to be careful with.

---

## 2. Current site audit

Platform: **Mopro**, a template website vendor. Footer reads **"Louie's Bakery © 2019."**

### Pages

| URL | State |
|---|---|
| `/` | Home. Hours, a short 1952 blurb, announcement banners. |
| `/menu` | Full price list. Long wall of text. |
| `/store` | Online ordering. UPS, ships Tuesdays. |
| `/shopping-cart` | Cart. |
| `/testimonials` | **Empty.** Just a link out to Facebook. |
| `/about` | Product description, not a story. Not linked in the nav. |
| `/team` | **Live with lorem ipsum and invented staff names.** Not linked in the nav. |
| `/contact` | Linked from the footer only. |

### Problems, roughly in order of how bad they are

1. **The `/team` page is publicly live with placeholder content.** Three fake people ("Bobby Rangler," "Lindsey Mckevin," "Sarah Rangler") with lorem ipsum bios. On a business whose entire story is a real family in its third generation, this is the worst thing on the site.
2. **The homepage still says they are closed.** The banner reads "We are CLOSED" and "we are on vacation july4-july20. we RESUME NORMAL BUSINESS HOURS JULY 21." It is August 11. A stale closure notice on the homepage actively costs them walk-in business.
3. **Copyright says 2019.** Everything about the site signals abandoned.
4. **The testimonials page has no testimonials.** A page whose only job is social proof, sending people off-site to find it.
5. **Menu pricing is confusing and has errors.** Every line carries two prices, "reg $1.89 cash discount $1.80," which means they run a card surcharge that is never explained anywhere. And the copy has real mistakes: the Pastries line reads "$2.10 cash discount $0.60," which is a stray value from the donut holes row above it.
6. **The menu is unshoppable.** It is a flat text price list, roughly 100 items, no photos, no sections you can jump to, no way to see what is actually available today.
7. **Availability rules are buried in parentheses.** Lemon jelly on Saturday. Chocolate drops Wednesday only. Cream horns Wednesdays or by order. Eclairs and Buzz Bombs fall through early spring. Pumpkin and egg custard pies fall and winter. Pecan pie fall and winter. This is genuinely useful information and it is hidden inside a wall of text.
8. **Two competing ordering paths.** Their own cart and a Goldbelly storefront, with no explanation of which to use or why. Goldbelly also takes a cut.
9. **Photo cookies are invisible.** Custom logo or photo printed on a cookie, no extra charge, two days notice. That is a differentiated, high-margin, corporate-and-party product sitting as one line of text in a price list.
10. **Merch is listed but not obviously sellable online.** T-shirts, mugs, rocks glasses, insulated mugs, canteens.
11. **The domain is a liability.** `louies-bakery.com` with a hyphen. `louiesbakery.com` is a **different bakery** and it ranks. Anyone typing the obvious spelling lands on a competitor.
12. **Facebook is doing the real work.** The site itself says "WE UPDATE FACEBOOK WITH NEW PRODUCTS, AND HOLIDAY SPECIALS." The website is a brochure nobody maintains, because Mopro makes updating a chore.

### What the current site does have that we should keep

- Real prices, publicly posted. Rare and good.
- A shipping business that already works, with UPS on Tuesdays.
- Honest, plain hours.
- A short, decent 1952 origin paragraph on the homepage to build from.

---

## 3. Product and price snapshot

Captured from the live menu page, August 2026. Every item lists a regular price and a lower cash price.

- **Donuts and rolls**, $1.89 / $1.80 cash. Nut roll, caramel roll, fried cakes (plain, chocolate, cinnamon, powder, glazed), apple fritter, fried cinnamon roll, twists, jelly rolls (strawberry, raspberry, blueberry, custard, lemon Saturdays), long johns (plain, custard, cream, cream glazed), butterfly, baked cinnamon, yeast raised.
- **Donut holes**, $0.63 / $0.60. Chocolate $0.79 / $0.75.
- **Pastries and danish**, small and large pecan rolls, pecan crisp.
- **Specials**, cream horn $2.89, eclair and Buzz Bomb $3.94, bacon donut $2.63, Nutella rolls.
- **Cookies**, regular $1.31, cutouts $1.58, photo cookies $3.68, macaroons $2.10.
- **Pies**, $21.00. Fruit, cream (meringue or "LouWhip"), pecan $23.10, pecan tart $2.89.
- **Breads, buns, dinner rolls**, $0.79 to $5.25. Hobo bread, Vienna, cream nut bread, English muffin, corn bread.
- **Cupcakes, squares, brownies**, $1.58 to $4.20. Including limoncello cupcakes.
- **Old pan toffee**, $4.74 small, $10.50 large.
- **Starbucks coffee and Pepsi fountain.**
- **Merch**, tees $21.00 to $26.25, drinkware $12.60.

Note the "LouWhip" name. That is house language worth using, not sanding off.

---

## 4. Where the rebuild opportunity is

Ranked by likely impact on their actual revenue.

**a. Make the nut roll the hero.** A thousand a day, the thing every review names, the reason people drive to Marshall. It currently appears as one line in a price list. The homepage should be the nut roll.

**b. Answer "what's in the case today."** Their whole rotation is day and season dependent, and their audience currently has to go to Facebook to find out. A single status component (the same pattern as Copper AC's `LiveStatus` and Cookin' with Beans' `TruckStatus`) that says open or closed, today's hours, and today's specials, editable in one file, kills the stale-vacation-banner problem permanently.

**c. Pre-order and call-ahead.** They sell out and there is a line at 5:30am. Dozen boxes, party trays, holiday orders, photo cookies with the two-day lead time. This is the highest-value feature and it does not exist today.

**d. Own the shipping.** They already ship UPS. Goldbelly takes a margin and owns the customer. A proper ship-a-dozen-nut-rolls page on their own site, Stripe Checkout, no third-party subscription, is squarely the Glazed Web play. Keep Goldbelly as a secondary channel rather than killing it.

**e. Tell the actual story.** Three generations, an oven with six revolving shelves, a 1952 pecan crisp recipe, Louie working into his eighties. Replace the lorem ipsum team page with the real family. This is the single cheapest credibility win on the site.

**f. Explain the cash discount.** One honest sentence beats a hundred confusing double prices.

**g. Sell the merch.** Shirts and mugs are pure margin for a brand with 70 years of local affection behind it.

**h. Local SEO and structured data.** Bakery schema, real hours markup, a Marshall-visitor-facing angle, proper metadata. The current site has none of the basics, and the hyphen domain is bleeding traffic to a bakery in another state.

**Careful with:** any framing that reads as mail order over the local counter. Some regulars already feel that way. The shipping business should look like a bonus, not a pivot.

---

## 5. How this fits the Glazed Web way of working

Same play as Super Duper, Copper AC, Cascarelli's, and Cookin' with Beans: **keep their brand, fix the execution.** Louie's has 74 years of equity and a genuinely good name. Nothing about the brand needs changing. The website is what is broken.

House stack from the existing repos: Next.js (App Router) + React 19 + Tailwind v4 + TypeScript, Stripe Checkout for anything sold, Resend for form email through the verified glazedweb.com sender, deployed on Vercel from a GitHub repo, no paid third-party services baked in. Content lives in typed data files (`data/site.ts`, `data/menu.ts`, `data/shop.ts`) so the client's facts are in one place. `GlazedCredit` in the footer with the real donut mark. Given the client, the line should be **"Double Dipped by Glazed Web."** A bakery is exactly the room that pun was written for.

The repo `hershock48/louies` exists and is currently empty, ready to go.

---

## 6. Open questions before scoping

1. Is Louie's an actual prospect yet, or is this a spec build like Cascarelli's?
2. Do we have permission for their photos and logo?
3. Do they want to keep Goldbelly, or move shipping in house?
4. Who at the bakery would update the daily status, and how comfortable are they with it?
5. Is the hyphen domain negotiable, and is `louiesbakery.com` genuinely taken by the other bakery long term?
6. Do they still do cakes and birthday cakes, or has that really been dropped?
7. What POS do they run, if anything, for tying pre-orders in?

---

## Sources

- [Home, Louie's Bakery](https://www.louies-bakery.com/)
- [Menu](https://www.louies-bakery.com/menu)
- [Store](https://www.louies-bakery.com/store)
- [About](https://www.louies-bakery.com/about)
- [Team](https://www.louies-bakery.com/team)
- [Testimonials](https://www.louies-bakery.com/testimonials)
- [Exploring Michigan: Louie's Bakery has been serving Marshall for nearly 75 years, WWMT](https://wwmt.com/features/exploring-michigan/exploring-michigan-louies-bakery-has-been-serving-marshall-for-nearly-75-years)
- [Louie's Bakery, Choose Marshall](https://choosemarshall.com/directory/louies-bakery/)
- [Louie's Bakery, Tripadvisor](https://www.tripadvisor.com/Restaurant_Review-g42442-d3265967-Reviews-Louie_s_Bakery-Marshall_Calhoun_County_Michigan.html)
- [Louie's Bakery, Restaurantji](https://www.restaurantji.com/mi/marshall/louies-bakery-/)
- [Louie's Bakery, Goldbelly](https://www.goldbelly.com/restaurants/louies-bakery)
- [Louie's Bakery, Yelp](https://www.yelp.com/biz/louies-bakery-marshall)

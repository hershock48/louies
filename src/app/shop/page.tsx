import type { Metadata } from "next";
import { PageHero, SectionHeading, ButtonLink, PhaseNote } from "@/components/Ui";
import ShipForm from "@/components/ShipForm";
import CallHint from "@/components/CallHint";
import { site } from "@/data/site";
import { boxes, shippedReviews } from "@/data/shipping";
import { money } from "@/lib/money";

export const metadata: Metadata = {
  title: "Ship a Box",
  description:
    "Nut rolls, old pan toffee and pecan crisps, boxed in Marshall and sent anywhere. Baked Monday night, on the truck Tuesday.",
};

/**
 * PHASE THREE LIVES HERE.
 *
 * A note on tone, which matters more on this page than anywhere else on the site.
 * Several longtime customers have said in reviews that the bakery feels like it puts
 * mail order ahead of the counter. Whether or not that is fair, the website should not
 * confirm it. So shipping is framed here as something for people who left Marshall
 * rather than as the main event, and the homepage leads with the shop, not the truck.
 */
export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ box?: string; error?: string }>;
}) {
  const { box, error } = await searchParams;
  const selected = boxes.find((b) => b.name === box)?.name;

  return (
    <>
      <PageHero
        eyebrow="For everyone who moved away"
        title="A box of Marshall, sent wherever you ended up."
        intro={`Baked Monday night, on the ${site.shipping.carrier} truck ${site.shipping.day} morning, on a porch by the middle of the week.`}
      />

      <section className="grain relative isolate bg-paper">
        <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <SectionHeading eyebrow="What travels well">
            Some things ship better than others, and we will tell you which.
          </SectionHeading>

          {/*
            THE FIVE BOXES THEY ACTUALLY SELL, from their own Goldbelly listing.

            The price shown is the marketplace price, labeled as one, because it is the
            only price that exists today and pretending otherwise would leave a customer
            guessing. What it is NOT is the price this page will charge when the bakery
            sells direct: see the note under the grid and the long comment in
            src/data/shipping.ts.
          */}
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {boxes.map((b) => (
              <li
                key={b.name}
                className="flex flex-col rounded-panel border border-awning/12 bg-paper-dim p-6"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-xl font-bold text-awning">{b.name}</h3>
                  <span className="flex-none text-xs font-bold uppercase tracking-wider text-brick">
                    {b.size}
                  </span>
                </div>

                <p className="mt-2 text-awning/75">{b.body}</p>

                <p className="mt-4 border-t border-awning/12 pt-4 text-sm leading-relaxed text-awning/70">
                  <span className="font-semibold text-awning">How it travels.</span>{" "}
                  {b.travels}
                </p>

                <div className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  {b.price !== undefined ? (
                    <p className="text-sm font-semibold tabular-nums text-brick">
                      {money(b.price)} shipped
                    </p>
                  ) : (
                    b.marketplacePrice !== undefined && (
                      <p className="text-sm tabular-nums text-awning/75">
                        <span className="font-semibold text-brick">
                          {money(b.marketplacePrice)}
                        </span>{" "}
                        shipped, through our Goldbelly listing
                      </p>
                    )
                  )}
                  {b.comingSoon && (
                    <span className="rounded-full border border-brick/30 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-brick">
                      Back in the fall
                    </span>
                  )}
                </div>

                {/* Straight to the form with this box already chosen. A plain link, so
                    it works with scripting off and can be opened in a new tab. */}
                <div className="mt-5">
                  <ButtonLink
                    href={`/shop?box=${encodeURIComponent(b.name)}#ship`}
                    variant="dark"
                    prefetch={false}
                  >
                    Send this one
                  </ButtonLink>
                </div>
              </li>
            ))}
          </ul>

          {/*
            Said out loud rather than papered over, and the client reads this page too.
            A shipped price is a real decision the bakery has to make, not a number a
            web studio picks for them.
          */}
          <p className="mt-8 max-w-3xl text-sm leading-relaxed text-awning/70">
            Those are marketplace prices, with the freight and the marketplace&rsquo;s
            share both inside them. Ordering straight from this page is next on the list,
            and what a box costs here is ours to set against a real{" "}
            {site.shipping.carrier} rate.
          </p>

          {/* Two verbatim verified-purchase reviews. A shipping page needs a review
              about shipping, and nothing we could write beats "not one cookie broke". */}
          <ul className="mt-10 grid gap-6 border-t border-awning/12 pt-10 md:grid-cols-2">
            {shippedReviews.map((r) => (
              <li key={r.quote}>
                <blockquote className="font-display text-lg font-bold leading-snug text-awning">
                  &ldquo;{r.quote}&rdquo;
                </blockquote>
                <p className="mt-2 text-sm text-awning/65">
                  {r.who}, {r.where}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <PhaseNote
              heading="Three ways to get a box out the door"
              cta={
                <>
                  <ButtonLink href={site.phoneHref} variant="dark">
                    Call {site.phone}
                  </ButtonLink>
                  <ButtonLink href={site.social.goldbelly} variant="dark" external>
                    Or order on Goldbelly
                  </ButtonLink>
                </>
              }
              footnote={<CallHint />}
            >
              <p>
                The form on this page, the telephone, or our Goldbelly listing. Paying by
                card on this page, without the call, is the next piece of work.
              </p>
            </PhaseNote>

            <div className="rounded-panel border border-awning/15 bg-awning p-6 text-paper sm:p-8">
              <h2 className="font-display text-xl font-bold">Why Tuesday</h2>
              <p className="mt-3 text-paper/80">
                Because the box is packed the morning after it is baked, not pulled off a
                shelf. One shipping day a week is what keeps a nut roll worth sending at
                all.
              </p>
              <p className="mt-3 text-paper/80">
                Order by Monday and yours goes out the next morning. Order Tuesday afternoon
                and it waits for the following week, which is worth knowing before a
                birthday.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/*
        THE PART THAT WAS MISSING. The page argued for selling boxes from their own site
        and then handed the visitor to a marketplace, which is the behaviour the proposal
        criticises. Now a box can be ordered here.
      */}
      <section className="grain relative isolate bg-paper-dim">
        <div className="relative mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
          <ShipForm selected={selected} error={error === "missing"} />
        </div>
      </section>
    </>
  );
}

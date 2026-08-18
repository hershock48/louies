import type { Metadata } from "next";
import { PageHero, SectionHeading, ButtonLink, PhaseNote } from "@/components/Ui";
import CallHint from "@/components/CallHint";
import { site } from "@/data/site";
import { boxes } from "@/data/shipping";
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
export default function ShopPage() {
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
            The box grid. Contents and price render the moment src/data/shipping.ts has
            them; until then each card carries what the thing is and how it survives a
            truck, which is the part of a shipping page people actually read.
          */}
          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {boxes.map((b) => (
              <li
                key={b.name}
                className="flex flex-col rounded-panel border border-awning/12 bg-paper-dim p-6"
              >
                <h3 className="font-display text-xl font-bold text-awning">{b.name}</h3>
                <p className="mt-2 text-awning/75">{b.body}</p>

                {b.contents && b.contents.length > 0 && (
                  <ul className="mt-4 space-y-1 text-sm text-awning/75">
                    {b.contents.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                )}

                <p className="mt-4 border-t border-awning/12 pt-4 text-sm leading-relaxed text-awning/70">
                  <span className="font-semibold text-awning">How it travels.</span>{" "}
                  {b.travels}
                </p>

                {b.price !== undefined && (
                  <p className="mt-4 text-sm font-semibold tabular-nums text-brick">
                    {money(b.price)} plus shipping
                  </p>
                )}
              </li>
            ))}
          </ul>

          {/*
            Said out loud rather than papered over. The client reads this page too, and
            "we did not have your numbers so we left them out" is a better sentence than
            a made-up price sitting under a photograph of their own baking.
          */}
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-awning/70">
            Prices are set with the bakery against a real {site.shipping.carrier} rate,
            so none are shown here yet. A shipped price is not a counter price with
            postage added, and it is not a marketplace price either.
          </p>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <PhaseNote
              heading="Shipping direct is on the way"
              cta={
                <>
                  <ButtonLink href={site.social.goldbelly} variant="dark" external>
                    Order on Goldbelly
                  </ButtonLink>
                  <ButtonLink href={site.phoneHref} variant="dark">
                    Call {site.phone}
                  </ButtonLink>
                </>
              }
              footnote={<CallHint />}
            >
              <p>
                Boxes can go out today, either by calling the shop or through our Goldbelly
                listing. Ordering straight from this page is next on the list.
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
    </>
  );
}

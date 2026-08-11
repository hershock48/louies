import type { Metadata } from "next";
import { PageHero, SectionHeading, ButtonLink, PhaseNote } from "@/components/Ui";
import CallHint from "@/components/CallHint";
import { site } from "@/data/site";

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
  const travellers = [
    {
      name: "Old Pan Toffee",
      body: "The best traveller they make. Broken by hand, keeps for weeks, and arrives exactly as it left.",
    },
    {
      name: "Pecan Crisps",
      body: "The 1952 recipe. Sturdy enough for a box and unlike anything you can buy where you live.",
    },
    {
      name: "Nut Rolls",
      body: "The reason most people click. Baked Monday night and on a truck by Tuesday morning so they arrive as close to fresh as a nut roll can.",
    },
  ];

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
            Some things ship better than others, and they will tell you which.
          </SectionHeading>

          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {travellers.map((t) => (
              <li key={t.name} className="rounded-panel border border-awning/12 bg-paper-dim p-6">
                <h3 className="font-display text-xl font-bold text-awning">{t.name}</h3>
                <p className="mt-2 text-awning/75">{t.body}</p>
              </li>
            ))}
          </ul>

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
                Boxes can be sent today either by calling the shop or through their
                Goldbelly listing. Ordering straight from this page is next on the list.
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

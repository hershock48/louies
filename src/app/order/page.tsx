import type { Metadata } from "next";
import { PageHero, SectionHeading, ButtonLink, PhaseNote } from "@/components/Ui";
import CallHint from "@/components/CallHint";
import CarouselOven from "@/components/CarouselOven";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Order for Pickup",
  description:
    "Build a dozen from the case, pick a time, and it will be boxed and waiting. Pies and photo cookies need a couple of days notice.",
};

/**
 * PHASE TWO LIVES HERE.
 *
 * Checkout is not wired yet, so this page does the honest version: it explains exactly
 * how ordering works today, by telephone, and it shows what the builder will do. It is
 * deliberately not a "coming soon" splash. A customer who lands here still leaves
 * knowing how to get a dozen nut rolls on Saturday morning.
 */
export default function OrderPage() {
  const steps = [
    {
      n: "1",
      title: "Fill the box",
      body: "Twelve from the case, in any combination. Only what is actually being made that day can go in, so nobody orders cream horns on a Thursday.",
    },
    {
      n: "2",
      title: "Pick a time",
      body: "Any opening hour on the day you choose. Early is better. The case thins out fast after eight.",
    },
    {
      n: "3",
      title: "Pay and collect",
      body: "Pay when you order, walk in, say your name, and it will be boxed and on the counter.",
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="Order ahead"
        title="Build a dozen and skip the line."
        intro="They bake one round a night and the case empties in the order people arrive. Ordering ahead means yours is set aside before the door opens."
      />

      <section className="grain relative isolate bg-paper">
        <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="grid gap-12 md:grid-cols-[1.1fr_0.9fr]">
            <div>
              <SectionHeading eyebrow="How it works">Three steps, about a minute.</SectionHeading>

              <ol className="mt-8 space-y-6">
                {steps.map((s) => (
                  <li key={s.n} className="flex gap-5">
                    <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-awning font-display text-lg font-bold text-paper">
                      {s.n}
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-bold text-awning">{s.title}</h3>
                      <p className="mt-1 text-awning/75">{s.body}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-10">
                <PhaseNote
                  heading="Ordering online is on the way"
                  cta={
                    <>
                      <ButtonLink href={site.phoneHref} variant="dark">
                        Call {site.phone}
                      </ButtonLink>
                      <ButtonLink href="/menu" variant="dark">
                        See the case
                      </ButtonLink>
                    </>
                  }
                  footnote={<CallHint />}
                >
                  <p>
                    Until the box builder goes live, the fastest way to reserve a dozen, a
                    pie or a party tray is a phone call to the shop. Ring during opening
                    hours and someone will write it down.
                  </p>
                </PhaseNote>
              </div>
            </div>

            <aside className="rounded-panel border border-awning/15 bg-paper-dim p-6 sm:p-8">
              <CarouselOven className="h-12 w-12 text-brick/50" spin={false} />
              <h2 className="mt-5 font-display text-xl font-bold text-awning">
                Things worth ordering ahead
              </h2>
              <ul className="mt-4 space-y-4 text-awning/80">
                <li>
                  <strong className="font-semibold text-awning">Pies.</strong> Especially in
                  November and December, when the whole town wants one on the same Thursday.
                </li>
                <li>
                  <strong className="font-semibold text-awning">Photo cookies.</strong> Two
                  days notice, any picture, no extra charge.
                </li>
                <li>
                  <strong className="font-semibold text-awning">Cream horns.</strong> Made
                  Wednesdays, or any day if you ask nicely and give them warning.
                </li>
                <li>
                  <strong className="font-semibold text-awning">Party trays and buns.</strong>{" "}
                  Party size hamburg buns come by the dozen and go quickly in the summer.
                </li>
              </ul>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}

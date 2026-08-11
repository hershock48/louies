import type { Metadata } from "next";
import { PageHero, SectionHeading, ButtonLink, PhaseNote } from "@/components/Ui";
import CallHint from "@/components/CallHint";
import { money } from "@/data/menu";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Photo Cookies",
  description:
    "Any photo or logo printed on a cookie, at no extra charge, with two days notice. Louie's Bakery, Marshall, Michigan.",
};

/**
 * The most commercially interesting product Louie's makes, and on the old site it was
 * one line inside a hundred-line price list: "PHOTO COOKIES $3.68 cash discount $3.50,
 * custom logos or photos at no additional cost, 2-day advance notice required".
 *
 * No new equipment, no new skill, and it reaches customers a bakery does not normally
 * get: offices, weddings, showers, teams, real estate closings. It earns a page.
 */
export default function CookiesPage() {
  const uses = [
    { title: "Offices and openings", body: "A logo on three dozen cookies, ready the morning of." },
    { title: "Showers and birthdays", body: "The photograph everybody groans at, edible." },
    { title: "Teams and clubs", body: "A crest, a mascot, or the whole squad." },
    { title: "Closings and thank yous", body: "A picture of the house, handed over with the keys." },
  ];

  return (
    <>
      <PageHero
        eyebrow="No extra charge"
        title="Any picture you like, printed on a cookie."
        intro={`${money(350)} each with cash, the same as any other decorated cookie. Give them two days and they will put almost anything on it.`}
      />

      <section className="grain relative isolate bg-paper">
        <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="grid gap-12 md:grid-cols-[1fr_1fr]">
            <div>
              <SectionHeading eyebrow="What people order">
                Mostly for the day something matters.
              </SectionHeading>
              <ul className="mt-8 grid gap-4 sm:grid-cols-2">
                {uses.map((u) => (
                  <li key={u.title} className="rounded-panel border border-awning/12 bg-paper-dim p-5">
                    <h3 className="font-display text-lg font-bold text-awning">{u.title}</h3>
                    <p className="mt-1 text-sm text-awning/75">{u.body}</p>
                  </li>
                ))}
              </ul>

              <h2 className="mt-12 font-display text-xl font-bold text-awning">
                What makes a good one
              </h2>
              <ul className="mt-4 space-y-2 text-awning/80">
                <li>A clear photograph, taken close, in decent light.</li>
                <li>Logos come out best as a single flat colour on white.</li>
                <li>Two days notice, minimum. More at Christmas and graduation.</li>
                <li>Order in dozens. They box neatly and travel across town well.</li>
              </ul>
            </div>

            <aside>
              <PhaseNote
                heading="Uploading here is on the way"
                cta={
                  <ButtonLink href={site.phoneHref} variant="dark">
                    Call {site.phone}
                  </ButtonLink>
                }
                footnote={<CallHint />}
              >
                <p>
                  For now, ring the shop and they will tell you how to get the picture to
                  them and when it can be ready.
                </p>
                <p>
                  Sending the image straight from this page, with the two day lead time
                  handled automatically, is part of the next round of work.
                </p>
              </PhaseNote>

              <div className="mt-8 rounded-panel border border-awning/15 bg-awning p-6 text-paper sm:p-8">
                <h2 className="font-display text-xl font-bold">The price</h2>
                <p className="mt-3 text-3xl font-extrabold tabular-nums text-wheat">
                  {money(368)}{" "}
                  <span className="text-base font-semibold text-paper/70">card</span>
                </p>
                <p className="mt-1 text-3xl font-extrabold tabular-nums text-wheat">
                  {money(350)}{" "}
                  <span className="text-base font-semibold text-paper/70">cash</span>
                </p>
                <p className="mt-4 text-sm text-paper/75">
                  Per cookie, whatever the picture. The printing genuinely does not cost
                  extra, which surprises most people who ask.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}

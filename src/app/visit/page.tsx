import type { Metadata } from "next";
import { PageHero, SectionHeading, ButtonLink } from "@/components/Ui";
import TodayBoard from "@/components/TodayBoard";
import { site, fullAddress, mapsUrl, mapsEmbedUrl } from "@/data/site";
import { week, formatMinutes } from "@/data/hours";
import { localNow } from "@/lib/time";

export const revalidate = 900;

export const metadata: Metadata = {
  title: "Visit",
  description:
    "Louie's Bakery is at 144 W. Michigan Ave in Marshall, Michigan. Open Tuesday to Saturday, 5:30am to 3pm. Closed Sunday and Monday.",
};

export default function VisitPage() {
  const now = localNow();

  return (
    <>
      <PageHero
        eyebrow="Find them"
        title="144 W. Michigan Ave, Marshall."
        intro="Downtown, on the north side of the street, under the brown awning. If there is a line on the sidewalk before six in the morning, you are in the right place."
      />

      <TodayBoard compact />

      <section className="grain relative isolate bg-paper">
        <div className="relative mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 sm:py-24 md:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Hours">Tuesday through Saturday.</SectionHeading>
            <dl className="mt-6 divide-y divide-awning/10 border-y border-awning/10">
              {week.map((d) => {
                const today = d.day === now.day;
                return (
                  <div
                    key={d.day}
                    className={`flex items-baseline justify-between gap-4 py-3 ${
                      today ? "font-semibold text-awning" : "text-awning/75"
                    }`}
                  >
                    <dt>
                      {d.label}
                      {today && (
                        <span className="ml-2 rounded-full bg-gold/25 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-brick">
                          Today
                        </span>
                      )}
                    </dt>
                    <dd className="tabular-nums">
                      {d.open === null || d.close === null
                        ? "Closed"
                        : `${formatMinutes(d.open)} to ${formatMinutes(d.close)}`}
                    </dd>
                  </div>
                );
              })}
            </dl>

            <p className="mt-6 text-awning/75">
              They bake one round. When something is gone it is gone until tomorrow, so the
              earlier you come the better the case looks.
            </p>

            <div className="mt-10">
              <SectionHeading eyebrow="Contact">Call the shop.</SectionHeading>
              <p className="mt-4 text-awning/80">
                For a pie, a party order, or to ask whether the cream horns are out, the
                fastest answer is a phone call.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink href={site.phoneHref} variant="dark">
                  {site.phone}
                </ButtonLink>
                <ButtonLink href={site.social.facebook} variant="dark" external>
                  Facebook
                </ButtonLink>
              </div>
            </div>
          </div>

          <div>
            <div className="overflow-hidden rounded-panel border border-awning/15">
              <iframe
                title={`Map to ${site.name}`}
                src={mapsEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-80 w-full sm:h-[26rem]"
              />
            </div>
            <address className="mt-6 not-italic text-lg leading-relaxed text-awning/85">
              {site.address.street}
              <br />
              {site.address.city}, {site.address.state} {site.address.zip}
            </address>
            <div className="mt-4">
              <ButtonLink href={mapsUrl} variant="dark" external>
                Directions
              </ButtonLink>
            </div>
            <p className="mt-6 text-sm leading-relaxed text-awning/70">
              Free parking on Michigan Avenue and in the lot behind the block. Marshall&rsquo;s
              historic downtown is worth the walk once you have your bag.
            </p>
            <p className="sr-only">{fullAddress}</p>
          </div>
        </div>
      </section>
    </>
  );
}

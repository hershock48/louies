import type { Metadata } from "next";
import Image from "next/image";
import CarouselOven from "@/components/CarouselOven";
import { ButtonLink, Eyebrow, PageHero } from "@/components/Ui";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Louis Bagi opened Louie's Bakery in November 1952. Three generations later, his grandson still runs the same recipes on the same corner of Michigan Avenue.",
};

/**
 * This page replaces two on the old site: an About page that was a paragraph about
 * donuts rather than a story, and a Team page that was live for years with lorem ipsum
 * and three invented employees. On a business whose whole identity is a real family in
 * its third generation, that was the single most damaging thing on the site.
 *
 * Every fact below is from the WWMT feature, the Choose Marshall listing, or their own
 * copy. Nothing here is embroidered.
 */
export default function StoryPage() {
  return (
    <>
      <PageHero
        eyebrow={`Since ${site.established}`}
        title="A bakery, a family, and one very large oven."
      />

      <article className="grain relative isolate bg-paper">
        <div className="relative mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="space-y-6 font-serif text-lg leading-relaxed text-awning/85">
            <p className="font-display text-xl font-semibold text-awning">
              In November of {site.established}, Louis Bagi bought a bakery on West Michigan
              Avenue and put his own name over the door.
            </p>
            <p>
              He kept it there for fifty years. Louie worked in this building into his late
              eighties and died in 2002, by which point his children were running it, and by
              now his grandson is. {site.people.baker} is the {site.people.bakerRole} and the
              third generation of the family to do this job on this corner.
            </p>
            <p>
              What has not changed is the part customers can taste. The recipes are the ones
              Louie wrote down. The pecan crisp has been made the same way since the year he
              opened. The nut roll, which is the thing most people come for, is still a
              cinnamon roll that gets fried, iced and covered in peanuts roasted in the back.
              They make about a thousand of them a day and are regularly out before lunch.
            </p>
          </div>

          <figure className="my-12">
            <Image
              src="/photos/louie-hot-cross-buns.jpg"
              alt="Louis Bagi standing behind the counter with trays of hot cross buns"
              width={1200}
              height={1539}
              sizes="(min-width: 768px) 700px, 90vw"
              className="w-full rounded-panel border border-awning/15"
            />
            <figcaption className="mt-3 text-sm text-awning/60">
              Louie with a morning&rsquo;s worth of hot cross buns.
            </figcaption>
          </figure>

          <div className="space-y-6 font-serif text-lg leading-relaxed text-awning/85">
            <p>
              The work starts in the middle of the night. Bakers come in on shifts and load a
              carousel oven with six revolving shelves, a machine most customers have never
              seen and would probably stand and watch if they could. By the time the door
              opens at half past five there is usually a line on the sidewalk.
            </p>
            <p>
              None of this is complicated. It is simply a family that has got up in the dark
              for seventy four years to put fried cakes in a case by breakfast, in a town
              that would notice immediately if they stopped.
            </p>
          </div>

          <blockquote className="mt-12 border-l-2 border-gold pl-6">
            <p className="font-display text-2xl font-bold leading-snug text-awning">
              &ldquo;We just hope people come down and bring their kids so we can get the next
              generation enjoying our product.&rdquo;
            </p>
            <footer className="mt-3 text-sm text-awning/60">
              {site.people.baker}, {site.people.bakerRole}
            </footer>
          </blockquote>
        </div>
      </article>

      {/* The oven, given its own moment. */}
      <section className="grain grain-dark relative isolate overflow-hidden bg-night text-paper">
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 sm:px-8 sm:py-24 md:grid-cols-[1fr_auto]">
          <div>
            <Eyebrow>The oven</Eyebrow>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Six shelves, turning all night.
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-paper/80">
              A carousel oven works like a Ferris wheel. Shelves come round in turn, the
              baker loads and pulls as they pass, and nothing sits in a hot spot. It is how
              this bakery has always turned out a whole morning&rsquo;s worth of bread and rolls
              before the town is awake.
            </p>
            <div className="mt-8">
              <ButtonLink href="/visit" variant="ghost">
                Come and see the case
              </ButtonLink>
            </div>
          </div>
          <CarouselOven className="mx-auto h-52 w-52 text-gold/70 sm:h-64 sm:w-64" />
        </div>
      </section>
    </>
  );
}

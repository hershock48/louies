import Image from "next/image";
import TodayBoard from "@/components/TodayBoard";
import CarouselOven from "@/components/CarouselOven";
import { ButtonLink, Eyebrow, SectionHeading } from "@/components/Ui";
import Wordmark from "@/components/Wordmark";
import { signatures, money } from "@/data/menu";
import { reviews } from "@/data/reviews";
import { site } from "@/data/site";

/*
  RENDERED PER REQUEST, NOT CACHED.

  This page's content depends on what time it is in Marshall: whether the door is
  open, what is in the case today, what comes back tomorrow. glaze.md names this
  exact trap. ISR regeneration is request-triggered, so `revalidate = 900` does not
  mean "at most fifteen minutes old", it means "at most fifteen minutes old on a busy
  site". On a quiet one the cached copy ages indefinitely, and a bakery in a town of
  seven thousand is a quiet site. Somebody arriving at nine at night would have been
  served a page generated that morning, cheerfully saying open until 3pm.

  The pages are small and hold no remote data, so per-request costs almost nothing
  and is the only version that is actually true.
*/
export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      {/* ── The storefront at half past five ─────────────────────────────── */}
      <section className="relative isolate overflow-hidden bg-night text-paper">
        <Image
          src="/photos/storefront-night.jpg"
          alt="Louie's Bakery on West Michigan Avenue in Marshall at night, lit sign over the awning"
          fill
          priority
          /*
            Capped at 1200. A bare 100vw asked Next for 1920 on a desktop and shipped a
            274KB file for an image sitting at 70% opacity behind a gradient.

            The source is now the bakery's full-resolution original from their Goldbelly
            listing, 2048 wide, rather than the 1400px copy: same photograph, but the
            copy was being upscaled on every retina screen. The srcset ladder is capped
            to 2048 in next.config.ts to match.
          */
          sizes="(max-width: 1200px) 100vw, 1200px"
          quality={60}
          /*
            Held at 45% rather than centered. The sign band sits about two fifths down
            the frame, and dead center crops it out behind the headline on a wide
            screen, which throws away the only photograph of the building we have.
          */
          className="object-cover object-[center_45%] opacity-70"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-night via-night/75 to-night/20"
          aria-hidden="true"
        />

        {/*
          THE HERO IS THE LOGO NOW, per Kevin: photo behind, their mark overlaid
          large, and the hat given a real entrance instead of only the quick header
          landing. It falls for two seconds, swaying on the way down, and settles on
          the B. The headline steps down a size because the wordmark carries the
          weight.

          The background is still the storefront, because it is the only photograph
          we may ship. The slot is built for the nut roll close-up: when that photo
          exists, swap the src on the Image above and this hero is finished. One
          line. It is on the checklist.
        */}
        <div className="hero-pad relative mx-auto flex min-h-[78vh] max-w-6xl flex-col items-center justify-center px-5 pb-20 pt-24 text-center sm:px-8">
          <Eyebrow dark>Marshall, Michigan &middot; Est. {site.established}</Eyebrow>
          <Wordmark hero className="mt-7 h-[clamp(6.5rem,24vw,13.5rem)] drop-shadow-[0_4px_24px_rgba(0,0,0,0.55)]" />
          {/*
            Hero copy, fifth and best version, and Kevin's angle: heritage.

            The scarcity headline wanted a product photo behind it and we do not have
            one. This one wants a 74-year-old storefront at night, which is exactly
            the photograph we have. The heritage research says family bakeries win on
            story; the conversion research says say one thing in a few words. This is
            both. The appetite and the scarcity did not go away, they moved to the
            subhead, so the hero still ends on "come early".

            One antithesis, and it is this one. House rule: rationed.
          */}
          <h1 className="mt-9 font-display text-[clamp(1.55rem,3.4vw,2.6rem)] font-extrabold leading-tight tracking-tight">
            A lot has changed since 1952.
            <br />
            The donuts haven&rsquo;t.
          </h1>
          {/*
            One sentence, per Kevin. The description, the thousand-a-day and "come
            early" all live two scrolls down in the nut roll section, so the hero
            saying them too was the page repeating itself. Eleven words under a
            two-line headline, and the next thing you read is the board.
          */}
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-paper/85">
            We still make them the way Louie wrote them down.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/menu?today=1">What&rsquo;s in the case today</ButtonLink>
            <ButtonLink href="/visit" variant="ghost">
              Hours and directions
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* ── The board ────────────────────────────────────────────────────── */}
      <TodayBoard />

      {/* ── The nut roll ─────────────────────────────────────────────────── */}
      <section className="grain relative isolate overflow-hidden bg-paper">
        <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <SectionHeading eyebrow="The one we are known for">
                Everything here is about the nut roll.
              </SectionHeading>
              <p className="mt-6 text-lg leading-relaxed text-awning/80">
                Jason&rsquo;s words, not ours: it is our biggest production item every
                single day. Cinnamon roll, fried, iced, then rolled in peanuts we roast
                ourselves, which is the part nobody else bothers with and the part you can
                taste.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-awning/80">
                Buy two. The second one rarely makes it home.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/order" variant="dark">
                  Order a dozen for pickup
                </ButtonLink>
                <ButtonLink href="/shop" variant="dark">
                  Send a box somewhere
                </ButtonLink>
              </div>
            </div>

            <ul className="grid gap-4 sm:grid-cols-2">
              {signatures.map((item) => (
                <li
                  key={item.name}
                  className="rounded-panel border border-awning/12 bg-paper-dim p-5"
                >
                  <h3 className="font-display text-lg font-bold text-awning">{item.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-awning/70">{item.description}</p>
                  {item.price !== undefined && (
                    <p className="mt-3 text-sm font-semibold tabular-nums text-brick">
                      {money(item.price)}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── What people say ──────────────────────────────────────────────── */}
      {/*
        The old site had a Testimonials page with nothing on it and a link out to
        "772 MORE REVIEWS ON OUR FACEBOOK PAGE". Seventy four years of goodwill,
        all of it hosted on somebody else's website. It belongs here.

        Verbatim, including the reviewer's own title where it is better than the
        quote, because "Best Damn Doughnuts Ever" is a person and "Excellent" is a
        press release.
      */}
      <section className="grain grain-dark relative isolate overflow-hidden bg-ash text-paper">
        <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <Eyebrow dark>What people say</Eyebrow>
          <ul className="mt-8 grid gap-8 md:grid-cols-3">
            {reviews.map((r) => (
              <li key={r.who}>
                <blockquote className="font-display text-xl font-bold leading-snug text-wheat sm:text-2xl">
                  &ldquo;{r.quote}&rdquo;
                </blockquote>
                <p className="mt-3 text-sm text-paper/65">
                  {r.title && (
                    <>
                      <span className="text-paper/80">{r.title}</span>
                      <br />
                    </>
                  )}
                  {r.who}, {r.where}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Louie ────────────────────────────────────────────────────────── */}
      <section className="grain grain-dark relative isolate overflow-hidden bg-awning text-paper">
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-24 md:grid-cols-[0.9fr_1.1fr]">
          <div className="relative mx-auto w-full max-w-sm">
            <Image
              src="/photos/louie-hot-cross-buns.jpg"
              alt="Louis Bagi behind the counter with trays of hot cross buns"
              width={1200}
              height={1539}
              sizes="(min-width: 768px) 384px, 90vw"
              className="rounded-panel border border-gold/25 object-cover"
            />
            <p className="mt-3 text-center text-xs text-paper/65">
              Louis Bagi, who opened the place in November {site.established}.
            </p>
          </div>

          <div>
            <SectionHeading eyebrow="Three generations" dark>
              Louie bought the bakery in 1952 and worked in it until he was nearly ninety.
            </SectionHeading>
            <p className="mt-6 font-serif text-lg leading-relaxed text-paper/85">
              His children ran it after him. His grandson {site.people.baker} runs it now.
              &ldquo;There are pictures of me as a little child in this place,&rdquo; he
              says. &ldquo;So, yeah, I&rsquo;ve been here my entire life.&rdquo;
            </p>
            <p className="mt-4 font-serif text-lg leading-relaxed text-paper/85">
              Same recipes, same corner, same oven.
            </p>
            <div className="mt-8">
              <ButtonLink href="/story" variant="ghost">
                Read the whole story
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* ── Three ways to get some ───────────────────────────────────────── */}
      <section className="grain relative isolate bg-paper-dim">
        <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <SectionHeading eyebrow="Three ways">Come in, order ahead, or send some.</SectionHeading>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Come in",
                body: `Tuesday through Saturday, 5:30am to 3pm. Come early. The good stuff goes first and we do not bake a second round.`,
                href: "/visit",
                cta: "Hours and directions",
              },
              {
                title: "Order ahead",
                body: "Tell us what you want and we will ring you back to confirm. Pies and photo cookies need a couple of days.",
                href: "/order",
                cta: "Order for pickup",
              },
              {
                title: "Send a box",
                body: `Baked Monday night, on the ${site.shipping.carrier} truck ${site.shipping.day}, on a porch somewhere Wednesday. Our toffee and pecan crisps travel best.`,
                href: "/shop",
                cta: "Ship it",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="flex flex-col rounded-panel border border-awning/12 bg-paper p-6"
              >
                <CarouselOven className="h-14 w-14 text-brick/70" spin={false} />
                <h3 className="mt-4 font-display text-xl font-bold text-awning">{card.title}</h3>
                <p className="mt-2 flex-1 text-awning/75">{card.body}</p>
                <div className="mt-5">
                  <ButtonLink href={card.href} variant="dark">
                    {card.cta}
                  </ButtonLink>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

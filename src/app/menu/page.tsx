import type { Metadata } from "next";
import MenuBrowser from "@/components/MenuBrowser";
import { activeClosure, firstOpenAfter } from "@/lib/availability";
import { PageHero } from "@/components/Ui";
import { sections } from "@/data/menu";
import { site, fullAddress } from "@/data/site";
import { hoursSummary } from "@/data/hours";
import { localNow } from "@/lib/time";

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

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Everything Louie's Bakery makes, with what is in the case today. Nut rolls, fried cakes, long johns, cookies, pies, bread and old pan toffee.",
};

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  /*
    The query string, rebuilt server side, so the first byte of HTML already shows what
    the URL asked for. The homepage's main button is /menu?today=1.
  */
  const sp = await searchParams;
  const initialSearch =
    "?" +
    new URLSearchParams(
      Object.entries(sp).flatMap(([k, v]) =>
        v === undefined ? [] : Array.isArray(v) ? v.map((x) => [k, x] as [string, string]) : [[k, v] as [string, string]],
      ),
    ).toString();

  // One clock, read on the server, handed to the client so hydration agrees.
  const now = localNow();
  /*
    A closure is a fact about the whole page, so it is read once here rather than by
    each row. Without it the menu badged things "Today only" and the today filter
    reported "47 of 61 being made this Wednesday" during a fortnight when the bakery was
    shut and nothing was being made at all.
  */
  const closure = activeClosure(now.date);
  const closed = closure !== null;

  return (
    <>
      {/* Printed pages lose the header and the hero, so they get their own masthead. */}
      {/*
        Not an <h1>. It is display:none on screen but it still counts in the document
        outline, and the audit flagged /menu as having two level-one headings. Print does
        not need the semantics, only the size.
      */}
      <div className="print-only">
        <p style={{ fontSize: "1.6rem", fontWeight: 800, margin: 0 }}>{site.name}</p>
        <p>
          {fullAddress} &middot; {site.phone}
        </p>
        <p>
          {hoursSummary.map((h) => `${h.label}: ${h.value}`).join(" \u00b7 ")}
        </p>
        <p>
          Some items are only made on certain days or in certain seasons, as noted.
        </p>
      </div>

      <div className="no-print">
        <PageHero
          eyebrow="What we make"
          title="The case, written out."
          intro="Baked before dawn, out front by half past five, and gone when it is gone. Anything we only make on certain days says so on the line."
        />

      </div>

      {closure && (
        <section className="border-b border-awning/10 bg-awning text-paper">
          <div className="mx-auto max-w-6xl px-5 py-5 sm:px-8">
            <p className="text-sm leading-relaxed">
              <strong className="font-semibold">
                Closed for {closure.reason.toLowerCase()}.
              </strong>{" "}
              Nothing is in the case until we are back on{" "}
              {firstOpenAfter(closure.to).pretty}. Everything below is what we make when
              we are open.
            </p>
          </div>
        </section>
      )}

      <MenuBrowser sections={sections} now={now} closed={closed} initialSearch={initialSearch} />

    </>
  );
}

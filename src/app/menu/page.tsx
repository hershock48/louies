import type { Metadata } from "next";
import MenuBrowser from "@/components/MenuBrowser";
import { PageHero } from "@/components/Ui";
import { sections } from "@/data/menu";
import { site, fullAddress } from "@/data/site";
import { hoursSummary } from "@/data/hours";

export const revalidate = 900;

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Everything Louie's Bakery makes, with what is in the case today. Nut rolls, fried cakes, long johns, cookies, pies, bread and old pan toffee.",
};

export default function MenuPage() {
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
          Prices shown are card prices. The lower figure is the cash price. Some items are
          only made on certain days or in certain seasons, as noted.
        </p>
      </div>

      <div className="no-print">
        <PageHero
          eyebrow="What they make"
          title="The case, written out."
          intro="Baked through the night, out front by half past five, and gone when it is gone. Anything that is only made on certain days says so on the line."
        />

      {/* The cash policy, explained once, in plain words. The old menu printed two
          prices on every row and never said why, which reads as a mistake. */}
        <section className="border-b border-awning/10 bg-paper-dim">
          <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8">
            <p className="text-sm leading-relaxed text-awning/80">
            <strong className="font-semibold text-awning">Two prices on every line.</strong>{" "}
            Card processing costs the bakery money, so they pass the saving on when you pay
            cash. The first number is the card price. The second is what you pay with cash.
          </p>
          </div>
        </section>
      </div>

      <MenuBrowser sections={sections} />

    </>
  );
}

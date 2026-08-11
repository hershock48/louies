import type { Metadata } from "next";
import MenuList from "@/components/MenuList";
import MenuSubnav from "@/components/MenuSubnav";
import { PageHero } from "@/components/Ui";
import { sections } from "@/data/menu";

export const revalidate = 900;

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Everything Louie's Bakery makes, with what is in the case today. Nut rolls, fried cakes, long johns, cookies, pies, bread and old pan toffee.",
};

export default function MenuPage() {
  return (
    <>
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

      {/* Jump links. A hundred items is a lot to scroll past on a phone. */}
      <MenuSubnav sections={sections} />

      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        {sections.map((s) => (
          <MenuList key={s.id} section={s} />
        ))}

        <p className="mt-12 max-w-2xl text-sm leading-relaxed text-awning/70">
          Prices change and so do the seasons. If you are making a trip for one particular
          thing, ring ahead and someone will tell you honestly whether it is there.
        </p>
      </div>
    </>
  );
}

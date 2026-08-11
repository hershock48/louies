import type { Metadata } from "next";
import { ButtonLink } from "@/components/Ui";
import CarouselOven from "@/components/CarouselOven";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <section className="grain grain-dark relative isolate overflow-hidden bg-night text-paper">
      <CarouselOven className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 text-gold/10" />
      <div className="relative mx-auto max-w-2xl px-5 py-28 text-center sm:px-8 sm:py-36">
        <p className="signage text-xs text-gold">Sold out</p>
        <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
          Whatever was here is gone.
        </h1>
        <p className="mt-5 text-lg text-paper/80">
          Happens most mornings by ten. Try the case instead.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/menu">See the menu</ButtonLink>
          <ButtonLink href="/" variant="ghost">
            Back to the front
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

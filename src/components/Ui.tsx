import Link from "next/link";
import CarouselOven from "./CarouselOven";

/** The small gold label that sits above a heading. Their sign band, shrunk. */
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="signage text-xs text-gold">{children}</p>;
}

export function SectionHeading({
  eyebrow,
  children,
  dark = false,
}: {
  eyebrow?: string;
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2
        className={`mt-3 font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl ${
          dark ? "text-paper" : "text-awning"
        }`}
      >
        {children}
      </h2>
    </>
  );
}

/**
 * The page header used on everything except the homepage. Dark band, oven turning
 * quietly behind it, so every page opens on the same note.
 */
export function PageHero({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <section className="grain grain-dark relative isolate overflow-hidden bg-night text-paper">
      <CarouselOven className="pointer-events-none absolute -right-20 -top-32 h-96 w-96 text-gold/10" />
      <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
          {title}
        </h1>
        {intro && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-paper/80">{intro}</p>}
      </div>
    </section>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost" | "dark";
  external?: boolean;
}) {
  const cls = `btn btn-${variant}`;
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

/**
 * The placeholder used on Order, Ship It and Photo Cookies while checkout is still
 * to come. It is deliberately not an apology and not a "coming soon" splash: it
 * describes exactly what the finished thing does, so the page is useful to a
 * customer today and reads as a plan rather than a gap.
 */
export function PhaseNote({
  heading,
  children,
  cta,
}: {
  heading: string;
  children: React.ReactNode;
  cta?: React.ReactNode;
}) {
  return (
    <div className="rounded-panel border border-awning/15 bg-paper-dim p-6 sm:p-8">
      <h2 className="font-display text-xl font-bold text-awning">{heading}</h2>
      <div className="mt-3 space-y-3 text-awning/80">{children}</div>
      {cta && <div className="mt-6 flex flex-wrap gap-3">{cta}</div>}
    </div>
  );
}

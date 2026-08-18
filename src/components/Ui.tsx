import Link from "next/link";
import CarouselOven from "./CarouselOven";

/**
 * The small label that sits above a heading. Their sign band, shrunk.
 *
 * Two colors, and it matters. Gold on the night background measures 6.49 and reads
 * exactly like the lettering on their awning. The same gold on cream measures 2.80,
 * which fails AA badly for text this small, so on light sections it drops to brick at
 * 8.28. Same idea, legible in both rooms.
 */
export function Eyebrow({
  children,
  dark = false,
}: {
  children: React.ReactNode;
  dark?: boolean;
}) {
  return <p className={`signage text-xs ${dark ? "text-gold" : "text-brick"}`}>{children}</p>;
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
      {eyebrow && <Eyebrow dark={dark}>{eyebrow}</Eyebrow>}
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
        <Eyebrow dark>{eyebrow}</Eyebrow>
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
  prefetch,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost" | "dark";
  external?: boolean;
  /**
   * Off for links back into the page you are already on with a different query.
   *
   * MEASURED, not a preference. The five "Send this one" buttons on /shop point at
   * /shop?box=... , and the router prefetches every one of them as an RSC request the
   * moment they enter the viewport. Those requests never complete: eight seconds in,
   * a phone still had an open GET for the first of them, which is why the auditor
   * reported /shop unreachable at 390 while curl fetched it in 15 milliseconds. A
   * prefetch that never finishes is a socket held open on a phone for a page the
   * visitor is already looking at.
   */
  prefetch?: false;
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
    <Link href={href} className={cls} prefetch={prefetch}>
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
  footnote,
}: {
  heading: string;
  children: React.ReactNode;
  cta?: React.ReactNode;
  /** Sits under the buttons. Used for the "is anybody there right now" line. */
  footnote?: React.ReactNode;
}) {
  return (
    <div className="rounded-panel border border-awning/15 bg-paper-dim p-6 sm:p-8">
      <h2 className="font-display text-xl font-bold text-awning">{heading}</h2>
      <div className="mt-3 space-y-3 text-awning/80">{children}</div>
      {cta && <div className="mt-6 flex flex-wrap gap-3">{cta}</div>}
      {footnote}
    </div>
  );
}

import { money } from "@/lib/money";
import type { MenuSection } from "@/data/menu";
import { statusFor } from "@/lib/availability";
import type { LocalNow } from "@/lib/time";

/**
 * THE CASE, WRITTEN OUT
 *
 * Two differences from the price list this replaces, and they are the whole point.
 *
 * One: availability is on the row. An item you cannot get today is dimmed and told
 * you when it is back, instead of hiding "(Wednesday only)" in a parenthesis you have
 * to notice. Nobody has to hold the rules in their head.
 *
 * Two: one price per row. Their published list prints two numbers on every line, a
 * card price and a cash price, and never explains either. The bakery has since moved
 * to Square and dropped the cash discount, so the second number now describes a way of
 * charging that no longer happens. One number, and it is the one you pay.
 */
export default function MenuList({
  section,
  items,
  now,
}: {
  section: MenuSection;
  /** Filtered subset from MenuBrowser. Falls back to the whole section. */
  items?: MenuSection["items"];
  /** The server's clock, so badges match between the two renders. See MenuBrowser. */
  now: LocalNow;
}) {
  const rows = items ?? section.items;

  return (
    // Scroll margin is derived from the two sticky bars, not guessed. See MenuBrowser.
    <section
      id={section.id}
      className="py-10 first:pt-0 scroll-mt-[calc(var(--header-h)+var(--subnav-h)+1rem)]"
    >
      <h2 className="font-display text-2xl font-extrabold tracking-tight text-awning sm:text-3xl">
        {section.title}
      </h2>
      {section.blurb && <p className="mt-2 max-w-2xl text-awning/70">{section.blurb}</p>}

      <ul className="mt-6 divide-y divide-awning/10 border-y border-awning/10">
        {rows.map((item) => {
          const s = statusFor(item.availability, now);
          const dim = !s.today && !!item.availability;

          return (
            /*
              NOT opacity.

              Unavailable rows used to carry opacity-60, and opacity multiplies through
              every child: a description already at text-awning/70 landed at an effective
              0.42 alpha, which measures 2.52 against the paper. The studio auditor found
              sixty of them on this page alone. The fix is at the pattern, not on the
              element that got flagged, so the dimming is gone entirely. The badge already
              says "Back Saturday", which is the actual information, and a tinted row
              carries the difference visually without touching a single text contrast.
            */
            <li
              key={item.name}
              className={`px-3 py-4 ${dim ? "-mx-3 rounded-card bg-paper-dim/70" : ""}`}
            >
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className="font-display text-lg font-bold text-awning">{item.name}</h3>

                {item.popular && !dim && (
                  <span className="rounded-full bg-gold/20 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-brick">
                    Popular
                  </span>
                )}

                {s.badge && (
                  <span className="rounded-full border border-brick/30 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-brick">
                    {s.badge}
                  </span>
                )}

                {item.price !== undefined && (
                  <span className="ml-auto flex-none text-right text-sm tabular-nums text-awning/75">
                    <span className="font-semibold text-awning">{money(item.price)}</span>
                  </span>
                )}
              </div>

              {(item.description || s.note) && (
                <p className="mt-1 max-w-2xl text-sm leading-relaxed text-awning/70">
                  {item.description}
                  {s.note && item.description ? " " : ""}
                  {s.note && <span className="text-brick">{s.note}</span>}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

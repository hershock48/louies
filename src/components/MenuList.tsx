import { money, type MenuSection } from "@/data/menu";
import { statusFor } from "@/lib/availability";
import { localNow } from "@/lib/time";

/**
 * THE CASE, WRITTEN OUT
 *
 * Two differences from the price list this replaces, and they are the whole point.
 *
 * One: availability is on the row. An item you cannot get today is dimmed and told
 * you when it is back, instead of hiding "(Wednesday only)" in a parenthesis you have
 * to notice. Nobody has to hold the rules in their head.
 *
 * Two: the cash price is labelled. Louie's printed two numbers on every line of the
 * old menu and never once explained why, which reads as an error. Here the pair is
 * headed "card" and "cash" and the policy is stated once above the list.
 */
export default function MenuList({ section }: { section: MenuSection }) {
  const now = localNow();

  return (
    // Scroll margin is derived from the two sticky bars, not guessed. See MenuSubnav.
    <section
      id={section.id}
      className="py-10 first:pt-0 scroll-mt-[calc(var(--header-h)+var(--subnav-h)+1rem)]"
    >
      <h2 className="font-display text-2xl font-extrabold tracking-tight text-awning sm:text-3xl">
        {section.title}
      </h2>
      {section.blurb && <p className="mt-2 max-w-2xl text-awning/70">{section.blurb}</p>}

      <ul className="mt-6 divide-y divide-awning/10 border-y border-awning/10">
        {section.items.map((item) => {
          const s = statusFor(item.availability, now);
          const dim = !s.today && !!item.availability;

          return (
            <li key={item.name} className={`py-4 ${dim ? "opacity-60" : ""}`}>
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
                    {item.cash !== undefined && item.cash !== item.price && (
                      <span className="text-awning/70"> card &middot; {money(item.cash)} cash</span>
                    )}
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

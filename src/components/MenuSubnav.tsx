"use client";

import { useEffect, useRef } from "react";
import type { MenuSection } from "@/data/menu";

/**
 * The jump links on the menu page.
 *
 * Client side for one reason: it publishes its own measured height as --subnav-h, the
 * same way SiteHeader publishes --header-h. Menu sections set
 *
 *   scroll-margin-top: calc(var(--header-h) + var(--subnav-h) + 1rem)
 *
 * so a jump link lands its heading just below both sticky bars. With the old fixed
 * scroll-mt-24 every one of the eleven links parked its heading 21px behind the nav,
 * which is the specific, maddening kind of broken where the page clearly moved but you
 * cannot see the thing you asked for.
 */
export default function MenuSubnav({ sections }: { sections: MenuSection[] }) {
  const el = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = el.current;
    if (!node) return;
    const publish = () =>
      document.documentElement.style.setProperty(
        "--subnav-h",
        `${Math.round(node.getBoundingClientRect().height)}px`,
      );
    publish();
    const ro = new ResizeObserver(publish);
    ro.observe(node);
    return () => ro.disconnect();
  }, []);

  return (
    <nav
      ref={el}
      aria-label="Menu sections"
      // Solid, not 95%. The dark hero scrolls underneath and ghosted through the
      // translucent version as a mottled band behind the chips.
      className="sticky top-[var(--header-h)] z-30 border-b border-awning/10 bg-paper"
    >
      <ul className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-1 text-sm font-semibold sm:px-7">
        {sections.map((s) => (
          <li key={s.id} className="flex-none">
            {/* py-3 px-2 keeps every chip over the 44px minimum on a phone. */}
            <a
              href={`#${s.id}`}
              className="flex min-h-11 items-center whitespace-nowrap px-2 py-3 text-awning/75 hover:text-brick"
            >
              {s.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

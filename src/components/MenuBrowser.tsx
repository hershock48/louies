"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import MenuList from "./MenuList";
import { statusFor } from "@/lib/availability";
import { localNow, DAY_NAMES } from "@/lib/time";
import type { MenuSection } from "@/data/menu";

/**
 * BROWSING THE CASE
 *
 * The site's whole promise is "what is in the case today", and until this component the
 * menu page could not answer it. The audit put numbers on the problem: 61 items across
 * 10.7 phone screens, no search, no filter, and 2 of the 11 jump chips visible at once
 * with nothing to suggest the rest scrolled.
 *
 * Three fixes, in order of how much they matter.
 *
 * 1. A today filter. One tap and the list is only what is actually being made, which is
 *    the question people currently go to Facebook to answer.
 * 2. Search. Somebody looking for "pecan" should not scroll past ninety other things.
 * 3. A subnav that says where you are, scrolls the active chip into view, and fades at
 *    the edges so it is obvious there is more.
 *
 * Filtering happens here rather than on the server so it is instant and keeps the page
 * static. localNow() reads America/Detroit on both sides, so server and client agree.
 */
export default function MenuBrowser({ sections }: { sections: MenuSection[] }) {
  const now = useMemo(() => localNow(), []);
  const [query, setQuery] = useState("");
  const [todayOnly, setTodayOnly] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const navEl = useRef<HTMLElement>(null);
  const listEl = useRef<HTMLUListElement>(null);

  const q = query.trim().toLowerCase();

  const visible = useMemo(() => {
    return sections
      .map((section) => {
        const items = section.items.filter((item) => {
          if (todayOnly && !statusFor(item.availability, now).today) return false;
          if (!q) return true;
          return (
            item.name.toLowerCase().includes(q) ||
            (item.description ?? "").toLowerCase().includes(q) ||
            section.title.toLowerCase().includes(q)
          );
        });
        return { section, items };
      })
      .filter((g) => g.items.length > 0);
  }, [sections, q, todayOnly, now]);

  const shown = visible.reduce((n, g) => n + g.items.length, 0);
  const total = sections.reduce((n, s) => n + s.items.length, 0);
  const filtering = todayOnly || q.length > 0;

  /* Publish the controls' height so section scroll margins clear both sticky bars. */
  useEffect(() => {
    const node = navEl.current;
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

  /* Scrollspy. Without it you lose your place in a list this long. */
  useEffect(() => {
    const headings = visible
      .map((g) => document.getElementById(g.section.id))
      .filter(Boolean) as HTMLElement[];
    if (!headings.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActiveId(hit.target.id);
      },
      // The band sits just under the two sticky bars, so the active chip changes when a
      // section reaches the top of the readable area rather than the top of the window.
      { rootMargin: "-140px 0px -70% 0px", threshold: 0 },
    );
    headings.forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, [visible]);

  /* Keep the active chip on screen. Eleven chips, two visible. */
  useEffect(() => {
    if (!activeId || !listEl.current) return;
    const chip = listEl.current.querySelector<HTMLElement>(`a[href="#${activeId}"]`);
    if (!chip) return;
    const list = listEl.current;
    const left = chip.offsetLeft - list.clientWidth / 2 + chip.clientWidth / 2;
    list.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
  }, [activeId]);

  return (
    <>
      <nav
        ref={navEl}
        aria-label="Menu controls"
        className="sticky top-[var(--header-h)] z-30 border-b border-awning/10 bg-paper"
      >
        <div className="mx-auto max-w-6xl px-5 pt-3 sm:px-8">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-0 flex-1">
              <svg
                viewBox="0 0 24 24"
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-awning/50"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search the case"
                aria-label="Search the menu"
                className="h-11 w-full rounded-full border border-awning/20 bg-paper-dim pl-9 pr-3 text-sm text-awning placeholder:text-awning/50 focus:border-brick focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={() => setTodayOnly((v) => !v)}
              aria-pressed={todayOnly}
              className={`flex min-h-11 flex-none items-center gap-2 rounded-full border px-4 text-sm font-bold transition-colors ${
                todayOnly
                  ? "border-brick bg-brick text-paper"
                  : "border-awning/20 bg-paper-dim text-awning hover:border-brick"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${todayOnly ? "bg-wheat" : "bg-brick"}`}
                aria-hidden="true"
              />
              In the case today
            </button>
          </div>

          <p aria-live="polite" className="mt-2 text-xs text-awning/70">
            {filtering
              ? `Showing ${shown} of ${total}${todayOnly ? ` being made this ${DAY_NAMES[now.day]}` : ""}${q ? ` matching “${query.trim()}”` : ""}.`
              : `Everything they make. ${total} things.`}
          </p>
        </div>

        {/* Fades at both ends, so it is obvious the chips keep going. */}
        <div className="relative mt-1">
          <ul
            ref={listEl}
            className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-1 text-sm font-semibold sm:px-7 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {visible.map(({ section }) => {
              const active = activeId === section.id;
              return (
                <li key={section.id} className="flex-none">
                  <a
                    href={`#${section.id}`}
                    aria-current={active ? "true" : undefined}
                    className={`flex min-h-11 items-center whitespace-nowrap rounded-full px-3 transition-colors ${
                      active ? "bg-brick text-paper" : "text-awning/75 hover:text-brick"
                    }`}
                  >
                    {section.title}
                  </a>
                </li>
              );
            })}
          </ul>
          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-paper to-transparent"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-paper to-transparent"
            aria-hidden="true"
          />
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        {visible.length === 0 ? (
          <div className="rounded-panel border border-awning/15 bg-paper-dim px-6 py-14 text-center">
            <p className="font-display text-xl font-bold text-awning">Nothing matches that.</p>
            <p className="mx-auto mt-2 max-w-md text-awning/75">
              {todayOnly
                ? "Try turning off the today filter. Plenty of what they make is seasonal or only on certain days."
                : "Try a shorter word, or ring the shop and ask. They will know."}
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setTodayOnly(false);
              }}
              className="btn btn-dark mt-6"
            >
              Show everything
            </button>
          </div>
        ) : (
          visible.map(({ section, items }) => (
            <MenuList key={section.id} section={section} items={items} />
          ))
        )}

        <p className="mt-12 max-w-2xl text-sm leading-relaxed text-awning/70">
          Prices change and so do the seasons. If you are making a trip for one particular
          thing, ring ahead and someone will tell you honestly whether it is there.
        </p>
      </div>
    </>
  );
}

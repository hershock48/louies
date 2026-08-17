"use client";

import Link from "next/link";
import Wordmark from "./Wordmark";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import OpenPill from "./OpenPill";
import { site } from "@/data/site";

/**
 * Labels are the plain thing each page does. "Order" on its own read as ambiguous next
 * to "Ship It" in the audit, because both are ordering: one you collect, one arrives in
 * a box. "Order Ahead" and "Ship a Box" say which is which without anyone having to
 * click to find out.
 */
const nav = [
  { href: "/menu", label: "Menu" },
  { href: "/order", label: "Order Ahead" },
  { href: "/shop", label: "Ship a Box" },
  { href: "/cookies", label: "Photo Cookies" },
  { href: "/story", label: "Our Story" },
  { href: "/visit", label: "Visit" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const headerEl = useRef<HTMLElement>(null);
  const barEl = useRef<HTMLDivElement>(null);
  const drawerEl = useRef<HTMLElement>(null);
  const toggleEl = useRef<HTMLButtonElement>(null);

  /*
    Publish the header's real height as --header-h.

    The menu page sticks its controls directly beneath this bar at top: var(--header-h),
    and the menu sections take their scroll margin from the same value. The fallback in
    globals.css was 72px; the bar actually measures 65px, which left a slot of page
    scrolling through between the two sticky bars and put every jump link 21px too high.

    The BAR is measured, not the <header>, because the mobile drawer renders inside the
    header. Measuring the header would report the whole open drawer as header height and
    shove the sticky controls most of the way down the screen the moment somebody taps
    the hamburger.
  */
  useEffect(() => {
    const bar = barEl.current;
    const header = headerEl.current;
    if (!bar || !header) return;
    const publish = () => {
      const border = parseFloat(getComputedStyle(header).borderBottomWidth) || 0;
      document.documentElement.style.setProperty(
        "--header-h",
        `${Math.round(bar.getBoundingClientRect().height + border)}px`,
      );
    };
    publish();
    const ro = new ResizeObserver(publish);
    ro.observe(bar);
    return () => ro.disconnect();
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    // Focus goes back where it came from, not to the top of the document, so a keyboard
    // or screen reader user does not lose their place every time they close the menu.
    toggleEl.current?.focus();
  }, []);

  /*
    Drawer keyboard behavior. The audit found the old version failed both halves of
    this: Escape did nothing, and three presses of Tab walked straight out of the open
    overlay into the page behind it, where the focus ring was invisible under the
    drawer.
  */
  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab") return;

      const stops = [
        toggleEl.current,
        ...Array.from(drawerEl.current?.querySelectorAll<HTMLElement>("a[href]") ?? []),
      ].filter(Boolean) as HTMLElement[];
      if (!stops.length) return;

      const first = stops[0];
      const last = stops[stops.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (e.shiftKey && (active === first || !stops.includes(active as HTMLElement))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close]);

  return (
    <header
      ref={headerEl}
      className="sticky top-0 z-40 border-b border-gold/25 bg-night text-paper"
    >
      <div ref={barEl} className="mx-auto flex max-w-6xl items-center gap-3 px-5 py-3 sm:px-8">
        <Link href="/" className="flex-none" aria-label={`${site.name}, home`}>
<Wordmark className="h-9 sm:h-10" />
        </Link>

        {/* Open or closed, on every page, without scrolling. */}
        <OpenPill compact className="flex min-w-0 lg:hidden" />

        <nav className="ml-auto hidden items-center gap-5 lg:flex" aria-label="Main">
          {nav.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`text-sm font-semibold tracking-wide transition-colors ${
                  active ? "text-gold" : "text-paper/85 hover:text-wheat"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3 lg:ml-6">
          <OpenPill className="hidden lg:flex" />
          <a
            href={site.phoneHref}
            className="-my-2 flex min-h-11 items-center px-2 text-sm font-semibold text-wheat hover:text-gold"
          >
            <span className="hidden sm:inline">{site.phone}</span>
            <span className="sm:hidden">Call</span>
          </a>

          <button
            ref={toggleEl}
            type="button"
            onClick={() => (open ? close() : setOpen(true))}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="-mr-2 flex h-11 w-11 flex-none items-center justify-center rounded-full text-paper lg:hidden"
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav
          ref={drawerEl}
          id="mobile-nav"
          aria-label="Main"
          className="border-t border-gold/20 bg-night lg:hidden"
        >
          <ul className="mx-auto max-w-6xl px-5 py-2 sm:px-8">
            {nav.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={pathname === l.href ? "page" : undefined}
                  /*
                    Closed on tap rather than in an effect keyed to the pathname. The
                    effect version fires a second render on every navigation, and the
                    drawer only ever closes because somebody touched something in it.
                  */
                  onClick={() => setOpen(false)}
                  className={`block border-b border-gold/10 py-4 text-lg font-semibold last:border-0 ${
                    pathname === l.href ? "text-gold" : "text-paper"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

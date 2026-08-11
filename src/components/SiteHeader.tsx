"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/data/site";

const nav = [
  { href: "/menu", label: "Menu" },
  { href: "/order", label: "Order" },
  { href: "/shop", label: "Ship It" },
  { href: "/cookies", label: "Photo Cookies" },
  { href: "/story", label: "Our Story" },
  { href: "/visit", label: "Visit" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-gold/25 bg-night/95 text-paper backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-3 sm:px-8">
        <Link href="/" className="flex-none" aria-label={`${site.name}, home`}>
          <Image
            src="/louies-logo-cream.png"
            alt={site.name}
            width={1050}
            height={432}
            priority
            className="h-9 w-auto sm:h-10"
          />
        </Link>

        <nav className="ml-auto hidden items-center gap-6 lg:flex" aria-label="Main">
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

        <a
          href={site.phoneHref}
          className="ml-auto text-sm font-semibold text-wheat hover:text-gold lg:ml-0"
        >
          <span className="hidden sm:inline">{site.phone}</span>
          <span className="sm:hidden">Call</span>
        </a>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="-mr-2 flex h-10 w-10 flex-none items-center justify-center rounded-full text-paper lg:hidden"
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

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="border-t border-gold/20 bg-night lg:hidden"
        >
          <ul className="mx-auto max-w-6xl px-5 py-2 sm:px-8">
            {nav.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  /*
                    Closed on tap rather than in an effect keyed to the pathname. The
                    effect version fires a second render on every navigation, and the
                    drawer only ever closes because somebody touched something in it.
                  */
                  onClick={() => setOpen(false)}
                  className="block border-b border-gold/10 py-4 text-lg font-semibold text-paper last:border-0"
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

"use client";

import { useEffect, useState } from "react";
import { openState } from "@/lib/availability";

/**
 * "Open until 3pm."
 *
 * The single most common question anyone has about a bakery, answered in the header on
 * every page. The audit measured the old answer at 0.88 screens down the homepage: a
 * customer standing on the sidewalk at 2:45pm had to scroll to find out whether it was
 * worth walking in.
 *
 * Computed in the browser, not on the server. The commerce pages are fully static, so a
 * server-rendered pill on those would freeze at build time and cheerfully tell somebody
 * at nine at night that the bakery is open. Rendering nothing until mount costs one
 * frame and is always right.
 */
export default function OpenPill({
  className = "",
  compact = false,
}: {
  className?: string;
  /**
   * Three words instead of a sentence. "Closed for the day. Open tomorrow at 5:30am."
   * is 44 characters and does not fit beside a logo and a hamburger on a 390px phone,
   * which is the most common screen this site will ever be opened on.
   */
  compact?: boolean;
}) {
  const [state, setState] = useState<ReturnType<typeof openState> | null>(null);

  useEffect(() => {
    const tick = () => setState(openState());
    tick();
    // Re-check every minute so "open until 3pm" turns over on its own for anyone who
    // leaves the tab sitting there.
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  if (!state) return <span className={className} aria-hidden="true" />;

  /*
    NOTE: no display utility here on purpose. This used to hardcode `inline-flex`, and
    callers pass `hidden lg:inline-flex` to control where it shows. Tailwind emits both
    `.hidden` and `.inline-flex`, the later one in the sheet wins, and `inline-flex` is
    later, so `hidden` silently did nothing: both copies of the pill rendered at 107px on
    a 390px phone, pushed the row to 457px, and shoved the hamburger clean off the screen
    where nothing could tap it. Display belongs to the caller.
  */
  return (
    <span className={`items-center gap-2 whitespace-nowrap ${className}`}>
      <span
        className={`h-2 w-2 flex-none rounded-full ${state.open ? "bg-gold" : "bg-paper/35"}`}
        aria-hidden="true"
      />
      <span className="truncate text-xs font-semibold text-paper/80">
        <span className="sr-only">{state.open ? "Open now. " : "Closed. "}</span>
        {compact ? shorten(state) : state.line}
      </span>
    </span>
  );
}

function shorten(state: ReturnType<typeof openState>) {
  if (!state.open) return "Closed";
  const close = state.today.close;
  if (close === null) return "Open";
  const hour = Math.floor(close / 60);
  const min = close % 60;
  const suffix = hour >= 12 ? "pm" : "am";
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return `Open till ${display}${min ? `:${String(min).padStart(2, "0")}` : ""}${suffix}`;
}

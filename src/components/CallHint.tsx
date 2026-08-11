"use client";

import { useEffect, useState } from "react";
import { openState } from "@/lib/availability";

/**
 * Sits next to a "call the shop" button and says whether anybody is there.
 *
 * Ordering, shipping and photo cookies all route to the telephone until checkout is
 * built. A phone number with no context is a coin toss: most of the people planning a
 * party order are doing it in the evening, when the bakery has been shut for six hours.
 * Saying so beats letting them ring out.
 *
 * Client side for the same reason as OpenPill: these pages are fully static, so a
 * server-rendered answer would be frozen at build time.
 */
export default function CallHint() {
  const [state, setState] = useState<ReturnType<typeof openState> | null>(null);

  useEffect(() => {
    const tick = () => setState(openState());
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  if (!state) return null;

  return (
    <p className="mt-4 flex items-center gap-2 text-sm text-awning/75">
      <span
        className={`h-2 w-2 flex-none rounded-full ${state.open ? "bg-brick" : "bg-awning/30"}`}
        aria-hidden="true"
      />
      {state.open
        ? `Someone is in the shop now. ${state.line}`
        : `Nobody is in the shop right now. ${state.line}`}
    </p>
  );
}

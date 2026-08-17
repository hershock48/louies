"use client";

import { useSyncExternalStore } from "react";

/**
 * The year, read in the visitor's browser.
 *
 * `new Date().getFullYear()` in a server component of a statically generated page
 * freezes at build time. glaze.md names this one specifically, and names the copyright
 * year as the case that catches people, because nothing looks wrong until January and
 * then it looks wrong to everybody.
 *
 * The footer renders on four routes that are genuinely static, so the year cannot come
 * from the server. useSyncExternalStore rather than an effect: the server snapshot is
 * empty, the client snapshot is the real year, and there is no render-then-correct.
 */
const yearStore = {
  subscribe: () => () => {},
  getSnapshot: () => String(new Date().getFullYear()),
  getServerSnapshot: () => "",
};

export default function CopyrightYear() {
  const year = useSyncExternalStore(
    yearStore.subscribe,
    yearStore.getSnapshot,
    yearStore.getServerSnapshot,
  );
  return year ? <>{year} </> : null;
}

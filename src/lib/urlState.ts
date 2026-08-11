/**
 * THE QUERY STRING AS A STORE
 *
 * The menu filters live in the URL so a filtered view can be shared, bookmarked and
 * posted. That makes the address bar a piece of external state, and the honest way to
 * read external state in React is useSyncExternalStore rather than an effect that
 * copies it into useState on mount.
 *
 * history.replaceState does not fire popstate, so writes notify subscribers here.
 * Replace rather than push: typing six letters into a search box should not put six
 * entries in the back button.
 */

const listeners = new Set<() => void>();

export function subscribeToSearch(onChange: () => void) {
  listeners.add(onChange);
  window.addEventListener("popstate", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("popstate", onChange);
  };
}

export function getSearch() {
  return window.location.search;
}

/** SSR and the first hydration render. No query string exists on the server. */
export function getServerSearch() {
  return "";
}

/** Set a value, or remove it by passing null. */
export function setSearchParams(next: Record<string, string | null>) {
  const sp = new URLSearchParams(window.location.search);
  for (const [key, value] of Object.entries(next)) {
    if (value === null || value === "") sp.delete(key);
    else sp.set(key, value);
  }
  const qs = sp.toString();
  const url = `${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash}`;
  if (url !== window.location.pathname + window.location.search + window.location.hash) {
    window.history.replaceState(null, "", url);
    listeners.forEach((l) => l());
  }
}

/*
  Whether the client has taken over.

  The subscribe callback never fires, so this settles once: false through the server
  render and the hydration pass, true immediately afterwards. Used to keep controls that
  do nothing without JavaScript out of the document entirely, rather than shipping
  somebody a search box that ignores them.
*/
export const hydratedStore = {
  subscribe: () => () => {},
  getSnapshot: () => true,
  getServerSnapshot: () => false,
};

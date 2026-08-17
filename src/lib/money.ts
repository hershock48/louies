/**
 * Cents to dollars.
 *
 * Its own module, and that is the whole point. It used to live in data/menu.ts, and
 * MenuList is a client component that imported it, which dragged the entire menu, all
 * sixty one items with their descriptions, into the client bundle. The same data was
 * already being sent down in the server payload, so every visitor to /menu downloaded
 * the case twice: 5KB compressed of pure duplication.
 *
 * A one line helper does not need to live next to the data it formats.
 */
export const money = (cents: number) => `$${(cents / 100).toFixed(2)}`;

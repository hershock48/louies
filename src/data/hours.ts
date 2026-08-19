/**
 * HOURS AND CLOSURES
 *
 * The whole reason this file exists: on the old site, a July vacation notice was
 * still sitting on the homepage in the middle of August, telling every visitor the
 * bakery was closed. It was a hand-typed banner, so it stayed up until somebody
 * remembered it.
 *
 * Here, closing is a date range in an array. Open or closed is computed from it.
 * There is no banner to forget, which means that particular bug cannot happen.
 */

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type DayHours = {
  day: Weekday;
  label: string;
  short: string;
  /** Minutes from midnight, local. null on both means closed that day. */
  open: number | null;
  close: number | null;
};

const h = (hour: number, minute = 0) => hour * 60 + minute;

/** Tuesday to Saturday, 5:30am to 3:00pm. Closed Sunday and Monday. */
export const week: DayHours[] = [
  { day: 0, label: "Sunday", short: "Sun", open: null, close: null },
  { day: 1, label: "Monday", short: "Mon", open: null, close: null },
  { day: 2, label: "Tuesday", short: "Tue", open: h(5, 30), close: h(15) },
  { day: 3, label: "Wednesday", short: "Wed", open: h(5, 30), close: h(15) },
  { day: 4, label: "Thursday", short: "Thu", open: h(5, 30), close: h(15) },
  { day: 5, label: "Friday", short: "Fri", open: h(5, 30), close: h(15) },
  { day: 6, label: "Saturday", short: "Sat", open: h(5, 30), close: h(15) },
];

export type Closure = {
  /** Inclusive, ISO yyyy-mm-dd, local dates. */
  from: string;
  to: string;
  reason: string;
};

/**
 * Add a range here and the site handles the rest: the status line says closed, the
 * daily board explains why and when they are back, and the menu stops promising
 * things nobody can buy.
 *
 * PLACEHOLDER: the bakery's real 2026 and 2027 closures. The entry below is
 * the shape, taken from the summer break they posted last year.
 */
export const closures: Closure[] = [
  // { from: "2026-07-04", to: "2026-07-20", reason: "Summer break" },
];

/*
  Closures are checked at module load, so a typo fails the build rather than the bakery.

  The comparison in the availability engine is a string compare, which is exact and fast
  on yyyy-mm-dd and silently useless on anything else: "2026-9-1" is a perfectly
  reasonable thing to type and never matches any date, so the site would sail through
  the closure insisting it was open until 3pm. That is precisely the bug this file
  exists to make impossible, so it is caught here instead.
*/
for (const c of closures) {
  const shape = /^\d{4}-\d{2}-\d{2}$/;
  if (!shape.test(c.from) || !shape.test(c.to)) {
    throw new Error(
      `Closure "${c.reason}" has a date that is not yyyy-mm-dd: ${c.from} to ${c.to}. ` +
        `Pad the month and the day, or the site will not notice this closure at all.`,
    );
  }
  if (c.from > c.to) {
    throw new Error(`Closure "${c.reason}" ends before it starts: ${c.from} to ${c.to}.`);
  }
}

export const hoursSummary = [
  { label: "Tuesday to Saturday", value: "5:30am to 3pm" },
  { label: "Sunday and Monday", value: "Closed" },
];

/** Kept as a name the pages already import. The implementation lives with time. */
export { clock as formatMinutes } from "@/lib/time";

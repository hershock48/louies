/**
 * LOCAL TIME
 *
 * Everything on this site that says "today" means today in Marshall, Michigan, not
 * today wherever the server happens to be running. Vercel runs in UTC, so a build
 * at 9pm Eastern would otherwise think it was already tomorrow and show the wrong
 * items in the case.
 *
 * Intl does the work. No date library, no timezone table to keep current.
 */

export const TZ = "America/Detroit";

export type LocalNow = {
  /** 0 = Sunday. */
  day: number;
  /** Minutes from local midnight. */
  minutes: number;
  /** yyyy-mm-dd, local. */
  date: string;
  month: number;
};

const parts = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ,
  weekday: "short",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const DAYS: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

export function localNow(at: Date = new Date()): LocalNow {
  const p = Object.fromEntries(parts.formatToParts(at).map((x) => [x.type, x.value]));
  // Intl gives "24" for midnight in some engines. Normalise it to 0.
  const hour = Number(p.hour) % 24;
  return {
    day: DAYS[p.weekday] ?? 0,
    minutes: hour * 60 + Number(p.minute),
    date: `${p.year}-${p.month}-${p.day}`,
    month: Number(p.month),
  };
}

/** Adds days to a local yyyy-mm-dd without going near a timezone. */
export function addDays(date: string, n: number) {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/**
 * Day of the week for a local yyyy-mm-dd, 0 = Sunday, matching `week` in data/hours.ts
 * and the `days` arrays on menu items. Anchored at noon UTC like addDays, so no
 * daylight-saving hour can push the date over a boundary.
 */
export function dayOfWeek(date: string) {
  return new Date(`${date}T12:00:00Z`).getUTCDay();
}

export const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

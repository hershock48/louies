/**
 * THE AVAILABILITY ENGINE
 *
 * This is the idea the whole site is built on.
 *
 * Louie's already wrote these rules down. They are on the old menu page, trapped in
 * parentheses where nothing can use them: "(Wednesday only)", "Lemon on Saturday",
 * "(Fall-Winter-Early Spring only)", "2-day advance notice required". A customer who
 * wants to know whether there are cream horns today has to read a hundred lines of
 * price list and do the arithmetic themselves, which is why they go to Facebook instead.
 *
 * Move the rules into data and one function answers the question everywhere: the daily
 * board on the homepage, the badges on the menu, the shoulder-season strip that says
 * the eclairs are coming back. Nobody edits a banner. Nothing goes stale.
 */

import { closures, week, type DayHours } from "@/data/hours";
import { localNow, type LocalNow } from "./time";

export type Availability = {
  /** 0 = Sunday. Absent means every day they are open. */
  days?: number[];
  /** Roughly their own words. Fall through early spring, or the warm half of the year. */
  season?: "fall-winter" | "spring-summer";
  /** "or by order" on the old menu. Not in the case, but they will make it. */
  byOrder?: boolean;
  /** Photo cookies need two days. */
  leadDays?: number;
  /** The bacon donut. Shows up when it shows up. */
  occasional?: boolean;
};

export type ItemStatus = {
  /** In the case today. */
  today: boolean;
  /** Short badge for a menu row. Null when the item is simply always around. */
  badge: string | null;
  /** Longer sentence for a tooltip or a detail line. */
  note: string | null;
};

/** Their seasons, as the menu describes them rather than as the calendar does. */
function inSeason(season: Availability["season"], month: number) {
  if (!season) return true;
  // Fall, winter and early spring. October through April.
  const cold = month >= 10 || month <= 4;
  return season === "fall-winter" ? cold : !cold;
}

function dayLabel(days: number[]) {
  const names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  if (days.length === 1) return names[days[0]];
  return days.slice(0, -1).map((d) => names[d]).join(", ") + " and " + names[days[days.length - 1]];
}

/** The next date on which a day-limited item is back, as a friendly word. */
function nextDayWord(days: number[], today: number) {
  const names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  for (let i = 1; i <= 7; i++) {
    const d = (today + i) % 7;
    if (days.includes(d)) return i === 1 ? "tomorrow" : names[d];
  }
  return null;
}

export function statusFor(a: Availability | undefined, now: LocalNow = localNow()): ItemStatus {
  if (!a) return { today: true, badge: null, note: null };

  if (a.occasional) {
    return { today: false, badge: "Now and then", note: "Made when the mood strikes. Watch for it." };
  }

  if (!inSeason(a.season, now.month)) {
    const label = a.season === "fall-winter" ? "Back in the fall" : "Back in the spring";
    return {
      today: false,
      badge: label,
      note:
        a.season === "fall-winter"
          ? "Made from fall through early spring."
          : "Made through the warmer months.",
    };
  }

  if (a.days && !a.days.includes(now.day)) {
    const next = nextDayWord(a.days, now.day);
    return {
      today: false,
      badge: next ? `Back ${next}` : dayLabel(a.days),
      note: `In the case on ${dayLabel(a.days)}.${a.byOrder ? " Any other day, by order." : ""}`,
    };
  }

  if (a.leadDays) {
    return {
      today: false,
      badge: `${a.leadDays} days notice`,
      note: `Made to order. Please give us ${a.leadDays} days.`,
    };
  }

  if (a.byOrder && !a.days) {
    return { today: false, badge: "By order", note: "Not usually in the case. Give us a call." };
  }

  return { today: true, badge: a.days ? "Today only" : null, note: null };
}

/* ------------------------------------------------------------------ */
/* Open, closed, and why                                               */
/* ------------------------------------------------------------------ */

export type OpenState = {
  open: boolean;
  /** The one line a person actually wants. "Open until 3pm." */
  line: string;
  /** Set while a closure is running, so the board can explain itself. */
  closure: { reason: string; until: string } | null;
  today: DayHours;
};

function fmt(m: number) {
  const hour = Math.floor(m / 60);
  const min = m % 60;
  const suffix = hour >= 12 ? "pm" : "am";
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return min === 0 ? `${display}${suffix}` : `${display}:${String(min).padStart(2, "0")}${suffix}`;
}

function prettyDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    timeZone: "UTC",
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function openState(now: LocalNow = localNow()): OpenState {
  const today = week[now.day];

  const closure = closures.find((c) => now.date >= c.from && now.date <= c.to);
  if (closure) {
    return {
      open: false,
      line: `Closed for ${closure.reason.toLowerCase()}. Back ${prettyDate(closure.to)}.`,
      closure: { reason: closure.reason, until: prettyDate(closure.to) },
      today,
    };
  }

  /** The next day they open, with its own opening time rather than an assumed one. */
  const nextOpenDay = () => {
    for (let i = 1; i <= 7; i++) {
      const d = week[(now.day + i) % 7];
      if (d.open !== null) return { when: i === 1 ? "tomorrow" : d.label, at: fmt(d.open) };
    }
    return null;
  };

  if (today.open === null || today.close === null) {
    const next = nextOpenDay();
    return {
      open: false,
      line: next ? `Closed today. Open ${next.when} at ${next.at}.` : "Closed today.",
      closure: null,
      today,
    };
  }

  if (now.minutes < today.open) {
    return { open: false, line: `Opens at ${fmt(today.open)} this morning.`, closure: null, today };
  }

  if (now.minutes >= today.close) {
    const next = nextOpenDay();
    return {
      open: false,
      line: next ? `Closed for the day. Open ${next.when} at ${next.at}.` : "Closed for the day.",
      closure: null,
      today,
    };
  }

  const left = today.close - now.minutes;
  if (left <= 60) {
    return { open: true, line: `Open, closing at ${fmt(today.close)}.`, closure: null, today };
  }
  return { open: true, line: `Open until ${fmt(today.close)}.`, closure: null, today };
}

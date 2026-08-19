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
import { addDays, clock as fmt, DAY_NAMES, dayOfWeek, localNow, type LocalNow } from "./time";

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

/**
 * The month it comes back, named.
 *
 * This used to say "Back in the fall", which is wrong for the whole of September: it is
 * already fall, the eclair is still a month away, and somebody reading the row would
 * reasonably go and ask for one. The warm-half version was worse, telling people in
 * March that something was back in the spring while they were standing in it. A month
 * cannot be argued with.
 */
function seasonReturn(season: Exclude<Availability["season"], undefined>, month: number) {
  const names = ["", "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];
  const back = season === "fall-winter" ? 10 : 5;
  return (back - month + 12) % 12 === 1 ? "Back next month" : `Back in ${names[back]}`;
}

function dayLabel(days: number[]) {
  if (days.length === 1) return DAY_NAMES[days[0]];
  return (
    days.slice(0, -1).map((d) => DAY_NAMES[d]).join(", ") +
    " and " +
    DAY_NAMES[days[days.length - 1]]
  );
}

/** The next date on which a day-limited item is back, as a friendly word. */
function nextDayWord(days: number[], today: number) {
  for (let i = 1; i <= 7; i++) {
    const d = (today + i) % 7;
    if (days.includes(d)) return i === 1 ? "tomorrow" : DAY_NAMES[d];
  }
  return null;
}

export function statusFor(
  a: Availability | undefined,
  now: LocalNow = localNow(),
  /**
   * True while the bakery is shut for a closure. Nothing is in the case, so no row may
   * say "Today only" and the today filter on the menu must match nothing. The rotation
   * itself is still described, because "in the case on Wednesdays" stays true through a
   * fortnight in July.
   */
  closed = false,
): ItemStatus {
  if (!a) return { today: !closed, badge: null, note: null };

  if (a.occasional) {
    return { today: false, badge: "Now and then", note: "Made when the mood strikes. Watch for it." };
  }

  if (!inSeason(a.season, now.month)) {
    const label = seasonReturn(a.season === "fall-winter" ? "fall-winter" : "spring-summer", now.month);
    return {
      today: false,
      badge: label,
      note:
        a.season === "fall-winter"
          ? "Made from fall through early spring."
          : "Made through the warmer months.",
    };
  }

  if (closed && a.days) {
    return {
      today: false,
      badge: dayLabel(a.days),
      note: `In the case on ${dayLabel(a.days)} once we are back.`,
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

  return {
    today: !closed,
    badge: a.days ? "Today only" : null,
    // The Cream Horn is a Wednesday item you can also order any other day, and that
    // second half used to vanish on Wednesdays: the one day somebody is most likely to
    // be reading the row.
    note: a.byOrder ? "Any other day, by order." : null,
  };
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


function prettyDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    timeZone: "UTC",
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

/* ------------------------------------------------------------------ */
/* Closures                                                            */
/* ------------------------------------------------------------------ */

/**
 * The closure covering a date, choosing the one that runs LATEST where ranges overlap.
 *
 * Overlap is not hypothetical: "closed the 1st to the 5th", then a week later "make
 * that the 10th", used to resolve to whichever was typed first, so the site announced
 * they were back five days before anybody was.
 */
export function activeClosure(date: string) {
  const matches = closures.filter((c) => date >= c.from && date <= c.to);
  if (matches.length === 0) return null;
  return matches.reduce((latest, c) => (c.to > latest.to ? c : latest));
}

/**
 * The first day after a closure ends on which the bakery is actually open. Skips the
 * days they are shut anyway and any second closure that begins where this one ends.
 */
export function firstOpenAfter(lastClosedDate: string) {
  let date = addDays(lastClosedDate, 1);
  for (let i = 0; i < 400; i++) {
    if (week[dayOfWeek(date)].open !== null && !activeClosure(date)) {
      return { date, pretty: prettyDate(date) };
    }
    date = addDays(date, 1);
  }
  // Four hundred days of continuous closure is not a bakery, but a loop with no exit
  // is a hung request, so it ends.
  return { date, pretty: prettyDate(date) };
}

/**
 * The next day they open: the date, the weekday, a friendly word for it and the hour.
 *
 * Exported because two different questions need the same answer and were computing it
 * separately. The status line asks it to say "open tomorrow at 5:30am". The board asks
 * it because at four in the afternoon on a Wednesday, listing the Wednesday-only cream
 * horns under a heading about the next time we open is a promise nobody can keep: what
 * a reader wants after closing time is what will be in the case when they can next
 * walk in, which is a different day's answer entirely.
 *
 * Skips closures as well as the days they are shut anyway. Without that, on the third
 * of July this cheerfully said "open tomorrow", on the first morning of a fortnight's
 * shutdown.
 */
export function nextOpenDay(now: LocalNow) {
  for (let i = 1; i <= 21; i++) {
    const date = addDays(now.date, i);
    const day = dayOfWeek(date);
    const d = week[day];
    if (d.open !== null && !activeClosure(date)) {
      return { date, day, when: i === 1 ? "tomorrow" : d.label, label: d.label, at: fmt(d.open) };
    }
  }
  return null;
}

export function openState(now: LocalNow = localNow()): OpenState {
  const today = week[now.day];

  const closure = activeClosure(now.date);
  if (closure) {
    const back = firstOpenAfter(closure.to);
    return {
      open: false,
      /*
        "Back <the last closed day>" is what this said before, which had the bakery shut
        and back on the same date, and that date was frequently a Monday: a day they
        never open at all. It now names the first morning somebody will actually be
        behind the counter, which is the only date a customer cares about.
      */
      line: `Closed for ${closure.reason.toLowerCase()}. Back ${back.pretty}.`,
      closure: { reason: closure.reason, until: back.pretty },
      today,
    };
  }

  if (today.open === null || today.close === null) {
    const next = nextOpenDay(now);
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
    const next = nextOpenDay(now);
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

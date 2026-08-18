/**
 * THE DAILY BOARD
 *
 * What the homepage says is in the case, derived rather than typed. Three groups:
 *
 *   today    things you can only get today, so there is a reason to come in now
 *   soon     things coming back, which is free marketing for the eclair in September
 *   notice   things worth ordering ahead, because they need lead time
 *
 * If all three come back empty the board still renders. It just says the ordinary
 * true thing, which is that the case is full of fried cakes.
 */

import { sections, type MenuItem } from "@/data/menu";
import { activeClosure, statusFor } from "./availability";
import { localNow, type LocalNow } from "./time";

export type BoardItem = { item: MenuItem; badge: string | null; note: string | null };

export type Board = {
  /** True while a closure is running. The board must not describe a case nobody can
   *  walk up to. */
  closed: boolean;
  today: BoardItem[];
  soon: BoardItem[];
  notice: BoardItem[];
  /** What is always there. Carries the board on the five days with no specials. */
  always: MenuItem[];
};

/*
  What is in the case whenever the door is open. Names, not size rows: this listed
  "Large" on the homepage every day without a special, because the Old Pan Toffee
  section prices a Small and a Large and the Large is marked popular. A row whose name
  only makes sense under its section heading cannot go on a board.

  Exported because the board still wants to name these while the bakery is shut, and
  the alternative was calling buildBoard with a faked date to get the list back.
*/
const SIZE_ROWS = new Set(["Small", "Large", "Half Dozen", "Dozen"]);

export const everydayItems: MenuItem[] = sections
  .flatMap((s) => s.items)
  .filter((i) => !i.availability && i.popular && !SIZE_ROWS.has(i.name))
  .slice(0, 6);

export function buildBoard(now: LocalNow = localNow()): Board {
  /*
    A closure emptied nothing before this line existed. On the eighth of July, in the
    middle of a fortnight's shutdown, the board cheerfully listed "Cream Horn, today
    only" directly underneath its own "Closed for summer break" heading. The bakery is
    shut: there is no today.
  */
  const closed = activeClosure(now.date) !== null;

  const today: BoardItem[] = [];
  const soon: BoardItem[] = [];
  const notice: BoardItem[] = [];

  for (const section of sections) {
    for (const item of section.items) {
      if (!item.availability) continue;
      const s = statusFor(item.availability, now);
      const entry = { item, badge: s.badge, note: s.note };

      if (s.today && item.availability.days) {
        today.push(entry);
      } else if (item.availability.leadDays) {
        notice.push(entry);
      } else if (!s.today && !item.availability.occasional) {
        soon.push(entry);
      }
    }
  }

  /*
    The board looked thin on any day without a special, which is most of them: it said
    "nothing unusual today" and left two thirds of the module empty. These are the
    everyday items, the ones somebody deciding whether to drive over actually wants
    named. No availability rules, marked popular, so they are in the case whenever the
    door is open.
  */
  if (closed) {
    // Nothing is in the case today. What is coming back and what needs notice are still
    // true, and still useful to somebody planning the week they reopen.
    return { closed, today: [], soon: soon.slice(0, 4), notice, always: [] };
  }

  return { closed, today, soon: soon.slice(0, 4), notice, always: everydayItems };
}

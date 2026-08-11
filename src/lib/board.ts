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
import { statusFor } from "./availability";
import { localNow, type LocalNow } from "./time";

export type BoardItem = { item: MenuItem; badge: string | null; note: string | null };

export type Board = {
  today: BoardItem[];
  soon: BoardItem[];
  notice: BoardItem[];
  /** What is always there. Carries the board on the five days with no specials. */
  always: MenuItem[];
};

export function buildBoard(now: LocalNow = localNow()): Board {
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
  const always = sections
    .flatMap((s) => s.items)
    .filter((i) => !i.availability && i.popular)
    .slice(0, 6);

  return { today, soon: soon.slice(0, 4), notice, always };
}

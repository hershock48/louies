import Link from "next/link";
import CarouselOven from "./CarouselOven";
import { openState } from "@/lib/availability";
import { buildBoard, everydayItems } from "@/lib/board";
import { localNow, DAY_NAMES } from "@/lib/time";

/**
 * THE BOARD
 *
 * The single most useful thing this site can do, and the thing the old one could not
 * do at all: say what is in the case, today, without anyone having to update it.
 *
 * Rendered on the server against Marshall time, per request. app/page.tsx is
 * force-dynamic for exactly this reason: a cached copy of "open until 3pm" is a lie
 * from three in the afternoon onwards, and on a quiet site a cached page can age for
 * days. See the note at the top of that file.
 */
export default function TodayBoard({ compact = false }: { compact?: boolean }) {
  const now = localNow();
  const state = openState(now);
  const board = buildBoard(now);
  // During a closure the board returns no "always" list, because nothing is in the
  // case. The panel still names what is normally there for the week they reopen.
  const everyday = everydayItems;

  return (
    <section
      className="grain grain-dark relative isolate overflow-hidden border-y border-gold/25 bg-ash text-paper"
      aria-labelledby="board-heading"
    >
      {/* The oven, turning behind the board, mostly out of frame. */}
      <CarouselOven className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 text-gold/10 sm:h-[26rem] sm:w-[26rem]" />

      <div className="relative mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest ${
              state.open ? "bg-gold text-night" : "bg-paper/10 text-wheat"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${state.open ? "bg-night" : "bg-wheat/70"}`}
              aria-hidden="true"
            />
            {state.open ? "Open now" : "Closed"}
          </span>
          <p className="text-sm text-paper/80">{state.line}</p>
        </div>

        {/*
          The heading tracks the state of the door. On a Sunday, or in the middle of a
          closure, "Sunday in the case" sat above a list of five things and a pill
          reading Closed, which is a board describing a case nobody can walk up to.
        */}
        <h2 id="board-heading" className="mt-5 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          {state.open ? `${DAY_NAMES[now.day]} in the case` : "When we open"}
        </h2>

        <div className={`mt-8 grid gap-8 ${compact ? "" : "md:grid-cols-3"}`}>
          <div>
            <h3 className="signage text-xs text-gold">
              {state.open ? "Today only" : "Next time we are open"}
            </h3>
            {board.today.length ? (
              <ul className="mt-3 space-y-2">
                {board.today.map(({ item }) => (
                  <li key={item.name} className="text-lg font-semibold">
                    {item.name}
                    {item.description && (
                      <span className="block text-sm font-normal text-paper/70">{item.description}</span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <>
                <p className="mt-3 text-paper/75">
                  {board.closed
                    ? "Nothing is in the case while we are shut. When we are back, this is what is here every day:"
                    : state.open
                      ? "No specials today, so it is the everyday case:"
                      : "The door is shut right now. This is what is in the case whenever it is open:"}
                </p>
                <ul className="mt-3 space-y-1">
                  {(board.always.length ? board.always : everyday).map((item) => (
                    <li key={item.name} className="text-lg font-semibold">
                      {item.name}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {!compact && (
            <>
              <div>
                <h3 className="signage text-xs text-gold">Coming back</h3>
                {board.soon.length ? (
                  <ul className="mt-3 space-y-2">
                    {board.soon.map(({ item, badge }) => (
                      <li key={item.name} className="flex items-baseline justify-between gap-3">
                        <span className="text-paper/85">{item.name}</span>
                        <span className="flex-none text-xs uppercase tracking-wider text-gold">{badge}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-paper/70">Everything we make is available right now.</p>
                )}
              </div>

              <div>
                <h3 className="signage text-xs text-gold">Worth ordering ahead</h3>
                <ul className="mt-3 space-y-2">
                  {board.notice.map(({ item, badge }) => (
                    <li key={item.name} className="flex items-baseline justify-between gap-3">
                      <span className="text-paper/85">{item.name}</span>
                      <span className="flex-none text-xs uppercase tracking-wider text-gold">{badge}</span>
                    </li>
                  ))}
                  <li className="flex items-baseline justify-between gap-3">
                    <span className="text-paper/85">Pies for a holiday</span>
                    <span className="flex-none text-xs uppercase tracking-wider text-gold">Call ahead</span>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>

        {/* The board answers "should I go". These are the two next steps from there.
            Suppressed in compact mode, which only renders on Visit, where both links
            would point at the page you are already on. */}
        {!compact && (
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/menu" className="btn btn-primary">
              See the whole case
            </Link>
            <Link href="/visit" className="btn btn-ghost">
              Hours and directions
            </Link>
          </div>
        )}

        {state.closure && (
          <p className="mt-8 rounded-panel border border-gold/25 bg-night/60 px-5 py-4 text-sm text-wheat">
            Closed for {state.closure.reason.toLowerCase()}. Back {state.closure.until}.
          </p>
        )}
      </div>
    </section>
  );
}

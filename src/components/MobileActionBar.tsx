import { site, mapsUrl } from "@/data/site";

/**
 * Two actions, always within thumb reach on a phone.
 *
 * Everything a walk-in bakery needs from a website reduces to "can I call them" and
 * "how do I get there". Directions previously took a trip to the Visit page from
 * wherever you happened to be, which is three taps for the single most likely thing a
 * person standing on Michigan Avenue wants.
 *
 * Hidden on desktop, where the phone number sits in the header and there is room for
 * the footer to carry the address.
 */
export default function MobileActionBar() {
  return (
    <div className="no-print fixed inset-x-0 bottom-0 z-40 border-t border-gold/25 bg-night/95 backdrop-blur lg:hidden">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-2 px-4 py-2">
        <a
          href={site.phoneHref}
          className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-gold px-4 text-sm font-bold text-night"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
            <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .57 3.6 1 1 0 0 1-.25 1z" />
          </svg>
          Call the shop
        </a>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-gold/45 px-4 text-sm font-bold text-wheat"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
            <path d="M12 2a7 7 0 0 0-7 7c0 5.1 6.2 12.4 6.5 12.7a.7.7 0 0 0 1 0C12.8 21.4 19 14.1 19 9a7 7 0 0 0-7-7m0 9.5A2.5 2.5 0 1 1 14.5 9 2.5 2.5 0 0 1 12 11.5" />
          </svg>
          Directions
        </a>
      </div>
    </div>
  );
}

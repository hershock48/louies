import Link from "next/link";
import Wordmark from "./Wordmark";
import GlazedPlate from "./GlazedPlate";
import CopyrightYear from "./CopyrightYear";
import { site, mapsUrl } from "@/data/site";
import { hoursSummary } from "@/data/hours";

export default function SiteFooter() {
  return (
    <footer className="grain grain-dark relative isolate border-t border-gold/25 bg-night text-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 sm:py-16 md:grid-cols-3">
        <div>
<Wordmark className="h-11" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-paper/75">{site.blurb}</p>
        </div>

        <div>
          <h2 className="signage text-xs text-gold">Find Us</h2>
          <address className="mt-4 not-italic text-sm leading-relaxed text-paper/85">
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-wheat">
              {site.address.street}
              <br />
              {site.address.city}, {site.address.state} {site.address.zip}
            </a>
            <br />
            <a href={site.phoneHref} className="mt-1 inline-flex min-h-6 items-center py-1 font-semibold hover:text-wheat">
              {site.phone}
            </a>
          </address>

          <h2 className="signage mt-8 text-xs text-gold">Hours</h2>
          <dl className="mt-4 space-y-1 text-sm text-paper/85">
            {hoursSummary.map((h) => (
              <div key={h.label} className="flex justify-between gap-4">
                <dt>{h.label}</dt>
                <dd className="text-paper/60">{h.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <h2 className="signage text-xs text-gold">More</h2>
          <ul className="mt-4 text-sm text-paper/85">
            <li><Link href="/menu" className="inline-block py-1.5 hover:text-wheat">Menu</Link></li>
            <li><Link href="/order" className="inline-block py-1.5 hover:text-wheat">Order ahead</Link></li>
            <li><Link href="/shop" className="inline-block py-1.5 hover:text-wheat">Ship a box</Link></li>
            <li><Link href="/cookies" className="inline-block py-1.5 hover:text-wheat">Photo cookies</Link></li>
            <li><Link href="/story" className="inline-block py-1.5 hover:text-wheat">Our story</Link></li>
            <li><Link href="/visit" className="inline-block py-1.5 hover:text-wheat">Visit</Link></li>
          </ul>

          <h2 className="signage mt-8 text-xs text-gold">Elsewhere</h2>
          <ul className="mt-4 text-sm text-paper/85">
            <li>
              <a href={site.social.facebook} target="_blank" rel="noopener noreferrer" className="inline-block py-1.5 hover:text-wheat">
                Facebook
              </a>
            </li>
            <li>
              <a href={site.social.goldbelly} target="_blank" rel="noopener noreferrer" className="inline-block py-1.5 hover:text-wheat">
                Goldbelly
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gold/15">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-6 text-xs text-paper/55 sm:flex-row sm:px-8">
          <p>
            &copy; <CopyrightYear />{site.name}. Baking on Michigan Avenue since {site.established}.
          </p>
        </div>
      </div>

      {/*
        The signature plate, last child of the footer and outside the max-width
        container so the drip edge is full bleed. brand.md's procedure, not an
        improvisation: the ground came from plate.mjs and the values sit next to the
        palette in globals.css.

        "Double Dipped by", on Kevin's call. brand.md reserves the donut line for work
        that has been bought and gives spec builds "Concept build by", so this is a
        deliberate divergence from the written rule rather than an oversight: he wants
        the bakery seeing the real line. Noted here because the next person reading
        brand.md will otherwise think this is a mistake and correct it back.

        The bakery's copyright stays in their own bar above. Only the credit moves.
      */}
      <GlazedPlate line="Double Dipped by" />
    </footer>
  );
}

"use client";

import { useState } from "react";
import { site, fullAddress, mapsUrl, mapsEmbedUrl } from "@/data/site";

/**
 * The map, loaded only if somebody asks for it.
 *
 * The embedded version used to load on every visit to this page, which bought three
 * problems for one map. A keyboard user tabbing down the page fell into Google's iframe
 * and had to fight their way back out. Every visitor pinged Google whether they cared
 * about the map or not. And it is a third-party frame on a site whose whole premise is
 * that it does not depend on anybody else's service.
 *
 * So the default is a still panel with the address, a Directions link that works
 * everywhere, and a button for anyone who genuinely wants the interactive map. Most
 * people want the address and the button; they get it without the freight.
 */
export default function MapEmbed() {
  const [loaded, setLoaded] = useState(false);

  if (loaded) {
    return (
      <div className="overflow-hidden rounded-panel border border-awning/15">
        <iframe
          title={`Map to ${site.name}`}
          src={mapsEmbedUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-80 w-full sm:h-[26rem]"
        />
      </div>
    );
  }

  return (
    <div className="flex h-80 flex-col items-center justify-center gap-4 rounded-panel border border-awning/15 bg-paper-dim px-6 text-center sm:h-[26rem]">
      <svg viewBox="0 0 24 24" className="h-10 w-10 text-brick/60" fill="currentColor" aria-hidden="true">
        <path d="M12 2a7 7 0 0 0-7 7c0 5.1 6.2 12.4 6.5 12.7a.7.7 0 0 0 1 0C12.8 21.4 19 14.1 19 9a7 7 0 0 0-7-7m0 9.5A2.5 2.5 0 1 1 14.5 9 2.5 2.5 0 0 1 12 11.5" />
      </svg>
      <p className="font-display text-lg font-bold text-awning">{fullAddress}</p>
      <p className="max-w-xs text-sm text-awning/75">
        Downtown, north side of the street, under the brown awning.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-dark">
          Directions
        </a>
        <button type="button" onClick={() => setLoaded(true)} className="btn btn-dark">
          Show the map
        </button>
      </div>
    </div>
  );
}

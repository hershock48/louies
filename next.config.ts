import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /*
      Next 16 only honours a quality it has been told about, so 72 was silently
      falling back to 75. The hero sits at 70% opacity under a dark gradient, where
      fine detail is invisible; 60 looks identical there and is worth about 100KB on
      the largest image on the site.

      45 was tried and rejected, measured rather than judged: against 60 it is an RMS
      difference of 7.46/255 with an 81/255 peak, about 5.2/255 as the visitor sees it
      through the opacity and the gradient. That is above the threshold of visibility
      on a phone, for 15KB. 60 is the floor.
    */
    qualities: [60, 75],

    /*
      The ladder stops at 1920.

      A 1440px desktop at 2x wants 2400 real pixels for the hero, and the browser takes
      the next candidate up. By default that is 3840, so Next was upscaling the source
      to 3840 and shipping a quarter of a megabyte of invented detail behind a gradient.
      Removing it makes the browser take the largest rendition that actually exists.

      1920 rather than 2048, measured the same way the quality floor was: rendered at
      display size, dimmed to the 70% the hero sits at, composited on the night
      background and diffed against a full 2048 rendition. 1920 is 3.69/255 away and
      48KB lighter; the 1200 rendition is 6.90/255 away, which is over the threshold
      this site already established as visible on a phone, so the ladder cannot stop
      any lower than this.

      Safe to keep short because the site has three photographs, all the bakery's own,
      none anywhere near 4K. Add the larger rungs back when a source can fill them.
    */
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },
  /*
    THE HOST SPLIT, per glaze/proposal.md. The pitch host serves the proposal at its
    root and the full demo under /demo; the client's own domain, when it arrives,
    serves the site at its root with no proposal anywhere.

    These MUST be beforeFiles: a plain rewrites() array is afterFiles, which only runs
    after Next has failed to find a page, and app/page.tsx already answers /, so the
    root rewrite would silently never fire.

    Host scoping rather than basePath, because basePath is global to a build and would
    bury the real site under /demo the day louies-bakery.com goes live.

    DELETE this whole block, and public/pitch/, once the bakery signs or passes.
  */
  async rewrites() {
    const onPitchHost = [{ type: "host" as const, value: "louies.glazedweb.com" }];
    return {
      beforeFiles: [
        { source: "/", destination: "/pitch/louies/index.html", has: onPitchHost },
        { source: "/demo", destination: "/", has: onPitchHost },
        { source: "/demo/:path*", destination: "/:path*", has: onPitchHost },
      ],
    };
  },

  // NOINDEX WHILE THIS IS A SPEC BUILD. See the long note in src/app/robots.ts.
  // Remove this and the robots rule together, on the day the site becomes theirs.
  // It also covers the pitch host and the .vercel.app host, which proposal.md requires.
  async headers() {
    return [
      { source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
    ];
  },
};

export default nextConfig;

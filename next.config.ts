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

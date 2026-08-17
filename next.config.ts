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
  // NOINDEX WHILE THIS IS A SPEC BUILD. See the long note in src/app/robots.ts.
  // Remove this and the robots rule together, on the day the site becomes theirs.
  async headers() {
    return [
      { source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
    ];
  },
};

export default nextConfig;

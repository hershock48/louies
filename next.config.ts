import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /*
      Next 16 only honours a quality it has been told about, so 72 was silently
      falling back to 75. The hero sits at 70% opacity under a dark gradient, where
      fine detail is invisible; 60 looks identical there and is worth about 100KB on
      the largest image on the site.
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

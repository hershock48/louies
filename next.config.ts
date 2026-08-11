import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // NOINDEX WHILE THIS IS A SPEC BUILD. See the long note in src/app/robots.ts.
  // Remove this and the robots rule together, on the day the site becomes theirs.
  async headers() {
    return [
      { source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
    ];
  },
};

export default nextConfig;

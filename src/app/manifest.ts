import type { MetadataRoute } from "next";
import { site } from "@/data/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.shortName,
    description: site.blurb,
    start_url: "/",
    display: "standalone",
    background_color: "#faf3e4",
    theme_color: "#0b0705",
  };
}

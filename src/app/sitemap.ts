import type { MetadataRoute } from "next";
import { site } from "@/data/site";

const routes = ["", "/menu", "/order", "/shop", "/cookies", "/story", "/visit"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: path === "" || path === "/menu" ? "daily" : "monthly",
    priority: path === "" ? 1 : path === "/menu" ? 0.9 : 0.7,
  }));
}

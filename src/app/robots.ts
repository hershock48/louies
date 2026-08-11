import type { MetadataRoute } from "next";
import { site } from "@/data/site";

/**
 * DISALLOW, DELIBERATELY, UNTIL THIS IS THEIR SITE.
 *
 * This is a spec build: a real business's menu, history and photographs served from a
 * hostname that is not theirs. Indexing it would put a second copy of Louie's content
 * on the web competing with the bakery we are trying to win, and a prospect who finds
 * their own words ranking under someone else's domain has a fair complaint.
 *
 * next.config.ts sends X-Robots-Tag as the belt to this file's braces. Remove BOTH on
 * the day it becomes their site, and not before. It is on the checklist in the README.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", disallow: "/" }],
    sitemap: `${site.url}/sitemap.xml`,
  };
}

import type { MetadataRoute } from "next";
import { site } from "@/data/site";

/**
 * NO SEARCH ENGINES, BUT YES TO LINK PREVIEWS.
 *
 * This is a spec build: a real business's menu, history and photographs served from a
 * hostname that is not theirs. Indexing it would put a second copy of Louie's content
 * on the web competing with the bakery we are trying to win, and a prospect who finds
 * their own words ranking under somebody else's domain has a fair complaint. So the
 * general rule stays "go away", and next.config.ts sends X-Robots-Tag as the belt to
 * these braces.
 *
 * The social crawlers are a different animal and were being caught by the same net.
 * Facebook's scraper obeys robots.txt, so `Disallow: /` meant a link pasted into
 * Messenger came up as a bare URL with no picture and no title: the proposal was being
 * shared and arriving looking like nothing. These agents do not index anything into a
 * search result; they fetch one page to draw a card. Letting them through costs us
 * none of the protection above and is the difference between a link that sells and a
 * link that looks broken.
 *
 * Remove the whole file, and the X-Robots-Tag header with it, on the day this becomes
 * their site. It is on the checklist in the README.
 */
const SOCIAL = [
  "facebookexternalhit",
  "facebookcatalog",
  "Facebot",
  "Twitterbot",
  "LinkedInBot",
  "Slackbot",
  "Slackbot-LinkExpanding",
  "WhatsApp",
  "TelegramBot",
  "Discordbot",
  "Applebot",
  "SkypeUriPreview",
  "redditbot",
  "Iframely",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: SOCIAL, allow: "/" },
      { userAgent: "*", disallow: "/" },
    ],
    sitemap: `${site.url}/sitemap.xml`,
  };
}

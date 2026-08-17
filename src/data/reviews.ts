/**
 * WHAT PEOPLE SAY
 *
 * The old site had a Testimonials page with no testimonials on it, just a link out to
 * "772 MORE REVIEWS ON OUR FACEBOOK PAGE". The proof of this place is in what customers
 * write about it, and none of it was on the site.
 *
 * Quoted verbatim, including the punctuation and the typo, because tidying a review is
 * how it stops sounding like a person. Public reviews, attributed to the handle and the
 * platform they were left on, which is the normal convention.
 *
 * PLACEHOLDER: worth telling the bakery these are on the site before launch. It is on
 * the checklist in the README.
 */

export type Review = {
  quote: string;
  who: string;
  where: string;
  /** The reviewer's own title for the review, where it is better than the quote. */
  title?: string;
};

export const reviews: Review[] = [
  {
    quote: "I can't eat doughnuts from a grocery store anymore.",
    who: "Oceans4T",
    where: "Tripadvisor",
    title: "Best Damn Doughnuts Ever",
  },
  {
    quote: "Love this place. Loved it all my life.",
    who: "Ellen A",
    where: "Tripadvisor",
    title: "Best nut rolls ever",
  },
  {
    quote:
      "I have been known to drive to Louie's for the express purpose of buying nut rolls.",
    who: "A reviewer",
    where: "Tripadvisor",
    title: "Worth the drive",
  },
];

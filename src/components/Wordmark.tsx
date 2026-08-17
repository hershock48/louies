import Image from "next/image";
import { site } from "@/data/site";

/**
 * THE LOGO, WITH THE HAT DOING SOMETHING.
 *
 * Their mark is a brush script with a chef's toque set over the B of Bakery. Two things
 * made this worth animating rather than leaving flat.
 *
 * One, it is the most human thing they own. Every roundup of 2026 design trends lands
 * on some version of the same idea, that hand-drawn and handwritten marks are the
 * pushback against AI-smoothed design. Louie's has had one since 1952 and the old site
 * used it as a static header image and nothing else.
 *
 * Two, the toque is a SEPARATE CONNECTED COMPONENT in their artwork. It does not touch
 * the wordmark at any point. So it can be lifted out and moved without redrawing a
 * single line of their logo, which is the difference between animating their mark and
 * animating a tracing of it. glaze.md is emphatic about that distinction and the reason
 * it is emphatic is a donut that got redrawn from scratch while the real one sat in the
 * repo.
 *
 * Split with scipy.ndimage.label: component 1, x527-788, y0-174 on the 1050x432 canvas.
 * The two layers are the same canvas size so they stack with no positioning maths.
 *
 * The motion, in the order it happens:
 *
 *   1. The hat drops in and settles, once, on load. It arrives from above with a little
 *      rotation and overshoots slightly before it sits, so it reads as being set down
 *      on the B rather than sliding into a slot.
 *   2. Then a slow sway, six seconds a cycle, about a degree and a half. Wind, not a
 *      metronome. Long enough that you notice it only if you look.
 *   3. On hover it tips, the way somebody tips their hat.
 *
 * It rocks on the middle of its brim, 62.6% across and 40.3% down, because a pivot
 * anywhere else makes it spin about its own middle and lift off the letter.
 *
 * The un-animated state is the finished state: both layers are in their final position
 * with no transform, so a blocked script or reduced motion leaves the logo exactly as
 * drawn. See the reduced-motion block in globals.css.
 */
export default function Wordmark({
  className = "",
  hero = false,
}: {
  className?: string;
  /**
   * The showpiece version for the homepage hero. Same two layers, same artwork; the
   * difference is the hat's entrance. In the header it lands in 900ms because a person
   * mid-navigation should not wait on a logo. In the hero it falls for two seconds,
   * swaying as it comes down like a leaf, because there the logo IS the show and the
   * hat landing on the B is the moment. Keyframes in globals.css under lb-mark--hero.
   */
  hero?: boolean;
}) {
  return (
    <span className={`lb-mark ${hero ? "lb-mark--hero" : ""} relative inline-block ${className}`}>
      <Image
        src="/louies-logo-word.png"
        alt={site.name}
        width={220}
        height={91}
        priority
        className="h-full w-auto"
      />
      {/*
        Three nested layers, one job each, because ONE ELEMENT CANNOT DO ALL THREE.
        A transform is a single list and an element has a single transform-origin, so
        composing fall, spin and sway on one node either snaps between origins or
        multiplies the curves into each other. Split, each motion gets its own clean
        curve and its own pivot:

          .lb-hat-drop   translateY only. The fall and the landing bounce.
          .lb-hat-spin   rotation during flight, about the hat's own centre
                         (62.6% 20% of the canvas), because a tossed hat spins
                         about its middle.
          .lb-hat        the settle and the breeze, about the brim (62.6% 40.3%),
                         because a landed hat rocks on what it sits on.

        In the header the wrappers exist and do nothing; only the hero animates them.
      */}
      <span className="lb-hat-drop absolute inset-0 block">
        <span className="lb-hat-spin absolute inset-0 block">
          <Image
            src="/louies-logo-hat.png"
            alt=""
            aria-hidden="true"
            width={220}
            height={91}
            priority
            className="lb-hat absolute inset-0 h-full w-auto"
          />
        </span>
      </span>
    </span>
  );
}

/**
 * THE CAROUSEL OVEN
 *
 * Louie's bakes on an oven with six revolving shelves. It runs all night, the bakers
 * load and unload it as it comes around, and no customer has ever laid eyes on it.
 *
 * It is the signature device of the site for three reasons: it is true, it is theirs
 * alone, and it gives a bakery website a piece of visual identity that is not another
 * photograph of a donut. It marks the daily board, the section breaks and the story
 * page.
 *
 * Six spokes, six trays, one rotation a minute. Slow enough to read as machinery.
 * Under prefers-reduced-motion the animation is dropped in globals.css and it simply
 * sits there, which is fine, because it is a decent mark standing still.
 */
export default function CarouselOven({
  className = "",
  spin = true,
}: {
  className?: string;
  /** Off for places where a turning wheel would compete, like inside a button. */
  spin?: boolean;
}) {
  const shelves = [0, 1, 2, 3, 4, 5];

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
      focusable="false"
      fill="none"
    >
      {/* The oven mouth. */}
      <circle cx="50" cy="50" r="47" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
      <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.75" opacity="0.2" />

      <g className={spin ? "oven-turn" : undefined}>
        {shelves.map((i) => {
          const angle = (i * 360) / shelves.length;
          return (
            <g key={i} transform={`rotate(${angle} 50 50)`}>
              {/* The arm that carries the shelf. */}
              <line
                x1="50"
                y1="50"
                x2="50"
                y2="16"
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.4"
              />
              {/* The tray, hanging level the way they actually do. */}
              <rect
                x="39"
                y="12"
                width="22"
                height="6"
                rx="1.5"
                fill="currentColor"
                opacity="0.85"
              />
              {/* Three rolls on the tray. */}
              <g fill="currentColor" opacity="0.5">
                <circle cx="44" cy="9" r="2.4" />
                <circle cx="50" cy="9" r="2.4" />
                <circle cx="56" cy="9" r="2.4" />
              </g>
            </g>
          );
        })}
      </g>

      {/* The hub. */}
      <circle cx="50" cy="50" r="5" fill="currentColor" opacity="0.75" />
      <circle cx="50" cy="50" r="1.75" fill="currentColor" opacity="0.3" />
    </svg>
  );
}

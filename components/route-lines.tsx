/**
 * Ambient backdrop: curved routes connecting points across a loose
 * map-like field, echoing both historic trade routes through the
 * Turkic world and a live network of people. Decorative only.
 */
export function RouteLinesBackdrop() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 800 500"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.35] dark:opacity-[0.45]"
    >
      <g fill="none" strokeWidth="1.25" strokeLinecap="round">
        <path
          d="M 60 380 Q 220 260 340 300 T 560 200 T 740 120"
          stroke="var(--accent)"
        />
        <path
          d="M 100 120 Q 260 200 380 160 T 620 260 T 720 380"
          stroke="var(--accent-warm)"
        />
        <path
          d="M 40 220 Q 200 180 320 240 T 540 340 T 760 300"
          stroke="var(--accent)"
          opacity="0.6"
        />
      </g>
      <g fill="var(--accent)">
        {[
          [60, 380],
          [340, 300],
          [560, 200],
          [740, 120],
          [100, 120],
          [380, 160],
          [620, 260],
          [720, 380],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3.5" />
        ))}
      </g>
    </svg>
  );
}

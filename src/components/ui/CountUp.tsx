'use client';

import { useEffect } from 'react';
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotionConfig,
  useTransform,
} from 'motion/react';

const DURATION = 1.2;

type CountUpProps = {
  value: number;
  // Passed in rather than done here: how a number reads belongs to the locale, and this
  // component has no business knowing whether it is counting euros or people.
  format: (value: number) => string;
};

// A total that lands at its figure says something a static number does not: that it was
// counted, and that it is still going up. Driven by a motion value rather than state, so the
// frames never touch React's render path.
export function CountUp({ value, format }: CountUpProps) {
  // The config flavour, not the bare hook: it folds MotionConfig's decision in on top of the
  // system preference, which is how the app states that preference in one place — and the only
  // version a test can answer, since the bare hook latches the media query on first read.
  const reduced = useReducedMotionConfig();
  const count = useMotionValue(reduced ? value : 0);
  // Whole units while it climbs, because counting through fractions of a euro reads as noise
  // and a fractional donor reads as a bug. The exact figure only at the end, which is the one
  // frame that has to be true: an amount with cents in it must land on them, not near them.
  const text = useTransform(count, (latest) =>
    format(latest === value ? value : Math.round(latest)),
  );

  useEffect(() => {
    // Someone who asked for less motion wants the figure, not the performance.
    if (reduced) {
      count.set(value);

      return;
    }

    // Fast to begin with and easing out, the way a tally slows as it catches up. Counting
    // from wherever it currently is means a refreshed figure ticks up from the old one
    // instead of dropping back to zero.
    const controls = animate(count, value, { duration: DURATION, ease: 'easeOut' });

    return () => controls.stop();
  }, [count, reduced, value]);

  return <motion.span>{text}</motion.span>;
}

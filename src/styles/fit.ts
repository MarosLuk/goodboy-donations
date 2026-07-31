// The design frame is 1024 tall and step 1 fills 929 of it, which is 1049 once the page
// keeps 60 above the stepper and below the footer. On a window at least that tall every
// number is the design's own; from there down to a laptop the vertical rhythm eases
// towards its floor, and that is what keeps the whole step on one screen.
const FULL = 1080;
const FLOOR = 800;

/**
 * A length that holds `design` on a window as tall as the design frame and eases to
 * `floor` on a short one. Horizontal measurements are never fed through here — only the
 * ones that decide whether the step needs a scrollbar.
 */
export function fit(design: number, floor: number) {
  const rate = ((design - floor) / (FULL - FLOOR)).toFixed(4);

  return `clamp(${floor}px, calc(${design}px - (${FULL}px - 100dvh) * ${rate}), ${design}px)`;
}

/**
 * Marks a section that can outgrow the window on its own — a list the visitor keeps
 * adding to. The screen above it then caps to the window rather than growing with it,
 * which is what leaves the scrolling to the one box inside that asked for it.
 *
 * An attribute and `:has()` rather than a prop: the page is rendered on the server and
 * which step is showing is client state, so there is no prop to pass down.
 */
const FILLS_SCREEN = 'data-fills-screen';

/** Spread onto the section that grows. */
export const fillsScreen = { [FILLS_SCREEN]: '' } as const;

/** Matches an element with such a section somewhere inside it. */
export const withFillingChild = `&:has([${FILLS_SCREEN}])`;

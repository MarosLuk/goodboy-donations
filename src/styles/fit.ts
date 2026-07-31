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

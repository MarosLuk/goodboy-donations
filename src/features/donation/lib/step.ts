export const STEPS = [1, 2, 3] as const;

export type Step = (typeof STEPS)[number];

// Reads whatever came in from the address bar. Anything unexpected is the first step,
// never a crash and never a blank screen.
export function parseStep(value: string | string[] | undefined): Step {
  const first = Array.isArray(value) ? value[0] : value;
  const parsed = Number(first);

  return STEPS.includes(parsed as Step) ? (parsed as Step) : 1;
}

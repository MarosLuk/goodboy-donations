'use client';

import { useEffect } from 'react';
import type { Step } from '../lib/step';
import { useWizard } from '../store/wizard';

// replaceState rather than pushState: the step stays shareable and the server can read
// it, without filling the history with entries that would make the browser back button
// walk the form in the opposite direction to the one on screen.
export function useStepInUrl(initialStep: Step) {
  const step = useWizard((state) => state.step);
  const goTo = useWizard((state) => state.goTo);

  // The store clamps this, so a link to the last step still lands on the first.
  useEffect(() => {
    goTo(initialStep);
  }, [goTo, initialStep]);

  useEffect(() => {
    const url = new URL(window.location.href);

    if (step === 1) {
      url.searchParams.delete('step');
    } else {
      url.searchParams.set('step', String(step));
    }

    window.history.replaceState(null, '', url);
  }, [step]);
}

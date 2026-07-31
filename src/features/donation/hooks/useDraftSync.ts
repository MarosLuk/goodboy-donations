'use client';

import { useEffect } from 'react';
import type { Control } from 'react-hook-form';
import { useWatch } from 'react-hook-form';
import type { DonationDraft } from '../store/wizard';
import { useWizard } from '../store/wizard';

/**
 * Writes what is on screen back into the draft as it is typed.
 *
 * A step's fields live in its own form, which is gone the moment the step unmounts — and it
 * unmounts for reasons the form knows nothing about, changing the language among them. The
 * draft outlives all of that, so it is what the step is rebuilt from; this is what keeps the
 * two the same. It does not validate and does not move off the step: submitting still owns
 * both of those.
 */
export function useDraftSync<T extends Partial<DonationDraft>>(control: Control<T>) {
  const keepDraft = useWizard((state) => state.keepDraft);
  // A new object only when a value actually changed, so this does not run on every render.
  const values = useWatch({ control });

  useEffect(() => {
    keepDraft(values as Partial<DonationDraft>);
  }, [values, keepDraft]);
}

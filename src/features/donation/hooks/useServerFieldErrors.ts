'use client';

import { useEffect } from 'react';
import type { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { stepForField } from '../lib/api-errors';
import type { Step } from '../lib/step';
import { useWizard } from '../store/wizard';

// Rejections from the server wait in the store until the step holding the field is on
// screen, then land on it like any other validation message. Messages stay translation
// keys, the same as the ones zod produces.
export function useServerFieldErrors<T extends FieldValues>(form: UseFormReturn<T>, ownStep: Step) {
  const serverErrors = useWizard((state) => state.serverErrors);
  const clearServerErrors = useWizard((state) => state.clearServerErrors);

  useEffect(() => {
    const mine = Object.entries(serverErrors).filter(([field]) => stepForField(field) === ownStep);

    if (mine.length === 0) {
      return;
    }

    for (const [field, messageKey] of mine) {
      form.setError(field as Path<T>, { type: 'server', message: messageKey });
    }

    clearServerErrors();
  }, [serverErrors, ownStep, form, clearServerErrors]);
}

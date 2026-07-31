'use client';

import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Checkbox } from '@/components/ui/Checkbox';
import type { StepThreeValues } from '../schema/donation';

export function ConsentField() {
  const { t } = useTranslation();
  const {
    register,
    formState: { errors },
  } = useFormContext<StepThreeValues>();

  const message = errors.consent?.message;

  return (
    <Checkbox
      label={t('donation.consent.label')}
      error={message ? t(message) : undefined}
      {...register('consent')}
    />
  );
}

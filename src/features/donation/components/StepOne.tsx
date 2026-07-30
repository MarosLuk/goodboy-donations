'use client';

import type { ReactNode } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ArrowLeftIcon } from '@/components/icons/ArrowLeftIcon';
import { ArrowRightIcon } from '@/components/icons/ArrowRightIcon';
import { Button } from '@/components/ui/Button';
import type { StepOneValues } from '../schema/donation';
import { stepOneSchema } from '../schema/donation';
import { useWizard } from '../store/wizard';
import { AmountPicker } from './AmountPicker';
import { HelpTypeToggle } from './HelpTypeToggle';
import { StepActions, StepLayout } from './StepActions';

// The shelter field belongs to the shelters feature, so it arrives as a slot instead
// of an import: features do not reach into each other, and the page owns both.
export type ShelterFieldProps = {
  value: { id: number; name: string } | null;
  onChange: (shelter: { id: number; name: string } | null) => void;
  error?: string;
  optional: boolean;
};

const Headline = styled.h1`
  font-size: ${({ theme }) => theme.heading.sm.fontSize};
  line-height: ${({ theme }) => theme.heading.sm.lineHeight};
  letter-spacing: ${({ theme }) => theme.heading.sm.letterSpacing};
  font-weight: ${({ theme }) => theme.font.weight.bold};

  @media (min-width: ${({ theme }) => theme.breakpoint.desktop}) {
    font-size: ${({ theme }) => theme.heading.lg.fontSize};
    line-height: ${({ theme }) => theme.heading.lg.lineHeight};
  }
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.text.md.fontSize};
  line-height: ${({ theme }) => theme.text.md.lineHeight};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
`;

export function StepOne({
  renderShelterField,
}: {
  renderShelterField: (props: ShelterFieldProps) => ReactNode;
}) {
  const { t } = useTranslation();
  const draft = useWizard((state) => state.draft);
  const advance = useWizard((state) => state.advance);

  const form = useForm<StepOneValues>({
    resolver: zodResolver(stepOneSchema),
    defaultValues: {
      helpType: draft.helpType,
      shelter: draft.shelter,
      amount: draft.amount,
    },
  });

  const { errors } = form.formState;
  // useWatch rather than form.watch: watch mutates outside React's model, which the
  // react-hooks lint rule flags, and a subscribing hook is the supported way.
  const helpType = useWatch({ control: form.control, name: 'helpType' });
  const shelter = useWatch({ control: form.control, name: 'shelter' });
  const amount = useWatch({ control: form.control, name: 'amount' });

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit((values) => advance(values))} noValidate>
        <StepLayout>
          <Headline>{t('donation.headline.1')}</Headline>

          <HelpTypeToggle />

          {/* "O projekte" sits above the shelter select in the design, most likely a
              leftover from the template it was built on. Kept as designed. */}
          <SectionTitle>{t('donation.about')}</SectionTitle>

          {renderShelterField({
            value: shelter,
            onChange: (value) => form.setValue('shelter', value, { shouldValidate: true }),
            error: errors.shelter?.message ? t(errors.shelter.message) : undefined,
            optional: helpType === 'foundation',
          })}

          <AmountPicker
            value={amount}
            onChange={(value) => form.setValue('amount', value, { shouldValidate: true })}
            error={errors.amount?.message ? t(errors.amount.message) : undefined}
          />

          <StepActions>
            <Button variant="secondary" disabled>
              <ArrowLeftIcon />
              {t('common.back')}
            </Button>

            <Button type="submit">
              {t('donation.actions.continue')}
              <ArrowRightIcon />
            </Button>
          </StepActions>
        </StepLayout>
      </form>
    </FormProvider>
  );
}

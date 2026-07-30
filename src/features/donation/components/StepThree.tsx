'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ArrowLeftIcon } from '@/components/icons/ArrowLeftIcon';
import { Button } from '@/components/ui/Button';
import type { StepThreeValues } from '../schema/donation';
import { stepThreeSchema } from '../schema/donation';
import { useWizard } from '../store/wizard';
import { ConsentField } from './ConsentField';
import { DonationSummary } from './DonationSummary';
import { StepActions, StepLayout } from './StepActions';

const Headline = styled.h1`
  font-size: ${({ theme }) => theme.heading.sm.fontSize};
  line-height: ${({ theme }) => theme.heading.sm.lineHeight};
  letter-spacing: ${({ theme }) => theme.heading.sm.letterSpacing};
  font-weight: ${({ theme }) => theme.font.weight.bold};
`;

export function StepThree({ onConfirm }: { onConfirm?: (consent: boolean) => void }) {
  const { t } = useTranslation();
  const draft = useWizard((state) => state.draft);
  const goBack = useWizard((state) => state.goBack);

  const form = useForm<StepThreeValues>({
    resolver: zodResolver(stepThreeSchema),
    defaultValues: { consent: draft.consent },
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit((values) => onConfirm?.(values.consent))} noValidate>
        <StepLayout>
          <Headline>{t('donation.headline.3')}</Headline>

          <DonationSummary draft={draft} />

          <ConsentField />

          <StepActions>
            <Button variant="secondary" onClick={goBack}>
              <ArrowLeftIcon />
              {t('common.back')}
            </Button>

            <Button type="submit">{t('donation.actions.submit')}</Button>
          </StepActions>
        </StepLayout>
      </form>
    </FormProvider>
  );
}

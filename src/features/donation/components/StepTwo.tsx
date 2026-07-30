'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ArrowLeftIcon } from '@/components/icons/ArrowLeftIcon';
import { ArrowRightIcon } from '@/components/icons/ArrowRightIcon';
import { Button } from '@/components/ui/Button';
import type { StepTwoValues } from '../schema/donation';
import { stepTwoSchema } from '../schema/donation';
import { useServerFieldErrors } from '../hooks/useServerFieldErrors';
import { useWizard } from '../store/wizard';
import { DonorList } from './DonorList';
import { StepActions, StepLayout } from './StepActions';

const Headline = styled.h1`
  font-size: ${({ theme }) => theme.heading.sm.fontSize};
  line-height: ${({ theme }) => theme.heading.sm.lineHeight};
  letter-spacing: ${({ theme }) => theme.heading.sm.letterSpacing};
  font-weight: ${({ theme }) => theme.font.weight.bold};
`;

export function StepTwo() {
  const { t } = useTranslation();
  const draft = useWizard((state) => state.draft);
  const advance = useWizard((state) => state.advance);
  const goBack = useWizard((state) => state.goBack);

  const form = useForm<StepTwoValues>({
    resolver: zodResolver(stepTwoSchema),
    defaultValues: { donors: draft.donors },
  });

  useServerFieldErrors(form, 2);

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit((values) => advance(values))} noValidate>
        <StepLayout>
          <Headline>{t('donation.headline.2')}</Headline>

          <DonorList />

          <StepActions>
            <Button variant="secondary" onClick={goBack}>
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

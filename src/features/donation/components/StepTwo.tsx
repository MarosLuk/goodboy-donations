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
import { Section, SectionTitle, StepActions, StepForm, StepLayout } from './StepActions';

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
      <StepForm onSubmit={form.handleSubmit((values) => advance(values))} noValidate>
        <StepLayout>
          <Headline data-step-heading tabIndex={-1}>
            {t('donation.headline.2')}
          </Headline>

          <Section>
            <SectionTitle>{t('donation.aboutYou')}</SectionTitle>
            <DonorList />
          </Section>

          <StepActions>
            <Button variant="secondary" size="lg" onClick={goBack}>
              <ArrowLeftIcon />
              {t('common.back')}
            </Button>

            <Button type="submit" size="lg">
              {t('donation.actions.continue')}
              <ArrowRightIcon />
            </Button>
          </StepActions>
        </StepLayout>
      </StepForm>
    </FormProvider>
  );
}

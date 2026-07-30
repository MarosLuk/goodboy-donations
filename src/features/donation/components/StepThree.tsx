'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ArrowLeftIcon } from '@/components/icons/ArrowLeftIcon';
import { Button } from '@/components/ui/Button';
import { FieldError } from '@/components/ui/FieldError';
import { ApiError } from '@/lib/api/errors';
import { useContribute } from '../api/useContribute';
import { fieldErrorsFrom, messageKeyForStatus } from '../lib/api-errors';
import { toContributePayload } from '../lib/payload';
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

export function StepThree() {
  const { t } = useTranslation();
  const draft = useWizard((state) => state.draft);
  const goBack = useWizard((state) => state.goBack);
  const markSent = useWizard((state) => state.markSent);
  const setServerErrors = useWizard((state) => state.setServerErrors);

  const contribute = useContribute();
  const [failure, setFailure] = useState<string | null>(null);

  const form = useForm<StepThreeValues>({
    resolver: zodResolver(stepThreeSchema),
    defaultValues: { consent: draft.consent },
  });

  async function submit() {
    setFailure(null);

    try {
      await contribute.mutateAsync(toContributePayload(draft));
      markSent();
    } catch (error) {
      if (!(error instanceof ApiError)) {
        setFailure('donation.submit.failed');
        return;
      }

      const fields = fieldErrorsFrom(error.messages);

      // A rejected field beats a general message: the store carries it back to the step
      // that can show it.
      if (Object.keys(fields).length > 0) {
        setServerErrors(fields);
        return;
      }

      setFailure(messageKeyForStatus(error.status));
    }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(submit)} noValidate>
        <StepLayout>
          <Headline>{t('donation.headline.3')}</Headline>

          <DonationSummary draft={draft} />

          <ConsentField />

          {failure ? <FieldError role="alert">{t(failure)}</FieldError> : null}

          <StepActions>
            <Button variant="secondary" onClick={goBack} disabled={contribute.isPending}>
              <ArrowLeftIcon />
              {t('common.back')}
            </Button>

            <Button type="submit" disabled={contribute.isPending}>
              {contribute.isPending ? t('donation.submit.pending') : t('donation.actions.submit')}
            </Button>
          </StepActions>
        </StepLayout>
      </form>
    </FormProvider>
  );
}

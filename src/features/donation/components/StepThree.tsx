'use client';

import { useRef, useState } from 'react';
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

export function StepThree({ onDonated }: { onDonated?: () => void }) {
  const { t } = useTranslation();
  const draft = useWizard((state) => state.draft);
  const goBack = useWizard((state) => state.goBack);
  const markSent = useWizard((state) => state.markSent);
  const setServerErrors = useWizard((state) => state.setServerErrors);

  const contribute = useContribute();
  const [failure, setFailure] = useState<string | null>(null);

  // A ref rather than isPending: two clicks in the same tick both run before React has
  // re-rendered with the pending flag, and the disabled attribute arrives too late. For a
  // donation that would mean giving twice, so the guard has to be synchronous.
  const inFlight = useRef(false);

  const form = useForm<StepThreeValues>({
    resolver: zodResolver(stepThreeSchema),
    defaultValues: { consent: draft.consent },
  });

  async function submit() {
    if (inFlight.current) {
      return;
    }

    inFlight.current = true;
    setFailure(null);

    try {
      await contribute.mutateAsync(toContributePayload(draft));
      markSent();
      onDonated?.();
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
    } finally {
      inFlight.current = false;
    }
  }

  return (
    <FormProvider {...form}>
      {/* handleSubmit is called from inside the handler rather than passed during
          render, so the in-flight ref is only ever read while handling an event. */}
      <form
        onSubmit={(event) => {
          void form.handleSubmit(submit)(event);
        }}
        noValidate
      >
        <StepLayout>
          <Headline data-step-heading tabIndex={-1}>
            {t('donation.headline.3')}
          </Headline>

          <DonationSummary draft={draft} />

          <ConsentField />

          {failure ? <FieldError role="alert">{t(failure)}</FieldError> : null}

          <StepActions>
            <Button variant="secondary" size="lg" onClick={goBack} disabled={contribute.isPending}>
              <ArrowLeftIcon />
              {t('common.back')}
            </Button>

            <Button type="submit" size="lg" disabled={contribute.isPending}>
              {contribute.isPending ? t('donation.submit.pending') : t('donation.actions.submit')}
            </Button>
          </StepActions>
        </StepLayout>
      </form>
    </FormProvider>
  );
}

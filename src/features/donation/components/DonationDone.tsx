'use client';

import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Button } from '@/components/ui/Button';
import { toLocale } from '@/i18n/settings';
import { formatCurrency } from '@/lib/format';
import { useWizard } from '../store/wizard';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.space[24]};
  padding: ${({ theme }) => `${theme.space[48]} 0`};
`;

const Heading = styled.h1`
  font-size: ${({ theme }) => theme.heading.sm.fontSize};
  line-height: ${({ theme }) => theme.heading.sm.lineHeight};
  letter-spacing: ${({ theme }) => theme.heading.sm.letterSpacing};
  font-weight: ${({ theme }) => theme.font.weight.bold};

  @media (min-width: ${({ theme }) => theme.breakpoint.desktop}) {
    font-size: ${({ theme }) => theme.heading.md.fontSize};
    line-height: ${({ theme }) => theme.heading.md.lineHeight};
  }
`;

const Text = styled.p`
  font-size: ${({ theme }) => theme.text.lg.fontSize};
  line-height: ${({ theme }) => theme.text.lg.lineHeight};
  color: ${({ theme }) => theme.color.content.tertiary};
`;

// The design has no screen for this, so it borrows the rhythm of the form it replaces.
// It says the amount and where it went, because that is what someone wants confirmed.
export function DonationDone() {
  const { t, i18n } = useTranslation();
  const draft = useWizard((state) => state.draft);
  const reset = useWizard((state) => state.reset);
  const locale = toLocale(i18n.resolvedLanguage);

  const amount = formatCurrency(draft.amount, locale);
  const toShelter = draft.helpType === 'shelter' && draft.shelter;

  return (
    <Wrapper>
      <Heading>{t('donation.done.heading')}</Heading>

      {/* role=status announces the confirmation without stealing focus. */}
      <Text role="status">
        {toShelter
          ? t('donation.done.shelter', { amount, shelter: draft.shelter?.name })
          : t('donation.done.foundation', { amount })}
      </Text>

      <Button size="lg" variant="secondary" onClick={reset}>
        {t('donation.done.again')}
      </Button>
    </Wrapper>
  );
}

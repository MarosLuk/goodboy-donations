'use client';

import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { toLocale } from '@/i18n/settings';
import { formatCount, formatCurrency } from '@/lib/format';
import { useResults } from '../api/useResults';

// Two columns rather than two boxes side by side: the amount and the count are meant to read
// as two separate figures, and left to a flex row a short "1" would sit right against the
// total. Stacks on a phone, where two columns would leave the labels wrapping.
const Stats = styled.dl`
  display: grid;
  gap: ${({ theme }) => theme.space[32]};
  max-width: 62ch;

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: ${({ theme }) => theme.space[48]};
  }
`;

const Stat = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[4]};
`;

const Value = styled.dd`
  font-size: ${({ theme }) => theme.heading.sm.fontSize};
  line-height: ${({ theme }) => theme.heading.sm.lineHeight};
  letter-spacing: ${({ theme }) => theme.heading.sm.letterSpacing};
  font-weight: ${({ theme }) => theme.font.weight.bold};
  color: ${({ theme }) => theme.color.action.primary.default};
`;

const Label = styled.dt`
  font-size: ${({ theme }) => theme.text.md.fontSize};
  line-height: ${({ theme }) => theme.text.md.lineHeight};
  color: ${({ theme }) => theme.color.content.tertiary};
`;

const Message = styled.p`
  font-size: ${({ theme }) => theme.text.md.fontSize};
  line-height: ${({ theme }) => theme.text.md.lineHeight};
  color: ${({ theme }) => theme.color.content.tertiary};
`;

export function ResultsSummary() {
  const { t, i18n } = useTranslation();
  const locale = toLocale(i18n.resolvedLanguage);
  const { data, isPending, isError } = useResults();

  // The endpoint currently answers 0 and 0, which would be indistinguishable from
  // a failed load if all three states rendered the same numbers.
  if (isPending) {
    return <Message>{t('common.loading')}</Message>;
  }

  if (isError) {
    return <Message role="alert">{t('results.loadFailed')}</Message>;
  }

  return (
    <Stats>
      <Stat>
        {/* dd before dt so the number reads first; the pair stays associated. */}
        <Value>{formatCurrency(data.contribution ?? 0, locale)}</Value>
        <Label>{t('results.contribution')}</Label>
      </Stat>

      <Stat>
        <Value>{formatCount(data.contributors, locale)}</Value>
        <Label>{t('results.contributors')}</Label>
      </Stat>
    </Stats>
  );
}

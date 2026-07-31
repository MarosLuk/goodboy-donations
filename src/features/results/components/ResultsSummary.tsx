'use client';

import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { CountUp } from '@/components/ui/CountUp';
import { toLocale } from '@/i18n/settings';
import { formatCount, formatCurrency } from '@/lib/format';
import { useResults } from '../api/useResults';

// Two columns, each centred on itself. The design centres them — read off the frame, where
// the shorter label and the wider figure above it share a centre to the pixel. Stacks on a
// phone, where two columns would leave the labels wrapping.
const Stats = styled.dl`
  display: grid;
  gap: ${({ theme }) => theme.space[32]};
  /* Rules above and below, the same hairline the footer draws; the frame keeps the
     numbers 64 off both rules. */
  padding: ${({ theme }) => `${theme.space[64]} 0`};
  border-top: ${({ theme }) => `${theme.borderWidth.xs} solid ${theme.color.content.quintary}`};
  border-bottom: ${({ theme }) => `${theme.borderWidth.xs} solid ${theme.color.content.quintary}`};

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: ${({ theme }) => theme.space[16]};
    /* The rules stop 32 short of the text at each end, unlike the footer's, which runs
       the full width. Not on a phone, where 32 more off each side of an already narrow
       column would start wrapping the labels. */
    margin: ${({ theme }) => `0 ${theme.space[32]}`};
  }
`;

const Stat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.space[12]};
  text-align: center;
`;

// 60/72 semibold and 18/24 semibold come from the frame itself, not from a guess: the file
// stores the size and line height per text node, and these two land exactly on heading.xl and
// text.lg. A phone gets a step down, since the design has no phone layout for this screen and
// a 60px figure on a 390px screen leaves no room for its own label.
const Value = styled.dd`
  font-size: ${({ theme }) => theme.heading.md.fontSize};
  line-height: ${({ theme }) => theme.heading.md.lineHeight};
  letter-spacing: ${({ theme }) => theme.heading.md.letterSpacing};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.color.action.primary.default};

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    font-size: ${({ theme }) => theme.heading.xl.fontSize};
    line-height: ${({ theme }) => theme.heading.xl.lineHeight};
    letter-spacing: ${({ theme }) => theme.heading.xl.letterSpacing};
  }
`;

const Label = styled.dt`
  font-size: ${({ theme }) => theme.text.lg.fontSize};
  line-height: ${({ theme }) => theme.text.lg.lineHeight};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.color.content.primary};
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
        <Value>
          <CountUp
            value={data.contribution ?? 0}
            format={(value) => formatCurrency(value, locale)}
          />
        </Value>
        <Label>{t('results.contribution')}</Label>
      </Stat>

      <Stat>
        <Value>
          <CountUp value={data.contributors} format={(value) => formatCount(value, locale)} />
        </Value>
        <Label>{t('results.contributors')}</Label>
      </Stat>
    </Stats>
  );
}

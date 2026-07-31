'use client';

import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { toLocale } from '@/i18n/settings';
import { formatCurrency } from '@/lib/format';
import type { DonationDraft } from '../store/wizard';

const List = styled.dl`
  display: grid;
  gap: ${({ theme }) => theme.space[12]};
  padding: ${({ theme }) => theme.space[16]};
  border-radius: ${({ theme }) => theme.radius[12]};
  background: ${({ theme }) => theme.color.surface.secondary};

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    grid-template-columns: max-content 1fr;
    column-gap: ${({ theme }) => theme.space[24]};
  }
`;

// display: contents keeps the term and its value as direct grid children, so the two
// columns line up across every row.
const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[2]};

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    display: contents;
  }
`;

// One element per line instead of <br>: the lines stay separate strings, which is
// both cleaner markup and something a test can point at.
const Line = styled.span`
  display: block;
`;

const Term = styled.dt`
  font-size: ${({ theme }) => theme.text.sm.fontSize};
  line-height: ${({ theme }) => theme.text.sm.lineHeight};
  color: ${({ theme }) => theme.color.content.tertiary};
`;

const Value = styled.dd`
  font-size: ${({ theme }) => theme.text.md.fontSize};
  line-height: ${({ theme }) => theme.text.md.lineHeight};
  color: ${({ theme }) => theme.color.content.primary};
`;

export function DonationSummary({ draft }: { draft: DonationDraft }) {
  const { t, i18n } = useTranslation();
  const locale = toLocale(i18n.resolvedLanguage);

  const rows = [
    { term: t('donation.summary.helpType'), value: t(`donation.helpType.${draft.helpType}`) },
    {
      term: t('donation.summary.shelter'),
      // A shelter picked earlier is shown even for a donation to the foundation, but
      // labelled as not part of it — the payload will not carry it either.
      value:
        draft.helpType === 'shelter' && draft.shelter
          ? draft.shelter.name
          : t('donation.summary.wholeFoundation'),
    },
    { term: t('donation.summary.amount'), value: formatCurrency(draft.amount, locale) },
  ];

  return (
    <List>
      {rows.map(({ term, value }) => (
        <Row key={term}>
          <Term>{term}</Term>
          <Value>{value}</Value>
        </Row>
      ))}

      {draft.donors.map((donor, index) => (
        <Row key={index}>
          <Term>{t('donation.summary.donor', { number: index + 1 })}</Term>
          <Value>
            <Line>
              {donor.firstName} {donor.lastName}
            </Line>
            <Line>{donor.email}</Line>
            {donor.phone ? (
              <Line>
                {donor.phonePrefix} {donor.phone}
              </Line>
            ) : null}
          </Value>
        </Row>
      ))}
    </List>
  );
}

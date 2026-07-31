'use client';

import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { toLocale } from '@/i18n/settings';
import { formatCurrency } from '@/lib/format';
import type { DonationDraft } from '../store/wizard';
import { Section, SectionTitle } from './StepActions';

// Plain rows the way the frame draws them: term on the left, value in semibold on the
// right, a hairline after each group of rows.
const List = styled.dl`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[16]};
  /* The summary's closing rule; the consent hangs 32 under it in the frame. */
  padding-bottom: ${({ theme }) => theme.space[32]};
  border-bottom: ${({ theme }) => `${theme.borderWidth.xs} solid ${theme.color.content.quintary}`};
  margin-bottom: ${({ theme }) => theme.space[16]};
`;

// The rule belongs to the row that opens a group: with the list gap and the margin it
// sits 32 from the row above, and the padding holds the row 32 under it — the spacing
// the frame gives its divider blocks.
const Row = styled.div<{ $ruled?: boolean }>`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[16]};

  ${({ $ruled }) =>
    $ruled &&
    css`
      margin-top: ${({ theme }) => theme.space[16]};
      padding-top: ${({ theme }) => theme.space[32]};
      border-top: ${({ theme }) => `${theme.borderWidth.xs} solid ${theme.color.content.quintary}`};
    `}
`;

const Term = styled.dt`
  font-size: ${({ theme }) => theme.text.md.fontSize};
  line-height: ${({ theme }) => theme.text.md.lineHeight};
  color: ${({ theme }) => theme.color.content.secondary};
`;

const Value = styled.dd`
  font-size: ${({ theme }) => theme.text.md.fontSize};
  line-height: ${({ theme }) => theme.text.md.lineHeight};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.color.content.primary};
  text-align: right;
`;

export function DonationSummary({ draft }: { draft: DonationDraft }) {
  const { t, i18n } = useTranslation();
  const locale = toLocale(i18n.resolvedLanguage);

  const rows = [
    {
      term: t('donation.summary.helpType'),
      value: t(`donation.summary.helpTypeValue.${draft.helpType}`),
    },
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
    <Section>
      <SectionTitle>{t('donation.summary.title')}</SectionTitle>

      <List>
        {rows.map(({ term, value }) => (
          <Row key={term}>
            <Term>{term}</Term>
            <Value>{value}</Value>
          </Row>
        ))}

        {draft.donors.map((donor, index) => (
          <Fragment key={index}>
            <Row $ruled>
              <Term>{t('donation.summary.name')}</Term>
              <Value>
                {donor.firstName} {donor.lastName}
              </Value>
            </Row>

            <Row>
              <Term>{t('donation.summary.email')}</Term>
              <Value>{donor.email}</Value>
            </Row>

            {donor.phone ? (
              <Row>
                <Term>{t('donation.summary.phone')}</Term>
                <Value>
                  {donor.phonePrefix} {donor.phone}
                </Value>
              </Row>
            ) : null}
          </Fragment>
        ))}
      </List>
    </Section>
  );
}

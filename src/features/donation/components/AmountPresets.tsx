'use client';

import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Button } from '@/components/ui/Button';
import { toLocale } from '@/i18n/settings';
import { formatCurrency } from '@/lib/format';
import { AMOUNT_PRESETS } from '../schema/donation';

const Grid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[12]};
  grid-template-columns: repeat(3, minmax(0, 1fr));

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    grid-template-columns: repeat(${AMOUNT_PRESETS.length}, minmax(0, 1fr));
  }
`;

type AmountPresetsProps = {
  value: number;
  onChange: (value: number) => void;
};

// Toggle buttons rather than a radiogroup: radios promise arrow-key movement with a
// single tab stop, and claiming that role without implementing it would be a lie to
// anyone navigating by keyboard. Typing a custom amount leaves all of them unpressed.
export function AmountPresets({ value, onChange }: AmountPresetsProps) {
  const { t, i18n } = useTranslation();
  const locale = toLocale(i18n.resolvedLanguage);

  return (
    <Grid role="group" aria-label={t('donation.amount.presets')}>
      {AMOUNT_PRESETS.map((preset) => (
        <Button
          key={preset}
          variant={preset === value ? 'primary' : 'secondary'}
          aria-pressed={preset === value}
          onClick={() => onChange(preset)}
        >
          {formatCurrency(preset, locale)}
        </Button>
      ))}
    </Grid>
  );
}

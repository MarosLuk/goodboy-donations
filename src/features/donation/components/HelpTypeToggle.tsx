'use client';

import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { StepOneValues } from '../schema/donation';
import { HELP_TYPES } from '../schema/donation';

// Real radio inputs behind the segments: a radio group already moves with the arrow
// keys and announces "1 of 2", none of which a pair of divs would do.
const Group = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[8]};
  padding: ${({ theme }) => theme.space[4]};
  border-radius: ${({ theme }) => theme.radius[12]};
  border: ${({ theme }) => `${theme.borderWidth.xs} solid ${theme.color.content.quintary}`};
  grid-template-columns: minmax(0, 1fr);

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const Segment = styled.label`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  /* 16 + 20 + 16 = the 52 the design draws. */
  min-height: 52px;
  padding: ${({ theme }) => `${theme.space[16]} ${theme.space[8]}`};
  border-radius: ${({ theme }) => theme.radius[8]};
  font-size: ${({ theme }) => theme.text.sm.fontSize};
  line-height: ${({ theme }) => theme.text.sm.lineHeight};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  color: ${({ theme }) => theme.color.content.primary};
  text-align: center;
  cursor: pointer;

  &:has(input:checked) {
    background: ${({ theme }) => theme.color.action.primary.default};
    color: ${({ theme }) => theme.color.content.onAction};
  }

  &:has(input:focus-visible) {
    box-shadow: ${({ theme }) => theme.focusRing};
  }
`;

const Radio = styled.input`
  position: absolute;
  inset: 0;
  margin: 0;
  opacity: 0;
  cursor: pointer;
`;

// The choice changes what the schema asks of the other fields, which react-hook-form has no
// way to know, so whoever owns those fields gets told the choice was made.
export function HelpTypeToggle({ onChange }: { onChange?: () => void }) {
  const { t } = useTranslation();
  const { register } = useFormContext<StepOneValues>();

  return (
    <Group>
      {HELP_TYPES.map((helpType) => (
        <Segment key={helpType}>
          <Radio type="radio" value={helpType} {...register('helpType', { onChange })} />
          {t(`donation.helpType.${helpType}`)}
        </Segment>
      ))}
    </Group>
  );
}

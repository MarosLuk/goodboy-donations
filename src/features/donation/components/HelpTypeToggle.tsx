'use client';

import { motion } from 'motion/react';
import { useFormContext, useWatch } from 'react-hook-form';
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
  /* The ink crosses over while the pill slides underneath. */
  transition: color 200ms ease;

  &:has(input:checked) {
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

// One pill for both segments: on a change of mind framer carries it over to the other
// side instead of the fill blinking from one box to the next. Clicks fall through it
// to the radio underneath.
const Pill = styled(motion.span)`
  position: absolute;
  inset: 0;
  background: ${({ theme }) => theme.color.action.primary.default};
  pointer-events: none;
`;

// Positioned, so the label's text paints over the pill.
const Wording = styled.span`
  position: relative;
`;

// The choice changes what the schema asks of the other fields, which react-hook-form has no
// way to know, so whoever owns those fields gets told the choice was made.
export function HelpTypeToggle({ onChange }: { onChange?: () => void }) {
  const { t } = useTranslation();
  const { register, control } = useFormContext<StepOneValues>();
  const helpType = useWatch({ control, name: 'helpType' });

  return (
    <Group>
      {HELP_TYPES.map((option) => (
        <Segment key={option}>
          <Radio type="radio" value={option} {...register('helpType', { onChange })} />

          {option === helpType ? (
            <Pill
              layoutId="help-type-pill"
              aria-hidden="true"
              transition={{ type: 'spring', duration: 0.45, bounce: 0.15 }}
              /* Through style, so the layout animation corrects the corners instead of
                 stretching them mid-flight. */
              style={{ borderRadius: 8 }}
            />
          ) : null}

          <Wording>{t(`donation.helpType.${option}`)}</Wording>
        </Segment>
      ))}
    </Group>
  );
}

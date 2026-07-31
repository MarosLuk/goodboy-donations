'use client';

import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { CheckIcon } from '@/components/icons/CheckIcon';
import type { Step } from '../lib/step';
import { STEPS } from '../lib/step';

// The three looks a step can wear in the design: done is an outlined circle with a
// check, current a filled one with the number, upcoming a barely-there ring.
type Status = 'done' | 'current' | 'upcoming';

const List = styled.ol`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[16]};
`;

const Item = styled.li`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[8]};

  &:not(:last-child) {
    flex: 1;
  }
`;

const circleStyles = {
  done: css`
    border-color: ${({ theme }) => theme.color.action.primary.default};
    color: ${({ theme }) => theme.color.action.primary.default};
  `,
  current: css`
    border-color: ${({ theme }) => theme.color.action.primary.default};
    background: ${({ theme }) => theme.color.action.primary.default};
    color: ${({ theme }) => theme.color.content.onAction};
  `,
  upcoming: css`
    border-color: ${({ theme }) => theme.color.surface.tertiary};
    color: ${({ theme }) => theme.color.content.quintary};
  `,
};

const Circle = styled.span<{ $status: Status }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.radius.circle};
  border: ${({ theme }) => `${theme.borderWidth.xs} solid transparent`};
  font-size: ${({ theme }) => theme.text.md.fontSize};
  /* CSS rather than js, so the reduced-motion rule in the reset silences it. */
  transition:
    background-color 200ms ease,
    border-color 200ms ease,
    color 200ms ease;

  ${({ $status }) => circleStyles[$status]}
`;

// Hidden below tablet, where the design keeps only the circles and the lines.
const Label = styled.span<{ $status: Status }>`
  display: none;
  font-size: ${({ theme }) => theme.text.md.fontSize};
  line-height: ${({ theme }) => theme.text.md.lineHeight};
  color: ${({ theme, $status }) =>
    $status === 'upcoming' ? theme.color.content.quintary : theme.color.content.primary};

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    display: inline;
  }
`;

const Line = styled.span`
  flex: 1;
  height: ${({ theme }) => theme.borderWidth.xs};
  margin: 0 ${({ theme }) => theme.space[8]};
  background: ${({ theme }) => theme.color.content.quintary};
`;

export function Stepper({ current }: { current: Step }) {
  const { t } = useTranslation();

  const statusOf = (step: Step): Status =>
    step === current ? 'current' : step < current ? 'done' : 'upcoming';

  return (
    <List aria-label={t('donation.steps.label')}>
      {STEPS.map((step) => {
        const status = statusOf(step);

        return (
          <Item key={step} aria-current={step === current ? 'step' : undefined}>
            <Circle $status={status}>{status === 'done' ? <CheckIcon /> : step}</Circle>
            <Label $status={status}>{t(`donation.steps.${step}`)}</Label>
            {step === STEPS.length ? null : <Line />}
          </Item>
        );
      })}
    </List>
  );
}

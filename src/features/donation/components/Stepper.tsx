'use client';

import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { Step } from '../lib/step';
import { STEPS } from '../lib/step';

const List = styled.ol`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[12]};
`;

const Item = styled.li`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[12]};

  &:not(:last-child) {
    flex: 1;
  }
`;

const Circle = styled.span<{ $current: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 24px;
  height: 24px;
  border-radius: ${({ theme }) => theme.radius.circle};
  font-size: ${({ theme }) => theme.text.sm.fontSize};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  background: ${({ theme, $current }) =>
    $current ? theme.color.action.primary.default : theme.color.surface.tertiary};
  color: ${({ theme, $current }) =>
    $current ? theme.color.content.onAction : theme.color.content.quaternary};
`;

// Hidden below tablet, where the design keeps only the circles and the lines.
const Label = styled.span<{ $current: boolean }>`
  display: none;
  font-size: ${({ theme }) => theme.text.sm.fontSize};
  line-height: ${({ theme }) => theme.text.sm.lineHeight};
  color: ${({ theme, $current }) =>
    $current ? theme.color.content.primary : theme.color.content.quaternary};

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    display: inline;
  }
`;

const Line = styled.span`
  flex: 1;
  height: ${({ theme }) => theme.borderWidth.xs};
  background: ${({ theme }) => theme.color.surface.quaternary};
`;

export function Stepper({ current }: { current: Step }) {
  const { t } = useTranslation();

  return (
    <List aria-label={t('donation.steps.label')}>
      {STEPS.map((step) => (
        <Item key={step} aria-current={step === current ? 'step' : undefined}>
          <Circle $current={step === current}>{step}</Circle>
          <Label $current={step === current}>{t(`donation.steps.${step}`)}</Label>
          {step === STEPS.length ? null : <Line />}
        </Item>
      ))}
    </List>
  );
}

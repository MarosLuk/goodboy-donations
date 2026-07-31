'use client';

import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { CheckIcon } from '@/components/icons/CheckIcon';
import type { Step } from '../lib/step';
import { STEPS } from '../lib/step';

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

// Three states, not two: a step already behind the visitor is an outline with a tick
// rather than a number, so what is done reads differently from what is still ahead.
type State = 'done' | 'current' | 'ahead';

const circleStates = {
  done: css`
    background: transparent;
    color: ${({ theme }) => theme.color.action.primary.default};
    /* An inset shadow rather than a border: a border on this one state would make the
       outlined circle wider than the filled one beside it. */
    box-shadow: ${({ theme }) =>
      `inset 0 0 0 ${theme.borderWidth.xs} ${theme.color.action.primary.default}`};
  `,
  current: css`
    background: ${({ theme }) => theme.color.action.primary.default};
    color: ${({ theme }) => theme.color.content.onAction};
  `,
  ahead: css`
    background: transparent;
    color: ${({ theme }) => theme.color.content.quintary};
    box-shadow: ${({ theme }) =>
      `inset 0 0 0 ${theme.borderWidth.xs} ${theme.color.surface.tertiary}`};
  `,
} satisfies Record<State, ReturnType<typeof css>>;

const Circle = styled.span<{ $state: State }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.radius.circle};
  font-size: ${({ theme }) => theme.text.md.fontSize};

  ${({ $state }) => circleStates[$state]}
`;

// Hidden below tablet, where the design keeps only the circles and the lines.
const Label = styled.span<{ $state: State }>`
  display: none;
  font-size: ${({ theme }) => theme.text.md.fontSize};
  line-height: ${({ theme }) => theme.text.md.lineHeight};
  /* A step behind the visitor keeps its label dark — it is something they did, not
     something greyed out. Only what is still ahead is dimmed. */
  color: ${({ theme, $state }) =>
    $state === 'ahead' ? theme.color.content.quintary : theme.color.content.primary};

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

function stateOf(step: Step, current: Step): State {
  if (step < current) {
    return 'done';
  }

  return step === current ? 'current' : 'ahead';
}

export function Stepper({ current }: { current: Step }) {
  const { t } = useTranslation();

  return (
    <List aria-label={t('donation.steps.label')}>
      {STEPS.map((step) => {
        const state = stateOf(step, current);

        return (
          <Item key={step} aria-current={state === 'current' ? 'step' : undefined}>
            {/* The tick replaces the number, and the label beside it already names the
                step, so a reader loses nothing by the digit going away. */}
            <Circle $state={state}>
              {state === 'done' ? <CheckIcon width={12} height={10} /> : step}
            </Circle>
            <Label $state={state}>{t(`donation.steps.${step}`)}</Label>
            {step === STEPS.length ? null : <Line />}
          </Item>
        );
      })}
    </List>
  );
}

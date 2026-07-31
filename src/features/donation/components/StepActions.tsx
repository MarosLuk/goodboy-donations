'use client';

import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { fillsScreen } from '@/styles/fit';

// Back on the left, forward on the right, the way the design has it. Kept in one
// place so the three steps cannot drift apart.
export const StepActions = styled.div`
  /* The design leaves 48 above the actions where the other blocks get 40. */
  padding-top: ${({ theme }) => theme.space[8]};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[16]};
`;

// A step that can outgrow the window says so, and every box between it and the column
// then takes the column's height rather than its own content's. Only then can something
// inside it scroll on its own while the page stays put. `min-height: 0` is the half that
// is easy to forget: a flex item refuses to shrink below its content without it.
export const fills = css`
  @media (min-width: ${({ theme }) => theme.breakpoint.desktop}) {
    /* Both halves of the job: take the height from above as a flex item, and hand it on
       as a flex container. One plain block anywhere in the chain and everything below it
       goes back to sizing itself, which is how the list ends up taller than the window. */
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
  }
`;

const Form = styled.form<{ $fill?: boolean }>`
  display: flex;
  flex-direction: column;

  ${({ $fill }) => $fill && fills}
`;

// `fill` hands the step the column's height and marks it for the screen above, which then
// caps itself to the window. The two always travel together, so neither is exposed alone.
export function StepForm({ fill, ...rest }: ComponentPropsWithoutRef<'form'> & { fill?: boolean }) {
  return <Form $fill={fill} {...(fill ? fillsScreen : null)} {...rest} />;
}

export function StepLayout({ children, fill }: { children: ReactNode; fill?: boolean }) {
  return <Column $fill={fill}>{children}</Column>;
}

// Measured off the design: the blocks inside a step sit 40 apart.
const Column = styled.div<{ $fill?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => `var(--rhythm, ${theme.space[40]})`};

  ${({ $fill }) => $fill && fills}
`;

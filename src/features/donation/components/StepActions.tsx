'use client';

import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { fillsScreen } from '@/styles/fit';

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

// Back on the left, forward on the right, the way the design has it. Kept in one
// place so the three steps cannot drift apart.
export const StepActions = styled.div`
  /* The design leaves 48 above the actions where the other blocks get 40. */
  padding-top: ${({ theme }) => theme.space[8]};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[16]};
  /* The frame pins the actions to the bottom edge: on a step whose fields end early
     they stay down by the footer instead of following the fields up. */
  margin-top: auto;
`;

// The small heading the design sets over the select, the donor fields and the summary.
export const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.text.md.fontSize};
  line-height: ${({ theme }) => theme.text.md.lineHeight};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.color.content.primary};
`;

// The heading and its block sit 16 apart, closer than the 40 between the blocks. The
// one over the donor list also hands the column's height down, hence the fill.
export const Section = styled.div<{ $fill?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[16]};

  ${({ $fill }) => $fill && fills}
`;

// Every step grows into the column so its actions can hold the bottom edge; only the
// one marked `fill` also tells the screen above to cap itself to the window.
const Form = styled.form`
  display: flex;
  flex-direction: column;

  ${fills}
`;

// `fill` marks the step for the screen above, which then caps itself to the window and
// leaves the scrolling to the donor list inside.
export function StepForm({ fill, ...rest }: ComponentPropsWithoutRef<'form'> & { fill?: boolean }) {
  return <Form {...(fill ? fillsScreen : null)} {...rest} />;
}

export function StepLayout({ children }: { children: ReactNode }) {
  return <Column>{children}</Column>;
}

// Measured off the design: the blocks inside a step sit 40 apart.
const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => `var(--rhythm, ${theme.space[40]})`};

  ${fills}
`;

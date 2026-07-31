'use client';

import type { ReactNode } from 'react';
import styled from 'styled-components';

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

// The heading and its block sit 16 apart, closer than the 40 between the blocks.
export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[16]};
`;

// The form has to pass the column's height down for the pinning above to work.
export const StepForm = styled.form`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export function StepLayout({ children }: { children: ReactNode }) {
  return <Column>{children}</Column>;
}

// Measured off the design: the blocks inside a step sit 40 apart.
const Column = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: ${({ theme }) => theme.space[40]};
`;

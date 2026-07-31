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
`;

export function StepLayout({ children }: { children: ReactNode }) {
  return <Column>{children}</Column>;
}

// Measured off the design: the blocks inside a step sit 40 apart.
const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => `var(--rhythm, ${theme.space[40]})`};
`;

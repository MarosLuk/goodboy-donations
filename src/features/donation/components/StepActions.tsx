'use client';

import type { ReactNode } from 'react';
import styled from 'styled-components';

// Back on the left, forward on the right, the way the design has it. Kept in one
// place so the three steps cannot drift apart.
export const StepActions = styled.div`
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
  gap: ${({ theme }) => theme.space[40]};
`;

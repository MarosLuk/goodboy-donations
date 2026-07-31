'use client';

import styled from 'styled-components';

// The same rhythm as the contact page, which the design does specify, so the two secondary
// screens open alike.
export const Layout = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[40]};

  @media (min-width: ${({ theme }) => theme.breakpoint.desktop}) {
    padding-top: ${({ theme }) => theme.space[40]};
  }
`;

export const Heading = styled.h1`
  font-size: ${({ theme }) => theme.heading.sm.fontSize};
  line-height: ${({ theme }) => theme.heading.sm.lineHeight};
  letter-spacing: ${({ theme }) => theme.heading.sm.letterSpacing};
  font-weight: ${({ theme }) => theme.font.weight.bold};

  @media (min-width: ${({ theme }) => theme.breakpoint.desktop}) {
    font-size: ${({ theme }) => theme.heading.lg.fontSize};
    line-height: ${({ theme }) => theme.heading.lg.lineHeight};
  }
`;

// Prose gets a measure of its own. Full width at 1200 would run to 1120 characters of line,
// which is roughly twice what stays comfortable to read.
export const Prose = styled.p`
  max-width: 62ch;
  color: ${({ theme }) => theme.color.content.secondary};
`;

// The numbers are the point of the page, so they sit between the two blocks of prose with
// more air than the 40 that separates everything else.
export const Numbers = styled.div`
  padding: ${({ theme }) => `${theme.space[16]} 0`};
`;

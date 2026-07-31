'use client';

import styled from 'styled-components';

// The same rhythm as the contact page, which the design does specify, so the two secondary
// screens open alike.
export const Layout = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[40]};

  /* Same viewport behaviour as the other screens: spare room goes above the footer. */
  @media (min-width: ${({ theme }) => theme.breakpoint.desktop}) {
    padding-top: ${({ theme }) => theme.space[40]};
    padding-bottom: ${({ theme }) => theme.space[40]};
    min-height: calc(100dvh - ${({ theme }) => theme.space[40]});

    > footer {
      margin-top: auto;
    }
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

// Full measure and full ink, the way the frame sets its paragraphs.
export const Prose = styled.p`
  color: ${({ theme }) => theme.color.content.primary};
`;

// The frame pulls the ruled band in by a further 32 on each side of the column.
export const Numbers = styled.div`
  align-self: stretch;

  @media (min-width: ${({ theme }) => theme.breakpoint.desktop}) {
    padding: 0 ${({ theme }) => theme.space[32]};
  }
`;

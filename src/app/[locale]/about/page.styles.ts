'use client';

import styled from 'styled-components';

// The same rhythm as the contact page, which the design does specify, so the two secondary
// screens open alike.
export const Layout = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => `var(--rhythm, ${theme.space[40]})`};

  @media (min-width: ${({ theme }) => theme.breakpoint.desktop}) {
    flex: 1;
    padding: ${({ theme }) => `var(--screen-air, ${theme.space[40]}) 0`};

    /* This screen has no photograph to soak up a tall window, and the gap above is the
       floor rather than the whole story: what the window leaves over is shared out
       between the blocks, so the page reads as filled rather than as content that
       stopped early above a footer pinned to the bottom. */
    justify-content: space-between;
  }
`;

export const Heading = styled.h1`
  font-size: ${({ theme }) => theme.heading.sm.fontSize};
  line-height: ${({ theme }) => theme.heading.sm.lineHeight};
  letter-spacing: ${({ theme }) => theme.heading.sm.letterSpacing};
  font-weight: ${({ theme }) => theme.font.weight.bold};

  @media (min-width: ${({ theme }) => theme.breakpoint.desktop}) {
    font-size: ${({ theme }) => `var(--headline-size, ${theme.heading.lg.fontSize})`};
    line-height: ${({ theme }) => `var(--headline-leading, ${theme.heading.lg.lineHeight})`};
  }
`;

// The prose runs the full width of the page, left aligned. A reading measure would be the
// textbook call, but the design sets these two paragraphs against the full-width rules of
// the metrics, and a narrow column beside them reads as an accident.
export const Prose = styled.p`
  color: ${({ theme }) => theme.color.content.secondary};
`;

// The summary draws its own rules and owns the air inside them, so this only exists to let
// the metrics sit apart from the paragraphs around them.
export const Numbers = styled.div`
  align-self: stretch;
`;

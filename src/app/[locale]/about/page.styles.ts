'use client';

import styled from 'styled-components';

// The same rhythm as the contact page, which the design does specify, so the two secondary
// screens open alike.
export const Layout = styled.div`
  display: flex;
  flex-direction: column;
  /* A flat 40 off the frame, not the donation screen's fluid rhythm. That one exists
     because step 1 needs more height than the frame has; this screen has 230 to spare
     above its footer even on a short window, so there is nothing here to take back. */
  gap: ${({ theme }) => theme.space[40]};

  @media (min-width: ${({ theme }) => theme.breakpoint.desktop}) {
    flex: 1;
    /* The page's ceiling on a desktop — the frame's own content width. */
    max-width: 1280px;
    padding: ${({ theme }) => `var(--screen-air, ${theme.space[40]}) 0`};

    /* The frame separates the sections by a flat 40 and spends everything the window has
       left in one place: above the footer. So the gap above stays the rhythm and only
       this margin grows — not space-between, which would push the blocks apart too. */
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
    font-size: ${({ theme }) => `var(--headline-size, ${theme.heading.lg.fontSize})`};
    line-height: ${({ theme }) => `var(--headline-leading, ${theme.heading.lg.lineHeight})`};
  }
`;

// The prose runs the full width of the page, left aligned, in the frame's full ink.
export const Prose = styled.p`
  color: ${({ theme }) => theme.color.content.primary};
`;

// The summary draws its own rules and owns the air inside them, so this only exists to let
// the metrics sit apart from the paragraphs around them.
export const Numbers = styled.div`
  align-self: stretch;
`;

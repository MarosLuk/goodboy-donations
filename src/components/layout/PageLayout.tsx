'use client';

import styled from 'styled-components';

// The shape every screen that is not the form shares: a column on the design's flat 40, the
// frame's own content width on a desktop, and whatever height the window has left spent in one
// place, above the footer. The donation screen has its own fluid rhythm because step 1 needs
// more height than the frame gives it; these screens have height to spare, so there is nothing
// for them to take back.
export const PageLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[40]};

  /* The same air the donation screen puts above its stepper, so every screen starts alike. */
  @media (min-width: ${({ theme }) => theme.breakpoint.desktop}) {
    flex: 1;
    max-width: 1280px;
    padding: ${({ theme }) => `var(--screen-air, ${theme.space[40]}) 0`};

    /* Not space-between, which would push the blocks apart too: only this margin grows. */
    > footer {
      margin-top: auto;
    }
  }
`;

export const PageHeading = styled.h1`
  font-size: ${({ theme }) => theme.heading.sm.fontSize};
  line-height: ${({ theme }) => theme.heading.sm.lineHeight};
  letter-spacing: ${({ theme }) => theme.heading.sm.letterSpacing};
  font-weight: ${({ theme }) => theme.font.weight.bold};

  @media (min-width: ${({ theme }) => theme.breakpoint.desktop}) {
    font-size: ${({ theme }) => `var(--headline-size, ${theme.heading.lg.fontSize})`};
    line-height: ${({ theme }) => `var(--headline-leading, ${theme.heading.lg.lineHeight})`};
  }
`;

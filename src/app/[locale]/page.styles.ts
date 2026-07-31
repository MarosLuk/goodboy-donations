'use client';

import styled from 'styled-components';
import { Container } from '@/components/layout/Container';
import { Page } from '@/components/layout/Page';
import { fit } from '@/styles/fit';

// On a desktop this screen is the window rather than a document inside it. Everything
// that decides whether it needs a scrollbar is declared here as a custom property, so
// the one rule — hold the design on a tall window, ease down on a short one — lives in
// one place. The blocks read them through `var(…, token)`, which is what leaves the
// contact page and every phone on the design's own numbers.
export const Screen = styled(Page)`
  @media (min-width: ${({ theme }) => theme.breakpoint.desktop}) {
    --rhythm: ${fit(40, 16)};
    --headline-size: ${fit(48, 32)};
    --headline-leading: ${fit(56, 40)};
    --amount-size: ${fit(72, 48)};
    --amount-air: ${fit(32, 8)};
    --footer-air: ${fit(24, 10)};

    /* The two columns carry their own vertical insets — 60 for the form, 20 for the
       photo — so the page keeps none of its own. */
    padding: 0;
  }
`;

// The design frame is not symmetric: 80 on the left, 20 on the right, which is what
// makes 658 + 80 + 602 add up to 1440. Reproduced here rather than in the shared
// container, because it belongs to this one screen.
export const Frame = styled(Container)`
  @media (min-width: ${({ theme }) => theme.breakpoint.desktop}) {
    /* The screen is the frame here, so the 80 and the 20 are measured off the window
       rather than off a 1440 column centred inside it. Past 1920 it centres again, where
       the form would otherwise be pulled wider than a form wants to be. */
    max-width: 1920px;
    padding-left: ${({ theme }) => theme.space[80]};
    padding-right: ${({ theme }) => theme.space[20]};
  }
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => `var(--rhythm, ${theme.space[40]})`};

  @media (min-width: ${({ theme }) => theme.breakpoint.desktop}) {
    /* The footer sits on the bottom edge of the frame in the design, so it goes there at
       any window height rather than trailing whichever step happens to be shortest. */
    flex: 1;
    justify-content: space-between;
  }
`;

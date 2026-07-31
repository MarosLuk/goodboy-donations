'use client';

import styled from 'styled-components';
import { fit } from '@/styles/fit';

// Every screen is the window on a desktop, so none of the three scrolls. Everything that
// decides whether one of them needs a scrollbar is declared here as a custom property, so
// the one rule — hold the design on a tall window, ease down on a short one — lives in a
// single place. The blocks read them through `var(…, token)`, which is what leaves every
// phone on the design's own numbers.
export const Screen = styled.div`
  padding: ${({ theme }) => `${theme.space[24]} 0`};

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    padding: ${({ theme }) => `${theme.space[20]} 0 ${theme.space[48]}`};
  }

  @media (min-width: ${({ theme }) => theme.breakpoint.desktop}) {
    --rhythm: ${fit(40, 16)};
    --screen-air: ${fit(60, 40)};
    --headline-size: ${fit(48, 32)};
    --headline-leading: ${fit(56, 40)};
    --amount-size: ${fit(60, 44)};
    --amount-air: ${fit(24, 0)};
    --footer-air: ${fit(24, 10)};

    display: flex;
    flex-direction: column;
    min-height: 100dvh;
    /* The screen's own columns carry the vertical insets, so the page keeps none. */
    padding: 0;
  }
`;

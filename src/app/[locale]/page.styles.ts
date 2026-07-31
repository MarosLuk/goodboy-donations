'use client';

import styled from 'styled-components';
import { Container } from '@/components/layout/Container';

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
    min-height: 0;
    justify-content: space-between;
  }
`;

'use client';

import styled from 'styled-components';

// 1440 wide with 80 of padding on the desktop design; the two smaller steps keep
// the text off the edge of a phone.
export const Container = styled.div`
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.space[24]};

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    padding: 0 ${({ theme }) => theme.space[40]};
  }

  @media (min-width: ${({ theme }) => theme.breakpoint.desktop}) {
    padding: 0 ${({ theme }) => theme.space[80]};
    /* Its only parent is Screen, which is the window tall there; the container passes
       that height on so the layout inside can spend it. */
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }
`;

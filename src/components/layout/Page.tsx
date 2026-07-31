'use client';

import styled from 'styled-components';

// The breathing room belongs to the page, not to one column: with it on the content
// only, the photo ran into the top edge of the window.
export const Page = styled.div`
  padding: ${({ theme }) => `${theme.space[24]} 0`};

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    padding: ${({ theme }) => `${theme.space[20]} 0 ${theme.space[48]}`};
  }
`;

'use client';

import styled from 'styled-components';

// The breathing room belongs to the page, not to one column: with it on the content
// only, the photo ran into the top edge of the window.
export const Page = styled.div`
  padding: ${({ theme }) => `${theme.space[24]} 0`};

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    padding: ${({ theme }) => `${theme.space[48]} 0`};
  }
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[48]};
`;

// The photo is decorative, so it carries an empty alt and never becomes taller than
// the viewport on a phone.
export const Photo = styled.div`
  border-radius: ${({ theme }) => theme.radius[24]};
  overflow: hidden;

  img {
    width: 100%;
    height: auto;
    max-height: 60vh;
    object-fit: cover;

    @media (min-width: ${({ theme }) => theme.breakpoint.desktop}) {
      max-height: none;
    }
  }
`;

'use client';

import styled from 'styled-components';

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[48]};
  padding: ${({ theme }) => `${theme.space[48]} 0`};
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

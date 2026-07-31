'use client';

import styled from 'styled-components';
import { Container } from '@/components/layout/Container';

// The breathing room belongs to the page, not to one column: with it on the content
// only, the photo ran into the top edge of the window.
export const Page = styled.div`
  padding: ${({ theme }) => `${theme.space[24]} 0`};

  @media (min-width: ${({ theme }) => theme.breakpoint.tablet}) {
    /* The design frame starts the photo 20 from the top; the content column adds its
       own 40 on top of that, which is what puts the stepper at 60. */
    padding: ${({ theme }) => `${theme.space[20]} 0 ${theme.space[48]}`};
  }
`;

// The design frame is not symmetric: 80 on the left, 20 on the right, which is what
// makes 658 + 80 + 602 add up to 1440. Reproduced here rather than in the shared
// container, because it belongs to this one screen.
export const Frame = styled(Container)`
  @media (min-width: ${({ theme }) => theme.breakpoint.desktop}) {
    padding-left: ${({ theme }) => theme.space[80]};
    padding-right: ${({ theme }) => theme.space[20]};
  }
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[40]};

  @media (min-width: ${({ theme }) => theme.breakpoint.desktop}) {
    padding-top: ${({ theme }) => theme.space[40]};
  }
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

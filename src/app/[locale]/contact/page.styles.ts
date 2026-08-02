'use client';

import Image from 'next/image';
import styled from 'styled-components';

// The frame gives the card row 20 of its own on both sides, on top of the page's 40.
export const Section = styled.div`
  padding: ${({ theme }) => `${theme.space[20]} 0`};
`;

// The design insets the photo by a further 80 on each side and crops it to a wide band,
// 1120 by 376 in the frame.
export const Photo = styled(Image)`
  width: 100%;
  height: auto;
  /* The 1120 by 376 band of the design would be a 130 tall strip on a phone, so the
     crop opens up until there is a dog to see. */
  aspect-ratio: 16 / 10;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.radius[20]};

  @media (min-width: ${({ theme }) => theme.breakpoint.desktop}) {
    /* No fixed band beside the rest of the page: the photo takes whatever height the
       window has left, which is what lets this screen open without a scrollbar at any
       size. On the 1024 frame that lands within a few pixels of the design's 376. */
    aspect-ratio: auto;
    flex: 1 1 0;
    /* Below this there is no photograph left to look at, so the page gives up and
       scrolls instead of crushing it. */
    min-height: 120px;
    width: calc(100% - ${({ theme }) => theme.space[160]});
    margin-inline: auto;
  }
`;

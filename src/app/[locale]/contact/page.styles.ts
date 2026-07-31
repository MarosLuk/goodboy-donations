'use client';

import Image from 'next/image';
import styled from 'styled-components';

export const Layout = styled.div`
  display: flex;
  flex-direction: column;
  /* The same flat 40 as the about screen: the photo below spends what the window has
     left, so the sections never have to give any of theirs back. */
  gap: ${({ theme }) => theme.space[40]};

  /* Same air the donation screen puts above its stepper, so both screens start alike. */
  @media (min-width: ${({ theme }) => theme.breakpoint.desktop}) {
    flex: 1;
    padding: ${({ theme }) => `var(--screen-air, ${theme.space[40]}) 0`};

    > footer {
      margin-top: auto;
    }
  }
`;

// The design gives the cards and the photo more room than the 40 between the rest, so
// they add to it rather than every gap growing.
export const Section = styled.div`
  padding-top: ${({ theme }) => theme.space[24]};
`;

export const Heading = styled.h1`
  font-size: ${({ theme }) => theme.heading.sm.fontSize};
  line-height: ${({ theme }) => theme.heading.sm.lineHeight};
  letter-spacing: ${({ theme }) => theme.heading.sm.letterSpacing};
  font-weight: ${({ theme }) => theme.font.weight.bold};

  @media (min-width: ${({ theme }) => theme.breakpoint.desktop}) {
    font-size: ${({ theme }) => `var(--headline-size, ${theme.heading.lg.fontSize})`};
    line-height: ${({ theme }) => `var(--headline-leading, ${theme.heading.lg.lineHeight})`};
  }
`;

// The design insets the photo by a further 80 on each side and crops it to a wide band,
// 1120 by 376 in the frame.
export const Photo = styled(Image)`
  margin-top: ${({ theme }) => theme.space[24]};
  width: 100%;
  height: auto;
  /* The 1120 by 376 band of the design would be a 130 tall strip on a phone, so the
     crop opens up until there is a dog to see. */
  aspect-ratio: 16 / 10;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.radius[24]};

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
    /* margin-inline, not margin: the shorthand would wipe the top margin above. */
    margin-inline: auto;
  }
`;

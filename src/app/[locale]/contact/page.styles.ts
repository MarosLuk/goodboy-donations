'use client';

import Image from 'next/image';
import styled from 'styled-components';

export const Layout = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[40]};

  /* Same 40 the donation page puts above its stepper, so both screens start alike.
     The frame is a viewport: with room to spare the footer keeps the bottom edge. */
  @media (min-width: ${({ theme }) => theme.breakpoint.desktop}) {
    padding-top: ${({ theme }) => theme.space[40]};
    padding-bottom: ${({ theme }) => theme.space[40]};
    min-height: calc(100dvh - ${({ theme }) => theme.space[40]});

    > footer {
      margin-top: auto;
    }
  }
`;

// The frame gives the card row 20 of its own on both sides, on top of the page's 40.
export const Section = styled.div`
  padding: ${({ theme }) => `${theme.space[20]} 0`};
`;

export const Heading = styled.h1`
  font-size: ${({ theme }) => theme.heading.sm.fontSize};
  line-height: ${({ theme }) => theme.heading.sm.lineHeight};
  letter-spacing: ${({ theme }) => theme.heading.sm.letterSpacing};
  font-weight: ${({ theme }) => theme.font.weight.bold};

  @media (min-width: ${({ theme }) => theme.breakpoint.desktop}) {
    font-size: ${({ theme }) => theme.heading.lg.fontSize};
    line-height: ${({ theme }) => theme.heading.lg.lineHeight};
  }
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
    aspect-ratio: 1120 / 376;
    width: calc(100% - ${({ theme }) => theme.space[160]});
    margin-inline: auto;
  }
`;

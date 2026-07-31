'use client';

import Image from 'next/image';
import styled from 'styled-components';

export const Layout = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[40]};

  /* Same 40 the donation page puts above its stepper, so both screens start alike. */
  @media (min-width: ${({ theme }) => theme.breakpoint.desktop}) {
    padding-top: ${({ theme }) => theme.space[40]};
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
    font-size: ${({ theme }) => theme.heading.lg.fontSize};
    line-height: ${({ theme }) => theme.heading.lg.lineHeight};
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
    aspect-ratio: 1120 / 376;
    width: calc(100% - ${({ theme }) => theme.space[160]});
    /* margin-inline, not margin: the shorthand would wipe the top margin above. */
    margin-inline: auto;
  }
`;

'use client';

import Image from 'next/image';
import styled, { css } from 'styled-components';
import { useWizard } from '@/features/donation/store/wizard';

// Decorative, hence the empty alt. On a phone the mobile design crops it to a landscape
// band instead of keeping the tall frame, which is what stops it pushing the form below
// the fold.
const Frame = styled.div<{ $firstStepOnly: boolean }>`
  border-radius: ${({ theme }) => theme.radius[20]};
  overflow: hidden;

  img {
    width: 100%;
    aspect-ratio: 6 / 5;
    height: auto;
    object-fit: cover;
    object-position: center 35%;
  }

  /* Beside the form the dog shows whole, never a crop: the frame is the window's height
     less the 20 above and below, the width follows from the photo's own proportions —
     the design's 602 by 984 on a 1024 window — and the form column adapts to what is
     left. In flow on purpose, so the media column is exactly as wide as the photo. */
  @media (min-width: ${({ theme }) => theme.breakpoint.desktop}) {
    display: block;
    height: calc(100dvh - 2 * ${({ theme }) => theme.space[20]});
    margin: ${({ theme }) => `${theme.space[20]} 0`};

    img {
      aspect-ratio: auto;
      width: auto;
      height: 100%;
    }
  }

  /* Stacked above the form it costs a screenful of scrolling per step, and the picture
     has already done its work by the time someone is filling in their name. */
  ${({ $firstStepOnly }) =>
    $firstStepOnly &&
    css`
      display: none;
    `}
`;

export function HeroPhoto() {
  const step = useWizard((state) => state.step);
  const sent = useWizard((state) => state.sent);

  return (
    <Frame $firstStepOnly={step > 1 || sent}>
      <Image
        src="/images/hero.webp"
        alt=""
        width={1204}
        height={1968}
        priority
        sizes="(min-width: 1200px) 602px, 100vw"
      />
    </Frame>
  );
}

'use client';

import Image from 'next/image';
import styled, { css } from 'styled-components';
import { useWizard } from '@/features/donation/store/wizard';

// Decorative, hence the empty alt. On a phone the mobile design crops it to a landscape
// band instead of keeping the tall frame, which is what stops it pushing the form below
// the fold.
const Frame = styled.div<{ $firstStepOnly: boolean }>`
  border-radius: ${({ theme }) => theme.radius[24]};
  overflow: hidden;

  img {
    width: 100%;
    aspect-ratio: 6 / 5;
    height: auto;
    object-fit: cover;
    object-position: center 35%;
  }

  /* Beside the form it costs nothing, so on a wide screen it stays on every step. */
  @media (min-width: ${({ theme }) => theme.breakpoint.desktop}) {
    display: block;

    img {
      aspect-ratio: auto;
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

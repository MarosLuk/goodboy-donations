'use client';

import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Wrapper = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[8]};
`;

// Brand artwork carries its own colours — the indigo mascot and the dark wordmark —
// so it stays a file instead of an inlined icon on currentColor. Unoptimized because
// there is nothing for the image pipeline to do to an svg.
export function Logo() {
  const { t } = useTranslation();

  return (
    <Wrapper>
      <Image src="/logo-mark.svg" alt="" width={30} height={31} unoptimized />
      <Image src="/logo-wordmark.svg" alt={t('app.brand')} width={88} height={21} unoptimized />
    </Wrapper>
  );
}

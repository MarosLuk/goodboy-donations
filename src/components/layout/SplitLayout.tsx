'use client';

import type { ReactNode } from 'react';
import styled from 'styled-components';

const Grid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[32]};
  /* On a phone the photo sits above the content, the way the mobile design has it. */
  grid-template-columns: minmax(0, 1fr);
  grid-template-areas:
    'media'
    'content';

  @media (min-width: ${({ theme }) => theme.breakpoint.desktop}) {
    grid-template-areas: 'content media';
    /* 658 for the content and 602 for the photo, exactly as the design frame has them.
       Both may shrink below 1440, neither grows past it. */
    grid-template-columns: minmax(0, 658px) minmax(0, 602px);
    gap: ${({ theme }) => theme.space[80]};
    align-items: start;
  }
`;

const Content = styled.div`
  grid-area: content;
`;

const Media = styled.div`
  grid-area: media;
`;

export function SplitLayout({ media, children }: { media: ReactNode; children: ReactNode }) {
  return (
    <Grid>
      <Content>{children}</Content>
      <Media>{media}</Media>
    </Grid>
  );
}

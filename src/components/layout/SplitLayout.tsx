'use client';

import type { ReactNode } from 'react';
import styled from 'styled-components';
import { fit, withFillingChild } from '@/styles/fit';

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
    /* The photo shows whole, so its own proportions and the window's height decide how
       wide it is; the form column runs right up to the 80 before the photo, capped at
       1280 like every page. On a 1440 by 1024 window this comes to the design's own
       602 and 658. */
    grid-template-columns: minmax(0, 1280px) auto;
    justify-content: space-between;
    column-gap: ${({ theme }) => theme.space[80]};
    /* The window is the frame. The single row fills it, so both columns are as tall as
       the screen and the step opens without a scrollbar. */
    flex: 1;
    min-height: 100dvh;

    /* With a section inside that grows as far as the visitor takes it, the window stops
       being a floor and becomes the ceiling too: the row is exactly the window, and the
       growing section scrolls within it. Without one, the row still grows and the page
       scrolls, which is what a screen too tall for a small window should do. */
    ${withFillingChild} {
      /* flex: none first — as a flex item with a basis of 0 the height below would be
         ignored and the row would go back to following its content. */
      flex: none;
      height: 100dvh;
      grid-template-rows: minmax(0, 1fr);
    }
  }
`;

const Content = styled.div`
  grid-area: content;

  @media (min-width: ${({ theme }) => theme.breakpoint.desktop}) {
    display: flex;
    flex-direction: column;
    min-height: 0;
    /* 60 above the stepper and below the footer. */
    padding: ${fit(60, 40)} 0;
  }
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

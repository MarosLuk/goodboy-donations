'use client';

import type { ReactNode } from 'react';
import styled from 'styled-components';
import { fit } from '@/styles/fit';

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
    /* The design's 658 for the content against 602 for the photo, kept as a ratio so the
       two share whatever the window leaves after the 80 gap. On a 1440 window that is
       the design's own 658 and 602; on a wider one both grow rather than the page
       stranding the photo short of the edge it is measured from. */
    grid-template-columns: minmax(0, 658fr) minmax(0, 602fr);
    column-gap: ${({ theme }) => theme.space[80]};
    /* The window is the frame. The single row fills it, so both columns are as tall as
       the screen and the step opens without a scrollbar. */
    flex: 1;
    min-height: 100dvh;
  }
`;

const Content = styled.div`
  grid-area: content;

  @media (min-width: ${({ theme }) => theme.breakpoint.desktop}) {
    display: flex;
    flex-direction: column;
    /* 60 above the stepper and below the footer. */
    padding: ${fit(60, 40)} 0;
  }
`;

const Media = styled.div`
  grid-area: media;

  @media (min-width: ${({ theme }) => theme.breakpoint.desktop}) {
    /* Only the frame for the photo, which fills it from out of flow. In flow its own
       height would size the row, and the row would then be the photo's 984 on every
       window instead of the window's. */
    position: relative;
  }
`;

export function SplitLayout({ media, children }: { media: ReactNode; children: ReactNode }) {
  return (
    <Grid>
      <Content>{children}</Content>
      <Media>{media}</Media>
    </Grid>
  );
}

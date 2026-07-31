'use client';

import type { ReactNode } from 'react';
import { MotionConfig } from 'motion/react';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from './GlobalStyle';
import { StyleRegistry } from './StyleRegistry';
import { theme } from './theme';

export function StyleProvider({ children }: { children: ReactNode }) {
  return (
    <StyleRegistry>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        {/* reducedMotion="user" leaves the decision to the operating system setting, and
            motion then animates opacity without moving anything. Doing it here rather
            than per animation means no component can forget. */}
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </ThemeProvider>
    </StyleRegistry>
  );
}

'use client';

import type { ReactNode } from 'react';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from './GlobalStyle';
import { StyleRegistry } from './StyleRegistry';
import { theme } from './theme';

export function StyleProvider({ children }: { children: ReactNode }) {
  return (
    <StyleRegistry>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        {children}
      </ThemeProvider>
    </StyleRegistry>
  );
}

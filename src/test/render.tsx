import type { ReactElement, ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { I18nProvider } from '@/i18n/I18nProvider';
import type { Locale } from '@/i18n/settings';
import { theme } from '@/styles/theme';
import { createTestQueryClient } from './query';

// The real i18n instance rather than a stub, so a test asserting on a label also
// proves the key exists in the locale file.
export function renderWithProviders(ui: ReactElement, { locale = 'sk' }: { locale?: Locale } = {}) {
  const client = createTestQueryClient();

  function Providers({ children }: { children: ReactNode }) {
    return (
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={client}>
          <I18nProvider locale={locale}>{children}</I18nProvider>
        </QueryClientProvider>
      </ThemeProvider>
    );
  }

  return render(ui, { wrapper: Providers });
}

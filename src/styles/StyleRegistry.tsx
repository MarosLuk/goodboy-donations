'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';

export function StyleRegistry({ children }: { children: ReactNode }) {
  // Lazy initial state, otherwise every re-render would start a new sheet.
  const [sheet] = useState(() => new ServerStyleSheet());

  useServerInsertedHTML(() => {
    const styles = sheet.getStyleElement();
    sheet.instance.clearTag();
    return <>{styles}</>;
  });

  // In the browser styled-components manages its own tags; the sheet is only
  // needed while the server renders.
  if (typeof window !== 'undefined') {
    return <>{children}</>;
  }

  return <StyleSheetManager sheet={sheet.instance}>{children}</StyleSheetManager>;
}

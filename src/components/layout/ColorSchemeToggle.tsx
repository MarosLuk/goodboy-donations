'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { MoonIcon } from '@/components/icons/MoonIcon';
import { SunIcon } from '@/components/icons/SunIcon';
import type { ColorScheme } from '@/styles/color-scheme';
import {
  applyScheme,
  currentScheme,
  readStoredScheme,
  storeScheme,
  systemScheme,
} from '@/styles/color-scheme';

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  /* No taller than the logo, so the footer keeps the design's 56. */
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.radius.circle};
  color: ${({ theme }) => theme.color.content.tertiary};

  &:hover {
    color: ${({ theme }) => theme.color.content.primary};
    background: ${({ theme }) => theme.color.action.secondary.default};
  }
`;

// Which one shows is decided in the stylesheet, not here — see the note on the variables in
// GlobalStyle. It means the icon is right in the very first frame the browser paints, even
// though the server had no way to know which scheme this browser is in.
const Sun = styled(SunIcon)`
  display: var(--icon-sun);
`;

const Moon = styled(MoonIcon)`
  display: var(--icon-moon);
`;

export function ColorSchemeToggle() {
  const { t } = useTranslation();

  // Only for the pressed state. Starting empty keeps the first client render identical to
  // the server's, and the effect fills it in a tick later.
  const [scheme, setScheme] = useState<ColorScheme | null>(null);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const sync = () => setScheme(readStoredScheme() ?? systemScheme());

    sync();
    media.addEventListener('change', sync);

    return () => media.removeEventListener('change', sync);
  }, []);

  function toggle() {
    const next = currentScheme() === 'dark' ? 'light' : 'dark';

    applyScheme(next);
    storeScheme(next);
    setScheme(next);
  }

  return (
    <Button
      type="button"
      onClick={toggle}
      aria-pressed={scheme === 'dark'}
      aria-label={t('footer.darkMode')}
    >
      <Sun />
      <Moon />
    </Button>
  );
}

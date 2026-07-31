'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { Locale } from '@/i18n/settings';
import { locales, toLocale } from '@/i18n/settings';

const List = styled.ul`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
`;

// A pair of links rather than a select: there are two of them, and a link is what a language
// change actually is — a different address for the same page.
const Choice = styled(Link)<{ $active: boolean }>`
  display: block;
  padding: ${({ theme }) => `${theme.space[6]} ${theme.space[8]}`};
  border-radius: ${({ theme }) => theme.radius[8]};
  font-size: ${({ theme }) => theme.text.sm.fontSize};
  line-height: ${({ theme }) => theme.text.sm.lineHeight};
  font-weight: ${({ theme, $active }) =>
    $active ? theme.font.weight.semibold : theme.font.weight.regular};
  color: ${({ theme, $active }) =>
    $active ? theme.color.content.primary : theme.color.content.quaternary};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.color.content.primary};
    background: ${({ theme }) => theme.color.action.secondary.default};
  }
`;

// Everything after the locale segment is kept, so switching language on the contact page
// lands on the contact page. The form's step is deliberately not carried over: switching is a
// document navigation, the draft does not survive it, and a fresh document clamps any step
// back to the first one anyway. Reading it would also cost a Suspense boundary on every page
// the footer appears on.
// Null when there is no router above, which is how the footer renders inside a page test.
function swapLocale(pathname: string | null, locale: Locale) {
  const rest = (pathname ?? '').split('/').slice(2).join('/');

  return rest === '' ? `/${locale}` : `/${locale}/${rest}`;
}

export function LocaleSwitcher() {
  const { t, i18n } = useTranslation();
  const pathname = usePathname();
  const active = toLocale(i18n.resolvedLanguage);

  return (
    <nav aria-label={t('footer.language')}>
      <List>
        {locales.map((locale) => (
          <li key={locale}>
            <Choice
              href={swapLocale(pathname, locale)}
              hrefLang={locale}
              $active={locale === active}
              // The label names the language; the code itself is what there is room for.
              aria-label={t(`language.${locale}`)}
              aria-current={locale === active ? 'true' : undefined}
            >
              {locale.toUpperCase()}
            </Choice>
          </li>
        ))}
      </List>
    </nav>
  );
}

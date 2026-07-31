'use client';

import type { MouseEvent } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
//
// next/link, so the browser keeps the document it has. The alternative, a plain anchor and a
// full load, threw away everything the visitor had typed: a language is a way of reading the
// page, not a reason to start it again.
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
// lands on the contact page.
// Null when there is no router above, which is how the footer renders inside a page test.
function swapLocale(pathname: string | null, locale: Locale) {
  const rest = (pathname ?? '').split('/').slice(2).join('/');

  return rest === '' ? `/${locale}` : `/${locale}/${rest}`;
}

// A plain left click is the only one that means "this page, in the other language". A new tab
// or a new window starts somewhere fresh with nothing to carry, so those are left to the
// browser and to the href.
function opensElsewhere(event: MouseEvent) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
}

export function LocaleSwitcher() {
  const { t, i18n } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const active = toLocale(i18n.resolvedLanguage);

  return (
    <nav aria-label={t('footer.language')}>
      <List>
        {locales.map((locale) => {
          const target = swapLocale(pathname, locale);

          return (
            <li key={locale}>
              <Choice
                href={target}
                hrefLang={locale}
                $active={locale === active}
                // The label names the language; the code itself is what there is room for.
                aria-label={t(`language.${locale}`)}
                aria-current={locale === active ? 'true' : undefined}
                onClick={(event) => {
                  if (opensElsewhere(event)) {
                    return;
                  }

                  // The query belongs to the page rather than to the language, and the
                  // form's step lives in it. Read at click time and not built into the
                  // href: the step changes without this component re-rendering, so an
                  // href prepared earlier would carry a stale one. Reading it through
                  // useSearchParams instead would cost a Suspense boundary on every page
                  // the footer appears on. The href stays the plain address, which is what
                  // a crawler and a new tab should get.
                  event.preventDefault();
                  router.push(`${target}${window.location.search}`);
                }}
              >
                {locale.toUpperCase()}
              </Choice>
            </li>
          );
        })}
      </List>
    </nav>
  );
}

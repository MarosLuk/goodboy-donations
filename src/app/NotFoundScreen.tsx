'use client';

import { useTranslation } from 'react-i18next';
import { BackLink } from '@/components/layout/BackLink';
import { Container } from '@/components/layout/Container';
import { Footer } from '@/components/layout/Footer';
import { PageHeading, PageLayout } from '@/components/layout/PageLayout';
import { Screen } from '@/components/layout/Screen';
import { toLocale } from '@/i18n/settings';
import { Message, Text } from './not-found.styles';

/**
 * The screen for an address that leads nowhere.
 *
 * A client component, because a not-found boundary is handed no params and the language has to
 * come from somewhere: the provider in the layout above already holds it, and the footer and the
 * confirmation screen read the active locale the same way.
 */
export function NotFoundScreen() {
  const { t, i18n } = useTranslation();
  const locale = toLocale(i18n.resolvedLanguage);

  return (
    <Screen>
      <Container>
        <PageLayout>
          <Message>
            <PageHeading>{t('notFound.title')}</PageHeading>

            <Text>{t('notFound.body')}</Text>

            <BackLink href={`/${locale}`}>{t('notFound.home')}</BackLink>
          </Message>

          <Footer />
        </PageLayout>
      </Container>
    </Screen>
  );
}

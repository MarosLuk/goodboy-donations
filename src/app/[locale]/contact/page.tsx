import type { Metadata } from 'next';
import { BackLink } from '@/components/layout/BackLink';
import { Container } from '@/components/layout/Container';
import { Footer } from '@/components/layout/Footer';
import { PageHeading, PageLayout } from '@/components/layout/PageLayout';
import { Screen } from '@/components/layout/Screen';
import { ContactDetails } from '@/features/contact/components/ContactDetails';
import { createServerI18n } from '@/i18n/server';
import { defaultLocale, isLocale } from '@/i18n/settings';
import { Photo, Section } from './page.styles';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/contact'>): Promise<Metadata> {
  const { locale } = await params;
  const { t } = createServerI18n(isLocale(locale) ? locale : defaultLocale);

  const title = t('contact.meta.title');
  const description = t('contact.meta.description');

  return { title, description, openGraph: { title, description } };
}

export default async function ContactPage({ params }: PageProps<'/[locale]/contact'>) {
  const { locale } = await params;
  const activeLocale = isLocale(locale) ? locale : defaultLocale;
  const { t } = createServerI18n(activeLocale);

  return (
    <Screen>
      <Container>
        <PageLayout>
          {/* The design opens the page with this link rather than a header. */}
          <BackLink href={`/${activeLocale}`}>{t('common.back')}</BackLink>

          <PageHeading>{t('contact.title')}</PageHeading>

          <Section>
            <ContactDetails />
          </Section>

          <Photo
            src="/images/contact.webp"
            alt=""
            width={2240}
            height={752}
            sizes="(min-width: 1200px) 1120px, 100vw"
          />

          <Footer />
        </PageLayout>
      </Container>
    </Screen>
  );
}

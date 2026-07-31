import type { Metadata } from 'next';
import { BackLink } from '@/components/layout/BackLink';
import { Container } from '@/components/layout/Container';
import { Footer } from '@/components/layout/Footer';
import { ContactDetails } from '@/features/contact/components/ContactDetails';
import { createServerI18n } from '@/i18n/server';
import { defaultLocale, isLocale } from '@/i18n/settings';
import { Page } from '../page.styles';
import { Heading, Layout, Photo, Section } from './page.styles';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/contact'>): Promise<Metadata> {
  const { locale } = await params;
  const { t } = createServerI18n(isLocale(locale) ? locale : defaultLocale);

  return {
    title: t('contact.meta.title'),
    description: t('contact.meta.description'),
  };
}

export default async function ContactPage({ params }: PageProps<'/[locale]/contact'>) {
  const { locale } = await params;
  const activeLocale = isLocale(locale) ? locale : defaultLocale;
  const { t } = createServerI18n(activeLocale);

  return (
    <Page>
      <Container>
        <Layout>
          {/* The design opens the page with this link rather than a header. */}
          <BackLink href={`/${activeLocale}`}>{t('common.back')}</BackLink>

          <Heading>{t('contact.title')}</Heading>

          <Section>
            <ContactDetails />
          </Section>

          <Photo
            src="/images/contact.jpg"
            alt=""
            width={1120}
            height={376}
            sizes="(min-width: 1200px) 1120px, 100vw"
          />

          <Footer />
        </Layout>
      </Container>
    </Page>
  );
}

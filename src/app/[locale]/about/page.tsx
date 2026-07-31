import type { Metadata } from 'next';
import { BackLink } from '@/components/layout/BackLink';
import { Container } from '@/components/layout/Container';
import { Footer } from '@/components/layout/Footer';
import { Page } from '@/components/layout/Page';
import { ResultsSummary } from '@/features/results/components/ResultsSummary';
import { createServerI18n } from '@/i18n/server';
import { defaultLocale, isLocale } from '@/i18n/settings';
import { Heading, Layout, Numbers, Prose } from './page.styles';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/about'>): Promise<Metadata> {
  const { locale } = await params;
  const { t } = createServerI18n(isLocale(locale) ? locale : defaultLocale);

  const title = t('about.meta.title');
  const description = t('about.meta.description');

  return { title, description, openGraph: { title, description } };
}

// The page the design puts the two metrics on: what the foundation does, how much has come
// in, and how the reader can help. The numbers come from the shelters results endpoint.
export default async function AboutPage({ params }: PageProps<'/[locale]/about'>) {
  const { locale } = await params;
  const activeLocale = isLocale(locale) ? locale : defaultLocale;
  const { t } = createServerI18n(activeLocale);

  return (
    <Page>
      <Container>
        <Layout>
          <BackLink href={`/${activeLocale}`}>{t('common.back')}</BackLink>

          <Heading>{t('about.title')}</Heading>

          <Prose>{t('about.intro')}</Prose>

          <Numbers>
            <ResultsSummary />
          </Numbers>

          <Prose>{t('about.outro')}</Prose>

          <Footer />
        </Layout>
      </Container>
    </Page>
  );
}

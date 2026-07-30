import type { Metadata } from 'next';
import Image from 'next/image';
import { Container } from '@/components/layout/Container';
import { Footer } from '@/components/layout/Footer';
import { SplitLayout } from '@/components/layout/SplitLayout';
import { parseStep } from '@/features/donation/lib/step';
import { createServerI18n } from '@/i18n/server';
import { defaultLocale, isLocale } from '@/i18n/settings';
import { DonationForm } from './DonationForm';
import { Column, Page, Photo } from './page.styles';

// Each step gets its own title and description. The step is in the query string, so
// the server can read it and a shared link describes the step it points at.
export async function generateMetadata({
  params,
  searchParams,
}: PageProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params;
  const { step } = await searchParams;
  const { t } = createServerI18n(isLocale(locale) ? locale : defaultLocale);
  const current = parseStep(step);

  return {
    title: t(`donation.meta.${current}.title`),
    description: t(`donation.meta.${current}.description`),
  };
}

export default async function DonationPage({ searchParams }: PageProps<'/[locale]'>) {
  const { step } = await searchParams;

  return (
    <Page>
      <Container>
        <SplitLayout
          media={
            <Photo>
              <Image
                src="/images/hero.jpg"
                alt=""
                width={602}
                height={984}
                priority
                sizes="(min-width: 1200px) 602px, 100vw"
              />
            </Photo>
          }
        >
          <Column>
            <DonationForm initialStep={parseStep(step)} />
            <Footer />
          </Column>
        </SplitLayout>
      </Container>
    </Page>
  );
}

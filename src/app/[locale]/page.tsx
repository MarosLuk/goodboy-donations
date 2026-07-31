import type { Metadata } from 'next';
import { Footer } from '@/components/layout/Footer';
import { SplitLayout } from '@/components/layout/SplitLayout';
import { parseStep } from '@/features/donation/lib/step';
import { createServerI18n } from '@/i18n/server';
import { defaultLocale, isLocale } from '@/i18n/settings';
import { DonationForm } from './DonationForm';
import { HeroPhoto } from './HeroPhoto';
import { Column, Frame, Page } from './page.styles';

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
      <Frame>
        <SplitLayout media={<HeroPhoto />}>
          <Column>
            <DonationForm initialStep={parseStep(step)} />
            <Footer />
          </Column>
        </SplitLayout>
      </Frame>
    </Page>
  );
}

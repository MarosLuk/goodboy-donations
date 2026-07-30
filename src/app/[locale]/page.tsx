import Image from 'next/image';
import { Container } from '@/components/layout/Container';
import { Footer } from '@/components/layout/Footer';
import { SplitLayout } from '@/components/layout/SplitLayout';
import { DonationForm } from './DonationForm';
import { Column, Photo } from './page.styles';

export default function DonationPage() {
  return (
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
          <DonationForm />
          <Footer />
        </Column>
      </SplitLayout>
    </Container>
  );
}
